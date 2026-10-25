import os
import shutil

src_dirs = [
    'backend/backend-loginsystem/backend_auth',  # wait, auth is in backend_auth
    'backend/backend-marketplace/app',
    'backend/backend-schemes/app',
    'backend/backend-cropyield/app',
    'backend/backend-crop-disease'
]

dest_dir = 'unified-backend/app'

# For backend_loginsystem, auth is in backend_auth
# For backend_crop_disease, it has ml_service.py and main.py in root.

def copy_contents(src, dst):
    if not os.path.exists(src):
        return
    for item in os.listdir(src):
        if item in ['__pycache__', '.env', '.env.example', 'README.md', 'requirements.txt']:
            continue
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            if not os.path.exists(d):
                os.makedirs(d)
            copy_contents(s, d)
        else:
            if not os.path.exists(d):
                shutil.copy2(s, d)
            else:
                # If file exists, maybe we skip or handle (e.g. main.py)
                print(f"Skipping existing file: {d}")

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

# 1. MarketPlace
copy_contents('backend/backend-marketplace/app', dest_dir)
# 2. Schemes
copy_contents('backend/backend-schemes/app', dest_dir)
# 3. Crop Yield
copy_contents('backend/backend-cropyield/app', dest_dir)
# 4. Auth
# backend_auth has auth.py, deps.py, schema.py, database.py. Let's copy them to routers, schemas etc.
os.makedirs(f"{dest_dir}/routers", exist_ok=True)
os.makedirs(f"{dest_dir}/schemas", exist_ok=True)
os.makedirs(f"{dest_dir}/services", exist_ok=True)
shutil.copy2('backend/backend-loginsystem/backend_auth/auth.py', f"{dest_dir}/routers/auth.py")
shutil.copy2('backend/backend-loginsystem/backend_auth/schema.py', f"{dest_dir}/schemas/auth.py")
if os.path.exists('backend/backend-loginsystem/backend_auth/deps.py'):
    shutil.copy2('backend/backend-loginsystem/backend_auth/deps.py', f"{dest_dir}/dependencies.py")
if os.path.exists('backend/backend-loginsystem/backend_auth/database.py'):
    shutil.copy2('backend/backend-loginsystem/backend_auth/database.py', f"{dest_dir}/database.py")

# 5. Crop Disease
shutil.copy2('backend/backend-crop-disease/ml_service.py', f"{dest_dir}/services/ml_service.py")
# The router for crop disease is in main.py, we will write a new router.

print("Merge copy complete.")
