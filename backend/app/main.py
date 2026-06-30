import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import a2a, chat, health, ingest, orchestrators, rag, threads, workflows
from app.core.config import get_settings
from app.db.session import dispose_engine, get_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_engine()
    logger.info("Venkat AI Platform backend startup (env=%s)", settings.app_env)
    yield
    await dispose_engine()
    logger.info("Venkat AI Platform backend shutdown complete")


app = FastAPI(
    title="Venkat AI Platform",
    description="Multi-agent orchestration API (LangGraph + FastAPI)",
    version="0.3.0",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.backend_cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(a2a.router)
app.include_router(chat.router)
app.include_router(threads.router)
app.include_router(ingest.router)
app.include_router(orchestrators.router)
app.include_router(rag.router)
app.include_router(workflows.router)
