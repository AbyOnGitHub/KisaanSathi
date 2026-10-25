call python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt
pip install scikit-learn pandas scipy
python models\retrain.py
