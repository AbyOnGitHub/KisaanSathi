import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

demo_users = [
    {
        "id": "00000000-0000-0000-0000-000000000001",
        "role": "farmer",
        "full_name": "Demo Farmer",
        "email": "demo.farmer@kisaansathi.org",
        "is_verified": True
    },
    {
        "id": "00000000-0000-0000-0000-000000000002",
        "role": "seller",
        "full_name": "Demo Seller",
        "email": "demo.seller@kisaansathi.org",
        "is_verified": True
    },
    {
        "id": "00000000-0000-0000-0000-000000000003",
        "role": "admin",
        "full_name": "Demo Admin",
        "email": "demo.admin@kisaansathi.org",
        "is_verified": True
    }
]

for user in demo_users:
    try:
        res = supabase.table("profiles").upsert(user).execute()
        print(f"Upserted {user['role']}: {res.data}")
    except Exception as e:
        print(f"Error upserting {user['role']}: {e}")
