from typing import Sequence

from app.core.config import get_settings


async def embed_texts(texts: Sequence[str]) -> list[list[float]]:
    settings = get_settings()
    if settings.embedding_provider == "openai" and settings.openai_api_key:
        from langchain_openai import OpenAIEmbeddings

        emb = OpenAIEmbeddings(api_key=settings.openai_api_key)
        return await emb.aembed_documents(list(texts))
    if settings.embedding_provider == "cohere" and settings.cohere_api_key:
        try:
            import cohere
        except ImportError as exc:
            raise RuntimeError('Install cohere: pip install "cohere>=5"') from exc
        co = cohere.Client(settings.cohere_api_key)
        out = co.embed(texts=list(texts), model="embed-english-v3.0", input_type="search_document")
        return out.embeddings  # type: ignore[return-value]
    # Deterministic fallback for local dev (not semantically meaningful)
    dim = 64
    return [[float((sum(ord(c) for c in t) + i) % 997) / 997 for i in range(dim)] for t in texts]
