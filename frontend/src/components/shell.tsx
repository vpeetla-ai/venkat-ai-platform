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

const platformWorkbenchRoutes = ["/chat", "/dashboard", "/monitor", "/settings"];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onPlatform =
    platformNav.some((n) => pathname.startsWith(n.href)) || pathname === "/settings";
  const onWorkbench = platformWorkbenchRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6fb] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 text-xs font-bold text-white shadow-sm">
              VP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-blue-700">
                {profile.name}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {profile.title}
              </span>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            <NavLink href="/" label="Home" />
            {portfolioNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <span className="mx-1 hidden h-4 w-px bg-slate-200 sm:block" aria-hidden />
            <span className="hidden px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:inline">
              Platform
            </span>
            {platformNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <NavLink href="/settings" label="Settings" />
          </nav>
        </div>
        {onPlatform ? (
          <div className="border-t border-amber-200 bg-amber-50">
            <p className="mx-auto max-w-6xl px-4 py-2 text-center text-xs leading-5 text-amber-900">
              <span className="font-semibold uppercase tracking-wide">Demo review mode</span>
              {" — "}
              orchestration reference with gateway notify fail-open by default. Prefer AegisAI{" "}
              <code className="rounded bg-amber-100 px-1">PRODUCTION_STRICT</code> + Strict ERAG for
              Principal panels.{" "}
              <Link href="/architecture" className="font-medium underline underline-offset-2 hover:text-amber-950">
                Architecture lens
              </Link>
            </p>
          </div>
        ) : null}
      </header>

      <main
        className={
          onWorkbench
            ? "flex w-full flex-1 flex-col"
            : "relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 md:py-12"
        }
      >
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">{profile.name}</p>
            <p className="mt-1 text-xs text-slate-500">
              Principal AI Architect · Agentic systems · Enterprise modernization
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 transition hover:text-blue-600"
            >
              LinkedIn
            </a>
            <a
              href={profile.links.substack}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 transition hover:text-blue-600"
            >
              Substack
            </a>
            <a
              href={profile.links.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 transition hover:text-blue-600"
            >
              Medium
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 transition hover:text-blue-600"
            >
              GitHub
            </a>
            <Link href="/chat" className="text-slate-500 transition hover:text-blue-600">
              Platform demo
            </Link>
          </div>
        </div>
        <p className="border-t border-slate-100 pb-6 pt-4 text-center text-[11px] text-slate-400">
          Market and portfolio narratives are informational only — not investment or legal advice.
        </p>
      </footer>
    </div>
  );
}
