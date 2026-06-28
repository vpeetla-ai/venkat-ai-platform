export function Section({
  eyebrow,
  title,
  description,
  children,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-8">
      <div className="max-w-2xl space-y-3">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal-400/90">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
        {description ? <p className="text-base leading-relaxed text-zinc-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
