cd api
python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload

http://localhost:8000/docs
