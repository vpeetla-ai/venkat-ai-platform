# Service Level Objectives — Venkat AI Platform

Production SLO definitions for portfolio reviewers and on-call runbooks.

## SLO targets

| SLI | Target | Measurement window |
|-----|--------|-------------------|
| **API availability** | 99.5% | 30 days |
| **Eval regression** | 0 failures | Per merge (golden-eval-registry) |
| **Security scan** | No CRITICAL CVEs | Per PR (Semgrep + Trivy) |

## How we measure

| Signal | Source |
|--------|--------|
| Availability | Render/Vercel health + `/health` |
| Eval regression | `golden-eval-registry` CI gate |
| Security posture | `.github/workflows/security-scan.yml` |

## Org reference

- [AI Content Factory SLO](https://github.com/vpeetla-ai/ai-content-factory/blob/main/docs/SLO.md)
- [Org Grade A tracker](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/docs/ORG_GRADE_A.md)
