import {
  enduringPrinciples,
  executiveDecisionLens,
  leadershipDualAudience,
  leadershipScope,
  leadershipTakeaways,
} from "@/lib/leadership";
import { roleFit } from "@/lib/portfolio";

export function LeadershipSection() {
  return (
    <div className="space-y-14">
      <div className="rounded-2xl border border-amber-900/30 bg-gradient-to-br from-amber-950/25 to-zinc-900/30 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
          Leadership lens
        </p>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-relaxed text-zinc-200">
          Every Substack essay and LinkedIn post closes with a{" "}
          <span className="text-amber-200/90">leadership takeaway</span> and operating principles —
          not just technical depth. This section mirrors that format for executives and principal
          engineers evaluating fit.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Enduring principles</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {enduringPrinciples.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-5"
            >
              <p className="text-sm font-semibold leading-snug text-teal-300">{p.principle}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Leadership takeaways from publishing</h3>
        <p className="max-w-2xl text-sm text-zinc-500">
          Direct lines from Venkat on AI Architecture (Substack) and LinkedIn — the same closes you
          use in newsletters and posts.
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {leadershipTakeaways.map((t) => (
            <li key={t.takeaway.slice(0, 40)}>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-zinc-800/70 bg-zinc-900/20 p-5 transition hover:border-amber-800/40 hover:bg-zinc-900/40"
              >
                <p className="flex-1 text-sm font-medium leading-relaxed text-zinc-200 group-hover:text-white">
                  “{t.takeaway}”
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-zinc-500 group-hover:text-amber-400/80">
                  {t.source} →
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{leadershipDualAudience.executives.title}</h3>
          <ul className="space-y-2">
            {leadershipDualAudience.executives.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/20 px-4 py-3 text-sm text-zinc-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{leadershipDualAudience.engineering.title}</h3>
          <ul className="space-y-2">
            {leadershipDualAudience.engineering.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/20 px-4 py-3 text-sm text-zinc-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Executive decision lens</h3>
        <p className="text-sm text-zinc-500">
          Questions I encourage leadership teams to ask before scaling agentic AI — aligned to redline
          review and architecture governance themes in my writing.
        </p>
        <ul className="grid gap-2 md:grid-cols-2">
          {executiveDecisionLens.map((q) => (
            <li
              key={q}
              className="rounded-lg border border-zinc-800/50 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-400"
            >
              {q}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Leadership scope</h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {leadershipScope.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/20 px-4 py-3 text-sm text-zinc-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Role positioning</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {roleFit.map((r) => (
            <div key={r.role} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5">
              <h4 className="text-sm font-semibold text-teal-300">{r.role}</h4>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{r.fit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
