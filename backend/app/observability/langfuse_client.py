import logging
from contextlib import contextmanager
from typing import Any, Iterator

from app.core.config import get_settings

logger = logging.getLogger(__name__)


@contextmanager
def langfuse_span(name: str, *, input: Any | None = None) -> Iterator[Any]:
    """Best-effort Langfuse trace hook; never fails the request path."""
    settings = get_settings()
    if not (settings.langfuse_public_key and settings.langfuse_secret_key):
        yield None
        return
    try:
        from langfuse import Langfuse

        lf = Langfuse(
            public_key=settings.langfuse_public_key,
            secret_key=settings.langfuse_secret_key,
            host=settings.langfuse_host,
        )
        with lf.start_as_current_observation(as_type="span", name=name, input=input) as observation:
            yield observation
    except Exception as exc:  # noqa: BLE001
        logger.debug("Langfuse disabled for %s: %s", name, exc)
        yield None
