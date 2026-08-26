const VERSIONS = [
  {
    id: "V1",
    name: "AI Receptionist",
    desc: "Answers every WhatsApp inquiry instantly, shares pricing and brochures, and captures the lead.",
  },
  {
    id: "V1.5",
    name: "Follow-Up CRM",
    desc: "Automated follow-up sequences, lead status tracking, staff notes and a callback queue.",
  },
  {
    id: "V2",
    name: "Complete CRM",
    desc: "Excel import, full guest profiles, team roles and a real analytics dashboard. Excel retired.",
  },
  {
    id: "V3",
    name: "Outreach Engine",
    desc: "AI-personalized campaigns to wedding planners, HR heads and travel agents \u2014 with ROI per campaign.",
  },
  {
    id: "V4",
    name: "Retention",
    desc: "Birthday and anniversary triggers, loyalty intelligence and Google review automation.",
  },
  {
    id: "V5",
    name: "AI Operations",
    desc: "Staff assistant, housekeeping, maintenance and one omnichannel inbox.",
  },
  {
    id: "V6+",
    name: "Revenue Intelligence",
    desc: "Occupancy forecasting, dynamic pricing, voice AI and OTA synchronization.",
  },
];

export function Capabilities() {
  return (
    <section className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-6 block font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
              The Roadmap
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
              One system.{" "}
              <span className="font-serif font-semibold text-primary italic">
                Every department.
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Built in stages with real hotels. Each version unlocks only after the last one
            is proven on the floor.
          </p>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {VERSIONS.map((v) => (
            <div
              key={v.id}
              className="group grid gap-2 py-6 transition-colors md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <span className="font-mono text-xs font-bold text-primary md:col-span-2">
                {v.id}
              </span>
              <h3 className="text-xl font-extrabold tracking-tight transition-colors group-hover:text-primary md:col-span-4">
                {v.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:col-span-6">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
