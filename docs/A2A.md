# A2A Agent Cards — Venkat AI Platform

Teaching implementation of [Google A2A Agent Card](https://github.com/google/A2A) discovery for portfolio specialists.

## Endpoints

| URL | Description |
|-----|-------------|
| `GET /.well-known/agent.json` | Well-known platform card |
| `GET /a2a/agent-card` | Same card (explicit path) |
| `GET /orchestrators/{id}/agent-card` | Per-orchestrator specialist card |

## Orchestrators

| ID | Card name |
|----|-----------|
| `platform` | Principal Platform |
| `research` | Deep Research Pipeline |
| `architecture` | Architecture Review |

## Honest scope

- **Today:** In-process LangGraph delegation between specialists
- **Future:** HTTP A2A peer transport between VAP and external agent runtimes

Set `PUBLIC_API_BASE_URL` in production (e.g. `https://your-api.onrender.com`) so card `url` fields resolve correctly.

## Related

- [ADR-007](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/adr/ADR-007-2026-agent-protocol-stack.md)
- [MCP.md](MCP.md) — tool layer (orthogonal to A2A coordination)
