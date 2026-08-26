import { Sparkles, ArrowUpRight } from "lucide-react";
import type { Lead } from "./data";

interface LedgerPulseProps {
  leads: Lead[];
}

export function LedgerPulse({ leads }: LedgerPulseProps) {
  const followUps = leads.filter((l) => l.status === "follow up due").length;
  const waiting = leads.filter((l) => l.status === "waiting").length;
  const hot = leads.filter((l) => l.status === "interested").length;

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-primary/[0.04] p-5">
      <div className="pointer-events-none absolute -top-10 -right-10 size-36 rounded-full bg-primary/10 blur-2xl" />
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-primary" />
        <p className="font-mono text-[10px] tracking-[0.22em] text-primary uppercase">
          Ledger pulse · AI brief
        </p>
      </div>

      <p className="mt-4 font-serif text-2xl leading-snug italic">
        {followUps} follow-up{followUps === 1 ? "" : "s"} due today — one nudge on
        WhatsApp usually doubles the reply rate.
      </p>

      <ul className="mt-5 space-y-2.5 border-t border-primary/15 pt-4 text-sm">
        <li className="flex items-center justify-between">
          <span className="text-foreground/75">Hot conversations</span>
          <span className="flex items-center gap-1 font-mono text-xs font-bold text-primary tabular-nums">
            {hot} <ArrowUpRight size={12} />
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-foreground/75">Waiting on reply</span>
          <span className="font-mono text-xs font-bold tabular-nums">{waiting}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-foreground/75">Follow-ups overdue</span>
          <span className="font-mono text-xs font-bold text-tag-foreground tabular-nums">
            {followUps}
          </span>
        </li>
      </ul>

      <p className="mt-4 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
        Compiled from today's WhatsApp threads
      </p>
    </div>
  );
}
