"""ReAct loop — reason → act (tool) → observe, repeat until done or max steps."""

from __future__ import annotations

from collections.abc import Awaitable, Callable

from app.agents._llm import ainvoke
from app.llm.router import RouteBucket

ToolFn = Callable[[str], Awaitable[str]]


async def run_react_loop(
    goal: str,
    tools: dict[str, ToolFn],
    *,
    max_steps: int = 4,
) -> str:
    tool_list = ", ".join(tools.keys()) or "(none)"
    trace: list[str] = []
    observation = "(start)"

    for step in range(1, max_steps + 1):
        system = f"""You are a ReAct agent (step {step}/{max_steps}).
Available tools: {tool_list}
Respond in this exact format:
THOUGHT: <one sentence>
ACTION: <tool_name> | FINISH
INPUT: <tool input or final answer if FINISH>

If you have enough evidence, use ACTION: FINISH and put the final answer in INPUT."""
        user = f"GOAL:\n{goal}\n\nPRIOR OBSERVATIONS:\n{observation}"
        raw = await ainvoke(system, user, RouteBucket.REASONING)
        trace.append(f"--- step {step} ---\n{raw}")

        action = "FINISH"
        tool_input = goal
        for line in raw.splitlines():
            upper = line.strip().upper()
            if upper.startswith("ACTION:"):
                action = line.split(":", 1)[1].strip().split("|")[0].strip()
            elif upper.startswith("INPUT:"):
                tool_input = line.split(":", 1)[1].strip()

        if action.upper() == "FINISH" or action not in tools:
            if action.upper() != "FINISH" and step == max_steps:
                return "\n".join(trace)
            final = tool_input if action.upper() == "FINISH" else raw
            trace.append(f"FINAL:\n{final}")
            return "\n".join(trace)

        try:
            result = await tools[action](tool_input)
            observation = f"Tool {action} returned:\n{result[:2000]}"
        except Exception as exc:  # noqa: BLE001
            observation = f"Tool {action} error: {exc}"

    trace.append("FINAL: (max steps reached)")
    return "\n".join(trace)
