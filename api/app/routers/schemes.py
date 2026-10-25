from fastapi import APIRouter
from typing import List
from app.models.schemas import FarmerProfileInput, SchemeRecommendationOutput, MatchedRule
from app.services.rule_engine import evaluate_rules

router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"]
)

MOCK_SCHEMES = [
    {
        "scheme_id": "SCH001",
        "scheme_name": "PM-KISAN",
        "rules": [
            {"rule_id": "R1", "field_name": "land_size", "operator": "<=", "value": 2.0},
            {"rule_id": "R2", "field_name": "category", "operator": "IN", "value": ["General", "OBC", "SC", "ST"]}
        ]
    },
    {
        "scheme_id": "SCH002",
        "scheme_name": "State Sub-Mission on Agriculture Mechanization",
        "rules": [
            {"rule_id": "R3", "field_name": "state", "operator": "=", "value": "Maharashtra"}
        ]
    }
]

@router.post("/", response_model=List[SchemeRecommendationOutput])
def get_recommendations(profile: FarmerProfileInput):
    # Flatten profile to dict
    farmer_data = profile.model_dump() if hasattr(profile, "model_dump") else profile.dict()
    
    # Merge additional_data to top level for easy rule matching
    additional = farmer_data.pop("additional_data", {})
    farmer_data.update(additional)
    
    recommendations = []
    
    for scheme in MOCK_SCHEMES:
        evaluation = evaluate_rules(farmer_data, scheme["rules"])
        
        # Return Eligible or Partial Match
        if evaluation["match_status"] in ["Eligible", "Partial Match"]:
            matched_rules_models = [MatchedRule(**r) for r in evaluation["matched_rules"]]
            
            recommendations.append(
                SchemeRecommendationOutput(
                    scheme_id=scheme["scheme_id"],
                    scheme_name=scheme["scheme_name"],
                    match_status=evaluation["match_status"],
                    matched_rules=matched_rules_models
                )
            )
            
    return recommendations
