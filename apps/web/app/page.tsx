import type { Metadata } from "next";

// You will need to move these components from Lovable into your Next.js project
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Audit } from "@/components/landing/Audit";
import { Philosophy } from "@/components/landing/Philosophy";
import { Capabilities } from "@/components/landing/Capabilities";
import { Markets } from "@/components/landing/Markets";
import { Pricing } from "@/components/landing/Pricing";
import { Founder } from "@/components/landing/Founder";
import { Footer } from "@/components/landing/Footer";

// Next.js handles SEO and head tags using this exported metadata object
export const metadata: Metadata = {
  title: "HotelPipe — AI Operating System for Indian Hotels",
  description:
    "HotelPipe is the WhatsApp-first AI receptionist and CRM for independent Indian hotels. Capture every lead, automate follow-ups, and let your team close.",
  openGraph: {
    title: "HotelPipe — AI Operating System for Indian Hotels",
    description:
      "Your guest leads are dying in WhatsApp. HotelPipe turns every message into a structured pipeline — AI captured, human closed.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function HomePage() {
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