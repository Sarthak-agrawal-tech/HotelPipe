const PLANS = [
  {
    name: "Starter",
    price: "\u20B94,999",
    features: ["AI Receptionist V1", "Up to 100 leads/mo", "WhatsApp Integration"],
    cta: "Choose Starter",
    featured: false,
  },
  {
    name: "Growth",
    price: "\u20B99,999",
    features: [
      "Automated AI Follow-up",
      "Up to 500 leads/mo",
      "Staff Dashboards",
      "Advanced CRM",
    ],
    cta: "Start Growth Pilot",
    featured: true,
  },
  {
    name: "Scale",
    price: "\u20B919,999",
    features: ["Outreach Engine", "Unlimited leads", "Multi-property Admin"],
    cta: "Contact Sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 px-6 py-32">
      <div className="mx-auto mb-20 max-w-7xl text-center">
        <h2 className="mb-4 text-5xl font-extrabold tracking-tighter">
          Simple. Scalable. Honest.
        </h2>
        <p className="text-muted-foreground">
          Built for the Indian market. Pricing in &#8377; only.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.featured
                ? "relative flex flex-col border-2 border-foreground p-10"
                : "group flex flex-col border border-border p-10 transition-colors hover:border-foreground"
            }
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground px-3 py-1 text-[10px] font-bold tracking-widest text-background uppercase">
                Most Popular
              </div>
            )}
            <span
              className={
                plan.featured
                  ? "mb-2 text-[10px] font-bold tracking-widest text-primary uppercase"
                  : "mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
              }
            >
              {plan.name}
            </span>
            <div className="mb-8 text-4xl font-extrabold">
              {plan.price}
              <span className="text-sm font-normal text-muted-foreground">/month</span>
            </div>
            <ul
              className={
                plan.featured
                  ? "mb-12 flex-grow space-y-4 text-sm"
                  : "mb-12 flex-grow space-y-4 text-sm text-muted-foreground"
              }
            >
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="size-1 shrink-0 bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#pilot"
              className={
                plan.featured
                  ? "w-full bg-foreground py-3 text-center font-bold text-background transition-all"
                  : "w-full border border-border py-3 text-center font-bold transition-all group-hover:bg-foreground group-hover:text-background"
              }
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        Enterprise &mdash; custom pricing for hotel chains and white-label deployments.
      </p>
    </section>
  );
}
