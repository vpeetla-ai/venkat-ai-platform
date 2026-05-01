from langchain_core.messages import HumanMessage, SystemMessage

from app.llm.factory import chat_llm_for_bucket
from app.llm.router import RouteBucket


async def ainvoke(system: str, user: str, bucket: RouteBucket) -> str:
    llm = chat_llm_for_bucket(bucket)
    out = await llm.ainvoke([SystemMessage(content=system), HumanMessage(content=user)])
    return str(out.content)
