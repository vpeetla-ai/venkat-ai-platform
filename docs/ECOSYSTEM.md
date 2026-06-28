# Venkat AI Ecosystem — How the repos fit together

This document aligns **[Venkat AI Platform (VAP)](https://github.com/vpeetla-ai/venkat-ai-platform)** (orchestration) with **[AegisAI](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform)** (governance) and sibling projects.

---

## The two-question split

| Question | Repo | Role |
|----------|------|------|
| **What should agents do?** | **This repo (VAP)** | LangGraph orchestration — Chief routes intent, workers run in parallel, Critic reviews output |
| **What are agents allowed to do?** | [aegisai-enterprise-agent-platform](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform) | Governance control plane — AI Gateway, policy, HITL, signed audit, FinOps |

```text
┌─────────────────────────────────────────────────────────────┐
│  Venkat AI Platform (VAP)  ← you are here                   │
│  Chief → Planner → Workers → Insight → Critic → Notify      │
└───────────────────────────┬─────────────────────────────────┘
                            │ side-effecting tool calls (target)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  AegisAI                                                    │
│  POST /api/gateway/tool-request → policy → HITL → execute   │
└─────────────────────────────────────────────────────────────┘
```

**Today:** VAP delivers notifications and external API calls directly. **Target:** route through AegisAI gateway for fleet-wide policy and audit.

---

## What VAP implements vs defers

| Capability | In VAP today | Deferred to AegisAI |
|------------|--------------|---------------------|
| Intent routing (13 labels) | Chief agent | — |
| Parallel specialist workers | asyncio bundles | — |
| LLM critic before notify | Critic node | — |
| Qdrant RAG + ingest | Yes | — |
| Postgres thread persistence | Yes | — |
| Langfuse spans | Yes | Cross-trace lineage |
| Approval gateway / HITL resume | No | Gateway + HITL queue |
| OPA / RBAC policy engine | No | `platform/policy/aegisai.rego` |
| Signed audit packets | No | Audit export API |
| Agent registry lifecycle | No | Shadow → Approved |
| Kill switch | No | Platform kill switch |

---

## VAP runtime graph (source of truth)

Linear LangGraph — all nodes run each turn; `content_extra` no-ops unless `intent == news_learning`:

```
START → chief → planner → workers → content_extra → insight → critic → compose → notify → END
```

Code: `backend/app/orchestrator/graph.py`

---

## Integration checklist (VAP → AegisAI)

1. Register: `agent_id=venkat-ai-platform` via AegisAI registry API
2. Wrap `backend/app/services/notifications.py` delivery through gateway SDK
3. High-risk intents → request `approval_required` before external publish
4. Emit `workflow_run_id` into AegisAI audit events

Full matrix: [AegisAI ECOSYSTEM.md](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform/blob/main/docs/ECOSYSTEM.md)

---

## Sibling projects

| Repo | Relationship |
|------|--------------|
| [aegisai-enterprise-agent-platform](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform) | Governance layer for VAP tool calls |
| [ai-content-factory](https://github.com/vpeetla-ai/ai-content-factory) | Application-layer content automation |
| [enterprise_rag_platform](https://github.com/vpeetla-ai/enterprise_rag_platform) | Enterprise RAG patterns (VAP uses Qdrant RAG in-app) |

---

## Reading order

1. [docs/PRINCIPAL_AI_ARCHITECT_DESIGN_DOCUMENT.md](./PRINCIPAL_AI_ARCHITECT_DESIGN_DOCUMENT.md)
2. [docs/ARCHITECTURE.md](./ARCHITECTURE.md)
3. [AegisAI ARCHITECTURE.md](https://github.com/vpeetla-ai/aegisai-enterprise-agent-platform/blob/main/platform/architecture/ARCHITECTURE.md)
4. [Article: From Multi-Agent OS to Agent Governance](https://github.com/vpeetla-ai/ai-content-factory/blob/main/docs/content/from-multi-agent-os-to-agent-governance-substack.md)
