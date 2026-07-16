"use client";

import { useMutation } from "@tanstack/react-query";
import { PlatformArchitecturePanel } from "@/components/portfolio/PlatformArchitecturePanel";
import { postChat, type ChatResponse } from "@/lib/api";
import { useSettingsStore } from "@/lib/store";
import { useMemo, useRef, useState } from "react";

type PhaseId =
  | "chief"
  | "planner"
  | "workers"
  | "content_extra"
  | "insight"
  | "critic"
  | "compose"
  | "notify";

const PHASES: { id: PhaseId; label: string; color: string }[] = [
  { id: "chief", label: "Chief", color: "bg-blue-600" },
  { id: "planner", label: "Planner", color: "bg-blue-500" },
  { id: "workers", label: "Workers", color: "bg-teal-600" },
  { id: "content_extra", label: "Content", color: "bg-amber-600" },
  { id: "insight", label: "Insight", color: "bg-indigo-600" },
  { id: "critic", label: "Critic", color: "bg-purple-600" },
  { id: "compose", label: "Compose", color: "bg-slate-700" },
  { id: "notify", label: "Notify", color: "bg-emerald-700" },
];

function splitInsightCritic(finalText: string): { insight: string; critic: string } {
  const marker = "---\nCritic / QA:";
  const idx = finalText.indexOf(marker);
  if (idx < 0) return { insight: finalText, critic: "" };
  const insight = finalText.slice(0, idx).trim();
  const critic = finalText.slice(idx + marker.length).trim();
  return { insight, critic };
}

function summarizeOutputs(outputs: Record<string, string>): string {
  const keys = Object.keys(outputs || {});
  if (!keys.length) return "No specialist outputs returned.";
  return keys
    .slice(0, 6)
    .map((k) => `${k}: ${(outputs[k] || "").slice(0, 120).replace(/\s+/g, " ").trim()}…`)
    .join("\n");
}

export default function MonitorPage() {
  const {
    notifySlack,
    notifyTelegram,
    notifyWhatsapp,
    activeThreadId,
    setActiveThreadId,
    apiKey,
  } = useSettingsStore();

  const channels = useMemo(() => {
    const list: string[] = [];
    if (notifySlack) list.push("slack");
    if (notifyTelegram) list.push("telegram");
    if (notifyWhatsapp) list.push("whatsapp");
    return list;
  }, [notifySlack, notifyTelegram, notifyWhatsapp]);

  const [message, setMessage] = useState(
    "Summarize the AI agent orchestration patterns I should focus on this month.",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChatResponse | null>(null);

  const [activePhase, setActivePhase] = useState<PhaseId | null>(null);
  const [donePhases, setDonePhases] = useState<Set<PhaseId>>(new Set());
  const timersRef = useRef<number[]>([]);

  const mutation = useMutation({
    mutationFn: () =>
      postChat(
        message,
        channels.length ? channels : undefined,
        activeThreadId ?? undefined,
        apiKey || undefined,
      ),
    onSuccess: (resp) => {
      if (resp.thread_id) setActiveThreadId(resp.thread_id);
      setData(resp);
      setError(null);

      const skipped = new Set<PhaseId>();
      if (resp.intent !== "news_learning") skipped.add("content_extra");
      if (!channels.length || Object.keys(resp.delivery || {}).length === 0) skipped.add("notify");

      const phaseIds = PHASES.map((p) => p.id).filter((id) => !skipped.has(id));

      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
      setDonePhases(new Set());
      setActivePhase(phaseIds[0] ?? null);

      const stepMs = 520;
      phaseIds.forEach((id, idx) => {
        timersRef.current.push(
          window.setTimeout(() => {
            setDonePhases((prev) => {
              const next = new Set(prev);
              next.add(id);
              return next;
            });
            setActivePhase(phaseIds[idx + 1] ?? null);
          }, idx * stepMs),
        );
      });
      setLoading(false);
    },
    onError: (e) => {
      setLoading(false);
      setError(e instanceof Error ? e.message : "Workflow failed");
      setData(null);
      setActivePhase(null);
      setDonePhases(new Set());
    },
  });

  async function run() {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    setLoading(true);
    setError(null);
    setData(null);
    setActivePhase(null);
    setDonePhases(new Set());
    await mutation.mutateAsync();
  }

  const skipped = useMemo(() => {
    const set = new Set<PhaseId>();
    if (!data) return set;
    if (data.intent !== "news_learning") set.add("content_extra");
    if (!channels.length || Object.keys(data.delivery || {}).length === 0) set.add("notify");
    return set;
  }, [channels.length, data]);

  const phaseDetail = useMemo(() => {
    if (!data || !activePhase) return null;
    if (activePhase === "chief") {
      return { title: "Chief — intent classification", body: `intent: ${data.intent}` };
    }
    if (activePhase === "planner") {
      return { title: "Planner — task plan", body: data.plan || "(no plan returned)" };
    }
    if (activePhase === "workers") {
      return { title: "Workers — parallel specialists", body: summarizeOutputs(data.outputs || {}) };
    }
    if (activePhase === "content_extra") {
      return {
        title: "Content extra — optional",
        body: (data.outputs as Record<string, string>)?.content_draft?.slice(0, 1500) ?? "skipped",
      };
    }
    if (activePhase === "insight" || activePhase === "critic") {
      const { insight, critic } = splitInsightCritic(data.final || "");
      return {
        title: activePhase === "insight" ? "Insight — synthesis" : "Critic — verification QA",
        body: activePhase === "insight" ? (insight || "(empty)") : (critic || "(empty)"),
      };
    }
    if (activePhase === "compose") {
      return { title: "Compose — final report", body: data.final?.slice(0, 1800) ?? "(empty)" };
    }
    if (activePhase === "notify") {
      const keys = Object.keys(data.delivery || {});
      return {
        title: "Notify — delivery toggles",
        body: keys.length
          ? keys
              .map((k) => `${k}: ${String((data.delivery as Record<string, boolean>)[k])}`)
              .join("\n")
          : "No channels enabled",
      };
    }
    return null;
  }, [activePhase, data]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Runtime visibility</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900 md:text-2xl">Glass-box: workflow phases</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Left column shows stack + live metrics. Center highlights the LangGraph execution order inferred from
          returned fields (not token-level trace).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[320px_1fr_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <PlatformArchitecturePanel />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-slate-900">Orchestrator phase replay</h2>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              inferred from response fields
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {PHASES.map((p) => {
              const isActive = activePhase === p.id;
              const isDone = donePhases.has(p.id);
              const isSkipped = skipped.has(p.id);
              return (
                <div
                  key={p.id}
                  className={[
                    "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                    isSkipped ? "border-slate-200 bg-slate-50 text-slate-400" : "border-slate-200 bg-white text-slate-600",
                    isActive ? "ring-2 ring-blue-400" : "",
                    isDone ? "border-blue-200 bg-blue-50 text-blue-700" : "",
                  ].join(" ")}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${p.color} ${isSkipped ? "opacity-30" : ""}`} aria-hidden />
                  {p.label}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            {phaseDetail ? (
              <>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{phaseDetail.title}</div>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-800">
                  {phaseDetail.body}
                </pre>
              </>
            ) : (
              <p className="text-sm text-slate-600">Run the workflow to see phase-by-phase breakdown from the response.</p>
            )}
          </div>

          {data ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orchestrator outputs</div>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-800">
                {summarizeOutputs(data.outputs || {})}
              </pre>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Run workflow</div>
          <p className="mt-1 text-sm text-slate-600">
            One message to the Chief; the graph fans out to specialists and composes a final executive report.
          </p>

          <label htmlFor="vapMessage" className="mt-4 block text-xs font-semibold text-slate-500">
            Message
          </label>
          <textarea
            id="vapMessage"
            className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="mt-4">
            <button
              type="button"
              onClick={run}
              disabled={loading || mutation.isPending}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading || mutation.isPending ? "Running agents…" : "Run workflow"}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {data ? (
            <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Intent</div>
                <div className="mt-1 text-sm font-medium text-slate-900">{data.intent}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan</div>
                <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-800">
                  {data.plan || "(empty)"}
                </pre>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Final</div>
                <pre className="mt-1 max-h-52 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-800">
                  {data.final || "(empty)"}
                </pre>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
