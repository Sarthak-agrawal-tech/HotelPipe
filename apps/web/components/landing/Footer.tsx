export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 md:flex-row">
        <div className="max-w-sm">
          <div className="mb-6 flex items-center gap-2">
            <div className="size-5 rounded-sm bg-primary" />
            <span className="text-lg font-extrabold tracking-tighter">HOTELPIPE</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Developed at VIT-AP by Sarthak Agrawal. Designed for the heart of Indian
            hospitality.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <h4 className="mb-6 text-[10px] font-bold tracking-widest uppercase">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#how" className="text-muted-foreground transition-colors hover:text-foreground">
                  AI Receptionist
                </a>
              </li>
              <li>
                <a href="#how" className="text-muted-foreground transition-colors hover:text-foreground">
                  Smart CRM
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-[10px] font-bold tracking-widest uppercase">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#problem" className="text-muted-foreground transition-colors hover:text-foreground">
                  Our Research
                </a>
              </li>
              <li>
                <a href="#pilot" className="text-muted-foreground transition-colors hover:text-foreground">
                  Book a Pilot
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@hotelpipe.in"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-7xl justify-between border-t border-border pt-8 font-mono text-[10px] text-muted-foreground uppercase">
        <span>&copy; 2026 HotelPipe Hospitality Tech</span>
        <span>Built in Prayagraj &amp; Vijayawada</span>
      </div>
    </footer>
  );
}
