# Service Level Objectives — Venkat AI Platform

Production SLO definitions for portfolio reviewers and on-call runbooks.

## SLO targets

| SLI | Target | Measurement window | Status |
|-----|--------|-------------------|--------|
| **API availability** | 99.5% | 30 days | Measured via Render/Vercel `/health` (free-tier cold starts excluded from error budget narrative) |
| **Eval regression** | 0 failures | Per merge | ✅ Gated — `vap_orchestrator_invariant_v1` via `.github/workflows/backend-tests.yml` |
| **Security scan** | No CRITICAL CVEs | Per PR | ✅ `.github/workflows/security-scan.yml` |
| **Unit / API tests** | Pass | Per PR | ✅ `.github/workflows/backend-tests.yml` → `pytest` |

## Eval regression — status

Sister platforms gate merges with suites from [`golden-eval-registry`](https://github.com/vpeetla-ai/golden-eval-registry).

**VAP CI gates** `vap.orchestrator_invariant_v1` (kind `router_invariant`) against the live orchestrator registry + intent map — a stable invariant that must not regress without an intentional suite bump. Workflow: `.github/workflows/backend-tests.yml` checks out the registry and runs `backend/tests/test_golden_eval_gate.py`.

## How we measure

| Signal | Source |
|--------|--------|
| Availability | Render/Vercel health + `/health` |
| Eval regression | ✅ `golden-eval-registry` suite `vap_orchestrator_invariant_v1` in `backend-tests.yml` |
| Test posture | `.github/workflows/backend-tests.yml` |
| Security posture | `.github/workflows/security-scan.yml` |

## Org reference

- [AI Content Factory SLO](https://github.com/vpeetla-ai/ai-content-factory/blob/main/docs/SLO.md)
- [Org Grade A tracker](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/docs/ORG_GRADE_A.md)
- [Top-1% 90-day backlog](https://github.com/vpeetla-ai/ai-architecture-portfolio/blob/main/docs/TOP1PCT_90DAY_BACKLOG.md)
