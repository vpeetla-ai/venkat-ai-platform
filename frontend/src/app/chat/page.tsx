"use client";

import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Link from "next/link";
import { PlatformArchitecturePanel } from "@/components/portfolio/PlatformArchitecturePanel";
import { ProductWorkbench } from "@/components/portfolio/ProductWorkbench";
import { postChat } from "@/lib/api";
import { useSettingsStore } from "@/lib/store";

export default function ChatPage() {
  const [input, setInput] = useState(
    "Summarize the AI agent orchestration patterns I should focus on this month.",
  );
  const { notifySlack, notifyTelegram, notifyWhatsapp, activeThreadId, setActiveThreadId, apiKey } =
    useSettingsStore();

  const channels = useMemo(() => {
    const list: string[] = [];
    if (notifySlack) list.push("slack");
    if (notifyTelegram) list.push("telegram");
    if (notifyWhatsapp) list.push("whatsapp");
    return list;
  }, [notifySlack, notifyTelegram, notifyWhatsapp]);

  const mutation = useMutation({
    mutationFn: () =>
      postChat(input, channels.length ? channels : undefined, activeThreadId ?? undefined, apiKey),
    onSuccess: (data) => {
      if (data.thread_id) setActiveThreadId(data.thread_id);
    },
  });

  return (
    <ProductWorkbench
      eyebrow="Multi-agent orchestration OS"
      productName="Venkat AI Platform"
      subtitle="Chief → Planner → specialists → Insight → Critic. Enable delivery toggles in Settings to mirror finals to Slack, Telegram, or WhatsApp."
      headerActions={
        <Link href="/settings" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Settings
        </Link>
      }
      productPanel={
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <textarea
            className="min-h-[140px] w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {mutation.isPending ? "Running agents…" : "Run workflow"}
            </button>
            {activeThreadId ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveThreadId(null)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  New thread
                </button>
                <span className="text-xs text-slate-500">Thread {activeThreadId}</span>
              </>
            ) : null}
          </div>
          {mutation.error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {(mutation.error as Error).message}
            </p>
          ) : null}
          {mutation.data ? (
            <div className="mt-6 space-y-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Intent</p>
                <p className="text-slate-900">{mutation.data.intent}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Final answer</p>
                <pre className="mt-1 max-h-96 overflow-auto whitespace-pre-wrap text-slate-800">{mutation.data.final}</pre>
              </div>
            </div>
          ) : null}
        </div>
      }
      architecturePanel={<PlatformArchitecturePanel />}
    />
  );
}
