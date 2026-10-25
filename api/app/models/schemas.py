from pydantic import BaseModel
from typing import List, Any, Dict, Optional

class FarmerProfileInput(BaseModel):
    name: Optional[str] = ""
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = ""
    taluka: Optional[str] = ""
    village: Optional[str] = ""
    category: Optional[str] = "General"
    land_size: Optional[float] = 2.0
    land_unit: Optional[str] = "acres"
    annual_income: Optional[float] = 150000.0
    gender: Optional[str] = "Male"
    age: Optional[int] = 35
    crops: List[str] = []
    needs: List[str] = []
    irrigation_availability: Optional[bool] = True
    irrigation_type: Optional[str] = "Drip"
    soil_type: Optional[str] = "Black"
    additional_data: Dict[str, Any] = {}

class MatchedRule(BaseModel):
    rule_id: str
    field_name: str
    operator: str
    value: Any
    is_matched: bool
    explanation: Optional[str] = ""

class SchemeRecommendationOutput(BaseModel):
    scheme_id: str
    scheme_name: str
    level: str = "central"
    category: str = "financial"
    benefit: str = ""
    match_status: str
    match_score: int = 100
    matched_rules: List[MatchedRule] = []
    unmatched_rules: List[MatchedRule] = []
    explanations: List[str] = []
    source_name: str = ""
    source_url: str = ""
    documents: List[str] = []
    how_to_apply: str = ""
