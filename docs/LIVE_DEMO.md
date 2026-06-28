# Live Demo — Venkat AI Platform

| Surface | URL |
|---------|-----|
| **UI (Vercel)** | https://venkat-ai-platform.vercel.app |
| **API (Render)** | https://vap-api.onrender.com |

## Deploy UI to Vercel (free)

```bash
cd frontend
npx vercel --prod
npx vercel alias set <deployment-url> venkat-ai-platform.vercel.app
```

`frontend/vercel.json` rewrites `/api/*` → Render `vap-api`. Set `NEXT_PUBLIC_API_URL=/api` in Vercel project env (already in vercel.json build env).

## Deploy API to Render (free)

1. Push `main` to GitHub.
2. Render Dashboard → **New Blueprint** → connect `venkat-ai-platform` → apply `render.yaml`.
3. Set secrets (free-tier friendly):
   - **Required:** `GROQ_API_KEY` (free LLM at [console.groq.com](https://console.groq.com))
   - **Optional:** `REDIS_URL` (Upstash), `QDRANT_URL` + `QDRANT_API_KEY` (Qdrant Cloud)
   - Or `OPENROUTER_API_KEY` instead of Groq if you prefer pay-as-you-go

## Local

```bash
docker compose up -d
cd backend && uvicorn app.main:app --reload
cd frontend && npm run dev
```
