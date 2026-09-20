from pydantic import BaseModel
from typing import List, Any, Dict

class FarmerProfileInput(BaseModel):
    state: str
    category: str
    land_size: float
    annual_income: float
    gender: str
    age: int
    crops: List[str] = []
    additional_data: Dict[str, Any] = {}

class MatchedRule(BaseModel):
    rule_id: str
    field_name: str
    operator: str
    value: Any
    is_matched: bool

class SchemeRecommendationOutput(BaseModel):
    scheme_id: str
    scheme_name: str
    match_status: str
    matched_rules: List[MatchedRule]
