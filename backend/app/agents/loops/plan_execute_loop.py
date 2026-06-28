"""Plan-Execute loop — decompose goal into steps, execute each, synthesize."""

from __future__ import annotations

import re
from collections.abc import Awaitable, Callable

from app.agents._llm import ainvoke
from app.llm.router import RouteBucket

StepFn = Callable[[str, str], Awaitable[str]]


async def run_plan_execute_loop(
    goal: str,
    execute_step: StepFn,
    *,
    max_steps: int = 5,
) -> str:
    plan_system = f"""Decompose the goal into numbered steps (max {max_steps}).
One step per line, format: 1. <action>"""
    plan_raw = await ainvoke(plan_system, goal, RouteBucket.STRUCTURED)
    steps = [ln.strip() for ln in plan_raw.splitlines() if re.match(r"^\d+\.", ln.strip())]

    if not steps:
        steps = [plan_raw.strip() or goal]

    results: list[str] = []
    context = ""
    for i, step in enumerate(steps[:max_steps], 1):
        out = await execute_step(step, context)
        block = f"Step {i}: {step}\nResult:\n{out}"
        results.append(block)
        context = f"{context}\n\n{block}"[-4000:]

    synth_system = "Synthesize step results into a cohesive final answer. Be concise."
    final = await ainvoke(synth_system, f"GOAL:\n{goal}\n\n{context}", RouteBucket.REASONING)
    return f"PLAN:\n{plan_raw}\n\nEXECUTION:\n" + "\n\n".join(results) + f"\n\nSYNTHESIS:\n{final}"
