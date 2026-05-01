# Venkat AI Platform (VAP)

Production-oriented **multi-agent** stack aligned with the Venkat AI Platform build guide: **Next.js** frontend, **FastAPI + LangGraph** backend, **Qdrant** RAG (optional **Pinecone** mirror hook), **Langfuse** observability, and delivery to **Slack / Telegram / WhatsApp (Twilio)**.

## Architecture (summary)

- **User layer:** Next.js UI on Vercel (local: `frontend/`).
- **Orchestrator:** LangGraph pipeline — Chief → Planner → parallel workers → optional Content → Insight → Critic → Notify.
- **Data layer:** Qdrant (`docker-compose`), optional Pinecone + configurable embeddings (`openai` | `cohere` | local fallback for dev).
- **Extended agents** (beyond the PDF baseline): `NewsResearchAgent`, `PrototypeBuilderAgent`, `MarketIntelligenceAgent`, plus notification routing in `DeliveryAgent` patterns.

## Quick start

1. **Infra**

   ```bash
   docker compose up -d postgres redis qdrant
   ```

2. **Backend**

   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -e ".[dev]"
   cp ../.env.example .env
   # Set OPENROUTER_API_KEY or OPENAI_API_KEY at minimum
   uvicorn app.main:app --reload --port 8000
   ```

3. **Frontend**

   ```bash
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev
   ```

4. **Try a workflow**

   - UI: http://localhost:3000/chat  
   - API: `POST http://localhost:8000/chat` with JSON `{"message":"...","notify_channels":["slack"]}`

## Principal-architect use cases

| Intent (Chief)        | Agents (high level)                         |
|-----------------------|---------------------------------------------|
| `news_learning`       | Web + NewsResearch + optional LinkedIn draft |
| `prototype_idea`      | Web + PrototypeBuilder + Code               |
| `market_analysis`     | Web + MarketIntelligence (not advice)       |
| `rag_query`           | Web + Knowledge (Qdrant)                    |
| `enterprise_api`      | Web + API integration patterns              |

## Notifications

- **Slack:** Incoming webhook (`SLACK_WEBHOOK_URL`).
- **Telegram:** Bot token + chat id (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
- **WhatsApp:** Twilio WhatsApp sandbox/production (`TWILIO_*` vars in `.env.example`). Meta Cloud API can be added behind the same `DeliveryAgent` interface.

## Docs (Principal AI Architect bar)

- `docs/PRINCIPAL_AI_ARCHITECT_DESIGN_DOCUMENT.md` — publication-ready design: tradeoffs, risks, ADRs, cost, scalability.  
- `docs/PRIMARY_REQUIREMENT_MEMORY.md` — durable charter (“memory”) for humans + agents.  
- `docs/ARCHITECTURE.md` — runtime architecture & agent catalog.  
- `.cursor/rules/vap-principal-architect-bar.mdc` — non-negotiable engineering standard for this repo.

## Git

If `git init` fails in your environment (hooks permission), run locally:

```bash
cd ~/venkat-ai-platform && git init
```

## Compliance

Market outputs are **informational only**, not investment advice. Wire your own disclaimers and jurisdiction-specific checks before external distribution.
