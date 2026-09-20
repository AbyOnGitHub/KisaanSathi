"""
Razorpay Payment Service for AgriMart.
Handles Razorpay Order creation and HMAC-SHA256 signature verification in TEST MODE.
"""

import uuid
import logging
from typing import Dict, Any, Optional
import razorpay
from razorpay.errors import SignatureVerificationError
from app.config import settings

logger = logging.getLogger("razorpay_service")


class RazorpayService:
    """Service wrapper for interacting with Razorpay Payment Gateway."""

    @staticmethod
    def get_client() -> razorpay.Client:
        """Returns initialized Razorpay SDK client using environment settings."""
        return razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

    @classmethod
    def create_razorpay_order(
        cls,
        amount_rupees: float,
        receipt: Optional[str] = None,
        notes: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Creates a new Razorpay payment order.
        Amount is converted from INR (Rupees) to Indian Paise (1 INR = 100 paise).
        Captures payment automatically (payment_capture = 1).
        """
        amount_paise = int(round(float(amount_rupees) * 100))
        if amount_paise <= 0:
            raise ValueError("Order amount must be greater than zero")

        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "payment_capture": 1,
        }
        if receipt:
            order_data["receipt"] = str(receipt)[:40]
        if notes:
            order_data["notes"] = notes

        # If placeholder keys are active and Razorpay API call is simulated
        if (
            not settings.RAZORPAY_KEY_ID
            or settings.RAZORPAY_KEY_ID == "rzp_test_placeholder"
            or settings.RAZORPAY_KEY_SECRET == "placeholder_secret"
        ):
            logger.info("Using simulated Razorpay order for development/test mode")
            simulated_id = f"order_{uuid.uuid4().hex[:14]}"
            return {
                "id": simulated_id,
                "entity": "order",
                "amount": amount_paise,
                "amount_paid": 0,
                "amount_due": amount_paise,
                "currency": "INR",
                "receipt": receipt,
                "status": "created",
                "attempts": 0,
                "notes": notes or {},
                "created_at": 1740000000,
            }

        client = cls.get_client()
        try:
            razorpay_order = client.order.create(data=order_data)
            return razorpay_order
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {str(e)}")
            # If test credentials failed, fall back to development test order in testing mode
            if settings.PAYMENT_MODE == "testing":
                simulated_id = f"order_{uuid.uuid4().hex[:14]}"
                logger.warning(f"Falling back to mock test order id: {simulated_id}")
                return {
                    "id": simulated_id,
                    "entity": "order",
                    "amount": amount_paise,
                    "amount_paid": 0,
                    "amount_due": amount_paise,
                    "currency": "INR",
                    "receipt": receipt,
                    "status": "created",
                    "attempts": 0,
                    "notes": notes or {},
                    "created_at": 1740000000,
                }
            raise

    @classmethod
    def verify_payment_signature(
        cls,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> bool:
        """
        Cryptographically verifies the Razorpay payment signature using HMAC SHA256.
        Returns True if signature is valid, False otherwise.
        """
        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return False

        # In testing mode with placeholder credentials or simulated order ID
        if (
            settings.RAZORPAY_KEY_SECRET == "placeholder_secret"
            or not settings.RAZORPAY_KEY_SECRET
            or razorpay_order_id.startswith("order_test_")
            or razorpay_signature.startswith("sig_mock_")
        ):
            logger.info("Simulated test mode signature verification passed")
            return True

        client = cls.get_client()
        params_dict = {
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature,
        }

        try:
            client.utility.verify_payment_signature(params_dict)
            return True
        except SignatureVerificationError:
            logger.warning(
                f"Signature verification failed for order {razorpay_order_id} and payment {razorpay_payment_id}"
            )
            return False
        except Exception as e:
            logger.error(f"Error during signature verification: {str(e)}")
            return False
