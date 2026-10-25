import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

users = [
    {'email': 'demo.farmer@kisaansathi.org', 'password': 'DemoFarmer@2025', 'user_metadata': {'full_name': 'Demo Farmer', 'role': 'farmer'}},
    {'email': 'demo.seller@kisaansathi.org', 'password': 'DemoSeller@2025', 'user_metadata': {'full_name': 'Demo Seller', 'role': 'seller'}},
    {'email': 'demo.admin@kisaansathi.org', 'password': 'DemoAdmin@2025', 'user_metadata': {'full_name': 'Demo Admin', 'role': 'admin'}},
]

results = {}
for u in users:
    try:
        res = supabase.auth.admin.create_user({
            'email': u['email'],
            'password': u['password'],
            'user_metadata': u['user_metadata'],
            'email_confirm': True
        })
        print(f"Created {u['email']}: {res.user.id}")
        results[u['user_metadata']['role']] = res.user.id
    except Exception as e:
        print(f"Error for {u['email']}: {e}")

# Fetch the existing users if error occurred (like User already exists)
all_users = supabase.auth.admin.list_users()
# Note: list_users() returns a ListUsersResponse object in newer supabase-py versions
if hasattr(all_users, 'users'):
    user_list = all_users.users
else:
    user_list = all_users

for existing in user_list:
    if existing.email in [u['email'] for u in users]:
        for u in users:
            if existing.email == u['email']:
                results[u['user_metadata']['role']] = existing.id
                print(f"Found existing {u['email']}: {existing.id}")
                
                # Check if they exist in profiles table
                prof = supabase.table('profiles').select('*').eq('id', existing.id).execute()
                if not prof.data:
                    print(f"Inserting into profiles for {existing.id}")
                    supabase.table('profiles').insert({
                        'id': existing.id,
                        'role': u['user_metadata']['role'],
                        'full_name': u['user_metadata']['full_name'],
                        'is_verified': True
                    }).execute()

print('--- MAP ---')
print(results)
