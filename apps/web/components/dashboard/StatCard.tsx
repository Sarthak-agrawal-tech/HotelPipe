import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  accent?: ReactNode;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
          {label}
        </p>
        {accent}
      </div>
      <p className="mt-3 text-4xl font-extrabold tracking-tighter tabular-nums">
        {value}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
