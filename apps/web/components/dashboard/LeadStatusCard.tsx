import { Check } from "lucide-react";
import { LEAD_STATUSES, STATUS_META, type LeadStatus } from "./data";

interface LeadStatusCardProps {
  leadName: string;
  leadCity: string;
  status: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export function LeadStatusCard({
  leadName,
  leadCity,
  status,
  onStatusChange,
}: LeadStatusCardProps) {
  const currentIndex = LEAD_STATUSES.indexOf(status);
  const meta = STATUS_META[status];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
          Lead status
        </p>
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide ${meta.pill}`}
        >
          {meta.label}
        </span>
      </div>

      <p className="mt-3 text-xl font-extrabold tracking-tight">{leadName}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {leadCity} · tap a stage to move the booking
      </p>

      <div className="mt-5 space-y-1.5">
        {LEAD_STATUSES.map((s, i) => {
          const isCurrent = s === status;
          const isPast = i < currentIndex && status !== "lost";
          const m = STATUS_META[s];
          return (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                isCurrent
                  ? "border-primary/50 bg-primary/5 font-semibold"
                  : "border-transparent hover:border-border hover:bg-muted/60"
              }`}
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full border ${
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : isPast
                      ? "border-primary/40 text-primary"
                      : "border-border text-muted-foreground/50"
                }`}
              >
                {isPast ? <Check size={11} strokeWidth={3} /> : null}
              </span>
              <span className={isCurrent ? "text-foreground" : "text-foreground/70"}>
                {m.label}
              </span>
              {isCurrent && (
                <span className="ml-auto font-mono text-[9px] tracking-[0.18em] text-primary uppercase">
                  Current
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
