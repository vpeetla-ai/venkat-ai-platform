from app.agents._llm import ainvoke
from app.llm.router import RouteBucket


async def plan_tasks(intent: str, user_message: str) -> str:
    system = """You are PlannerAgent. Produce a short numbered plan (max 6 steps) listing agents to invoke:
WebAgent, KnowledgeAgent, NewsResearchAgent, PrototypeBuilderAgent, MarketIntelligenceAgent,
PortfolioRiskAgent, CalendarCommitmentsAgent, BudgetTelemetryAgent, SecurityReviewAgent,
ComplianceAgent, MeetingBriefAgent, ExperimentAgent, APIAgent, CodeAgent, RagExpertAgent,
GapAnalystAgent, ArchitectureSynthesizerAgent, InsightAgent, CriticAgent, ContentAgent, DeliveryAgent.
Be concise. No preamble."""
    return await ainvoke(system, f"Intent={intent}\nUser:\n{user_message}", RouteBucket.STRUCTURED)
