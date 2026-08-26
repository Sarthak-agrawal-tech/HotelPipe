const AI_OWNS = [
  "Lead capture from WhatsApp, calls and walk-ins",
  "Instant replies, 24/7, in Hindi and English",
  "Day 1 / 3 / 7 follow-up sequences",
  "Outreach campaigns to planners and agents",
  "Proposals, analytics and morning reports",
];

const HUMAN_OWNS = [
  "The actual sales conversation",
  "Relationship closing for weddings and events",
  "High-stakes trust-building",
  "The final call that confirms the booking",
];

const SEQUENCE = [
  {
    day: "Day 1",
    message: "\u201CJust checking if you\u2019re still planning your stay.\u201D",
  },
  {
    day: "Day 3",
    message:
      "\u201CDates are filling up for December \u2014 shall I hold a slot?\u201D",
  },
  {
    day: "Day 7",
    message: "Final touchpoint before the lead is archived.",
  },
];

export function Philosophy() {
  return (
    <section id="how" className="scroll-mt-16 border-b border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <span className="mb-6 block font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
            The Philosophy
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            AI owns the noise.{" "}
            <span className="font-serif font-semibold text-primary italic">Humans</span>{" "}
            own the relationship.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Indian guests want a human for high-value bookings. HotelPipe never replaces
            the sales conversation &mdash; it makes sure no lead dies before that
            conversation happens.
          </p>
        </div>

        <div className="grid gap-1 overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2">
          <div className="bg-background p-8 md:p-10">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              HotelPipe AI owns
            </span>
            <ul className="mt-6 divide-y divide-border">
              {AI_OWNS.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3 text-sm">
                  <span className="size-1 shrink-0 bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background p-8 md:p-10">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              Your team owns
            </span>
            <ul className="mt-6 divide-y divide-border">
              {HUMAN_OWNS.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3 text-sm">
                  <span className="size-1 shrink-0 bg-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-1 grid gap-1 overflow-hidden rounded-b-xl border border-t-0 border-border bg-border md:grid-cols-3">
          {SEQUENCE.map((step) => (
            <div key={step.day} className="bg-card p-6">
              <span className="font-mono text-[10px] font-bold text-primary uppercase">
                {step.day} / Auto follow-up
              </span>
              <p className="mt-3 text-sm text-muted-foreground italic">{step.message}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          Sequences stop the moment the guest replies or the lead closes.
        </p>
      </div>
    </section>
  );
}
