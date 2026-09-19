import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

if url and key:
    supabase: Client = create_client(url, key)
else:
    print("Warning: SUPABASE_URL and key are not set. Database operations will fail.")
    supabase = None
