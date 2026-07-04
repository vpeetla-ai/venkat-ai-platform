const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "/api"
    : "http://localhost:8000");

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
  apiKey?: string,
): Promise<ChatResponse> {
  const body: Record<string, unknown> = {
    message,
    notify_channels: notifyChannels,
  };
  if (threadId) {
    body.thread_id = threadId;
  }
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers["X-API-Key"] = apiKey;
  const r = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `HTTP ${r.status}`);
  }
  return r.json() as Promise<ChatResponse>;
}
