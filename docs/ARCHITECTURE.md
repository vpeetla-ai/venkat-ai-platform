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
| Secondary vector | Pinecone (optional) | Ingest mirror only — reads always from Qdrant |
| Persistence | Postgres | `chat_threads`, `chat_messages`, `workflow_runs` |
| Jobs | Redis + ARQ | Scheduled daily brief (`app/worker/settings.py`) |
| Observability | Langfuse | Spans via `start_as_current_observation` |
| Notifications | Slack / Telegram / Twilio WhatsApp | WhatsApp via Meta Cloud API can plug in similarly |

## LangGraph flow

```
START → chief → planner → workers → content_extra → insight → critic → compose → notify → END
```

**Linear graph** — no conditional LangGraph edges. Branching happens *inside* nodes (e.g. `content_extra` only drafts when `intent == news_learning`).

- **chief:** intent classification (see **Chief intents** below).  
- **planner:** textual execution plan for humans / UI.  
- **workers:** `asyncio` parallel bundle per intent (always includes **WebAgent** for freshness).  
- **content_extra:** LinkedIn/blog draft when intent is `news_learning`; no-op otherwise.  
- **insight / critic:** synthesis + LLM QA guardrails (not an approval gateway — see [ECOSYSTEM.md](ECOSYSTEM.md)).  
- **compose / notify:** final response + Slack / Telegram / WhatsApp delivery.

Source: `backend/app/orchestrator/graph.py`

## Chief intents (routing labels)

`general`, `news_learning`, `prototype_idea`, `market_analysis`, `rag_query`, `enterprise_api`,  
`portfolio_risk`, `calendar_commitments`, `budget_telemetry`, `security_review`, `compliance`,  
`meeting_brief`, `experiment`.

## Core agents (implementation types)

| Agent | Type | Notes |
|-------|------|-------|
| **ChiefOrchestrator** | LLM classifier | `agents/chief.py` — 13 intent labels |
| **PlannerAgent** | LLM | Human-readable plan (`agents/planner.py`) |
| **KnowledgeAgent** | Tool-backed RAG | Qdrant retrieval (`agents/knowledge.py`) |
| **WebAgent** | Tool-backed | Tavily when `TAVILY_API_KEY` set |
| **APIAgent** | LLM patterns | Enterprise REST/GraphQL guidance |
| **CodeAgent** | LLM | Implementation support |
| **InsightAgent** | LLM | Executive synthesis |
| **ContentAgent** | LLM | Social/blog drafting |
| **CriticAgent** | LLM review | Policy/hallucination check — not HITL gateway |

## Extended agents (personal OS)

| Agent | Type | Notes |
|-------|------|-------|
| **NewsResearchAgent** | Tool + LLM | NewsAPI + Web synthesis |
| **PrototypeBuilderAgent** | LLM | MVP scope, architecture, tickets |
| **MarketIntelligenceAgent** | Tool + LLM | **Not financial advice** |
| **PortfolioRiskAgent** | LLM | Scenario education — **not financial advice** |
| **CalendarCommitmentsAgent** | LLM + optional file | `CALENDAR_CONTEXT_PATH` |
| **BudgetTelemetryAgent** | LLM + optional file | `BUDGET_SUMMARY_PATH` |
| **SecurityReviewAgent** | LLM checklist | STRIDE-style review |
| **ComplianceAgent** | LLM | Licensing/privacy flags |
| **MeetingBriefAgent** | LLM + optional file | `MEETING_CONTEXT_PATH` |
| **ExperimentAgent** | LLM | Eval design patterns |

Worker bundle selection: `backend/app/orchestrator/workers.py` (`workers_for_intent`).

## Production hardening (in-repo)

| Capability | Location |
|-----------|----------|
| Alembic migrations | `backend/alembic/` |
| Chat persistence API | `POST /chat` + `GET /threads/{id}/messages` |
| Scheduled brief | `arq app.worker.settings.WorkerSettings` |
| Pinecone mirror | install `pip install -e ".[pinecone]"`, set `PINECONE_*` — ingest only |

## HTTP API (runtime)

| Route | Purpose |
|-------|---------|
| `POST /chat` | Run LangGraph workflow; optional `notify_channels` |
| `GET /threads/{id}/messages` | Thread history from Postgres |
| `POST /ingest` | Upsert chunks to Qdrant (+ optional Pinecone mirror) |
| `GET /health` | Liveness |

## Ecosystem alignment

VAP answers **what agents should do**. For **what agents are allowed to do** (gateway, OPA policy, HITL queue, signed audit, fleet registry), pair with **[AegisAI](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform)** — see [ECOSYSTEM.md](ECOSYSTEM.md).

| Capability | VAP | AegisAI |
|------------|-----|---------|
| Orchestration | ✅ | — |
| LLM critic before notify | ✅ | — |
| Approval gateway / resume | — | ✅ |
| Tool intercept + FinOps | — | ✅ |

## Phase mapping (honest status)

| Phase | Status in repo |
|-------|----------------|
| 1 Foundation | ✅ Monorepo, docker-compose, README |
| 2 Frontend | ✅ Chat + settings; 🟡 dashboard/monitor placeholders |
| 3 Backend foundation | ✅ FastAPI layout, schemas, routes |
| 4 LLM router | ✅ `llm/router.py`, `factory.py` (`bucket_for_intent` defined, routing uses env defaults) |
| 5 LangGraph | ✅ Linear 9-node graph (`orchestrator/graph.py`) |
| 6 RAG | ✅ `/ingest`, Qdrant; Pinecone ingest mirror optional |
| 7 Observability | ✅ Langfuse spans on chief/planner/critic |
| 8 Enterprise | 🟡 Salesforce stub route only |
| 9 Content engine | ✅ ContentAgent for `news_learning` |
| 10 Advanced | ❌ Voice, marketplace, MCP — future |
| 11 Governance integration | 🟡 Documented in ECOSYSTEM.md — code wiring planned |

## Data ingestion

`POST /ingest` with `{ "chunks": [{ "id": "...", "text": "...", "metadata": {} }] }` upserts vectors into **Qdrant** and (if configured) mirrors to **Pinecone**. Retrieval always reads from Qdrant.

## Privacy & safety

- Never ship market commentary without disclaimers and human review for external audiences.  
- Slack/Telegram/WhatsApp credentials are **server-side only**; the UI only toggles which channels to request.
