export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border px-6 pt-24 pb-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 inline-block animate-slide-up border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
          For Independent Indian Hotels
        </div>
        <h1 className="mb-8 animate-slide-up text-6xl font-extrabold leading-[0.9] tracking-tight text-balance [animation-delay:100ms] md:text-8xl">
          Your guest leads are{" "}
          <span className="font-serif font-semibold text-primary italic">dying</span> in
          WhatsApp.
        </h1>
        <p className="mb-12 max-w-2xl animate-slide-up text-xl leading-relaxed text-pretty text-muted-foreground [animation-delay:200ms] md:text-2xl">
          Indian hospitality happens on WhatsApp, but revenue is lost in the noise.
          HotelPipe turns every message into a structured pipeline. AI captured, human
          closed.
        </p>

        {/* The Pipeline Visual */}
        <div className="grid animate-slide-up gap-1 overflow-hidden rounded-xl border border-border bg-border [animation-delay:300ms] md:grid-cols-3">
          <div className="bg-background p-8">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              01 / Incoming
            </span>
            <div className="mt-6 space-y-3">
              <div className="rounded-lg border border-foreground/5 bg-muted p-3 text-sm">
                <p className="font-bold">Customer</p>
                <p className="italic">&ldquo;Namaste, room available for Dec 12?&rdquo;</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
                <p className="font-bold">HotelPipe AI</p>
                <p>
                  &ldquo;Namaste! Yes, Deluxe rooms are available at &#8377;4,500. May I
                  have your name?&rdquo;
                </p>
              </div>
            </div>
          </div>
          <div className="relative bg-background p-8">
            <div className="absolute top-0 left-0 hidden h-full w-px bg-border md:block" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              02 / Captured
            </span>
            <div className="mt-6">
              <div className="rounded border border-border bg-card p-4">
                <div className="mb-2 text-[10px] font-bold text-muted-foreground uppercase">
                  Lead Card Created
                </div>
                <div className="text-lg font-bold">Rahul Sharma</div>
                <div className="text-sm">+91 98765 43210</div>
                <div className="mt-2 inline-block rounded bg-tag px-2 py-0.5 text-[10px] font-bold text-tag-foreground uppercase">
                  Wedding Inquiry
                </div>
              </div>
            </div>
          </div>
          <div className="relative bg-background p-8">
            <div className="absolute top-0 left-0 hidden h-full w-px bg-border md:block" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              03 / Closing
            </span>
            <div className="mt-6">
              <a
                href="#pilot"
                className="flex w-full items-center justify-center gap-2 border-2 border-foreground py-4 font-bold transition-colors hover:bg-foreground hover:text-background"
              >
                Call to Confirm &rarr;
              </a>
              <p className="mt-4 text-center text-[10px] text-pretty text-muted-foreground italic">
                AI handles the 24/7 noise. You handle the relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
