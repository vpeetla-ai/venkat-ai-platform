# Service Level Objectives — Venkat AI Platform

Production SLO definitions for portfolio reviewers and on-call runbooks.

## SLO targets

| SLI | Target | Measurement window | Status |
|-----|--------|-------------------|--------|
| **API availability** | 99.5% | 30 days | Measured via Render/Vercel `/health` (free-tier cold starts excluded from error budget narrative) |
| **Eval regression** | 0 failures | Per merge | **Planned** — not yet a CI gate in this repo (see note) |
| **Security scan** | No CRITICAL CVEs | Per PR | ✅ `.github/workflows/security-scan.yml` |
| **Unit / API tests** | Pass | Per PR | ✅ `.github/workflows/backend-tests.yml` → `pytest` |

## Eval regression — honest status

Sister platforms (Enterprise RAG, LoopForge, ACF, DomainForge, Sentinel, AegisLoop) gate merges with suites from [`golden-eval-registry`](https://github.com/vpeetla-ai/golden-eval-registry).

**VAP does not yet wire a golden suite in CI.** Earlier drafts of this doc over-claimed an org-wide gate here. Tracked as backlog **P2.4** in [`TOP1PCT_90DAY_BACKLOG.md`](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/docs/TOP1PCT_90DAY_BACKLOG.md).

Until then, regressions are caught by `backend/tests` only.

## How we measure

| Signal | Source |
|--------|--------|
| Availability | Render/Vercel health + `/health` |
| Eval regression | *Planned* — golden-eval-registry suite + workflow (P2.4) |
| Test posture | `.github/workflows/backend-tests.yml` |
| Security posture | `.github/workflows/security-scan.yml` |

## Org reference

- [AI Content Factory SLO](https://github.com/vpeetla-ai/ai-content-factory/blob/main/docs/SLO.md)
- [Org Grade A tracker](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/docs/ORG_GRADE_A.md)
- [Top-1% 90-day backlog](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/docs/TOP1PCT_90DAY_BACKLOG.md)
