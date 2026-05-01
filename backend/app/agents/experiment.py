from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def run_experiment_agent(user_message: str) -> str:
    system = """You are ExperimentAgent. Design LLM/agent evaluations: hypotheses, datasets, metrics,
human review gates, statistical caution, rollout plan, and rollback triggers.
Optimize for principal-level rigor without academic overhead."""
    return await ainvoke(system, user_message, RouteBucket.STRUCTURED)
