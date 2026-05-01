# Venkat AI Platform — Architecture & Agent Catalog

## Publication & governance

- **Principal design document:** `docs/PRINCIPAL_AI_ARCHITECT_DESIGN_DOCUMENT.md` (tradeoffs, risks, cost, scale).  
- **Durable charter / “memory” anchor:** `docs/PRIMARY_REQUIREMENT_MEMORY.md` + `.cursor/rules/vap-principal-architect-bar.mdc`.

## Stack decisions (Principal AI Architect view)

| Concern | Choice | Notes |
|---------|--------|------|
| Orchestration | LangGraph | Explicit graph for portfolio demos + testable nodes |
| LLM access | OpenRouter default | Single integration surface; Groq/OpenAI switches via env |
| Embeddings | OpenAI default | Swap to Cohere with `EMBEDDING_PROVIDER=cohere` |
| Primary vector | Qdrant | Docker-friendly, predictable latency |
| Secondary vector | Pinecone (optional) | Best-effort dual-write from `memory/pinecone_optional.py` |
| Persistence | Postgres | `chat_threads`, `chat_messages`, `workflow_runs` |
| Jobs | Redis + ARQ | Scheduled daily brief (`app/worker/settings.py`) |
| Observability | Langfuse | Spans via `start_as_current_observation` |
| Notifications | Slack / Telegram / Twilio WhatsApp | WhatsApp via Meta Cloud API can plug in similarly |

## LangGraph flow

```
START → chief → planner → workers → content_extra → insight → critic → compose → notify → END
```

- **chief:** intent classification (see **Chief intents** below).  
- **planner:** textual execution plan for humans / UI.  
- **workers:** `asyncio` parallel bundle per intent (always includes **WebAgent** for freshness).  
- **content_extra:** LinkedIn/blog draft when intent is `news_learning`.  
- **insight / critic:** synthesis + QA guardrails (especially for finance/compliance copy).

## Chief intents (routing labels)

`general`, `news_learning`, `prototype_idea`, `market_analysis`, `rag_query`, `enterprise_api`,  
`portfolio_risk`, `calendar_commitments`, `budget_telemetry`, `security_review`, `compliance`,  
`meeting_brief`, `experiment`.

## Core agents (from build guide)

- **ChiefOrchestrator** — intent routing (`agents/chief.py` + graph entry).  
- **PlannerAgent** — decomposition (`agents/planner.py`).  
- **KnowledgeAgent** — Qdrant retrieval-augmented answers.  
- **WebAgent** — Tavily-backed live search when `TAVILY_API_KEY` is set.  
- **APIAgent** — enterprise REST/GraphQL integration patterns.  
- **CodeAgent** — implementation support.  
- **InsightAgent** — executive synthesis.  
- **ContentAgent** — social/blog drafting.  
- **CriticAgent** — hallucination / policy checks.

## Extended agents (personal OS — implemented)

- **NewsResearchAgent** — NewsAPI + Web synthesis → learning brief.  
- **PrototypeBuilderAgent** — idea → MVP scope, architecture, scaffold, tickets.  
- **MarketIntelligenceAgent** — market APIs + narrative (**not financial advice**).  
- **PortfolioRiskAgent** — scenario / factor education (**not financial advice**).  
- **CalendarCommitmentsAgent** — schedule-aware planning (`CALENDAR_CONTEXT_PATH` optional file).  
- **BudgetTelemetryAgent** — spend/unit economics interpretation (`BUDGET_SUMMARY_PATH` optional file).  
- **SecurityReviewAgent** — STRIDE-style architecture review checklist.  
- **ComplianceAgent** — licensing/privacy/promotion considerations.  
- **MeetingBriefAgent** — exec briefing (`MEETING_CONTEXT_PATH` optional file).  
- **ExperimentAgent** — offline/online eval design patterns.

## Production hardening (in-repo)

| Capability | Location |
|-----------|----------|
| Alembic migrations | `backend/alembic/` |
| Chat persistence API | `POST /chat` + `GET /threads/{id}/messages` |
| Scheduled brief | `arq app.worker.settings.WorkerSettings` |
| Pinecone mirror | install `pip install -e ".[pinecone]"`, set `PINECONE_*` |

## Phase mapping (PDF checklist)

| Phase | Status in repo |
|-------|----------------|
| 1 Foundation | Monorepo, docker-compose, README |
| 2 Frontend | Next.js App Router, dashboard/chat/monitor/settings |
| 3 Backend foundation | FastAPI layout, schemas, routes |
| 4 LLM router | Bucket-based model selection (`llm/router.py`, `factory.py`) |
| 5 LangGraph | `orchestrator/graph.py` |
| 6 RAG | `/ingest`, Qdrant, optional Pinecone dual-write |
| 7 Observability | Langfuse spans |
| 8 Enterprise | Salesforce stub route |
| 9 Content engine | ContentAgent in graph for news intent |
| 10 Advanced | Voice, marketplace, MCP — future |

## Data ingestion

`POST /ingest` with `{ "chunks": [{ "id": "...", "text": "...", "metadata": {} }] }` upserts vectors into **Qdrant** and (if configured) **Pinecone**.

## Privacy & safety

- Never ship market commentary without disclaimers and human review for external audiences.  
- Slack/Telegram/WhatsApp credentials are **server-side only**; the UI only toggles which channels to request.
