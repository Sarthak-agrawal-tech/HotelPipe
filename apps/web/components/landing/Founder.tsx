export function Founder() {
  return (
    <>
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-8 block font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
            Built in the field
          </span>
          <blockquote className="mb-8 font-serif text-2xl leading-relaxed text-pretty italic md:text-3xl">
            &ldquo;Indian hospitality isn&rsquo;t failing because of service &mdash;
            it&rsquo;s failing because of fragmented communication. I&rsquo;m building
            HotelPipe so every &lsquo;Namaste&rsquo; on WhatsApp turns into a guest at
            your front desk.&rdquo;
          </blockquote>
          <p className="font-extrabold tracking-tight">Sarthak Agrawal</p>
          <p className="mt-1 text-sm text-muted-foreground">Founder, HotelPipe</p>
          <p className="mt-4 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            B.Tech CSE, VIT-AP University &middot; Piloting at Rama Continental,
            Prayagraj
          </p>
        </div>
      </section>

      <section id="pilot" className="scroll-mt-16 bg-foreground px-6 py-24 text-background">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-balance md:text-6xl">
            Stop losing leads in{" "}
            <span className="font-serif font-semibold text-primary-light italic">
              WhatsApp.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-background/60">
            We&rsquo;re onboarding a small batch of independent hotels for the Winter 2026
            pilot. Personally configured, live in days.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hello@hotelpipe.in?subject=HotelPipe%20Pilot%20Request"
              className="rounded-full bg-background px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Book a Pilot
            </a>
            <span className="font-mono text-[10px] tracking-widest text-background/50 uppercase">
              Limited slots &middot; Tier-2 North India first
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
