"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/portfolio";

const portfolioNav = [
  { href: "/architecture", label: "Architecture" },
  { href: "/writing", label: "Writing" },
];

const platformNav = [
  { href: "/chat", label: "AI Chat" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/monitor", label: "Monitor" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm transition ${
        active
          ? "bg-zinc-800/80 font-medium text-white"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onPlatform = platformNav.some((n) => pathname.startsWith(n.href)) || pathname === "/settings";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <div className="portfolio-noise pointer-events-none fixed inset-0 opacity-[0.35]" aria-hidden />

      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="group flex flex-col">
            <span className="text-base font-semibold tracking-tight text-white group-hover:text-teal-50">
              {profile.name}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {profile.title}
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            <NavLink href="/" label="Home" />
            {portfolioNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <span className="mx-1 hidden h-4 w-px bg-zinc-800 sm:block" aria-hidden />
            <span className="hidden px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 sm:inline">
              Platform
            </span>
            {platformNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <NavLink href="/settings" label="Settings" />
          </nav>
        </div>
        {onPlatform ? (
          <div className="border-t border-zinc-900/80 bg-teal-950/20">
            <p className="mx-auto max-w-6xl px-4 py-2 text-center text-xs text-teal-300/80">
              Live reference architecture demo —{" "}
              <Link href="/architecture" className="underline underline-offset-2 hover:text-teal-200">
                read the architecture lens
              </Link>
            </p>
          </div>
        ) : null}
      </header>

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 md:py-12">
        {children}
      </main>

      <footer className="relative border-t border-zinc-800/80 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-300">{profile.name}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Principal AI Architect · Agentic systems · Enterprise modernization
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition hover:text-teal-400"
            >
              LinkedIn
            </a>
            <a
              href={profile.links.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition hover:text-teal-400"
            >
              Substack
            </a>
            <a
              href={profile.links.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition hover:text-teal-400"
            >
              Medium
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition hover:text-teal-400"
            >
              GitHub
            </a>
            <Link href="/chat" className="text-zinc-400 transition hover:text-teal-400">
              Platform demo
            </Link>
          </div>
        </div>
        <p className="border-t border-zinc-900 pb-6 pt-4 text-center text-[11px] text-zinc-600">
          Market and portfolio narratives are informational only — not investment or legal advice.
        </p>
      </footer>
    </div>
  );
}
