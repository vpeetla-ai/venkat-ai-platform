# MCP — Venkat AI Platform Tool Layer

## Architecture (ADR-007)

VAP orchestrators are **MCP clients** in the target architecture. Today tools are in-process Python modules; this document defines the contract for stdio MCP servers.

```text
Orchestrator (LangGraph)  →  Tool registry  →  MCP bridge  →  Side-effect gateway
```

## Tool categories

| Class | Examples | Governance |
|-------|----------|------------|
| Read-only | `rag.retrieve`, `read_style_guide`, `search_docs` | No gateway |
| Notify | `slack.notify`, `email.send` | AegisAI gateway + HITL |
| Mutate | `publish.*`, `git.push` | Gateway required |

## In-process registry (v1)

| Module | Tools |
|--------|-------|
| `app/agents/*` | Planner, researcher agents |
| `app/memory/rag_strategies.py` | Strategy experiments |
| `app/orchestrator/*_graph.py` | LangGraph orchestrators |

## MCP server roadmap

1. 🟡 Document tool names + JSON schemas (this file)
2. ❌ Package `vap-mcp-server` stdio entrypoint
3. ❌ Register server in Cursor + AegisAI tool catalog

## Wiring to Enterprise RAG

- RAG lab promotes winning strategies to adapters implementing Enterprise RAG `Retriever` port
- Orchestrators call `/v1/answer` with tenant principal — see [enterprise_rag_platform](https://github.com/vpeetla-ai/enterprise_rag_platform/blob/main/docs/ARCHITECTURE.md)

## Related

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [INFERENCE.md](INFERENCE.md) — model router + vLLM lab
- Org skill: `mcp-tool-exposure` in [vpeetla-ai-skills](https://github.com/vpeetla-ai/vpeetla-ai-skills)
