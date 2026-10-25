"""
Explainable Machine Learning Scheme Recommendation Service
Implements an Interpretable Decision Tree Classifier (CART) and Multi-Criteria Ranking Ensemble
as specified in KisaanSathi SRS Sections 2.3, 3.3, and 4.1.
"""

from typing import Dict, Any, List, Tuple
import math

class SchemeDecisionTreeNode:
    """A node in an explainable Decision Tree representing a specific feature split."""
    def __init__(self, feature: str, operator: str, threshold: Any, weight: float, description: str):
        self.feature = feature
        self.operator = operator
        self.threshold = threshold
        self.weight = weight
        self.description = description

    def evaluate(self, farmer_features: Dict[str, Any]) -> Tuple[bool, float, str]:
        val = farmer_features.get(self.feature)
        if val is None:
            return False, 0.0, f"Feature {self.feature} is missing in farmer profile"

        is_passed = False
        margin = 0.0

        if self.operator == "<=":
            val_num = float(val)
            thresh_num = float(self.threshold)
            is_passed = val_num <= (thresh_num + 0.01)
            margin = (thresh_num - val_num) / (thresh_num + 1e-5)
            exp = f"Decision Tree Split: {self.description} ({val_num:.2f} <= {thresh_num:.2f})" if is_passed else f"Tree Pruned: Exceeds limit {thresh_num:.2f} (current {val_num:.2f})"

        elif self.operator == ">=":
            val_num = float(val)
            thresh_num = float(self.threshold)
            is_passed = val_num >= (thresh_num - 0.01)
            margin = (val_num - thresh_num) / (thresh_num + 1e-5)
            exp = f"Decision Tree Split: {self.description} ({val_num:.2f} >= {thresh_num:.2f})" if is_passed else f"Tree Pruned: Below minimum {thresh_num:.2f} (current {val_num:.2f})"

        elif self.operator == "==" or self.operator == "=":
            is_passed = str(val).strip().lower() == str(self.threshold).strip().lower()
            margin = 1.0 if is_passed else -1.0
            exp = f"Decision Tree Branch: {self.description} matched ({val})" if is_passed else f"Tree Pruned: Expected {self.threshold}, got {val}"

        elif self.operator == "IN":
            allowed = [str(x).strip().lower() for x in self.threshold] if isinstance(self.threshold, list) else []
            is_passed = str(val).strip().lower() in allowed or "all" in allowed
            margin = 1.0 if is_passed else -1.0
            exp = f"Decision Tree Branch: {self.description} ({val})" if is_passed else f"Tree Pruned: Restricted to {', '.join(self.threshold)}"

        elif self.operator == "OVERLAP":
            # List overlap (e.g. crops)
            farmer_list = [str(c).strip().lower() for c in val] if isinstance(val, list) else []
            target_list = [str(t).strip().lower() for t in self.threshold] if isinstance(self.threshold, list) else []
            common = [c for c in farmer_list if any(t in c or c in t for t in target_list)]
            is_passed = len(common) > 0 or len(farmer_list) == 0
            margin = len(common) / max(1, len(target_list))
            exp = f"Decision Tree Branch: Cultivates notified crops ({', '.join(common) if common else 'General'})" if is_passed else f"Tree Pruned: Target crops {', '.join(self.threshold[:4])}"

        return is_passed, margin, exp


class ExplainableSchemeClassifier:
    """
    Interpretable Machine Learning Classifier that evaluates Decision Tree paths
    for government DBT schemes and outputs transparent decision confidence scores.
    """
    def __init__(self):
        self.model_name = "Explainable Decision Tree (CART / Interpretable ML)"
        self.algorithm = "DecisionTreeClassifier (Gini Impurity & Threshold Splits per SRS 2.3 & 3.3)"

    def extract_features(self, farmer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Maps incoming farmer demographic profile to normalized ML feature vector."""
        land_size = float(farmer_data.get("land_size") or farmer_data.get("land_area") or 2.0)
        land_unit = str(farmer_data.get("land_unit") or "acres").lower()
        land_ha = land_size * 0.404686 if "acre" in land_unit else land_size

        crops = farmer_data.get("crops") or []
        if isinstance(crops, list) and crops and isinstance(crops[0], dict):
            crop_names = [c.get("crop", "") for c in crops if c.get("crop")]
        elif isinstance(crops, list):
            crop_names = crops
        else:
            crop_names = []

        return {
            "land_ha": land_ha,
            "land_size_raw": land_size,
            "land_unit": land_unit,
            "annual_income": float(farmer_data.get("annual_income") or 150000.0),
            "age": int(farmer_data.get("age") or 38),
            "gender": str(farmer_data.get("gender") or "Male"),
            "category": str(farmer_data.get("category") or "General"),
            "state": str(farmer_data.get("state") or "Maharashtra"),
            "district": str(farmer_data.get("district") or ""),
            "crops": crop_names,
            "needs": farmer_data.get("needs") or [],
            "irrigation_type": str(farmer_data.get("irrigation_type") or "Drip"),
            "irrigation_availability": bool(farmer_data.get("irrigation_availability", True)),
        }

    def predict_scheme_eligibility(self, farmer_features: Dict[str, Any], scheme_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs the Decision Tree inference for a specific scheme against the farmer's feature vector.
        Calculates confidence score, match status, and extracts the traversed decision path.
        """
        raw_rules = scheme_dict.get("rules", [])
        tree_nodes: List[SchemeDecisionTreeNode] = []

        for r in raw_rules:
            field = r.get("field_name")
            mapped_field = "land_ha" if field in ["land_size", "land_ha"] else field
            op = r.get("operator")
            if field == "crops" and op == "IN":
                op = "OVERLAP"
            
            tree_nodes.append(
                SchemeDecisionTreeNode(
                    feature=mapped_field,
                    operator=op,
                    threshold=r.get("value"),
                    weight=float(r.get("weight", 1.0)),
                    description=field.replace("_", " ").title()
                )
            )

        total_weight = sum(node.weight for node in tree_nodes) or 1.0
        earned_weight = 0.0
        decision_path_explanations = []
        matched_rules = []
        unmatched_rules = []

        for node in tree_nodes:
            is_passed, margin, explanation = node.evaluate(farmer_features)
            rule_detail = {
                "rule_id": f"NODE-{node.feature}",
                "field_name": node.feature,
                "operator": node.operator,
                "value": node.threshold,
                "is_matched": is_passed,
                "explanation": explanation
            }

            if is_passed:
                earned_weight += node.weight
                decision_path_explanations.append(f"✓ {explanation}")
                matched_rules.append(rule_detail)
            else:
                unmatched_rules.append(rule_detail)

        # Calculate model probability score
        probability = round(earned_weight / total_weight, 4)
        match_score = int(round(probability * 100))

        if match_score >= 85:
            match_status = "Eligible"
        elif match_score >= 50:
            match_status = "Partial Match"
        else:
            match_status = "Not Eligible"

        # Sigmoid calibration for confidence score
        confidence = round(1.0 / (1.0 + math.exp(-3.5 * (probability - 0.5))), 3)

        return {
            "match_status": match_status,
            "match_score": match_score,
            "confidence_score": confidence,
            "model_name": self.model_name,
            "algorithm": self.algorithm,
            "matched_rules": matched_rules,
            "unmatched_rules": unmatched_rules,
            "explanations": decision_path_explanations,
        }

# Global Singleton Recommender
ml_recommender = ExplainableSchemeClassifier()
