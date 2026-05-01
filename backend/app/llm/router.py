from enum import Enum


class RouteBucket(str, Enum):
    REASONING = "reasoning"
    STRUCTURED = "structured"
    FAST = "fast"
    CODE = "code"


def bucket_for_task(task_kind: str) -> RouteBucket:
    """Heuristic routing aligned with the platform playbook."""
    t = task_kind.lower()
    if t in {"code", "prototype", "implementation"}:
        return RouteBucket.CODE
    if t in {"structured", "json", "salesforce", "api_contract"}:
        return RouteBucket.STRUCTURED
    if t in {"fast", "short", "classification"}:
        return RouteBucket.FAST
    return RouteBucket.REASONING


def bucket_for_intent(intent: str) -> RouteBucket:
    i = intent.lower()
    if i in {"market_analysis", "market"}:
        return RouteBucket.REASONING
    if i in {"prototype_idea", "prototype", "builder"}:
        return RouteBucket.CODE
    if i in {"news_learning", "news", "research"}:
        return RouteBucket.REASONING
    if i in {"rag_query", "knowledge"}:
        return RouteBucket.STRUCTURED
    return RouteBucket.REASONING
