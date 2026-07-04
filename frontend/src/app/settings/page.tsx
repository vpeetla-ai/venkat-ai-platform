"use client";

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
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-zinc-400">
          Model routing stays on the backend (.env). This panel captures UI preferences and notification
          toggles for chat requests.
        </p>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="text-zinc-300">Architect notes</span>
        <textarea
          className="min-h-[96px] w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
          value={defaultModelNote}
          onChange={(e) => setDefaultModelNote(e.target.value)}
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="text-zinc-300">API key (only if the backend requires one)</span>
        <input
          type="password"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="X-API-Key"
        />
        <span className="text-xs text-zinc-500">
          Set VAP_API_KEY on the backend to require this. Stored in this browser only.
        </span>
      </label>
      <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-sm font-medium text-white">Notify channels (chat requests)</p>
        {[
          ["slack", notifySlack, setNotifySlack],
          ["telegram", notifyTelegram, setNotifyTelegram],
          ["whatsapp", notifyWhatsapp, setNotifyWhatsapp],
        ].map(([id, on, set]) => (
          <label key={id as string} className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-500"
              checked={on as boolean}
              onChange={(e) => (set as (v: boolean) => void)(e.target.checked)}
            />
            Send final report to {id as string}
          </label>
        ))}
        <p className="text-xs text-zinc-500">
          Requires matching credentials in backend `.env` (see repo `.env.example`).
        </p>
      </div>
    </div>
  );
}
