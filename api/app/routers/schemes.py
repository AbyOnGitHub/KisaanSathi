from fastapi import APIRouter
from typing import List
from app.models.schemas import FarmerProfileInput, SchemeRecommendationOutput, MatchedRule
from app.services.scheme_ml_recommender import ml_recommender


router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"]
)

SCHEME_CATALOG = [
    {
        "scheme_id": "pm-kisan",
        "scheme_name": "PM Kisan Samman Nidhi",
        "level": "central",
        "category": "financial",
        "benefit": "₹6,000 per year in 3 installments of ₹2,000 directly transferred to your Aadhaar-linked bank account.",
        "source_name": "PM Kisan Portal",
        "source_url": "https://pmkisan.gov.in",
        "how_to_apply": "Apply online at pmkisan.gov.in or through your nearest Common Service Centre (CSC). Requires Aadhaar, land record (7/12), and active bank account.",
        "documents": ["Aadhaar Card", "7/12 Land Record / Khasra", "Bank Passbook with Aadhaar link", "Mobile Number"],
        "rules": [
            {"rule_id": "PMK-1", "field_name": "land_size", "operator": "<=", "value": 2.0, "weight": 2},
            {"rule_id": "PMK-2", "field_name": "category", "operator": "IN", "value": ["General", "OBC", "SC", "ST", "EWS"], "weight": 1}
        ]
    },
    {
        "scheme_id": "namo-shetkari",
        "scheme_name": "Namo Shetkari Mahasanman Nidhi",
        "level": "state",
        "category": "financial",
        "benefit": "Additional ₹6,000 per year from the Maharashtra State Government for PM-KISAN verified farmers.",
        "source_name": "Maharashtra Agriculture Department",
        "source_url": "https://krishi.maharashtra.gov.in",
        "how_to_apply": "State top-up automatically credited to PM-KISAN verified beneficiaries in Maharashtra with active e-KYC.",
        "documents": ["PM-KISAN Registration ID", "Maharashtra Land Record (7/12 & 8A)", "Aadhaar Card", "Bank Passbook"],
        "rules": [
            {"rule_id": "NSM-1", "field_name": "state", "operator": "=", "value": "Maharashtra", "weight": 3},
            {"rule_id": "NSM-2", "field_name": "land_size", "operator": "<=", "value": 5.0, "weight": 1}
        ]
    },
    {
        "scheme_id": "pmfby",
        "scheme_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "level": "central",
        "category": "insurance",
        "benefit": "Comprehensive crop insurance at nominal 2% Kharif / 1.5% Rabi premium with rapid claim settlement for yield losses.",
        "source_name": "PMFBY Official Portal",
        "source_url": "https://pmfby.gov.in",
        "how_to_apply": "Enroll through your local primary agricultural credit society (PACS), bank branch, or online on pmfby.gov.in before the seasonal cutoff date.",
        "documents": ["Aadhaar Card", "Sowing Certificate / Talathi Verification", "7/12 Land Record", "Bank Passbook"],
        "rules": [
            {"rule_id": "PMF-1", "field_name": "crops", "operator": "IN", "value": ["Cotton", "Soybean", "Wheat", "Rice", "Sugarcane", "Maize", "Pulses", "Gram", "Groundnut", "Onion", "Jowar", "Bajra"], "weight": 2}
        ]
    },
    {
        "scheme_id": "pm-kusum",
        "scheme_name": "PM-KUSUM (Solar Agricultural Pumps)",
        "level": "central",
        "category": "irrigation",
        "benefit": "Up to 60% combined subsidy (central + state) on solar irrigation pumps (3HP to 7.5HP) + 30% bank loan assistance.",
        "source_name": "MNRE - PM-KUSUM",
        "source_url": "https://pmkusum.mnre.gov.in",
        "how_to_apply": "Apply via the state renewable energy development agency portal (MEDA in Maharashtra) or the central PM-KUSUM portal.",
        "documents": ["Aadhaar Card", "7/12 Land Record (minimum 0.5 acre)", "Electricity Bill / NOC for no grid pump", "Bank Account Details"],
        "rules": [
            {"rule_id": "KUS-1", "field_name": "land_size", "operator": ">=", "value": 0.2, "weight": 1},
            {"rule_id": "KUS-2", "field_name": "needs", "operator": "=", "value": "irrigation", "weight": 1}
        ]
    },
    {
        "scheme_id": "pmksy",
        "scheme_name": "PMKSY – Per Drop More Crop (Micro-Irrigation)",
        "level": "central",
        "category": "irrigation",
        "benefit": "Subsidy up to 55% for small/marginal farmers and 45% for other farmers on drip and sprinkler micro-irrigation sets.",
        "source_name": "PMKSY Department of Agriculture",
        "source_url": "https://pmksy.gov.in",
        "how_to_apply": "Apply online on the state agriculture portal (e.g., MahaDBT for Maharashtra) with quotation from an empanelled micro-irrigation manufacturer.",
        "documents": ["Aadhaar Card", "7/12 Land Record", "Quotation from Authorized Drip Vendor", "Bank Passbook"],
        "rules": [
            {"rule_id": "KSY-1", "field_name": "land_size", "operator": "<=", "value": 5.0, "weight": 1}
        ]
    },
    {
        "scheme_id": "smam",
        "scheme_name": "Sub-Mission on Agricultural Mechanization (SMAM)",
        "level": "central",
        "category": "farm_machinery",
        "benefit": "40% to 50% subsidy on tractors, power tillers, rotavators, and harvesters. Higher 60% subsidy for SC/ST and women farmers.",
        "source_name": "Farm Mechanization Portal",
        "source_url": "https://agrimachinery.nic.in",
        "how_to_apply": "Register on the Agrimachinery portal (agrimachinery.nic.in) or state DBT portal and upload required dealer quotation.",
        "documents": ["Aadhaar Card", "Caste Certificate (if claiming SC/ST bonus)", "Land Records (7/12)", "Bank Passbook"],
        "rules": [
            {"rule_id": "SMA-1", "field_name": "category", "operator": "IN", "value": ["General", "OBC", "SC", "ST", "EWS"], "weight": 1}
        ]
    },
    {
        "scheme_id": "birsa-munda",
        "scheme_name": "Birsa Munda Krishi Kranti Yojana (ST Farmers)",
        "level": "state",
        "category": "irrigation",
        "benefit": "100% financial subsidy up to ₹2.5 Lakh for new dug well, electric pump set, and micro-irrigation for Scheduled Tribe (ST) farmers.",
        "source_name": "MahaDBT Agriculture",
        "source_url": "https://mahadbt.maharashtra.gov.in",
        "how_to_apply": "Apply on MahaDBT portal under the Tribal Development / Agriculture department with ST caste certificate.",
        "documents": ["Caste Certificate (ST)", "Caste Validity Certificate", "7/12 & 8A Land Extract", "Income Certificate (≤ ₹1.5L)", "Aadhaar Card"],
        "rules": [
            {"rule_id": "BMK-1", "field_name": "state", "operator": "=", "value": "Maharashtra", "weight": 2},
            {"rule_id": "BMK-2", "field_name": "category", "operator": "=", "value": "ST", "weight": 3},
            {"rule_id": "BMK-3", "field_name": "annual_income", "operator": "<=", "value": 150000.0, "weight": 1}
        ]
    },
    {
        "scheme_id": "ambedkar-swavalamban",
        "scheme_name": "Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana (SC Farmers)",
        "level": "state",
        "category": "irrigation",
        "benefit": "Financial grant up to ₹2.5 Lakh for new well construction, in-well boring, pump set, and drip systems for SC and neo-Buddhist farmers.",
        "source_name": "MahaDBT Agriculture",
        "source_url": "https://mahadbt.maharashtra.gov.in",
        "how_to_apply": "Apply online on the MahaDBT portal under Special Component Plan for Scheduled Castes.",
        "documents": ["Caste Certificate (SC)", "7/12 & 8A Land Extract", "Income Certificate (≤ ₹1.5L)", "Aadhaar Card", "Bank Passbook"],
        "rules": [
            {"rule_id": "BAK-1", "field_name": "state", "operator": "=", "value": "Maharashtra", "weight": 2},
            {"rule_id": "BAK-2", "field_name": "category", "operator": "=", "value": "SC", "weight": 3},
            {"rule_id": "BAK-3", "field_name": "annual_income", "operator": "<=", "value": 150000.0, "weight": 1}
        ]
    },
    {
        "scheme_id": "kcc",
        "scheme_name": "Kisan Credit Card (KCC) Scheme",
        "level": "central",
        "category": "loans",
        "benefit": "Short-term farm loans up to ₹3,00,000 at a concessional interest rate of 4% with prompt repayment subvention.",
        "source_name": "myScheme - Government of India",
        "source_url": "https://www.myscheme.gov.in",
        "how_to_apply": "Submit a single-page KCC application form along with land records at your nearest commercial, rural (RRB), or cooperative bank branch.",
        "documents": ["Aadhaar Card", "PAN Card", "7/12 Land Extract", "Passport size photograph"],
        "rules": [
            {"rule_id": "KCC-1", "field_name": "land_size", "operator": ">=", "value": 0.1, "weight": 1}
        ]
    },
    {
        "scheme_id": "shc",
        "scheme_name": "Soil Health Card Scheme",
        "level": "central",
        "category": "crop_support",
        "benefit": "Free lab testing of 12 macro and micro-nutrients of farm soil and crop-wise fertilizer dosage advice to reduce input costs.",
        "source_name": "Soil Health Card Portal",
        "source_url": "https://soilhealth.dac.gov.in",
        "how_to_apply": "Hand over soil sample to the visiting Village Agriculture Officer (Kisan Sahayak) or at the nearest Krishi Vigyan Kendra (KVK).",
        "documents": ["Aadhaar Card", "7/12 Land Record", "Farmer Mobile Number"],
        "rules": [
            {"rule_id": "SHC-1", "field_name": "land_size", "operator": ">=", "value": 0.1, "weight": 1}
        ]
    },
    {
        "scheme_id": "pkvy",
        "scheme_name": "Paramparagat Krishi Vikas Yojana (PKVY Organic Farming)",
        "level": "central",
        "category": "organic",
        "benefit": "₹50,000 per hectare assistance over 3 years for organic cluster formation, organic seeds, bio-fertilizers, and PGS certification.",
        "source_name": "PGS India / NCOF",
        "source_url": "https://pgsindia-ncof.gov.in",
        "how_to_apply": "Join or form a 20-50 farmer organic cluster through your local block agriculture office (Taluka Krishi Adhikari).",
        "documents": ["Aadhaar Card", "7/12 Land Record", "Bank Passbook", "Cluster Farmer Agreement"],
        "rules": [
            {"rule_id": "PKV-1", "field_name": "land_size", "operator": "<=", "value": 4.0, "weight": 1}
        ]
    },
    {
        "scheme_id": "magel-tyala",
        "scheme_name": "Magel Tyala Shettale (Farm Pond on Demand)",
        "level": "state",
        "category": "irrigation",
        "benefit": "Direct DBT subsidy of ₹50,000 to ₹75,000 to construct farm ponds for rain-water harvesting and protective irrigation.",
        "source_name": "MahaDBT",
        "source_url": "https://mahadbt.maharashtra.gov.in",
        "how_to_apply": "Apply online on MahaDBT portal under Farm Pond on Demand scheme with geo-tagged plot location.",
        "documents": ["7/12 & 8A Land Extract (minimum 0.60 hectare land)", "Aadhaar Card", "Bank Account Details"],
        "rules": [
            {"rule_id": "MTS-1", "field_name": "state", "operator": "=", "value": "Maharashtra", "weight": 3},
            {"rule_id": "MTS-2", "field_name": "land_size", "operator": ">=", "value": 0.5, "weight": 1}
        ]
    },
    {
        "scheme_id": "gopinath-munde",
        "scheme_name": "Gopinath Munde Farmer Accident Insurance Scheme",
        "level": "state",
        "category": "insurance",
        "benefit": "100% state-funded accident insurance coverage up to ₹2,00,000 for registered landholding farmers in Maharashtra.",
        "source_name": "Maharashtra Agriculture Department",
        "source_url": "https://krishi.maharashtra.gov.in",
        "how_to_apply": "Automatic insurance protection provided to all farmers registered in Maharashtra 7/12 records. Claims submitted through Taluka Krishi Adhikari.",
        "documents": ["7/12 Land Record showing name of farmer", "Aadhaar Card", "FIR / Panchanama (in case of claim)", "Nominee Bank Account"],
        "rules": [
            {"rule_id": "GMM-1", "field_name": "state", "operator": "=", "value": "Maharashtra", "weight": 2},
            {"rule_id": "GMM-2", "field_name": "age", "operator": ">=", "value": 10, "weight": 1},
            {"rule_id": "GMM-3", "field_name": "age", "operator": "<=", "value": 75, "weight": 1}
        ]
    },
    {
        "scheme_id": "pmkmy",
        "scheme_name": "PM Kisan Maandhan Yojana (Old Age Pension)",
        "level": "central",
        "category": "financial",
        "benefit": "Assured minimum pension of ₹3,000 per month upon reaching age 60 with matching central government contribution.",
        "source_name": "PM Kisan Maandhan",
        "source_url": "https://maandhan.in",
        "how_to_apply": "Visit any Common Service Centre (CSC) with Aadhaar and bank passbook. Monthly contribution ranges from ₹55 to ₹200 based on entry age.",
        "documents": ["Aadhaar Card", "Bank Savings Account Passbook", "7/12 Land Record"],
        "rules": [
            {"rule_id": "PMKMY-1", "field_name": "age", "operator": ">=", "value": 18, "weight": 2},
            {"rule_id": "PMKMY-2", "field_name": "age", "operator": "<=", "value": 40, "weight": 2},
            {"rule_id": "PMKMY-3", "field_name": "land_size", "operator": "<=", "value": 2.0, "weight": 1}
        ]
    }
]

@router.post("/", response_model=List[SchemeRecommendationOutput])
@router.post("", response_model=List[SchemeRecommendationOutput])
def get_recommendations(profile: FarmerProfileInput):
    farmer_data = profile.model_dump() if hasattr(profile, "model_dump") else profile.dict()
    additional = farmer_data.pop("additional_data", {})
    farmer_data.update(additional)

    # 1. Feature Vector Extraction
    features = ml_recommender.extract_features(farmer_data)
    recommendations = []

    # 2. Decision Tree Classifier Inference across Scheme Catalog
    for scheme in SCHEME_CATALOG:
        prediction = ml_recommender.predict_scheme_eligibility(features, scheme)

        if prediction["match_status"] in ["Eligible", "Partial Match"]:
            matched_models = [MatchedRule(**r) for r in prediction["matched_rules"]]
            unmatched_models = [MatchedRule(**r) for r in prediction.get("unmatched_rules", [])]

            recommendations.append(
                SchemeRecommendationOutput(
                    scheme_id=scheme["scheme_id"],
                    scheme_name=scheme["scheme_name"],
                    level=scheme.get("level", "central"),
                    category=scheme.get("category", "financial"),
                    benefit=scheme.get("benefit", ""),
                    match_status=prediction["match_status"],
                    match_score=prediction["match_score"],
                    confidence_score=prediction["confidence_score"],
                    model_name=prediction["model_name"],
                    matched_rules=matched_models,
                    unmatched_rules=unmatched_models,
                    explanations=prediction.get("explanations", []),
                    source_name=scheme.get("source_name", ""),
                    source_url=scheme.get("source_url", ""),
                    documents=scheme.get("documents", []),
                    how_to_apply=scheme.get("how_to_apply", "")
                )
            )

    # Sort recommendations by match_score & confidence_score descending
    recommendations.sort(key=lambda x: (x.match_score, x.confidence_score), reverse=True)
    return recommendations


