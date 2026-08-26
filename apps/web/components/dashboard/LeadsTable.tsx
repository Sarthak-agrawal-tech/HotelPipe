import { STATUS_META, type Lead } from "./data";

interface LeadsTableProps {
  leads: Lead[];
}

function formatDay(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86_400_000);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
          Recent entries
        </p>
        <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {leads.length} rows
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-2.5 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
                Lead
              </th>
              <th className="px-5 py-2.5 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
                Contact
              </th>
              <th className="px-5 py-2.5 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
                City
              </th>
              <th className="px-5 py-2.5 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
                Status
              </th>
              <th className="px-5 py-2.5 text-right font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
                Added
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const meta = STATUS_META[lead.status];
              return (
                <tr
                  key={lead.id}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold">{lead.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {lead.id}
                    </p>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-foreground/70 tabular-nums">
                    {lead.phone}
                  </td>
                  <td className="px-5 py-3 text-foreground/80">{lead.city}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide whitespace-nowrap ${meta.pill}`}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                    {formatDay(lead.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
