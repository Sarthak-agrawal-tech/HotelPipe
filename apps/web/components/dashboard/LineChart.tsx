interface LineChartProps {
  title: string;
  data: { label: string; value: number }[];
}

export function LineChart({ title, data }: LineChartProps) {
  const W = 100;
  const H = 44;
  const PAD = 4;
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const min = 0;

  const x = (i: number) => PAD + (i * (W - PAD * 2)) / (data.length - 1);
  const y = (v: number) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);

  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = `${PAD},${H - PAD} ${points} ${W - PAD},${H - PAD}`;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
        {title}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="mt-5 h-44 w-full"
        role="img"
        aria-label={title}
      >
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PAD}
            x2={W - PAD}
            y1={H * t}
            y2={H * t}
            className="stroke-border"
            strokeWidth="0.25"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <polygon points={area} className="fill-primary/10" stroke="none" />
        <polyline
          points={points}
          fill="none"
          className="stroke-primary"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => (
          <circle
            key={d.label}
            cx={x(i)}
            cy={y(d.value)}
            r={i === data.length - 1 ? 1.8 : 1.1}
            className={i === data.length - 1 ? "fill-primary" : "fill-primary/50"}
          />
        ))}
      </svg>
      <div className="mt-1.5 flex justify-between px-1">
        {data.map((d) => (
          <span
            key={d.label}
            className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
