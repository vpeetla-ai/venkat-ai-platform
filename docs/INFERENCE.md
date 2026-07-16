# Inference — Model Router & vLLM Architecture Lab

## VAP model routing (application layer)

VAP routes LLM calls by intent bucket via `app/llm/router.py` and `factory.py`.

**Preference order** (first match wins):

1. **`LLM_GATEWAY_URL`** — OpenAI-compatible [aegis-llm-gateway](https://github.com/vpeetla-ai/aegis-llm-gateway) (`/v1`); tenant via `LLM_GATEWAY_TENANT_ID` (default `vap`). VAP **selects** the bucket/model; the gateway **enforces + records** role/tier/data-class headers ([ADR-028](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/adr/ADR-028-federated-ai-control-plane-k8s-analogy.md) · [ADR-029](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/adr/ADR-029-app-owned-role-aware-routing-contract.md)). Live: `https://aegis-llm-gateway-api.onrender.com` (stub default).
2. Direct providers — OpenRouter / OpenAI / Groq (see `.env.example`).

| Bucket | Typical use | When gateway unset |
|--------|-------------|--------------------|
| Fast | Classification, routing | `LLM_DEFAULT_PROVIDER` |
| Reasoning | Planning, architecture graphs | OpenRouter / Anthropic |
| Creative | Content drafts | Configurable per orchestrator |

Ops: `GET /api/v1/ops/metrics` → `extra.llm_gateway.enabled` when gateway is configured.

## Relationship to vLLM Architecture Lab

**VAP** = which model/API to call for agent steps.  
**[vLLM Architecture Lab](https://github.com/vpeetla-ai/vllm-architecture-lab)** = how high-throughput inference works under the hood (PagedAttention, KV cache, batching).

| Concern | Owner |
|---------|-------|
| Agent orchestration + router | `venkat-ai-platform` |
| Shared completions + budget/cache | `aegis-llm-gateway` + `aegis-semantic-cache` (+ `aegis-routing-contract`) |
| Inference mechanics education | `vllm-architecture-lab` |
| Production GPU serving | External vLLM / TGI — not duplicated in portfolio |

## Cross-links

- Live lab: [vllm-architecture-lab.vercel.app](https://vllm-architecture-lab.vercel.app)
- API: [vllm-architecture-lab-api.onrender.com](https://vllm-architecture-lab-api.onrender.com)
- Skill: [vllm-inference](https://github.com/vpeetla-ai/vpeetla-ai-skills/tree/main/skills/vllm-inference)
- Case study: [ai-architecture-portfolio](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/case-studies/vllm-architecture-lab.md)

## Future wiring (honest)

- 🟡 Export router bucket metrics to Langfuse
- ❌ Route lab simulator metrics into VAP FinOps dashboard
- ❌ Self-hosted vLLM behind VAP router (out of portfolio scope today)
