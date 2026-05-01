"use client";

import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { postChat } from "@/lib/api";
import { useSettingsStore } from "@/lib/store";

export default function ChatPage() {
  const [input, setInput] = useState(
    "Summarize the AI agent orchestration patterns I should focus on this month.",
  );
  const {
    notifySlack,
    notifyTelegram,
    notifyWhatsapp,
    activeThreadId,
    setActiveThreadId,
  } = useSettingsStore();

  const channels = useMemo(() => {
    const list: string[] = [];
    if (notifySlack) list.push("slack");
    if (notifyTelegram) list.push("telegram");
    if (notifyWhatsapp) list.push("whatsapp");
    return list;
  }, [notifySlack, notifyTelegram, notifyWhatsapp]);

  const mutation = useMutation({
    mutationFn: () =>
      postChat(input, channels.length ? channels : undefined, activeThreadId ?? undefined),
    onSuccess: (data) => {
      if (data.thread_id) {
        setActiveThreadId(data.thread_id);
      }
    },
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Chat</h1>
        <p className="text-sm text-zinc-400">
          Messages route through Chief → Planner → specialist agents → Insight → Critic. Enable delivery
          toggles in Settings to mirror finals to Slack / Telegram / WhatsApp.
        </p>
      </div>
      <textarea
        className="min-h-[140px] w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Running agents…" : "Run workflow"}
        </button>
        {activeThreadId ? (
          <button
            type="button"
            onClick={() => setActiveThreadId(null)}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:border-zinc-500"
          >
            New thread
          </button>
        ) : null}
        {activeThreadId ? (
          <span className="text-xs text-zinc-500">Thread {activeThreadId}</span>
        ) : null}
      </div>
      {mutation.error ? (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {(mutation.error as Error).message}
        </p>
      ) : null}
      {mutation.data ? (
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Intent</p>
            <p className="text-white">{mutation.data.intent}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Planner</p>
            <pre className="mt-1 whitespace-pre-wrap text-zinc-300">{mutation.data.plan}</pre>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Specialist outputs</p>
            <div className="mt-2 space-y-3">
              {Object.entries(mutation.data.outputs).map(([k, v]) => (
                <details key={k} className="rounded-lg border border-zinc-800 bg-black/30">
                  <summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                    {k}
                  </summary>
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap px-3 pb-3 text-xs text-zinc-300">
                    {v}
                  </pre>
                </details>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Final answer</p>
            <pre className="mt-1 max-h-96 overflow-auto whitespace-pre-wrap text-zinc-100">
              {mutation.data.final}
            </pre>
          </div>
          {Object.keys(mutation.data.delivery).length ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Delivery</p>
              <pre className="mt-1 text-xs text-zinc-300">
                {JSON.stringify(mutation.data.delivery, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
