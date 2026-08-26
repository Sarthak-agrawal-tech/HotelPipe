import Image from "next/image";
import ledgerPhone from "../../assets/ledger-phone.jpg"

export function Audit() {
  return (
    <section id="problem" className="scroll-mt-16 bg-foreground px-6 py-24 text-background">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-extrabold tracking-tight uppercase">
              The Mystery Shopper Audit
            </h2>
            <p className="mb-8 text-lg text-background/60">
              In July 2026, we audited 7 independent hotels in North India. The results
              were a wake-up call for the industry.
            </p>

            <div className="space-y-8">
              <div className="flex items-end gap-4">
                <span className="text-7xl leading-none font-extrabold text-primary-light">
                  0/7
                </span>
                <p className="pb-2 text-sm font-bold tracking-widest uppercase">
                  Hotels followed up after initial inquiry
                </p>
              </div>
              <div className="flex items-end gap-4">
                <span className="text-7xl leading-none font-extrabold text-background">
                  5/7
                </span>
                <p className="pb-2 text-sm font-bold tracking-widest uppercase">
                  Never asked for the caller&rsquo;s name
                </p>
              </div>
              <div className="flex items-end gap-4">
                <span className="text-7xl leading-none font-extrabold text-primary-light">
                  &#8377;1L+
                </span>
                <p className="pb-2 text-sm font-bold tracking-widest uppercase">
                  Monthly sales spend with zero conversion tracking
                </p>
              </div>
            </div>
          </div>
          <div className="relative mt-10 md:mt-0">
            <Image
              src={ledgerPhone}
              alt="A handwritten hotel reservation ledger beside a smartphone running WhatsApp — where hotel sales actually live"
              loading="lazy"
              width={1024}
              height={768}
              className="aspect-square w-full rounded-2xl object-cover outline-1 -outline-offset-1 outline-background/10"
            />
            <div className="mt-6 max-w-[280px] bg-primary p-6 text-primary-foreground md:absolute md:-bottom-6 md:-left-6 md:mt-0">
              <p className="text-sm leading-tight font-bold italic">
                &ldquo;Indian hotels lose lakhs because sales live inside a staff
                member&rsquo;s personal WhatsApp.&rdquo;
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase opacity-80">
                &mdash; Sarthak Agrawal, Founder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
