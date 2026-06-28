import Link from "next/link";
import { profile } from "@/lib/portfolio";

export function PortfolioHero() {
  return (
    <div className="portfolio-hero relative overflow-hidden rounded-3xl border border-zinc-800/80 p-8 md:p-12">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-400">{profile.tagline}</p>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {profile.name}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl">{profile.headline}</p>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-500 md:text-base">{profile.bio}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-zinc-700/70 bg-zinc-900/50 px-3 py-1 text-xs font-medium text-zinc-300"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/architecture"
              className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-teal-950 transition hover:bg-teal-400"
            >
              Architecture lens
            </Link>
            <Link
              href="/writing"
              className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900/50"
            >
              Read latest essays
            </Link>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
            >
              Hiring or advisory
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 lg:items-end">
          <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-900 to-zinc-950 text-3xl font-semibold tracking-tight text-teal-300 shadow-2xl shadow-teal-950/40">
            VP
          </div>
          <p className="text-center text-sm font-medium text-zinc-400 lg:text-right">{profile.title}</p>
        </div>
      </div>
    </div>
  );
}
