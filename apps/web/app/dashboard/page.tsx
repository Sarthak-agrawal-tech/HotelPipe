'use client';

import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchWithAuth } from "@/lib/api";

import { Drawer } from "@/components/dashboard/Drawer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart } from "@/components/dashboard/BarChart";
import { LineChart } from "@/components/dashboard/LineChart";
import { LeadStatusCard } from "@/components/dashboard/LeadStatusCard";
import { LedgerPulse } from "@/components/dashboard/LedgerPulse";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { NewEntryDialog } from "@/components/dashboard/NewEntryDialog";

// We will eventually replace this mock data with a fetch to your Express backend
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

export default function Dashboard() {
  const { getToken, isLoaded } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importNote, setImportNote] = useState<string | null>(null);
  
  // This state will soon be populated by your Express API
  const [leads, setLeads] = useState<Lead[]>([]);
  const [featured, setFeatured] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      if (!isLoaded) return;
      try {
        const data = await fetchWithAuth('/api/leads', getToken);
        
        // Map Prisma data to Lovable's expected format
        const formattedLeads: Lead[] = data.map((l: any) => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          city: l.inquiryType || "—", // Using inquiryType as a fallback for city
          status: l.status.toLowerCase() as LeadStatus,
          createdAt: new Date(l.createdAt).getTime(), // Convert ISO string to timestamp
        }));

        setLeads(formattedLeads);
        if (formattedLeads.length > 0) {
          setFeatured(formattedLeads[0]);
        }
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLeads();
  }, [isLoaded, getToken]);

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

  if(isLoading){
    return <div className="flex h-screen items-center justify-center font-sans text-foreground">Loading pipeline...</div>;
  }

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

          <div className="space-y-5">
            <StatCard
              label="Conversion rate"
              value={`${conversion}%`}
              sub={`${bookedLeads} booked of ${totalLeads} total leads`}
            />
            <LineChart title="Conversion · weekly %" data={conversionSeries} />
          </div>

          <div className="space-y-5">
            {/* Check if featured exists before rendering the card */}
            {featured ? (
              <LeadStatusCard
                leadName={featured.name}
                leadCity={featured.city}
                status={featured.status}
                onStatusChange={(status) => {
                  // TypeScript also needs f to be checked here
                  setFeatured((f) => (f ? { ...f, status } : null));
                  setLeads((prev) =>
                    prev.map((l) => (l.id === featured.id ? { ...l, status } : l)),
                  );
                }}
              />
            ) : (
              // Clean placeholder for when the pipeline is empty
              <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
                No active leads to display.
              </div>
            )}
            
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