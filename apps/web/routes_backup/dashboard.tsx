import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Drawer } from "@/components/dashboard/Drawer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart } from "@/components/dashboard/BarChart";
import { LineChart } from "@/components/dashboard/LineChart";
import { LeadStatusCard } from "@/components/dashboard/LeadStatusCard";
import { LedgerPulse } from "@/components/dashboard/LedgerPulse";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { NewEntryDialog } from "@/components/dashboard/NewEntryDialog";
import {
  BASE_BOOKED_LEADS,
  BASE_TOTAL_LEADS,
  CONVERSION_BASE,
  DAILY_LEADS_BASE,
  LEAD_STATUSES,
  SEED_LEADS,
  type Lead,
  type LeadStatus,
} from "@/components/dashboard/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Leads Ledger — HotelPipe Dashboard" },
      {
        name: "description",
        content:
          "HotelPipe's leads ledger: daily leads, conversion rate, live booking status and the WhatsApp pipeline for an independent Indian hotel.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Leads Ledger — HotelPipe Dashboard" },
      {
        property: "og:description",
        content:
          "Daily leads, conversion rate and live booking status — the HotelPipe console for independent Indian hotels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const DAY = 86_400_000;

function parseCsv(text: string, startIndex: number): Lead[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(",").map((c) => c.trim()))
    .filter((cols) => cols.length >= 2 && cols[0] && cols[0].toLowerCase() !== "name")
    .map((cols, i): Lead => {
      const status = (cols[3] || "new").toLowerCase() as LeadStatus;
      return {
        id: `L-${1042 + startIndex + i}`,
        name: cols[0] ?? "Unnamed lead",
        phone: cols[1] || "—",
        city: cols[2] || "—",
        status: LEAD_STATUSES.includes(status) ? status : "new",
        createdAt: Date.now(),
      };
    });
}

function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importNote, setImportNote] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [featured, setFeatured] = useState<Lead>(SEED_LEADS[1] as Lead);

  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const todaysLeads = leads.filter((l) => l.createdAt >= startOfToday).length;

  const dailySeries = useMemo(
    () => [...DAILY_LEADS_BASE, { label: "Today", value: todaysLeads }],
    [todaysLeads],
  );

  const totalLeads = BASE_TOTAL_LEADS + leads.length;
  const bookedLeads =
    BASE_BOOKED_LEADS + leads.filter((l) => l.status === "booked").length;
  const conversion = Math.round((bookedLeads / totalLeads) * 100);

  const conversionSeries = useMemo(
    () => [...CONVERSION_BASE, { label: "Now", value: conversion }],
    [conversion],
  );

  const addLead = (lead: Lead) => setLeads((prev) => [lead, ...prev]);

  const handleImportCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(String(reader.result ?? ""), leads.length - SEED_LEADS.length);
      if (parsed.length > 0) {
        setLeads((prev) => [...parsed, ...prev]);
        setImportNote(`Imported ${parsed.length} lead${parsed.length === 1 ? "" : "s"}`);
        window.setTimeout(() => setImportNote(null), 4000);
      } else {
        setImportNote("No rows found — use name,phone,city,status");
        window.setTimeout(() => setImportNote(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  const nextId = `L-${1042 + (leads.length - SEED_LEADS.length)}`;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10">
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <DashboardHeader
        onMenu={() => setDrawerOpen(true)}
        onNewEntry={() => setDialogOpen(true)}
        onImportCsv={handleImportCsv}
        importNote={importNote}
      />

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Column 1 — daily leads + its graph */}
          <div className="space-y-5">
            <StatCard
              label="Daily leads"
              value={String(todaysLeads)}
              sub="New WhatsApp enquiries since midnight"
              accent={
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                  LIVE
                </span>
              }
            />
            <BarChart title="Leads · trailing 7 days" data={dailySeries} />
          </div>

          {/* Column 2 — conversion rate + its graph */}
          <div className="space-y-5">
            <StatCard
              label="Conversion rate"
              value={`${conversion}%`}
              sub={`${bookedLeads} booked of ${totalLeads} total leads`}
            />
            <LineChart title="Conversion · weekly %" data={conversionSeries} />
          </div>

          {/* Column 3 — booking status stepper + AI pulse */}
          <div className="space-y-5">
            <LeadStatusCard
              leadName={featured.name}
              leadCity={featured.city}
              status={featured.status}
              onStatusChange={(status) => {
                setFeatured((f) => ({ ...f, status }));
                setLeads((prev) =>
                  prev.map((l) => (l.id === featured.id ? { ...l, status } : l)),
                );
              }}
            />
            <LedgerPulse leads={leads} />
          </div>
        </div>

        <LeadsTable leads={leads} />
      </main>

      <NewEntryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={addLead}
        nextId={nextId}
      />
    </div>
  );
}
