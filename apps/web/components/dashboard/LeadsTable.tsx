import { Lead, STATUS_META } from "./data";

export function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left text-sm text-muted-foreground">
        <thead className="border-b border-border bg-muted/50 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Guest Name</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Inquiry Type</th>
            <th className="px-4 py-3 font-medium">Event Date</th>
            <th className="px-4 py-3 font-medium">Guests</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {leads.map((lead) => (
            <tr key={lead.id} className="transition-colors hover:bg-muted/50">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{lead.name}</td>
              <td className="whitespace-nowrap px-4 py-3">{lead.phone}</td>
              <td className="whitespace-nowrap px-4 py-3">{lead.city}</td>
              <td className="whitespace-nowrap px-4 py-3">
                {lead.eventDate ? new Date(lead.eventDate).toLocaleDateString() : "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3">{lead.guestCount || "—"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-xs">{lead.source.replace("_", " ")}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <span 
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ 
                    backgroundColor: STATUS_META[lead.status].dot + '20', 
                    color: STATUS_META[lead.status].pill 
                  }}
                >
                  {STATUS_META[lead.status].label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && (
        <div className="p-8 text-center text-sm">No leads in the pipeline yet.</div>
      )}
    </div>
  );
}