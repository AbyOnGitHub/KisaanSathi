import requests
import io
from PIL import Image

# Create a small dummy image
image = Image.new('RGB', (224, 224), color = 'red')
img_byte_arr = io.BytesIO()
image.save(img_byte_arr, format='JPEG')
img_byte_arr.seek(0)

# Send it to the endpoint
try:
    files = {'file': ('test.jpg', img_byte_arr, 'image/jpeg')}
    res = requests.post('http://localhost:8000/api/crop-disease/predict', files=files)
    print("Status Code:", res.status_code)
    # Use ascii encoding to avoid windows console crash with emojis
    print(str(res.json()).encode('ascii', 'ignore').decode('ascii'))
except Exception as e:
    print("Error:", e)
