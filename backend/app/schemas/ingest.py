from pydantic import BaseModel, Field


class IngestChunk(BaseModel):
    id: str
    text: str
    metadata: dict | None = None


class IngestRequest(BaseModel):
    chunks: list[IngestChunk] = Field(..., min_length=1)
