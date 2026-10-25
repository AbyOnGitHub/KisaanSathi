import os
from supabase import create_client

SUPABASE_URL = "https://pxzikfwejlncbwcrsujv.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emlrZndlamxuY2J3Y3JzdWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTc0NzU3NCwiZXhwIjoyMTA1MzIzNTc0fQ.Ig9Gzof3ol10hl5qjyjLdwCpGtOiSQf_Fs_2tgk_XHI"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Define the sellers we want to recreate
sellers = [
    {
        "id": "a1111111-1111-1111-1111-111111111111",
        "email": "seller1@agrimart.in",
        "full_name": "Ramesh Patil",
        "business_name": "Kisan Seva Kendra (Nagpur)",
        "phone": "+919876543210",
        "gstin": "27AABCK1234R1Z5"
    },
    {
        "id": "a2222222-2222-2222-2222-222222222222",
        "email": "seller2@agrimart.in",
        "full_name": "Suresh Agrawal",
        "business_name": "GreenGrow Agri Depot (Indore)",
        "phone": "+919876543211",
        "gstin": "23AABCS5678R1Z2"
    },
    {
        "id": "a3333333-3333-3333-3333-333333333333",
        "email": "seller3@agrimart.in",
        "full_name": "Gurpreet Singh",
        "business_name": "Punjab Crop Solutions (Ludhiana)",
        "phone": "+919876543212",
        "gstin": "03AABCP9012R1Z8"
    },
    {
        "id": "a4444444-4444-4444-4444-444444444444",
        "email": "seller4@agrimart.in",
        "full_name": "Venkatesh Rao",
        "business_name": "Southern Agro Inputs (Guntur)",
        "phone": "+919876543213",
        "gstin": "37AABCK3456R1Z1"
    },
    {
        "id": "a5555555-5555-5555-5555-555555555555",
        "email": "seller5@agrimart.in",
        "full_name": "Priya Sharma",
        "business_name": "Priya Bio-Organics (Nashik)",
        "phone": "+919876543214",
        "gstin": "27AABCA7890R1Z4"
    }
]

# We will let the DB trigger handle profile creation, then we just update the specific fields
def recreate_sellers():
    print("Recreating sellers...")
    for s in sellers:
        try:
            print(f"Creating user {s['email']} with ID {s['id']}...")
            new_user = supabase.auth.admin.create_user({
                "email": s['email'],
                "password": "Seller@123",
                "email_confirm": True,
                "user_metadata": {
                    "role": "seller",
                    "full_name": s['full_name'],
                    "business_name": s['business_name'],
                    "phone_number": s['phone'],
                    "gstin_or_license": s['gstin']
                }
            })
            
            # The id assigned by Supabase might not match the requested 'id' unless we can force it,
            # but create_user does not allow passing a specific UUID.
            # That's totally fine, we will just use the new assigned ID!
            assigned_id = new_user.user.id
            print(f"Created successfully! Assigned ID: {assigned_id}")
            
            # Update the profile (created by trigger) with the extra seller data
            supabase.table("profiles").update({
                "role": "seller",
                "is_verified": True,
                "business_name": s['business_name'],
                "gstin_or_license": s['gstin'],
                "phone_number": s['phone']
            }).eq("id", assigned_id).execute()
            
            s['assigned_id'] = assigned_id
        except Exception as e:
            print(f"Error creating {s['email']}: {e}")

    # Now let's re-insert the products using the NEW IDs
    print("\nRe-seeding products...")
    
    # Map old IDs to new IDs
    # e.g., 's1' -> assigned_id of seller1
    id_map = {
        's1': sellers[0].get('assigned_id'),
        's2': sellers[1].get('assigned_id'),
        's3': sellers[2].get('assigned_id'),
        's4': sellers[3].get('assigned_id'),
        's5': sellers[4].get('assigned_id')
    }

    products = [
        (id_map['s1'], 1, 'Hybrid Cotton Seeds (Bt-II Bollgard)', 'High-yield pest resistant Bt cotton seed packet. Ideal for Kharif sowing.', 820.00, 10.0, 'per packet (450g)', 150, 2, 4.8, 120, ['https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500'], ['cotton', 'seeds', 'kharif'], True, True),
        (id_map['s2'], 1, 'Basmati Rice Seeds (Pusa 1121)', 'Premium long-grain Basmati rice seeds. Excellent aroma and crop density.', 240.00, 5.0, 'per kg', 500, 5, 4.6, 85, ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'], ['rice', 'basmati', 'paddy'], True, True),
        (id_map['s3'], 1, 'Hybrid Wheat Seeds (HD-2967)', 'High rust resistance variety recommended for Northern Rabi wheat production.', 95.00, 0.0, 'per kg', 2000, 10, 4.9, 210, ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500'], ['wheat', 'seeds', 'rabi'], True, True),
        (id_map['s1'], 1, 'Soybean Seeds (JS-9560)', 'Early maturing high-oil content soybean variety suited for rainfed cultivation.', 110.00, 8.0, 'per kg', 800, 10, 4.5, 64, ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500'], ['soybean', 'oilseed'], True, True),
        (id_map['s3'], 1, 'Mustard Seeds (Pusa Bold)', 'Bold seeded high oil yield mustard variety for Rabi season.', 130.00, 5.0, 'per kg', 600, 5, 4.7, 92, ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500'], ['mustard', 'oilseed'], True, True),
        (id_map['s2'], 1, 'Hybrid Maize Seeds (NK-6240)', 'Uniform cob size and disease resistance. Maturity in 95-100 days.', 320.00, 12.0, 'per kg', 450, 4, 4.6, 115, ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500'], ['maize', 'corn'], True, True),
        (id_map['s4'], 1, 'Tomato Seeds (Arka Rakshak Hybrid)', 'Triple disease resistant tomato variety with yield potential of 75-80 t/ha.', 1400.00, 15.0, 'per 10g packet', 100, 1, 4.9, 42, ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'], ['tomato', 'vegetable'], True, True),
        (id_map['s5'], 1, 'Onion Seeds (Nashik Red High Yield)', 'Deep red globe shaped onions with 120-130 days maturity.', 2600.00, 10.0, 'per kg', 80, 1, 4.8, 55, ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500'], ['onion', 'vegetable'], True, True),

        (id_map['s1'], 2, 'Neem Coated Urea (46% N)', 'Standard nitrogenous fertilizer essential for vegetative growth and green foliage.', 267.00, 0.0, 'per 50kg bag', 1200, 5, 4.9, 310, ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'], ['urea', 'nitrogen'], True, False),
        (id_map['s2'], 2, 'DAP Fertilizer (18-46-0)', 'Di-ammonium phosphate providing high phosphorus & nitrogen for root establishment.', 1350.00, 4.0, 'per 50kg bag', 500, 2, 4.8, 142, ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500'], ['dap', 'phosphorus'], True, True),
        (id_map['s3'], 2, 'NPK Complex (10:26:26)', 'Balanced complex fertilizer for root, flower, and grain formation.', 1470.00, 5.0, 'per 50kg bag', 400, 2, 4.7, 98, ['https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500'], ['npk', 'complex'], True, True),
        (id_map['s2'], 2, 'Muriate of Potash (MOP 60% K)', 'Potassium fertilizer essential for grain filling, disease resistance, and yield quality.', 880.00, 0.0, 'per 50kg bag', 350, 2, 4.6, 76, ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500'], ['potash', 'mop'], True, True),
        (id_map['s1'], 2, 'Single Super Phosphate (SSP Powder)', 'Contains 16% P2O5 and 11% Sulphur. Ideal for oilseed and pulse crops.', 420.00, 5.0, 'per 50kg bag', 600, 5, 4.5, 52, ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'], ['ssp', 'phosphate'], True, True),
        (id_map['s4'], 2, 'Zinc Sulphate Monohydrate (33% Zn)', 'Corrects zinc deficiency in paddy, wheat, and sugarcane crops.', 75.00, 0.0, 'per kg', 1000, 5, 4.7, 88, ['https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500'], ['zinc', 'micronutrient'], True, True),
        (id_map['s5'], 2, 'Water Soluble NPK (19:19:19)', '100% water soluble foliar and fertigation fertilizer for quick plant response.', 180.00, 10.0, 'per kg', 500, 2, 4.8, 134, ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'], ['water soluble', 'foliar'], True, True),

        (id_map['s2'], 3, 'Chlorpyrifos 20% EC Insecticide', 'Broad spectrum insecticide for soil insect and termite control.', 420.00, 8.0, 'per litre', 250, 1, 4.5, 78, ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'], ['insecticide', 'pesticide'], True, True),
        (id_map['s4'], 3, 'Imidacloprid 17.8% SL Sucking Pest Control', 'Systemic insecticide for aphid, jassid, thrips, and whitefly control.', 480.00, 10.0, 'per 250ml', 300, 1, 4.8, 160, ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'], ['insecticide', 'systemic'], True, True),
        (id_map['s3'], 3, 'Glyphosate 41% SL Non-Selective Herbicide', 'Systemic non-selective weedicide for total weed clearance in non-crop areas.', 550.00, 5.0, 'per litre', 200, 1, 4.6, 95, ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'], ['herbicide', 'weedicide'], True, True),
        (id_map['s1'], 3, 'Mancozeb 75% WP Contact Fungicide', 'Broad spectrum protective fungicide for blight and downy mildew control.', 360.00, 5.0, 'per kg', 400, 1, 4.7, 110, ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'], ['fungicide', 'protection'], True, True),
        (id_map['s5'], 3, 'Neem Oil Bio-Pesticide (1500 PPM)', '100% natural cold pressed neem oil for organic pest management.', 380.00, 12.0, 'per litre', 300, 1, 4.9, 85, ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500'], ['neem', 'bio pesticide', 'organic'], True, True),

        (id_map['s1'], 4, '16L Battery Operated Knapsack Sprayer', 'Double motor high pressure sprayer with 12V battery and 4 brass nozzles.', 3150.00, 18.0, 'per piece', 45, 1, 4.8, 190, ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=500'], ['sprayer', 'battery'], True, True),
        (id_map['s3'], 4, 'Brush Cutter (4-Stroke Petrol Engine)', 'Heavy duty petrol brush cutter for grass cutting, weed clearance, and paddy harvesting.', 11800.00, 15.0, 'per piece', 15, 1, 4.7, 38, ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=500'], ['brush cutter', 'machinery'], True, True),
        (id_map['s2'], 4, 'Manual Hand Cultivator Weeder', 'Iron body cultivator tool for aeration and weeding in vegetable beds.', 480.00, 10.0, 'per piece', 100, 1, 4.4, 45, ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=500'], ['hand tool', 'weeder'], True, True),
        (id_map['s1'], 4, 'Heavy Iron Sickle (Daranti For Harvesting)', 'Forged carbon steel hardened edge blade for manual crop harvesting.', 220.00, 0.0, 'per piece', 250, 2, 4.6, 82, ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=500'], ['sickle', 'harvesting'], True, True),
        (id_map['s4'], 4, 'Manual Seed Drill Machine (3 Row)', 'Adjustable depth seed drill for line sowing of wheat, pulses, and maize.', 3400.00, 10.0, 'per piece', 20, 1, 4.5, 29, ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=500'], ['seed drill', 'sowing'], True, True),

        (id_map['s2'], 5, 'Drip Irrigation Kit (1 Acre Complete Set)', 'Complete drip system with main line, laterals, drippers, line filter, and connectors.', 14200.00, 15.0, 'per set', 20, 1, 4.9, 78, ['https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500'], ['drip', 'irrigation', 'kit'], True, True),
        (id_map['s2'], 5, 'HDPE Drip Mainline Pipe (63mm 100m Roll)', 'ISI marked UV stabilized HDPE pipe for agricultural water transport.', 4800.00, 8.0, 'per roll', 50, 1, 4.7, 42, ['https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500'], ['hdpe', 'pipe'], True, True),
        (id_map['s3'], 5, 'Submersible Water Pump (5 HP 3-Phase)', 'Heavy duty cast iron submersible pump for open wells and borewells.', 21500.00, 12.0, 'per piece', 10, 1, 4.8, 31, ['https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500'], ['pump', 'submersible'], True, True),
        (id_map['s4'], 5, 'Rain Gun Sprinkler (360 Degree Rotation)', 'High throw radius sprinkler for uniform irrigation in sugarcane and groundnut.', 2900.00, 10.0, 'per piece', 35, 1, 4.6, 64, ['https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=500'], ['rain gun', 'sprinkler'], True, True),

        (id_map['s1'], 6, 'High Protein Cattle Feed Pellets', 'Enriched with 20% bypass protein and minerals for higher milk yield.', 1150.00, 5.0, 'per 50kg bag', 300, 2, 4.8, 140, ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500'], ['cattle feed', 'dairy'], True, True),
        (id_map['s3'], 6, 'Pure Mustard Oil Cake (Sarson Khal)', 'High fat and protein supplement cake for dairy cows and buffaloes.', 42.00, 0.0, 'per kg', 2000, 10, 4.7, 185, ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500'], ['oil cake', 'khal'], True, True),
        (id_map['s1'], 6, 'Mineral Mixture for Dairy Cattle', 'Chelated mineral supplement containing Calcium, Phosphorus, Zinc, and Iodine.', 190.00, 10.0, 'per kg', 400, 2, 4.9, 92, ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500'], ['minerals', 'dairy'], True, True),

        (id_map['s5'], 7, 'Pure Vermicompost Organic Manure', '100% organic earthworm manure rich in humic content and soil microbes.', 420.00, 15.0, 'per 40kg bag', 200, 2, 4.8, 115, ['https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500'], ['vermicompost', 'organic'], True, True),
        (id_map['s5'], 7, 'Liquid Bio-Decomposer for Stubble', 'Accelerates crop residue decomposition in soil within 20-25 days.', 250.00, 10.0, 'per bottle (1L)', 300, 1, 4.6, 48, ['https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500'], ['decomposer', 'bio'], True, True),
        (id_map['s5'], 7, 'Humic Acid 98% Potassium Humate', 'Promotes white root development and enhances soil nutrient uptake.', 380.00, 12.0, 'per kg', 250, 1, 4.9, 88, ['https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=500'], ['humic acid', 'root growth'], True, True),

        (id_map['s3'], 8, 'UV Stabilized Greenhouse Sheet (200 Micron)', '3-layer polyhouse sheet for nursery and polyhouse structures.', 8500.00, 10.0, 'per roll (7m x 30m)', 10, 1, 4.7, 18, ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500'], ['greenhouse', 'polyhouse'], True, True),
        (id_map['s1'], 8, 'Galvanized Grain Storage Silo Bin (500kg)', 'Air tight pest resistant galvanized iron bin for storing wheat and grains.', 6800.00, 8.0, 'per piece', 15, 1, 4.8, 35, ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500'], ['storage', 'silo'], True, True)
    ]
    
    for p in products:
        try:
            if not p[0]: continue
            supabase.table("products").insert({
                "seller_id": p[0],
                "category_id": p[1],
                "name": p[2],
                "description": p[3],
                "price": p[4],
                "discount_percent": p[5],
                "unit": p[6],
                "stock": p[7],
                "min_order": p[8],
                "rating": p[9],
                "total_reviews": p[10],
                "image_urls": p[11],
                "tags": p[12],
                "is_active": p[13],
                "allow_bargaining": p[14]
            }).execute()
        except Exception as e:
            print(f"Error inserting product {p[2]}: {e}")

    print("Seed complete! You can now login with these accounts using the correct API-created credentials.")

if __name__ == "__main__":
    recreate_sellers()
