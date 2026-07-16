"""Architecture Review orchestrator — security + compliance + RAG + reflection loop."""

from __future__ import annotations

import asyncio
import uuid
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from app.agents.architecture_synthesizer import run_architecture_synthesizer_agent
from app.agents.compliance import run_compliance_agent
from app.agents.critic import run_critic_agent
from app.agents.knowledge import run_knowledge_agent
from app.agents.loops.plan_execute_loop import run_plan_execute_loop
from app.agents.loops.reflection_loop import run_reflection_loop
from app.agents.security_review import run_security_review_agent
from app.agents.web import run_web_agent
from app.observability.langfuse_client import langfuse_span
from app.services.notifications import deliver_report


class ArchitectureState(TypedDict, total=False):
    user_message: str
    intent: str
    plan: str
    outputs: dict[str, str]
    insight: str
    critic: str
    final: str
    notify_channels: list[str]
    delivery: dict[str, bool]
    audit_case_id: str


async def node_arch_scope(state: ArchitectureState) -> dict:
    from app.agents._llm import ainvoke
    from app.llm.router import RouteBucket

    system = """You are ArchitectureReviewScopeAgent. Extract: system boundaries, data flows,
trust zones, compliance scope, and review checklist (max 8 bullets)."""
    plan = await ainvoke(system, state["user_message"], RouteBucket.STRUCTURED)
    return {"plan": plan, "intent": "architecture_review"}


async def node_specialists(state: ArchitectureState) -> dict:
    msg = state["user_message"]
    with langfuse_span("architecture.specialists"):
        security, compliance, knowledge, web = await asyncio.gather(
            run_security_review_agent(msg),
            run_compliance_agent(msg),
            run_knowledge_agent(msg),
            run_web_agent(msg),
        )
    return {
        "outputs": {
            "security_review": security,
            "compliance": compliance,
            "knowledge_rag": knowledge,
            "web_context": web,
        }
    }


async def node_plan_execute(state: ArchitectureState) -> dict:
    msg = state["user_message"]

    async def execute_step(step: str, context: str) -> str:
        from app.agents._llm import ainvoke
        from app.llm.router import RouteBucket

        system = "Execute one architecture review step. Reference prior context when useful."
        return await ainvoke(system, f"STEP:\n{step}\n\nCONTEXT:\n{context[-2000:]}\n\nSYSTEM:\n{msg}", RouteBucket.STRUCTURED)

    pe_trace = await run_plan_execute_loop(msg, execute_step, max_steps=4)
    outputs = dict(state.get("outputs", {}))
    outputs["plan_execute"] = pe_trace
    return {"outputs": outputs}


async def node_synthesize(state: ArchitectureState) -> dict:
    bundle = "\n\n".join(f"## {k}\n{v[:2500]}" for k, v in state.get("outputs", {}).items())
    with langfuse_span("architecture.synthesize"):
        insight = await run_architecture_synthesizer_agent(state["user_message"], bundle)
    return {"insight": insight}


async def node_reflection(state: ArchitectureState) -> dict:
    draft = state.get("insight", "")
    final_draft, traces = await run_reflection_loop(
        goal=state["user_message"],
        initial_draft=draft,
        max_rounds=2,
        quality_threshold=7.5,
    )
    return {"insight": final_draft, "critic": "\n\n".join(traces)}


async def node_security_critic(state: ArchitectureState) -> dict:
    with langfuse_span("architecture.critic"):
        extra = await run_critic_agent(
            state.get("insight", ""),
            generator_provider="stub",
            workflow_id=state.get("audit_case_id"),
        )
    critic = f"{state.get('critic', '')}\n\n---\nFinal QA:\n{extra}"
    return {"critic": critic}


async def node_compose(state: ArchitectureState) -> dict:
    final = (
        f"# Architecture Review\n\n{state.get('insight', '')}\n\n"
        f"---\n## QA / Reflection\n{state.get('critic', '')}"
    )
    return {"final": final}


async def node_notify(state: ArchitectureState) -> dict:
    if not state.get("notify_channels"):
        return {"delivery": {}}
    delivery = await deliver_report(
        "VAP Architecture Review",
        state.get("final", ""),
        channels=state["notify_channels"],
        case_id=state.get("audit_case_id"),
    )
    return {"delivery": delivery}


def build_architecture_graph():
    g = StateGraph(ArchitectureState)
    g.add_node("scope", node_arch_scope)
    g.add_node("specialists", node_specialists)
    g.add_node("plan_execute", node_plan_execute)
    g.add_node("synthesize", node_synthesize)
    g.add_node("reflection", node_reflection)
    g.add_node("security_critic", node_security_critic)
    g.add_node("compose", node_compose)
    g.add_node("notify", node_notify)

    g.add_edge(START, "scope")
    g.add_edge("scope", "specialists")
    g.add_edge("specialists", "plan_execute")
    g.add_edge("plan_execute", "synthesize")
    g.add_edge("synthesize", "reflection")
    g.add_edge("reflection", "security_critic")
    g.add_edge("security_critic", "compose")
    g.add_edge("compose", "notify")
    g.add_edge("notify", END)
    return g.compile()


_arch_graph = None


def get_architecture_graph():
    global _arch_graph
    if _arch_graph is None:
        _arch_graph = build_architecture_graph()
    return _arch_graph


async def run_architecture_turn(
    user_message: str,
    notify_channels: list[str] | None = None,
    *,
    audit_case_id: str | None = None,
) -> ArchitectureState:
    graph = get_architecture_graph()
    init: ArchitectureState = {
        "user_message": user_message,
        "notify_channels": notify_channels or [],
        "outputs": {},
        "audit_case_id": audit_case_id or str(uuid.uuid4()),
    }
    return await graph.ainvoke(init)
