import os
import shutil

src_dirs = [
    'frontend/frontend-schemes/src',
    'frontend/frontend-marketplace/src',
    'frontend/frontendtest-crop-disease/src',
    'frontend/frontend-loginsystem/src'
]

dest_dir = 'unified-frontend/src'

def copy_contents(src, dst):
    if not os.path.exists(src):
        print(f"Source not found: {src}")
        return
    for item in os.listdir(src):
        if item in ['App.jsx', 'main.jsx', 'index.css', 'App.tsx', 'main.tsx', 'vite-env.d.ts']:
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
                print(f"Skipping existing file: {d}")

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

for src in src_dirs:
    print(f"Copying {src}...")
    copy_contents(src, dest_dir)

print("Frontend merge copy complete.")
