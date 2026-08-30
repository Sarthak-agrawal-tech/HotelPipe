'use client';

import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
  LEAD_STATUSES,
  LeadStatus,
  LeadSource,
  type Lead,
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
      // Safely parse CSV status into uppercase Prisma enum format
      const rawStatus = (cols[3] || "NEW").toUpperCase();
      const status = LEAD_STATUSES.includes(rawStatus as LeadStatus) 
        ? (rawStatus as LeadStatus) 
        : LeadStatus.NEW;

      return {
        id: `L-${1042 + startIndex + i}`,
        name: cols[0] ?? "Unnamed lead",
        phone: cols[1] || "—",
        city: cols[2] || "—",
        source: LeadSource.EXCEL_IMPORT,
        status: status,
        createdAt: Date.now(),
      };
    });
}

export default function Dashboard() {
  const router = useRouter();
  const { getToken, isLoaded } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importNote, setImportNote] = useState<string | null>(null);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [featured, setFeatured] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        
        // 1. GATEKEEPER CHECK
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const hotelRes = await fetch(`${apiUrl}/api/hotels/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (hotelRes.status === 404) {
          router.push('/onboarding');
          return;
        }

        if (!hotelRes.ok) {
          throw new Error(`Gatekeeper failed: ${hotelRes.status}`);
        }

        // 2. FETCH REAL LEADS (Bypassing Next.js Cache)
        const leadsRes = await fetch(`${apiUrl}/api/leads`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store' 
        });
        
        if (!leadsRes.ok) throw new Error("Failed to fetch leads");
        const data = await leadsRes.json();
        
        const formattedLeads: Lead[] = data.map((l: any) => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          city: l.inquiryType || "—", 
          source: (l.source as LeadSource) || LeadSource.WHATSAPP,
          eventDate: l.eventDate ? new Date(l.eventDate).getTime() : null,
          guestCount: l.guestCount || null,
          note: l.notes || "",
          status: l.status as LeadStatus, // Strictly map to Prisma Enum
          createdAt: new Date(l.createdAt).getTime(), 
        }));

        setLeads(formattedLeads);
        if (formattedLeads.length > 0) {
          setFeatured(formattedLeads[0]);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [isLoaded, getToken, router]);

  // --- DYNAMIC METRICS CALCULATIONS ---

  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const todaysLeads = leads.filter((l) => l.createdAt >= startOfToday).length;

  const totalLeads = leads.length;
  // Use Prisma Enum to check for booked leads
  const bookedLeads = leads.filter((l) => l.status === LeadStatus.BOOKED).length;
  const conversion = totalLeads === 0 ? 0 : Math.round((bookedLeads / totalLeads) * 100);

  // Dynamically calculate the last 7 days of leads for the Bar Chart
  const dailySeries = useMemo(() => {
    const series = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setHours(0, 0, 0, 0);
      targetDate.setDate(targetDate.getDate() - i);
      
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = leads.filter(l => l.createdAt >= targetDate.getTime() && l.createdAt < nextDate.getTime()).length;
      
      series.push({
        label: i === 0 ? "Today" : targetDate.toLocaleDateString('en-US', { weekday: 'short' }),
        value: count
      });
    }
    return series;
  }, [leads]);

  const conversionSeries = useMemo(
    () => [
      { label: "Prev", value: conversion },
      { label: "Now", value: conversion }
    ],
    [conversion]
  );

  // --- SAVE LEAD TO BACKEND ---
  const addLead = async (lead: Lead) => {
    try {
      const token = await getToken();
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      const response = await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          city: lead.city, 
          status: lead.status,
          notes: lead.note, // Sending new fields
          eventDate: lead.eventDate,
          guestCount: lead.guestCount
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP Error ${response.status}`);
      }

      const savedLead = await response.json();

      const formattedNewLead: Lead = {
        id: savedLead.id,
        name: savedLead.name,
        phone: savedLead.phone,
        city: savedLead.inquiryType || "—",
        source: (savedLead.source as LeadSource) || LeadSource.WHATSAPP,
        eventDate: savedLead.eventDate ? new Date(savedLead.eventDate).getTime() : null,
        guestCount: savedLead.guestCount || null,
        note: savedLead.notes || "",
        status: savedLead.status as LeadStatus,
        createdAt: new Date(savedLead.createdAt).getTime(),
      };

      setLeads((prev) => [formattedNewLead, ...prev]);
      if (leads.length === 0) setFeatured(formattedNewLead);

    } catch (error: any) {
      console.error("❌ CRITICAL ERROR IN ADDLEAD:", error);
      alert(`Could not save lead: ${error.message}`);
    }
  };

  if(isLoading){
    return <div className="flex h-screen items-center justify-center font-sans text-foreground">Loading pipeline...</div>;
  }

  const handleImportCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(String(reader.result ?? ""), leads.length);
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

  const nextId = `L-${1042 + leads.length}`;

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
            <LineChart title="Conversion · current %" data={conversionSeries} />
          </div>

          <div className="space-y-5">
            {featured ? (
              <LeadStatusCard
                leadName={featured.name}
                leadCity={featured.city}
                status={featured.status}
                onStatusChange={async (newStatus) => {
                  setFeatured((f) => (f ? { ...f, status: newStatus } : null));
                  setLeads((prev) =>
                    prev.map((l) => (l.id === featured.id ? { ...l, status: newStatus } : l)),
                  );

                  try {
                    const token = await getToken();
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                    
                    const response = await fetch(`${apiUrl}/api/leads/${featured.id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({ status: newStatus })
                    });

                    if (!response.ok) {
                      throw new Error("Failed to sync status with database");
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Network error: Failed to save status change.");
                  }
                }}
              />
            ) : (
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