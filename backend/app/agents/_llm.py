from langchain_core.messages import HumanMessage, SystemMessage

from app.llm.factory import chat_llm_for_bucket
from app.llm.router import RouteBucket


async def ainvoke(
    system: str,
    user: str,
    bucket: RouteBucket,
    *,
    agent_role: str | None = None,
    data_class: str = "internal",
    generator_provider: str | None = None,
    workflow_id: str | None = None,
) -> str:
    llm = chat_llm_for_bucket(
        bucket,
        agent_role=agent_role,
        data_class=data_class,
        generator_provider=generator_provider,
        workflow_id=workflow_id,
    )
    out = await llm.ainvoke([SystemMessage(content=system), HumanMessage(content=user)])
    return str(out.content)
