"""Real merge gate: vap.orchestrator_invariant_v1 from golden-eval-registry.

Validates a stable VAP invariant (orchestrator registry + intent map) via the
shared registry scorer — no LLM calls. Skips locally when the sibling registry
repo isn't checked out; CI always checks it out first
(see .github/workflows/backend-tests.yml).
"""

from __future__ import annotations

import os
from pathlib import Path

import pytest

from app.orchestrator.registry import INTENT_ORCHESTRATOR, ORCHESTRATORS

try:
    from golden_eval_registry.runner import score_suite
    from golden_eval_registry.schema import parse_manifest
    from golden_eval_registry.validate import load_jsonl

    GOLDEN_EVAL_REGISTRY_AVAILABLE = True
except ImportError:
    GOLDEN_EVAL_REGISTRY_AVAILABLE = False

def _default_registry_path() -> Path:
    env = os.getenv("GOLDEN_EVAL_REGISTRY_PATH")
    if env:
        return Path(env).resolve()
    # Prefer sibling clone; also accept checkout beside backend/ (CI layout).
    candidates = [
        Path(__file__).resolve().parents[3] / "golden-eval-registry",  # .../venkat-ai-platform/../
        Path(__file__).resolve().parents[2] / "golden-eval-registry",  # repo root sibling checkout
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[0]


REGISTRY_PATH = _default_registry_path()
SUITE_DIR = REGISTRY_PATH / "suites" / "vap_orchestrator_invariant_v1"

pytestmark = pytest.mark.skipif(
    not GOLDEN_EVAL_REGISTRY_AVAILABLE,
    reason="golden-eval-registry not installed",
)


@pytest.mark.skipif(not SUITE_DIR.exists(), reason="vap orchestrator suite missing")
def test_vap_orchestrator_invariant_v1_suite_passes() -> None:
    manifest = parse_manifest(SUITE_DIR / "manifest.json")
    cases = load_jsonl(manifest.cases_path)

    actual = {
        "orchestrator_ids": sorted(ORCHESTRATORS.keys()),
        "intent_map": dict(INTENT_ORCHESTRATOR),
    }
    actual_by_id = {str(case["id"]): actual for case in cases}

    result = score_suite(manifest, cases, actual_by_id)
    failures = "\n".join(f"{failure.case_id}: {failure.detail}" for failure in result.failures)
    assert result.passed, f"golden eval regressions:\n{failures}"
