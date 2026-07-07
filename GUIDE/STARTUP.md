# Startup Guide

Run each of the following in a separate terminal, in order.

---

## 1. Ollama

```powershell
ollama serve
```

Runs on port 11434. Must be running before the AI service starts.

---

## 2. AI Service (FastAPI)

```powershell
cd BACKEND\ai_service
.venv\Scripts\Activate.ps1
python main.py
```

Runs on port 8000. First-time setup:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 3. Backend (Express)

```powershell
cd BACKEND
npm install
npm run dev
```

Runs on port 5000. Requires MongoDB running locally on port 27017.

---

## 4. Frontend (Next.js)

```powershell
cd frontend
npm install
npm run dev
```

Runs on port 3000. Open http://localhost:3000 in your browser.

---

## 5. Admin Panel (Next.js)

```powershell
cd admin
npm install
npm run dev
```

Runs on port 3001. Open http://localhost:3001 in your browser.

---

## First-Time Data Setup

After all services are running:

1. Go to http://localhost:3001 (admin panel)
2. Navigate to Scenarios and click "Seed Defaults"
3. Navigate to Training and click "Seed Training Data"
4. To seed Pinecone (RAG vectors), run:

```powershell
cd BACKEND\ai_service
.venv\Scripts\Activate.ps1
python scripts\seed_pinecone.py
```

---

## Environment Files

| Location | Required vars |
|---|---|
| `BACKEND/.env` | `MONGODB_URL`, `MONGODB_DB`, `JWT_SECRET`, `AI_SERVICE_URL` |
| `BACKEND/ai_service/.env` | `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `PINECONE_API_KEY`, `PINECONE_INDEX` |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` |
| `admin/.env.local` | `NEXT_PUBLIC_API_URL` |
