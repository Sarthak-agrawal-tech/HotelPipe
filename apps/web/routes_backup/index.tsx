import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Audit } from "@/components/landing/Audit";
import { Philosophy } from "@/components/landing/Philosophy";
import { Capabilities } from "@/components/landing/Capabilities";
import { Markets } from "@/components/landing/Markets";
import { Pricing } from "@/components/landing/Pricing";
import { Founder } from "@/components/landing/Founder";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HotelPipe — AI Operating System for Indian Hotels" },
      {
        name: "description",
        content:
          "HotelPipe is the WhatsApp-first AI receptionist and CRM for independent Indian hotels. Capture every lead, automate follow-ups, and let your team close.",
      },
      {
        property: "og:title",
        content: "HotelPipe — AI Operating System for Indian Hotels",
      },
      {
        property: "og:description",
        content:
          "Your guest leads are dying in WhatsApp. HotelPipe turns every message into a structured pipeline — AI captured, human closed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10">
      <Nav />
      <main>
        <Hero />
        <Audit />
        <Philosophy />
        <Capabilities />
        <Markets />
        <Pricing />
        <Founder />
      </main>
      <Footer />
    </div>
  );
}
