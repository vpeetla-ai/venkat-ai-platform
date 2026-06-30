# Inference — Model Router & vLLM Architecture Lab

## VAP model routing (application layer)

VAP routes LLM calls by intent bucket via `app/llm/router.py` and `factory.py`:

| Bucket | Typical use | Provider (env) |
|--------|-------------|----------------|
| Fast | Classification, routing | `LLM_DEFAULT_PROVIDER` |
| Reasoning | Planning, architecture graphs | OpenRouter / Anthropic |
| Creative | Content drafts | Configurable per orchestrator |

Set keys in `.env` — see `.env.example` for `OPENROUTER_*`, `OPENAI_*`, `GROQ_*`.

## Relationship to vLLM Architecture Lab

**VAP** = which model/API to call for agent steps.  
**[vLLM Architecture Lab](https://github.com/vpeetla-ai/vllm-architecture-lab)** = how high-throughput inference works under the hood (PagedAttention, KV cache, batching).

| Concern | Owner |
|---------|-------|
| Agent orchestration + router | `venkat-ai-platform` |
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
