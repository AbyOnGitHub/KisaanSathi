def evaluate_rules(farmer_data: dict, scheme: dict) -> dict:
    """
    Evaluates scheme eligibility rules against a farmer's profile data.
    Provides complete explainability by detailing which rules matched and why.
    """
    rules = scheme.get("rules", [])
    matched_rules_details = []
    unmatched_rules_details = []
    explanations = []

    # Extract farmer attributes with sensible defaults
    state = farmer_data.get("state", "Maharashtra")
    category = farmer_data.get("category", "General")
    gender = farmer_data.get("gender", "Male")
    age = farmer_data.get("age") or 35
    land_size = float(farmer_data.get("land_size") or farmer_data.get("land_area") or 2.0)
    land_unit = str(farmer_data.get("land_unit") or "acres").lower()
    annual_income = float(farmer_data.get("annual_income") or 150000)
    farmer_crops = farmer_data.get("crops") or []
    if isinstance(farmer_crops, list) and farmer_crops and isinstance(farmer_crops[0], dict):
        farmer_crops = [c.get("crop", "") for c in farmer_crops if c.get("crop")]
    farmer_needs = farmer_data.get("needs") or []

    # Normalize land size to hectares for standardized comparison
    land_ha = land_size * 0.404686 if "acre" in land_unit else land_size

    total_weight = 0
    earned_weight = 0

    for rule in rules:
        rule_id = rule.get("rule_id", "R")
        field_name = rule.get("field_name")
        operator = rule.get("operator")
        expected_value = rule.get("value")
        weight = rule.get("weight", 1)
        total_weight += weight
        
        is_matched = False
        explanation = ""

        if field_name == "state":
            if operator == "=" or operator == "==":
                is_matched = str(state).strip().lower() == str(expected_value).strip().lower()
                explanation = f"Location in {state} qualifies for {expected_value} state benefits" if is_matched else f"Requires residence in {expected_value}"
            elif operator == "IN":
                allowed = [s.strip().lower() for s in expected_value] if isinstance(expected_value, list) else []
                is_matched = str(state).strip().lower() in allowed or "all" in allowed
                explanation = f"State {state} is eligible" if is_matched else f"Valid only for states: {', '.join(expected_value)}"

        elif field_name == "category":
            if operator == "=" or operator == "==":
                is_matched = str(category).strip().lower() == str(expected_value).strip().lower()
                explanation = f"Special category reservation: {category}" if is_matched else f"Requires {expected_value} category"
            elif operator == "IN":
                allowed = [c.strip().lower() for c in expected_value] if isinstance(expected_value, list) else []
                is_matched = str(category).strip().lower() in allowed
                explanation = f"Social category {category} is covered" if is_matched else f"Restricted to categories: {', '.join(expected_value)}"

        elif field_name == "land_size" or field_name == "land_ha":
            expected_num = float(expected_value)
            if operator == "<=":
                is_matched = land_ha <= (expected_num + 0.05)
                explanation = f"Land holding {land_size:.1f} {land_unit} ({land_ha:.2f} ha) meets limit <= {expected_num:.1f} ha" if is_matched else f"Exceeds max land limit of {expected_num:.1f} ha"
            elif operator == ">=":
                is_matched = land_ha >= (expected_num - 0.05)
                explanation = f"Land holding {land_size:.1f} {land_unit} meets minimum requirement >= {expected_num:.1f} ha" if is_matched else f"Below minimum land requirement of {expected_num:.1f} ha"

        elif field_name == "annual_income":
            expected_num = float(expected_value)
            if operator == "<=":
                is_matched = annual_income <= expected_num
                explanation = f"Annual farm income of ₹{annual_income:,.0f} satisfies income ceiling <= ₹{expected_num:,.0f}" if is_matched else f"Income exceeds ceiling of ₹{expected_num:,.0f}"

        elif field_name == "age":
            age_val = int(age) if age else 35
            expected_num = int(expected_value)
            if operator == "<=":
                is_matched = age_val <= expected_num
                explanation = f"Age {age_val} is within maximum age limit of {expected_num} years" if is_matched else f"Exceeds maximum age limit of {expected_num} years"
            elif operator == ">=":
                is_matched = age_val >= expected_num
                explanation = f"Age {age_val} satisfies minimum age requirement of {expected_num} years" if is_matched else f"Below minimum age of {expected_num} years"

        elif field_name == "crops":
            if isinstance(expected_value, list):
                common = [c for c in farmer_crops if any(c.lower() in ec.lower() or ec.lower() in c.lower() for ec in expected_value)]
                is_matched = len(common) > 0 or len(farmer_crops) == 0
                explanation = f"Cultivates eligible notified crops: {', '.join(common) if common else 'General crop coverage'}" if is_matched else f"Insures crops like: {', '.join(expected_value[:4])}"

        elif field_name == "needs":
            category_need = scheme.get("category")
            is_matched = category_need in farmer_needs or "all" in farmer_needs or not farmer_needs
            explanation = f"Addresses your priority need for {category_need.replace('_', ' ').title()}" if is_matched else f"Category: {category_need.replace('_', ' ').title()}"

        else:
            # Fallback direct comparison
            farmer_val = farmer_data.get(field_name)
            if operator in ["=", "=="]:
                is_matched = farmer_val == expected_value
            elif operator == "<=":
                is_matched = float(farmer_val or 0) <= float(expected_value)
            elif operator == ">=":
                is_matched = float(farmer_val or 0) >= float(expected_value)
            elif operator == "IN":
                is_matched = farmer_val in expected_value if isinstance(expected_value, list) else False
            explanation = f"Rule on {field_name} satisfied" if is_matched else f"Rule on {field_name} not satisfied"

        rule_detail = {
            "rule_id": rule_id,
            "field_name": field_name,
            "operator": operator,
            "value": expected_value,
            "is_matched": is_matched,
            "explanation": explanation
        }

        if is_matched:
            earned_weight += weight
            matched_rules_details.append(rule_detail)
            explanations.append(f"✓ {explanation}")
        else:
            unmatched_rules_details.append(rule_detail)

    if total_weight == 0:
        match_score = 100
        match_status = "Eligible"
    else:
        match_score = int(round((earned_weight / total_weight) * 100))
        if match_score >= 85:
            match_status = "Eligible"
        elif match_score >= 50:
            match_status = "Partial Match"
        else:
            match_status = "Not Eligible"

    return {
        "match_status": match_status,
        "match_score": match_score,
        "matched_rules": matched_rules_details,
        "unmatched_rules": unmatched_rules_details,
        "explanations": explanations
    }
