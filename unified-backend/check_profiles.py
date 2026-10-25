import os
from supabase import create_client

SUPABASE_URL = "https://pxzikfwejlncbwcrsujv.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emlrZndlamxuY2J3Y3JzdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDc1NzQsImV4cCI6MjEwNTMyMzU3NH0.ltZjZ5KjEVS02VVP_KxENB0QB4XymnC5WGcU8XteJYs"

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

try:
    print("Querying profiles...")
    res = supabase.table("profiles").select("*").limit(1).execute()
    print("Success. Profiles:", res.data)
except Exception as e:
    print(f"Error querying profiles: {e}")
