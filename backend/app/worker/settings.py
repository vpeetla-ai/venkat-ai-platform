"""ARQ worker settings — run with `arq app.worker.settings.WorkerSettings`."""

from __future__ import annotations

import os
from pathlib import Path

from arq import cron
from arq.connections import RedisSettings
from dotenv import load_dotenv

# Load backend/.env before reading worker-related environment variables.
_env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(_env_path)


async def run_daily_brief(ctx):  # noqa: ARG001
    from app.core.config import get_settings
    from app.orchestrator.registry import run_platform_turn

    settings = get_settings()
    if not settings.daily_brief_enabled:
        return "skipped"
    channels = [c.strip() for c in settings.daily_brief_channels.split(",") if c.strip()]
    message = (
        "Generate the daily principal AI architect intelligence brief: top model/provider changes, "
        "notable security bulletins, regulatory signals, and three concrete learning sprints."
    )
    await run_platform_turn(message, notify_channels=channels or None)
    return "ok"


_cron_jobs = []
if os.getenv("DAILY_BRIEF_ENABLED", "").lower() in ("1", "true", "yes"):
    _cron_jobs.append(
        cron(
            run_daily_brief,
            hour=int(os.getenv("DAILY_BRIEF_HOUR_UTC", "7")),
            minute=int(os.getenv("DAILY_BRIEF_MINUTE", "0")),
        )
    )


class WorkerSettings:
    redis_settings = RedisSettings.from_dsn(os.getenv("REDIS_URL", "redis://localhost:6379/0"))
    functions = [run_daily_brief]
    cron_jobs = _cron_jobs
