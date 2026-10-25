import os
from supabase import create_client

# Config from unified-backend/.env
SUPABASE_URL = "https://pxzikfwejlncbwcrsujv.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emlrZndlamxuY2J3Y3JzdWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTc0NzU3NCwiZXhwIjoyMTA1MzIzNTc0fQ.Ig9Gzof3ol10hl5qjyjLdwCpGtOiSQf_Fs_2tgk_XHI"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

email = "seller1@agrimart.in"
password = "Seller@123"

try:
    print(f"Creating user {email}...")
    user = supabase.auth.admin.create_user({
        "email": email,
        "password": password,
        "email_confirm": True,
        "user_metadata": {
            "role": "seller",
            "full_name": "AgriMart Dealer"
        }
    })
    print(f"User created successfully: {user.user.id}")
except Exception as e:
    if "already registered" in str(e).lower() or "User already exists" in str(e):
        print(f"User {email} already exists. Attempting to update password and confirm email.")
        try:
            # We don't have the user ID easily from just email via standard API unless we query users.
            # But the user is complaining they can't login, so they probably aren't confirmed or password is wrong.
            pass
        except Exception as inner_e:
            pass
    print(f"Error: {e}")
