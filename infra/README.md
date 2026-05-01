# Infrastructure notes

- **Vercel:** connect `frontend/`; set `NEXT_PUBLIC_API_URL` to your Render/Fly/Railway backend URL.
- **Render / Fly / Railway:** build from `backend/Dockerfile` or run `uvicorn` with buildpack; attach managed Postgres + Redis for production sessions.
- **Qdrant Cloud:** replace `QDRANT_URL` / API key as per vendor docs.
- **Langfuse Cloud:** populate `LANGFUSE_*` keys; traces emit from LangGraph nodes.
- **CI:** add GitHub Actions (`lint`, `pytest`, `npm run build`) — template intentionally omitted so you can align with org standards.
