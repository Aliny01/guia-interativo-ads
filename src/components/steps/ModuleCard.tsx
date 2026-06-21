import Link from "next/link";

export function ModuleCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-card border border-surface-border bg-surface p-6 transition hover:border-royal/50 hover:shadow-glow active:scale-[0.98]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-royal/15 text-2xl">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
      <span className="text-xl text-royal-bright">→</span>
    </Link>
  );
}
