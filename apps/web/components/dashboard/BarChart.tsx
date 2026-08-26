interface BarChartProps {
  title: string;
  data: { label: string; value: number }[];
}

export function BarChart({ title, data }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
        {title}
      </p>
      <div className="mt-5 flex h-44 items-end gap-2">
        {data.map((d, i) => {
          const isToday = i === data.length - 1;
          return (
            <div
              key={d.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
            >
              <span
                className={`font-mono text-[10px] tabular-nums ${
                  isToday ? "font-bold text-primary" : "text-muted-foreground"
                }`}
              >
                {d.value}
              </span>
              <div
                className={`w-full rounded-t-sm transition-all duration-500 ${
                  isToday ? "bg-primary" : "bg-primary/25"
                }`}
                style={{ height: `${Math.max((d.value / max) * 78, 4)}%` }}
              />
              <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
