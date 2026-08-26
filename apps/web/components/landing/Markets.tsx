const MARKETS = [
  {
    id: "M1",
    title: "Weddings & Events",
    desc: "Banquet inquiries, decorator and planner networks, AI-generated proposals with packages and venue photos.",
  },
  {
    id: "M2",
    title: "Pilgrimage Belt",
    desc: "Prayagraj, Varanasi, Haridwar. Group organizers, pandas and UP/Bihar travel agents \u2014 seasonal campaigns fire automatically before the rush.",
  },
  {
    id: "M3",
    title: "Corporate",
    desc: "HR managers, admin heads and executive assistants. Contract renewals tracked and re-engaged proactively.",
  },
  {
    id: "M4",
    title: "Hills & Tourism",
    desc: "Trekking groups, school trips and travel agents. Outreach switches on 6\u20138 weeks before your peak season.",
  },
];

export function Markets() {
  return (
    <section className="border-b border-border bg-muted px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <span className="mb-6 block font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
            One Product, Auto-Tailored
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            Configured to your{" "}
            <span className="font-serif font-semibold text-primary italic">market</span>{" "}
            on day one.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Answer 8&ndash;10 questions during onboarding. HotelPipe sets your templates,
            outreach targets, language and follow-up timing automatically.
          </p>
        </div>

        <div className="grid gap-1 overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
          {MARKETS.map((m) => (
            <div key={m.id} className="group bg-background p-8 md:p-10">
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                {m.id}
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight transition-colors group-hover:text-primary">
                {m.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
