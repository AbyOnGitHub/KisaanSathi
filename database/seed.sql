-- seed.sql

-- Insert Demo Scheme: Farm Mechanization
INSERT INTO schemes (
    id, name_en, name_hi, name_mr,
    description_en, description_hi, description_mr,
    category
) VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'Farm Mechanization Assistance', 
    'कृषि यंत्रीकरण सहायता', 
    'कृषी यांत्रिकीकरण योजना',
    'Financial assistance for purchasing agricultural machinery like tractors, power tillers, and implements.',
    'ट्रैक्टर, पावर टिलर और उपकरणों जैसी कृषि मशीनरी खरीदने के लिए वित्तीय सहायता।',
    'ट्रॅक्टर, पॉवर टिलर आणि इतर कृषी यंत्रे खरेदीसाठी आर्थिक सहाय्य.',
    'farm_machinery'
);

-- Insert Rules for Demo Scheme
INSERT INTO scheme_rules (scheme_id, field_name, operator, value, description_en) VALUES 
('11111111-1111-1111-1111-111111111111', 'state', '=', '"Maharashtra"', 'Must be a resident of Maharashtra.'),
('11111111-1111-1111-1111-111111111111', 'farmer_category', 'IN', '["small", "marginal", "women", "sc", "st"]', 'Targeted mainly for specific categories for higher subsidy.');

-- Insert Application Fields
INSERT INTO scheme_application_fields (scheme_id, field_name, label_en, field_type, field_order) VALUES 
('11111111-1111-1111-1111-111111111111', 'machinery_type', 'Type of Machinery', 'select', 1),
('11111111-1111-1111-1111-111111111111', 'quotation_amount', 'Quotation Amount (Rs)', 'number', 2);
