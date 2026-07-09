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
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 md:p-8">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-amber-800">
          Leadership lens
        </p>
        <p className="mt-3 max-w-3xl text-lg font-medium leading-relaxed text-slate-800">
          Every Substack essay and LinkedIn post closes with a{" "}
          <span className="text-amber-900">leadership takeaway</span> and operating principles —
          not just technical depth. This section mirrors that format for executives and principal
          engineers evaluating fit.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">Enduring principles</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {enduringPrinciples.map((p) => (
            <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold leading-snug text-blue-800">{p.principle}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">Leadership takeaways from publishing</h3>
        <p className="max-w-2xl text-sm text-slate-600">
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
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-200 hover:shadow-md"
              >
                <p className="flex-1 text-sm font-medium leading-relaxed text-slate-800">
                  “{t.takeaway}”
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500 group-hover:text-amber-800">
                  {t.source} →
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">{leadershipDualAudience.executives.title}</h3>
          <ul className="space-y-2">
            {leadershipDualAudience.executives.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">{leadershipDualAudience.engineering.title}</h3>
          <ul className="space-y-2">
            {leadershipDualAudience.engineering.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Executive decision lens</h3>
        <p className="text-sm text-slate-600">
          Questions I encourage leadership teams to ask before scaling agentic AI — aligned to redline
          review and architecture governance themes in my writing.
        </p>
        <ul className="grid gap-2 md:grid-cols-2">
          {executiveDecisionLens.map((q) => (
            <li
              key={q}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              {q}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Leadership scope</h3>
        <ul className="grid gap-3 md:grid-cols-2">
          {leadershipScope.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Role positioning</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {roleFit.map((r) => (
            <div key={r.role} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-blue-800">{r.role}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.fit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
