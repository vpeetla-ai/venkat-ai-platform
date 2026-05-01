import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Venkat AI Platform</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Your principal-architect operating system
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          Orchestrates specialized agents for AI news and learning paths, idea-to-prototype planning,
          market intelligence (informational only), RAG over your documents, and routed delivery to
          Slack, Telegram, or WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400"
          >
            Open AI Chat
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500"
          >
            View Dashboard
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "News & learning",
            body: "NewsResearchAgent curates headlines plus live web synthesis into a weekly learning brief.",
          },
          {
            title: "Ideas → prototypes",
            body: "PrototypeBuilderAgent turns prompts into architecture, stack choices, and ticket-sized work.",
          },
          {
            title: "Markets & delivery",
            body: "MarketIntelligenceAgent combines quotes with cautious narrative; DeliveryAgent fans out to chat apps.",
          },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="text-base font-semibold text-white">{c.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
