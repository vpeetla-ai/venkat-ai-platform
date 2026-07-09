"use client";

import Link from "next/link";
import { PlatformArchitecturePanel } from "@/components/portfolio/PlatformArchitecturePanel";
import { ProductWorkbench } from "@/components/portfolio/ProductWorkbench";
import { useSettingsStore } from "@/lib/store";

export default function SettingsPage() {
  const {
    defaultModelNote,
    setDefaultModelNote,
    notifySlack,
    notifyTelegram,
    notifyWhatsapp,
    setNotifySlack,
    setNotifyTelegram,
    setNotifyWhatsapp,
    apiKey,
    setApiKey,
  } = useSettingsStore();

  return (
    <ProductWorkbench
      eyebrow="Operator preferences"
      productName="Settings"
      subtitle="Model routing stays on the backend (.env). This panel captures UI preferences and notification toggles for chat requests."
      headerActions={
        <Link href="/chat" className="text-sm font-medium text-slate-600 hover:text-slate-900">
           AI Chat
        </Link>
      }
      productPanel={
        <div className="mx-auto max-w-xl space-y-6">
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">Architect notes</span>
            <textarea
              className="min-h-[96px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={defaultModelNote}
              onChange={(e) => setDefaultModelNote(e.target.value)}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-700">API key (only if the backend requires one)</span>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="X-API-Key"
            />
            <span className="text-xs text-slate-500">
              Set VAP_API_KEY on the backend to require this. Stored in this browser only.
            </span>
          </label>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Notify channels (chat requests)</p>
            {[
              ["slack", notifySlack, setNotifySlack],
              ["telegram", notifyTelegram, setNotifyTelegram],
              ["whatsapp", notifyWhatsapp, setNotifyWhatsapp],
            ].map(([id, on, set]) => (
              <label key={id as string} className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={on as boolean}
                  onChange={(e) => (set as (v: boolean) => void)(e.target.checked)}
                />
                Send final report to {id as string}
              </label>
            ))}
            <p className="text-xs text-slate-500">
              Requires matching credentials in backend `.env` (see repo `.env.example`).
            </p>
          </div>
        </div>
      }
      architecturePanel={<PlatformArchitecturePanel />}
    />
  );
}
