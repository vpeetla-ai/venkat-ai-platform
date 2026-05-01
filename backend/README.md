# Venkat AI Platform — Backend

FastAPI service with LangGraph orchestration, multi-LLM routing, RAG (Qdrant / optional Pinecone), and notification delivery.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp ../.env.example .env
# Edit .env — set OPENROUTER_API_KEY or OPENAI_API_KEY at minimum
```

From repo root, start infra:

```bash
docker compose up -d postgres redis qdrant
```

Apply database migrations:

```bash
alembic upgrade head
```

Run API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open docs: http://localhost:8000/docs

### Persistence & history

- `POST /chat` accepts optional `thread_id` to continue a conversation.  
- `GET /threads/{thread_id}/messages` returns ordered messages.  
- Toggle `ENABLE_DB_PERSISTENCE=false` to disable writes while debugging.

### Scheduled daily brief (Redis + ARQ)

Set `DAILY_BRIEF_ENABLED=true` and configure `DAILY_BRIEF_CHANNELS` / cron env vars in `.env`, then:

```bash
arq app.worker.settings.WorkerSettings
```

### Optional Pinecone dual-write

```bash
pip install -e ".[pinecone]"
```

Set `PINECONE_API_KEY` and `PINECONE_INDEX` (dimension must match embeddings).
