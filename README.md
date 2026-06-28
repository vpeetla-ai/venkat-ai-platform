# Venkat AI Platform (VAP)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-purple)](https://langchain-ai.github.io/langgraph/)
[![Stack](https://img.shields.io/badge/RAG-Qdrant%20primary-blue)](https://qdrant.tech/)

**Principal-architect multi-agent operating system** — Chief routes intent, specialist agents run in parallel, Critic guards output, notifications fan out to Slack, Telegram, and WhatsApp.

> A portfolio-grade reference for **LangGraph orchestration**, **multi-LLM routing**, **Qdrant RAG** (optional Pinecone ingest mirror), **Langfuse observability**, and **production persistence** — with publication-ready ADRs and design docs.

[📖 Principal design doc](docs/PRINCIPAL_AI_ARCHITECT_DESIGN_DOCUMENT.md) · [🏗 Architecture catalog](docs/ARCHITECTURE.md) · [🔗 Ecosystem map](docs/ECOSYSTEM.md) · [📋 Charter / memory](docs/PRIMARY_REQUIREMENT_MEMORY.md)

---

## Why this exists

Single-chat LLM wrappers cannot model how principal architects actually work: route intent, parallelize research, synthesize insight, critique before delivery, and notify across channels.

VAP is a **multi-agent orchestration platform** with:

| Capability | Implementation |
|------------|----------------|
| Intent routing | Chief orchestrator — 16 intent labels + 3 orchestrators |
| Parallel evidence | asyncio worker bundles per intent |
| RAG architectures | 6 strategies (naive, hybrid, multi-query, HyDE, rerank, parent-doc) |
| Loop patterns | ReAct, Reflection, Plan-Execute (`agents/loops/`) |
| QA gate | CriticAgent (LLM review) before external delivery |
| Persistence | Postgres threads, messages, workflow runs |
| Schedules | Redis + ARQ cron for daily briefs |
| Observability | Langfuse spans on critical nodes |

---

## Implementation status (honest)

| Component | Status |
|-----------|--------|
| LangGraph orchestrator (9 linear nodes) | ✅ Platform pipeline |
| Deep Research orchestrator | ✅ Recon + ReAct + reflection |
| Architecture Review orchestrator | ✅ Specialists + plan-execute + reflection |
| Chief intent routing (16 labels) | ✅ Auto-routes to orchestrators |
| RAG strategy library (6 patterns) | ✅ `GET /rag/strategies` |
| Loop pattern agents | ✅ ReAct, Reflection, Plan-Execute |
| Automated test suite | ✅ `pytest` in `backend/tests/` |
| Postgres thread persistence | ✅ |
| Pinecone | 🟡 Ingest mirror only |
| Approval gateway / HITL | ❌ — pair with [AegisAI](docs/ECOSYSTEM.md) |

**What VAP is not:** an enterprise governance control plane. For policy, HITL queues, signed audit, and fleet registry, use [aegisai-enterprise-agent-platform](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform).

---

## Three orchestrators

| Orchestrator | Intent | Sub-agents / loops |
|--------------|--------|-------------------|
| **Platform** (default) | `general`, `rag_query`, `news_learning`, … | Parallel workers + critic |
| **Deep Research** | `deep_research` | Web, RagExpert, gap analyst, ReAct, reflection |
| **Architecture Review** | `architecture_review` | Security, compliance, RAG, plan-execute, reflection |

```bash
curl -X POST http://localhost:8000/chat -H 'Content-Type: application/json' \
  -d '{"message":"Deep research on enterprise agent governance"}'

curl -X POST http://localhost:8000/orchestrators/research/run \
  -H 'Content-Type: application/json' \
  -d '{"message":"Compare LangGraph vs custom orchestrators for FinOps"}'
```

[RAG architectures](docs/RAG_ARCHITECTURES.md) · [Full architecture](docs/ARCHITECTURE.md)

---

## 60-second overview

```text
User → Chief → Planner → Parallel Workers → Content → Insight → Critic → Notify
                                              ↘ Slack · Telegram · WhatsApp
```

---

## Architecture

### System context

```mermaid
flowchart TB
    subgraph Client["Operator layer"]
        UI["Next.js App Router<br/>Chat · Dashboard · Monitor"]
    end

    subgraph API["FastAPI backend"]
        CHAT["POST /chat"]
        ING["POST /ingest"]
        LG["LangGraph orchestrator"]
    end

    subgraph Agents["Agent library"]
        CHIEF["Chief — intent routing"]
        PLAN["Planner — execution plan"]
        WORK["Parallel workers<br/>Web · RAG · Code · Market…"]
        INS["Insight — synthesis"]
        CRT["Critic — QA guardrails"]
        DEL["Notify — delivery"]
    end

    subgraph Data["Data layer"]
        PG["PostgreSQL<br/>threads · runs"]
        QD["Qdrant — primary vectors"]
        PC["Pinecone — optional mirror"]
        RD["Redis — ARQ jobs"]
    end

    subgraph External["External services"]
        LLM["OpenRouter / OpenAI / Groq"]
        SRCH["Tavily · NewsAPI · Market APIs"]
        OBS["Langfuse"]
        MSG["Slack · Telegram · Twilio WhatsApp"]
    end

    UI --> CHAT --> LG
    LG --> CHIEF --> PLAN --> WORK
    WORK --> INS --> CRT --> DEL
    WORK --> QD
    WORK --> PC
    LG --> PG
    ING --> QD
    WORK --> LLM
    WORK --> SRCH
    LG -.-> OBS
    DEL --> MSG
    RD -.-> LG
```

### LangGraph workflow (runtime — linear graph)

The graph is **sequential** (no conditional edges). `content_extra` only drafts LinkedIn/blog copy when `intent == news_learning`; otherwise it passes through.

```mermaid
flowchart LR
    START((Start)) --> CHIEF["Chief"]
    CHIEF --> PLAN["Planner"]
    PLAN --> WORKERS["Workers ∥"]
    WORKERS --> CONTENT["content_extra"]
    CONTENT --> INSIGHT["Insight"]
    INSIGHT --> CRITIC["Critic"]
    CRITIC --> COMPOSE["Compose"]
    COMPOSE --> NOTIFY["Notify"]
    NOTIFY --> END((End))
```

### Chief intent routing

| Intent | Agent bundle (high level) |
|--------|---------------------------|
| `news_learning` | Web + NewsResearch + optional LinkedIn draft |
| `prototype_idea` | Web + PrototypeBuilder + Code |
| `market_analysis` | Web + MarketIntelligence *(not financial advice)* |
| `rag_query` | Web + Knowledge (Qdrant) |
| `enterprise_api` | Web + API integration patterns |
| `security_review` | SecurityReviewAgent — STRIDE checklist |
| `compliance` | ComplianceAgent — licensing / privacy flags |
| `general` | Knowledge + Code + Web freshness |

Full catalog: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Stack decisions

| Concern | Choice | Notes |
|---------|--------|-------|
| Orchestration | LangGraph | Testable nodes, graph introspection |
| LLM access | OpenRouter default | Swappable via env |
| Embeddings | OpenAI / Cohere | `EMBEDDING_PROVIDER` |
| Primary vector | Qdrant | Docker-friendly dev parity |
| Secondary vector | Pinecone optional | Ingest mirror only — queries use Qdrant |
| Persistence | Postgres + Alembic | Threads, messages, runs |
| Jobs | Redis + ARQ | Scheduled daily brief |
| Observability | Langfuse | Spans on chief / planner / critic |

---

## Quick start

### 1. Infrastructure

```bash
docker compose up -d postgres redis qdrant
```

### 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp ../.env.example .env
# Set OPENROUTER_API_KEY or OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install && npm run dev
```

### 4. Try it

- UI: http://localhost:3000/chat
- API: `POST http://localhost:8000/chat` with `{"message":"...","notify_channels":["slack"]}`

---

## Project structure

```text
venkat-ai-platform/
├── frontend/           # Next.js — chat, dashboard, monitor, settings
├── backend/
│   ├── app/agents/     # Chief, Planner, Web, Knowledge, Critic, …
│   ├── app/orchestrator/  # LangGraph graph.py
│   ├── alembic/        # Postgres migrations
│   └── app/worker/     # ARQ scheduled jobs
├── docs/               # Principal architect design docs + ADRs
├── infra/              # Deployment references
└── docker-compose.yml  # Postgres, Redis, Qdrant
```

---

## Documentation (principal-architect bar)

| Document | Purpose |
|----------|---------|
| [PRINCIPAL_AI_ARCHITECT_DESIGN_DOCUMENT.md](docs/PRINCIPAL_AI_ARCHITECT_DESIGN_DOCUMENT.md) | Tradeoffs, risks, cost, scale — publication-ready |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Runtime architecture + agent catalog |
| [PRIMARY_REQUIREMENT_MEMORY.md](docs/PRIMARY_REQUIREMENT_MEMORY.md) | Durable charter for humans + agents |

---

## Compliance

Market and portfolio outputs are **informational only** — not investment advice. Add your own disclaimers before external distribution.

---

## Related projects

See [docs/ECOSYSTEM.md](docs/ECOSYSTEM.md) for how repos connect.

| Project | Role |
|---------|------|
| [aegisai-enterprise-agent-platform](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform) | Governance control plane — gateway + HITL (pair with VAP) |
| [ai-content-factory](https://github.com/vpeetla-ai/ai-content-factory) | Content pipeline with HITL publish gate |
| [enterprise_rag_platform](https://github.com/vpeetla-ai/enterprise_rag_platform) | Enterprise RAG governance patterns |

Built by [Venkata Peetla](https://github.com/vpeetla-ai) — [venkat-ai.com](https://venkat-ai.com)

⭐ Star if this reference architecture helps your multi-agent work.
