"""Deep Research orchestrator — recon → gap analysis → ReAct → reflection loop."""

from __future__ import annotations

import asyncio
import uuid
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from app.agents.gap_analyst import run_gap_analyst_agent
from app.agents.insight import run_insight_agent
from app.agents.loops.react_loop import run_react_loop
from app.agents.loops.reflection_loop import run_reflection_loop
from app.agents.rag_expert import run_rag_expert_agent
from app.agents.web import run_web_agent
from app.memory.rag_strategies import RagStrategy, format_hits, retrieve
from app.observability.langfuse_client import langfuse_span
from app.services.notifications import deliver_report


class ResearchState(TypedDict, total=False):
    user_message: str
    intent: str
    plan: str
    outputs: dict[str, str]
    insight: str
    critic: str
    final: str
    notify_channels: list[str]
    delivery: dict[str, bool]
    loop_round: int
    audit_case_id: str


async def node_research_scope(state: ResearchState) -> dict:
    from app.agents._llm import ainvoke
    from app.llm.router import RouteBucket

    system = """You are ResearchScopeAgent. Define: objective, success criteria, constraints, 4 research angles.
Max 8 bullets."""
    plan = await ainvoke(system, state["user_message"], RouteBucket.STRUCTURED)
    return {"plan": plan, "intent": "deep_research", "loop_round": 0}


async def node_recon(state: ResearchState) -> dict:
    msg = state["user_message"]
    with langfuse_span("research.recon"):
        web, rag_expert, hybrid_hits = await asyncio.gather(
            run_web_agent(msg),
            run_rag_expert_agent(msg),
            retrieve(RagStrategy.HYBRID, msg, limit=5),
        )
    outputs = {
        "web": web,
        "rag_expert": rag_expert,
        "hybrid_rag": format_hits(hybrid_hits),
    }
    return {"outputs": outputs}


async def node_gap_analysis(state: ResearchState) -> dict:
    bundle = "\n\n".join(f"## {k}\n{v}" for k, v in state.get("outputs", {}).items())
    gaps = await run_gap_analyst_agent(state["user_message"], bundle)
    outputs = dict(state.get("outputs", {}))
    outputs["gap_analysis"] = gaps
    return {"outputs": outputs}


async def node_react_research(state: ResearchState) -> dict:
    from app.memory.rag_strategies import retrieve as rag_retrieve

    async def rag_tool(q: str) -> str:
        hits = await rag_retrieve(RagStrategy.MULTI_QUERY, q, limit=4)
        return format_hits(hits)

    tools = {"web": run_web_agent, "rag_search": rag_tool}
    trace = await run_react_loop(state["user_message"], tools, max_steps=4)
    outputs = dict(state.get("outputs", {}))
    outputs["react_loop"] = trace
    return {"outputs": outputs}


async def node_synthesize(state: ResearchState) -> dict:
    bundle = "\n\n".join(f"## {k}\n{v[:3000]}" for k, v in state.get("outputs", {}).items())
    bundle = f"PLAN:\n{state.get('plan', '')}\n\n{bundle}"
    with langfuse_span("research.synthesize"):
        insight = await run_insight_agent(bundle)
    return {"insight": insight}


async def node_reflection(state: ResearchState) -> dict:
    draft = state.get("insight", "")
    final_draft, traces = await run_reflection_loop(
        goal=state["user_message"],
        initial_draft=draft,
        max_rounds=2,
        quality_threshold=7.0,
    )
    critic = "\n\n".join(traces)
    return {"insight": final_draft, "critic": critic}


async def node_compose(state: ResearchState) -> dict:
    final = (
        f"# Deep Research Report\n\n{state.get('insight', '')}\n\n"
        f"---\n## Reflection trace\n{state.get('critic', '')}"
    )
    return {"final": final}


async def node_notify(state: ResearchState) -> dict:
    if not state.get("notify_channels"):
        return {"delivery": {}}
    title = "VAP Deep Research"
    delivery = await deliver_report(
        "VAP Deep Research", state.get("final", ""), channels=state["notify_channels"],
        case_id=state.get("audit_case_id"),
    )
    return {"delivery": delivery}


def build_research_graph():
    g = StateGraph(ResearchState)
    g.add_node("scope", node_research_scope)
    g.add_node("recon", node_recon)
    g.add_node("gap", node_gap_analysis)
    g.add_node("react", node_react_research)
    g.add_node("synthesize", node_synthesize)
    g.add_node("reflection", node_reflection)
    g.add_node("compose", node_compose)
    g.add_node("notify", node_notify)

    g.add_edge(START, "scope")
    g.add_edge("scope", "recon")
    g.add_edge("recon", "gap")
    g.add_edge("gap", "react")
    g.add_edge("react", "synthesize")
    g.add_edge("synthesize", "reflection")
    g.add_edge("reflection", "compose")
    g.add_edge("compose", "notify")
    g.add_edge("notify", END)
    return g.compile()


_research_graph = None


def get_research_graph():
    global _research_graph
    if _research_graph is None:
        _research_graph = build_research_graph()
    return _research_graph


async def run_research_turn(
    user_message: str,
    notify_channels: list[str] | None = None,
    *,
    audit_case_id: str | None = None,
) -> ResearchState:
    graph = get_research_graph()
    init: ResearchState = {
        "user_message": user_message,
        "notify_channels": notify_channels or [],
        "outputs": {},
        "audit_case_id": audit_case_id or str(uuid.uuid4()),
    }
    return await graph.ainvoke(init)
