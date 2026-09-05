# Venkat AI Platform — Principal AI Architect Design Document

**Version:** 0.2  
**Status:** Publication-ready (living document)  
**Audience:** CTO/CIO offices, principal engineers, security/compliance reviewers, FinOps partners  

---

## 1. Executive summary

Venkat AI Platform (VAP) is a **multi-agent orchestration system** — built as a personal “principal architect operating system,” doubling as a portfolio-grade reference architecture. It combines:

- **LangGraph** workflow
- **Multi-LLM** routing
- **RAG** over **Qdrant**, with optional **Pinecone** dual-write
- **Observability** via **Langfuse**
- **Durable conversation/workflow persistence** in **PostgreSQL**
- **Scheduled automation** via **Redis + ARQ**
- **Notification fan-out** (Slack, Telegram, WhatsApp/Twilio)

This document captures **architecture intent**, **decision rationale**, **tradeoffs**, **risk posture**, **cost levers**, and **scalability pathways** suitable for external publication after organizational sanitization (credentials, proprietary data flows).

---

## 2. System context

### 2.1 Stakeholders

| Stakeholder | Primary need |
|-------------|--------------|
| Principal AI architect (operator) | Personal automation for learning, prototyping, analysis, delivery |
| Platform engineering | Operable services, observability, safe deployments |
| Security / governance | Agent abuse surfaces, data residency, third-party risk |
| FinOps | Token + infra unit economics |

### 2.2 External dependencies

- LLM inference providers (OpenRouter/OpenAI/Groq-class)
- Search/news/market APIs (Tavily, NewsAPI, Finnhub/Alpha Vantage as optional)
- Vector databases (Qdrant primary; Pinecone optional)
- Messaging webhooks (Slack, Telegram Bot API, Twilio WhatsApp)

---

## 3. Goals and non-functional requirements (NFRs)

### 3.1 Goals

- Orchestrate **specialist agents** with **parallel execution** where safe.
- Maintain **swappable LLM backends** via routing buckets.
- Provide **RAG** with **dual-index optionality** for resilience / geographic strategy.
- Emit **structured telemetry** suitable for portfolio demonstrations.

### 3.2 NFRs

| NFR | Target posture |
|-----|----------------|
| Availability | Best-effort MVP; production requires HA DB + managed Redis + vector SLA |
| Latency | Interactive chat bounded by slowest parallel agent + critic pass |
| Durability | Postgres persistence for threads/runs when enabled |
| Security | Server-side secrets only; minimal PII in logs |
| Compliance | Explicit disclaimers for market-like outputs |
| Cost | Optimizable via routing, caching, selective agents |

---

## 4. Logical architecture

### 4.1 Major components

1. **Frontend (Next.js):** Operator UI for chat, monitoring placeholders, settings toggles for notifications.
2. **Backend API (FastAPI):** Synchronous request path invoking LangGraph; ingestion endpoints.
3. **Orchestrator (LangGraph):** Deterministic graph structure with parallelizable worker node.
4. **Agent library:** Stateless LLM-call wrappers plus optional HTTP tool usage.
5. **Memory/RAG:** Embedding providers + Qdrant (+ optional Pinecone mirror).
6. **Persistence:** Postgres models for threads/messages/workflow runs.
7. **Workers:** ARQ cron for scheduled brief generation + notification fan-out.
8. **Observability:** Langfuse spans best-effort on critical nodes.

### 4.2 Core workflow (runtime)

`Chief → Planner → Parallel Workers → Optional Content → Insight → Critic → Compose → Notify`

**Rationale:** separation of **routing**, **plan explainability**, **parallel evidence gathering**, **synthesis**, and **QA**. The critic stage reduces unsafe financial/compliance tone drift before delivery channels.

---

## 5. Agent catalog (extended)

### 5.1 Baseline agents

Planner, Knowledge (RAG), Web, API patterns, Code, Insight, Content, Critic.

### 5.2 Personal OS extensions

| Agent | Purpose | Inputs |
|-------|---------|--------|
| NewsResearchAgent | AI learning brief | NewsAPI + Web |
| PrototypeBuilderAgent | Idea→prototype plan | User prompt |
| MarketIntelligenceAgent | Market commentary | Market APIs |
| PortfolioRiskAgent | Scenario education | Market snapshot + prompt |
| CalendarCommitmentsAgent | Schedule-aware planning | Optional context file |
| BudgetTelemetryAgent | Spend/unit economics interpretation | Optional telemetry file |
| SecurityReviewAgent | STRIDE-style review | User prompt |
| ComplianceAgent | Licensing/privacy/promotion flags | User prompt |
| MeetingBriefAgent | Exec briefing | Optional meeting context file |
| ExperimentAgent | Eval design | User prompt |

**Design choice:** file-backed context for calendar/budget/meeting reduces OAuth scope for MVP while documenting a clear enterprise upgrade path.

---

## 6. Data architecture

### 6.1 PostgreSQL

**Entities**

- `chat_threads`, `chat_messages`, `workflow_runs`

**Why:** reproducibility for portfolio demos, audit trail for agent outputs, future personalization.

**Tradeoff:** adds operational burden vs pure ephemeral chat.

### 6.2 Redis

Used as ARQ broker for scheduled jobs; can extend to rate limiting and cache.

### 6.3 Qdrant (primary vector index)

Optimized for self-hosted/dev parity and predictable embedding dimensions.

### 6.4 Pinecone (optional dual-write)

**Purpose:** secondary index for cloud DR, migration flexibility, or multi-region strategy.

**Critical decision:** dual-write failures **must not** block Qdrant ingestion (implemented as best-effort with logging).

---

## 7. Architecture Decision Records (ADR summary)

### ADR-001 — LangGraph vs custom orchestration

- **Decision:** LangGraph for workflow compilation and visualization compatibility.
- **Tradeoffs:** (+) ecosystem alignment, graph introspection (−) version churn, learning curve.

### ADR-002 — OpenRouter-first LLM access

- **Decision:** default multi-model routing through OpenRouter-compatible API.
- **Tradeoffs:** (+) vendor agility (−) additional dependency and data routing considerations.

### ADR-003 — Qdrant primary + Pinecone optional

- **Decision:** Qdrant canonical; Pinecone mirror optional.
- **Tradeoffs:** (+) cost control & dev fidelity (−) dual-index consistency requires reconciliation jobs at scale.

### ADR-004 — ARQ over heavyweight workflow engines (for schedules)

- **Decision:** ARQ cron for scheduled briefs.
- **Tradeoffs:** (+) simple ops (−) advanced scheduling features require migration to Temporal/Airflow later.

### ADR-005 — Postgres persistence default-on with rollback-safe API path

- **Decision:** persist chat + runs; API tolerates DB failures without dropping inference results.
- **Tradeoffs:** (+) resilience (−) dual outcome paths must be monitored.

---

## 8. Tradeoff matrices

### 8.1 Vector database strategy

| Option | Pros | Cons | When to choose |
|--------|------|------|------------------|
| Qdrant only | Lowest complexity | Self-managed ops | MVP, strong cost discipline |
| Pinecone only | Managed scale | Cost + embedding lock-in | Pure serverless org standard |
| Dual-write | Migration/DR flexibility | Consistency & cost | Principal demos + enterprise paths |

### 8.2 Notification channels

| Channel | Pros | Cons |
|---------|------|------|
| Slack webhook | Fastest integration | Limited formatting/security controls |
| Telegram bot | Easy personal automation | Chat lifecycle governance |
| WhatsApp (Twilio) | Reach | Meta policy + paid messaging constraints |

---

## 9. Risk analysis

### 9.1 Technical risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| LLM hallucinations in finance/legal domains | High | CriticAgent + disclaimers + human review for externals |
| Tool/API abuse via prompts | High | Allowlists, secrets server-side, rate limits |
| Dual-write drift (Qdrant vs Pinecone) | Medium | Periodic reconciliation job; single source reads |
| Worker duplicate executions | Medium | Idempotency keys + distributed locks (future) |

### 9.2 Operational risks

| Risk | Mitigation |
|------|------------|
| Redis outage blocks schedules | Monitor broker; fallback to API-triggered jobs |
| DB migration failures | Alembic gated CI + staged rollout |

### 9.3 Third-party / compliance risks

- Market data vendor terms & attribution.
- Content generation licensing for scraped web/news snippets.
- WhatsApp messaging policies.

---

## 10. Security architecture (high level)

- **Secrets:** environment variables only on backend runtime; never `NEXT_PUBLIC_*` for provider keys.
- **Agents:** principle of least privilege for tools; avoid arbitrary shell execution in MVP.
- **PII:** minimize storage in `workflow_runs.outputs`; consider encryption-at-rest for Postgres in prod.
- **Threat modeling:** SecurityReviewAgent assists humans; it is **not** a substitute for formal review.

---

## 11. Cost model & optimization

### 11.1 Primary cost drivers

1. **LLM tokens** — dominant at scale  
2. **Embeddings** — ingestion bursts  
3. **Vector storage** — corpus growth  
4. **Managed services** — DB/Redis/monitoring  

### 11.2 Optimization playbook

| Lever | Mechanism |
|-------|-----------|
| Routing | Route “fast” intents to smaller models |
| Caching | Cache embeddings per chunk hash |
| RAG pruning | Score thresholds + max tokens |
| Parallelism discipline | Avoid redundant agents per intent |
| Observability | Track cost per workflow run (extend metadata) |

---

## 12. Scalability & reliability roadmap

### 12.1 Near-term limits

- Single-region deployment.
- Parallel agents bounded by Python asyncio + provider rate limits.
- SSE streaming path lacks incremental persistence.

### 12.2 Scale triggers & responses

| Signal | Response |
|--------|----------|
| API latency SLO breach | Separate worker tier for heavy intents |
| DB CPU saturation | Read replicas + archival |
| Redis memory pressure | Dedicated cluster + TTL policies |
| Vector latency | Shard collections / namespaces |

### 12.3 Multi-tenant future

Add tenant_id to threads/runs, per-tenant secrets, and queue namespaces—documented but not enabled in MVP.

---

## 13. Deployment topology (reference)

- **Frontend:** Vercel  
- **Backend:** Render/Fly/Railway container  
- **Data:** Managed Postgres + Redis  
- **Vectors:** Qdrant Cloud and/or Pinecone  
- **Observability:** Langfuse Cloud  

---

## 14. Observability & SLO thinking

**Minimum viable metrics**

- Requests/day, p95 latency, error rate  
- Agent fan-out counts per intent  
- External API failures (Tavily/news/market)  

**Tracing**

Langfuse spans around chief/planner/insight/critic provide portfolio-grade narratives.

---

## 15. Publication checklist (before external release)

- [ ] Remove secrets & internal URLs  
- [ ] Add organizational branding + accountability owners  
- [ ] Attach threat model appendix (diagram link)  
- [ ] Legal review for finance-adjacent flows  
- [ ] Define incident response ownership  

---

## 16. Document governance

This document must evolve with material changes. **Canonical hierarchy:**

1. `.cursor/rules/vap-principal-architect-bar.mdc`  
2. `docs/PRIMARY_REQUIREMENT_MEMORY.md`  
3. This document + `docs/ARCHITECTURE.md`  

---

### Appendix A — Intent routing coverage

Chief intents align with specialist bundles documented in `docs/ARCHITECTURE.md`. Unknown intents fall back to `general` with Knowledge + Code branches plus Web freshness.

### Appendix B — Future enhancements

Voice interfaces, agent marketplace, MCP tool hubs, realtime collaboration, federated memory graphs—each requires ADR extensions and updated risk sections before implementation.
