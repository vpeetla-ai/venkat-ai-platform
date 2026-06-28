import asyncio
from collections.abc import Awaitable, Callable
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from app.agents.api_tools import run_api_agent
from app.agents.budget_telemetry import run_budget_telemetry_agent
from app.agents.calendar_commitments import run_calendar_commitments_agent
from app.agents.chief import classify_intent
from app.agents.code import run_code_agent
from app.agents.compliance import run_compliance_agent
from app.agents.content import run_content_agent
from app.agents.critic import run_critic_agent
from app.agents.experiment import run_experiment_agent
from app.agents.insight import run_insight_agent
from app.agents.knowledge import run_knowledge_agent
from app.agents.market_intelligence import run_market_intelligence_agent
from app.agents.meeting_brief import run_meeting_brief_agent
from app.agents.news_research import run_news_research_agent
from app.agents.planner import plan_tasks
from app.agents.portfolio_risk import run_portfolio_risk_agent
from app.agents.prototype_builder import run_prototype_builder_agent
from app.agents.rag_expert import run_rag_expert_agent
from app.agents.security_review import run_security_review_agent
from app.agents.web import run_web_agent
from app.observability.langfuse_client import langfuse_span
from app.services.notifications import deliver_report

AgentFn = Callable[[str], Awaitable[str]]

DEFAULT_BRANCH: list[tuple[str, AgentFn]] = [
    ("knowledge", run_knowledge_agent),
    ("code", run_code_agent),
]

SPECIALISTS: dict[str, list[tuple[str, AgentFn]]] = {
    "news_learning": [("news", run_news_research_agent)],
    "prototype_idea": [
        ("prototype", run_prototype_builder_agent),
        ("code", run_code_agent),
    ],
    "market_analysis": [("market", run_market_intelligence_agent)],
    "rag_query": [("knowledge", run_knowledge_agent)],
    "rag_expert": [("rag_expert", run_rag_expert_agent)],
    "enterprise_api": [("api", run_api_agent)],
    "portfolio_risk": [
        ("portfolio_risk", run_portfolio_risk_agent),
        ("market", run_market_intelligence_agent),
    ],
    "calendar_commitments": [("calendar", run_calendar_commitments_agent)],
    "budget_telemetry": [("budget", run_budget_telemetry_agent)],
    "security_review": [("security", run_security_review_agent)],
    "compliance": [("compliance", run_compliance_agent)],
    "meeting_brief": [("meeting", run_meeting_brief_agent)],
    "experiment": [("experiment", run_experiment_agent)],
    "general": DEFAULT_BRANCH,
}


class VState(TypedDict, total=False):
    user_message: str
    intent: str
    plan: str
    outputs: dict[str, str]
    insight: str
    critic: str
    final: str
    notify_channels: list[str]
    delivery: dict[str, bool]


async def node_chief(state: VState) -> dict:
    with langfuse_span("chief.classify", input=state.get("user_message")):
        intent = await classify_intent(state["user_message"])
    return {"intent": intent}


async def node_planner(state: VState) -> dict:
    with langfuse_span("planner.plan"):
        plan = await plan_tasks(state.get("intent", "general"), state["user_message"])
    return {"plan": plan}


async def node_parallel_workers(state: VState) -> dict:
    intent = state.get("intent", "general")
    msg = state["user_message"]
    tasks: dict[str, asyncio.Task[str]] = {}

    def enqueue(name: str, coro: Awaitable[str]) -> None:
        tasks[name] = asyncio.create_task(coro)

    enqueue("web", run_web_agent(msg))

    branch = SPECIALISTS.get(intent, DEFAULT_BRANCH)
    for name, fn in branch:
        enqueue(name, fn(msg))

    outputs: dict[str, str] = {}
    for name, t in tasks.items():
        try:
            outputs[name] = await t
        except Exception as exc:  # noqa: BLE001
            outputs[name] = f"(agent error: {exc})"
    return {"outputs": outputs}


async def node_insight(state: VState) -> dict:
    bundle = "\n\n".join(f"## {k}\n{v}" for k, v in state.get("outputs", {}).items())
    bundle = f"PLAN:\n{state.get('plan','')}\n\n{bundle}"
    with langfuse_span("insight.synthesize"):
        insight = await run_insight_agent(bundle)
    return {"insight": insight}


async def node_critic(state: VState) -> dict:
    draft = state.get("insight", "")
    with langfuse_span("critic.review"):
        critic = await run_critic_agent(draft)
    return {"critic": critic}


async def node_compose_final(state: VState) -> dict:
    final = f"{state.get('insight','')}\n\n---\nCritic / QA:\n{state.get('critic','')}"
    return {"final": final}


async def node_optional_content(state: VState) -> dict:
    if state.get("intent") != "news_learning":
        return {}
    research = "\n\n".join(f"{k}: {v}" for k, v in state.get("outputs", {}).items())
    post = await run_content_agent(state["user_message"], research)
    outputs = dict(state.get("outputs", {}))
    outputs["content_draft"] = post
    return {"outputs": outputs}


async def node_notify(state: VState) -> dict:
    if not state.get("notify_channels"):
        return {"delivery": {}}
    title = f"VAP report — {state.get('intent', 'general')}"
    body = state.get("final", "")
    delivery = await deliver_report(title, body, channels=state["notify_channels"])
    return {"delivery": delivery}


def build_graph():
    g = StateGraph(VState)
    g.add_node("chief", node_chief)
    g.add_node("planner", node_planner)
    g.add_node("workers", node_parallel_workers)
    g.add_node("content_extra", node_optional_content)
    g.add_node("insight", node_insight)
    g.add_node("critic", node_critic)
    g.add_node("compose", node_compose_final)
    g.add_node("notify", node_notify)

    g.add_edge(START, "chief")
    g.add_edge("chief", "planner")
    g.add_edge("planner", "workers")
    g.add_edge("workers", "content_extra")
    g.add_edge("content_extra", "insight")
    g.add_edge("insight", "critic")
    g.add_edge("critic", "compose")
    g.add_edge("compose", "notify")
    g.add_edge("notify", END)
    return g.compile()


_graph = None


def get_compiled_graph():
    global _graph
    if _graph is None:
        _graph = build_graph()
    return _graph


async def run_platform_graph_turn(
    user_message: str, notify_channels: list[str] | None = None
) -> VState:
    graph = get_compiled_graph()
    init: VState = {
        "user_message": user_message,
        "notify_channels": notify_channels or [],
        "outputs": {},
    }
    return await graph.ainvoke(init)


# Backward-compatible alias
run_platform_turn = run_platform_graph_turn
