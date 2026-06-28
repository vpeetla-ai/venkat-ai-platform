export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-700/80 bg-zinc-900/60 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
      {children}
    </span>
  );
}
