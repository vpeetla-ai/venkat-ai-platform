"""Reflection loop — draft → critique → improve until quality threshold or max rounds."""

from __future__ import annotations

import re

from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


def _parse_score(critique: str) -> float:
    for pattern in (r"quality score[:\s]+(\d+(?:\.\d+)?)", r"score[:\s]+(\d+(?:\.\d+)?)/10"):
        m = re.search(pattern, critique, re.I)
        if m:
            return float(m.group(1))
    return 5.0


async def run_reflection_loop(
    *,
    goal: str,
    initial_draft: str,
    max_rounds: int = 2,
    quality_threshold: float = 7.0,
) -> tuple[str, list[str]]:
    """Returns (final_draft, round_traces)."""
    draft = initial_draft
    traces: list[str] = []

    for round_num in range(1, max_rounds + 1):
        critic_system = """You are an independent critic. Score 0-10, list issues, suggest fixes.
Format:
Quality score: N/10
Issues:
- ...
Revised answer: (only if score < 7)"""
        critique = await ainvoke(critic_system, f"GOAL:\n{goal}\n\nDRAFT:\n{draft}", RouteBucket.STRUCTURED)
        score = _parse_score(critique)
        traces.append(f"Round {round_num} score={score}\n{critique}")

        if score >= quality_threshold:
            return draft, traces

        improve_system = """Improve the draft using the critique. Output only the improved draft."""
        draft = await ainvoke(
            improve_system,
            f"GOAL:\n{goal}\n\nDRAFT:\n{draft}\n\nCRITIQUE:\n{critique}",
            RouteBucket.REASONING,
        )

    return draft, traces
