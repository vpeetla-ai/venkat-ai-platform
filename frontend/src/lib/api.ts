const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ChatResponse = {
  thread_id?: string | null;
  run_id?: string | null;
  intent: string;
  plan: string;
  outputs: Record<string, string>;
  final: string;
  delivery: Record<string, boolean>;
};

export async function postChat(
  message: string,
  notifyChannels?: string[],
  threadId?: string | null,
): Promise<ChatResponse> {
  const body: Record<string, unknown> = {
    message,
    notify_channels: notifyChannels,
  };
  if (threadId) {
    body.thread_id = threadId;
  }
  const r = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `HTTP ${r.status}`);
  }
  return r.json() as Promise<ChatResponse>;
}
