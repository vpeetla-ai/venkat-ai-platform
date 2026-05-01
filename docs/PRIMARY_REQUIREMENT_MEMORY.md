# Primary requirement memory (durable project charter)

This file is the **human-readable anchor** for the non-negotiable standard described in `.cursor/rules/vap-principal-architect-bar.mdc`.

## Mission

Ship Venkat AI Platform as a **Principal AI Architect-grade** reference system: publishable documentation, explicit architecture decisions, measurable risks, cost clarity, and a credible scalability story.

## What “done” means for substantive changes

1. Update or extend `docs/PRINCIPAL_AI_ARCHITECT_DESIGN_DOCUMENT.md` with tradeoffs, risks, ADRs, cost notes, and scaling implications.  
2. Keep `docs/ARCHITECTURE.md` synchronized with the runtime graph (agents, data stores, workers).  
3. Preserve observability and safe defaults for dual-writes and outbound notifications.  
4. Never ship silent failures on persistence, vector indexing, or delivery paths without structured logs/metrics.

## Why this exists

Cursor (and other agents) do not share a universal long-term memory across sessions. **Repository artifacts + project rules** are the durable substitute. Treat them as the source of truth for architectural judgment.
