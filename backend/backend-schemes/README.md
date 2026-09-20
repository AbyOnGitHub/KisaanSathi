# Government Scheme Recommendation Backend (`backend-schemes`)

This service provides the rules engine and recommendation APIs for government welfare schemes, subsidies, and grants tailored to farmers.

---

## Features
- **Rule Engine**: Evaluates farmer profile (land size, state, crop type, category) against criteria.
- **Endpoints**:
  - `POST /api/recommendations/`: Returns matched schemes with eligibility reasoning.
  - `GET /api/protected`: Protected route requiring valid Supabase user JWT.

---

## How to Run

```bash
cd backend/backend-schemes
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.
