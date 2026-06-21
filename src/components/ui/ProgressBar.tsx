export function ProgressBar({ value, total }: { value: number; total: number }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-muted">
        <span>
          {value} de {total} etapas concluídas
        </span>
        <span className="text-royal-bright">{percent}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-border/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-royal to-royal-bright shadow-[0_0_12px_rgba(37,99,235,0.7)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
