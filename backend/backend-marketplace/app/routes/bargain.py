"""
Bargain & Negotiation router.
Handles dynamic price negotiation between farmers and sellers with offer validation,
turn alternation, session state locks, and settled deals.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user, require_farmer, require_seller
from app.database import get_supabase
from app.models.bargain import (
    BargainStartRequest,
    BargainOfferRequest,
    BargainSessionResponse,
    BargainOfferResponse,
)
from app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/api/bargain", tags=["Bargaining"])


def _format_bargain_session(session_row: dict, offers_data: list = None) -> BargainSessionResponse:
    """Helper to structure a bargain session entity with nested offers and product info."""
    offers = []
    if offers_data:
        for off in offers_data:
            offers.append(
                BargainOfferResponse(
                    id=off["id"],
                    session_id=off["session_id"],
                    offered_by=off["offered_by"],
                    offered_price=float(off["offered_price"]),
                    quantity=int(off.get("quantity", 1)),
                    message=off.get("message"),
                    created_at=off.get("created_at"),
                )
            )

    return BargainSessionResponse(
        id=session_row["id"],
        product_id=session_row["product_id"],
        farmer_id=session_row["farmer_id"],
        seller_id=session_row["seller_id"],
        original_price=float(session_row["original_price"]),
        status=session_row.get("status", "open"),
        settled_price=float(session_row["settled_price"]) if session_row.get("settled_price") is not None else None,
        settled_at=session_row.get("settled_at"),
        expires_at=session_row.get("expires_at"),
        created_at=session_row.get("created_at"),
        product=session_row.get("product"),
        farmer=session_row.get("farmer"),
        seller=session_row.get("seller"),
        offers=offers,
    )


# Route: POST /api/bargain/start
# Purpose: Farmer initiates a new bargain negotiation session for a product
@router.post(
    "/start",
    response_model=BargainSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Initiate price negotiation session",
)
async def start_bargain_session(
    payload: BargainStartRequest,
    current_user: Dict[str, Any] = Depends(require_farmer),
):
    """
    Starts a bargaining session for a product.
    Validations:
    - Product exists and allows bargaining
    - Proposed price is within 50% to 99% of original price
    - Farmer has no currently open session for this same product
    """
    supabase = get_supabase()
    farmer_id = current_user["id"]

    # 1. Fetch product
    prod = SupabaseService.fetch_product_by_id(payload.product_id)
    if not prod.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot bargain on an inactive product",
        )

    if not prod.get("allow_bargaining"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bargaining is not enabled for this product",
        )

    orig_price = float(prod["price"])
    seller_id = prod["seller_id"]

    if seller_id == farmer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot bargain on your own listed product",
        )

    # 2. Validate price threshold (50% - 99% of original price)
    min_allowed = round(orig_price * 0.50, 2)
    max_allowed = round(orig_price * 0.99, 2)

    if payload.offered_price < min_allowed or payload.offered_price > max_allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Initial offer must be between ₹{min_allowed} (50%) and ₹{max_allowed} (99%) of original price ₹{orig_price}",
        )

    # 3. Check for existing open session
    existing = supabase.table("bargain_sessions").select("id").eq("farmer_id", farmer_id).eq("product_id", payload.product_id).eq("status", "open").execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an active negotiation open for this product",
        )

    # 4. Create session
    session_data = {
        "product_id": payload.product_id,
        "farmer_id": farmer_id,
        "seller_id": seller_id,
        "original_price": orig_price,
        "status": "open",
    }

    try:
        sess_res = supabase.table("bargain_sessions").insert(session_data).execute()
        if not sess_res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to initiate bargain session",
            )
        new_session = sess_res.data[0]
        session_id = new_session["id"]

        # 5. Insert initial farmer offer
        offer_data = {
            "session_id": session_id,
            "offered_by": "farmer",
            "offered_price": payload.offered_price,
            "quantity": payload.quantity,
            "message": payload.message or f"Offered ₹{payload.offered_price} for {payload.quantity} {prod.get('unit', 'unit')}",
        }
        supabase.table("bargain_offers").insert(offer_data).execute()

        return await get_bargain_session(session_id, current_user)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error starting bargain: {str(e)}",
        )


# Route: GET /api/bargain/sessions
# Purpose: Retrieve all bargain sessions involving the current authenticated user (farmer or seller)
@router.get(
    "/sessions",
    response_model=List[BargainSessionResponse],
    status_code=status.HTTP_200_OK,
    summary="Get user's bargain sessions",
)
async def get_user_bargain_sessions(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Returns all negotiation sessions where the current user participates either as a farmer or as a seller.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    try:
        # Fetch sessions where user is either farmer or seller
        sess_res = supabase.table("bargain_sessions").select(
            "*, product:product_id(*), farmer:farmer_id(id, full_name, avatar_url, phone_number), seller:seller_id(id, full_name, business_name, avatar_url, phone_number)"
        ).or_(f"farmer_id.eq.{user_id},seller_id.eq.{user_id}").order("created_at", desc=True).execute()

        sessions_data = sess_res.data or []
        results = []

        for s in sessions_data:
            offers_res = supabase.table("bargain_offers").select("*").eq("session_id", s["id"]).order("created_at", desc=False).execute()
            results.append(_format_bargain_session(s, offers_res.data or []))

        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching bargain sessions: {str(e)}",
        )


# Route: GET /api/bargain/session/{id}
# Purpose: Fetch single bargain session details along with complete offer history
@router.get(
    "/session/{id}",
    response_model=BargainSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single bargain session details",
)
async def get_bargain_session(
    id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Retrieves full negotiation history, participating parties, and chronological offers for a session.
    """
    supabase = get_supabase()
    user_id = current_user["id"]
    role = current_user.get("role", "farmer")

    try:
        sess_res = supabase.table("bargain_sessions").select(
            "*, product:product_id(*, category:category_id(*)), farmer:farmer_id(id, full_name, avatar_url, phone_number), seller:seller_id(id, full_name, business_name, avatar_url, phone_number)"
        ).eq("id", id).execute()

        if not sess_res.data or len(sess_res.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Bargain session with ID '{id}' not found",
            )

        session_data = sess_res.data[0]
        if session_data["farmer_id"] != user_id and session_data["seller_id"] != user_id and role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this negotiation session",
            )

        offers_res = supabase.table("bargain_offers").select("*").eq("session_id", id).order("created_at", desc=False).execute()
        return _format_bargain_session(session_data, offers_res.data or [])

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching bargain session: {str(e)}",
        )


# Route: POST /api/bargain/offer
# Purpose: Submit a counter-offer in an active bargain session
@router.post(
    "/offer",
    response_model=BargainSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Make a counter-offer",
)
async def make_counter_offer(
    payload: BargainOfferRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Submits a counter-offer in an open session.
    Validations:
    - Session status must be 'open'
    - Total offers in session must not exceed 10
    - Parties must alternate turns (cannot make two consecutive offers)
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    # 1. Fetch session
    sess_res = supabase.table("bargain_sessions").select("*").eq("id", payload.session_id).execute()
    if not sess_res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bargain session '{payload.session_id}' not found",
        )
    session_data = sess_res.data[0]

    if session_data.get("status") != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot offer on session with status '{session_data.get('status')}'",
        )

    # 2. Determine user role in this session
    is_farmer = session_data["farmer_id"] == user_id
    is_seller = session_data["seller_id"] == user_id

    if not (is_farmer or is_seller):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this bargaining session",
        )

    current_offered_by = "farmer" if is_farmer else "seller"

    # 3. Fetch past offers to check count and turn alternation
    offers_res = supabase.table("bargain_offers").select("*").eq("session_id", payload.session_id).order("created_at", desc=False).execute()
    offers_list = offers_res.data or []

    if len(offers_list) >= 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum offer limit (10) reached for this negotiation session",
        )

    if offers_list:
        last_offer = offers_list[-1]
        if last_offer["offered_by"] == current_offered_by:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="It is not your turn. Please wait for the counterparty's response",
            )
        default_qty = last_offer.get("quantity", 1)
    else:
        default_qty = 1

    # 4. Insert counter offer
    new_offer = {
        "session_id": payload.session_id,
        "offered_by": current_offered_by,
        "offered_price": payload.offered_price,
        "quantity": payload.quantity or default_qty,
        "message": payload.message,
    }

    try:
        supabase.table("bargain_offers").insert(new_offer).execute()
        return await get_bargain_session(str(payload.session_id), current_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting counter-offer: {str(e)}",
        )


# Route: POST /api/bargain/accept/{session_id}
# Purpose: Accept the latest counter-offer, lock the price, and finalize the bargain deal
@router.post(
    "/accept/{session_id}",
    response_model=BargainSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Accept offer and settle bargain",
)
async def accept_bargain(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Accepts the most recent counter-offer made in the session.
    Sets status to 'accepted', records the settled price and timestamp.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    # 1. Fetch session
    sess_res = supabase.table("bargain_sessions").select("*").eq("id", session_id).execute()
    if not sess_res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bargain session '{session_id}' not found",
        )
    session_data = sess_res.data[0]

    if session_data.get("status") != "open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Session is already closed with status '{session_data.get('status')}'",
        )

    if session_data["farmer_id"] != user_id and session_data["seller_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this session",
        )

    # 2. Get latest offer
    offers_res = supabase.table("bargain_offers").select("*").eq("session_id", session_id).order("created_at", desc=False).execute()
    offers_list = offers_res.data or []
    if not offers_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No offers exist to accept",
        )

    latest_offer = offers_list[-1]
    settled_price = float(latest_offer["offered_price"])
    now_iso = datetime.now(timezone.utc).isoformat()

    try:
        supabase.table("bargain_sessions").update({
            "status": "accepted",
            "settled_price": settled_price,
            "settled_at": now_iso,
        }).eq("id", session_id).execute()

        return await get_bargain_session(session_id, current_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error accepting bargain: {str(e)}",
        )


# Route: POST /api/bargain/reject/{session_id}
# Purpose: Reject negotiation and close the bargain session
@router.post(
    "/reject/{session_id}",
    response_model=BargainSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Reject and close bargain session",
)
async def reject_bargain(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Rejects the ongoing negotiation and closes the session with status 'rejected'.
    """
    supabase = get_supabase()
    user_id = current_user["id"]

    sess_res = supabase.table("bargain_sessions").select("*").eq("id", session_id).execute()
    if not sess_res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bargain session '{session_id}' not found",
        )
    session_data = sess_res.data[0]

    if session_data["farmer_id"] != user_id and session_data["seller_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this session",
        )

    try:
        supabase.table("bargain_sessions").update({
            "status": "rejected"
        }).eq("id", session_id).execute()

        return await get_bargain_session(session_id, current_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error rejecting bargain: {str(e)}",
        )


# Route: GET /api/bargain/seller/pending
# Purpose: Retrieve all open bargain sessions awaiting response from the current seller
@router.get(
    "/seller/pending",
    response_model=List[BargainSessionResponse],
    status_code=status.HTTP_200_OK,
    summary="Get seller's pending bargains",
)
async def get_seller_pending_bargains(
    current_user: Dict[str, Any] = Depends(require_seller),
):
    """
    Lists open sessions where the seller needs to respond (i.e. latest offer was made by farmer).
    """
    supabase = get_supabase()
    seller_id = current_user["id"]

    try:
        sess_res = supabase.table("bargain_sessions").select(
            "*, product:product_id(*), farmer:farmer_id(id, full_name, avatar_url, phone_number), seller:seller_id(id, full_name, business_name, avatar_url, phone_number)"
        ).eq("seller_id", seller_id).eq("status", "open").order("created_at", desc=True).execute()

        pending_sessions = []
        for s in (sess_res.data or []):
            offers_res = supabase.table("bargain_offers").select("*").eq("session_id", s["id"]).order("created_at", desc=False).execute()
            offers_list = offers_res.data or []
            # Check if last offer was from farmer -> pending seller response
            if offers_list and offers_list[-1].get("offered_by") == "farmer":
                pending_sessions.append(_format_bargain_session(s, offers_list))

        return pending_sessions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching pending bargains: {str(e)}",
        )
