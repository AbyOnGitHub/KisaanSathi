def evaluate_rules(farmer_data: dict, scheme_rules: list) -> dict:
    """
    Evaluates a set of rules against farmer data.
    Returns a dictionary with match status and details of matched/unmatched rules.
    """
    matched_rules_details = []
    all_matched = True
    any_matched = False
    
    for rule in scheme_rules:
        field_name = rule.get("field_name")
        operator = rule.get("operator")
        expected_value = rule.get("value")
        rule_id = rule.get("rule_id", "unknown")
        
        farmer_value = farmer_data.get(field_name)
        
        is_matched = False
        
        if farmer_value is not None:
            if operator == "=" or operator == "==":
                is_matched = farmer_value == expected_value
            elif operator == "!=":
                is_matched = farmer_value != expected_value
            elif operator == ">":
                is_matched = farmer_value > expected_value
            elif operator == "<":
                is_matched = farmer_value < expected_value
            elif operator == ">=":
                is_matched = farmer_value >= expected_value
            elif operator == "<=":
                is_matched = farmer_value <= expected_value
            elif operator == "IN":
                is_matched = farmer_value in expected_value if isinstance(expected_value, list) else False
            elif operator == "CONTAINS":
                is_matched = expected_value in farmer_value if isinstance(farmer_value, list) else False
        
        if not is_matched:
            all_matched = False
        else:
            any_matched = True
            
        matched_rules_details.append({
            "rule_id": rule_id,
            "field_name": field_name,
            "operator": operator,
            "value": expected_value,
            "is_matched": is_matched
        })
        
    if not scheme_rules:
        match_status = "Eligible"
    elif all_matched:
        match_status = "Eligible"
    elif any_matched:
        match_status = "Partial Match"
    else:
        match_status = "Not Eligible"
        
    return {
        "match_status": match_status,
        "matched_rules": matched_rules_details
    }
