import Link from "next/link";
import { profile } from "@/lib/portfolio";

export function PortfolioHero() {
  return (
    <div className="portfolio-hero relative overflow-hidden rounded-3xl p-8 md:p-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {profile.tagline}
            </p>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {profile.name}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">{profile.headline}</p>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">{profile.bio}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/architecture"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Architecture lens
            </Link>
            <Link
              href="/writing"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Read latest essays
            </Link>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Hiring or advisory
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 lg:items-end">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-600 to-teal-600 text-3xl font-semibold tracking-tight text-white shadow-lg">
            VP
          </div>
          <p className="text-center text-sm font-medium text-slate-600 lg:text-right">{profile.title}</p>
        </div>
      </div>
    </div>
  );
}
