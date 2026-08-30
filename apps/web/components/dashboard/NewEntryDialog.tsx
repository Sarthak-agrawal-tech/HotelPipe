'use client';

import { X } from "lucide-react";
import { useState } from "react";
import { LEAD_STATUSES, STATUS_META, LeadSource, type Lead, type LeadStatus } from "./data";

interface NewEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => Promise<void> | void;
  nextId: string;
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-ring/40";
const labelCls =
  "mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase";

const INQUIRY_TYPES = [
  "Wedding",
  "Corporate Event",
  "Conference",
  "Room Booking",
  "Birthday / Party",
  "General Inquiry"
];

export function NewEntryDialog({ open, onClose, onSave, nextId }: NewEntryDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [note, setNote] = useState("");
  
  const [source, setSource] = useState<LeadSource>(LeadSource.WHATSAPP);
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [status, setStatus] = useState<LeadStatus>("NEW" as LeadStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const canSave = name.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSubmitting(true);

    try {
      await onSave({
        id: nextId,
        name: name.trim(),
        phone: phone.trim() || "—",
        city: inquiryType, // Maps inquiry type to the existing 'city' property in the interface
        source: source,
        eventDate: eventDate ? new Date(eventDate).getTime() : null,
        guestCount: guestCount ? parseInt(guestCount, 10) : null,
        note: note.trim() || undefined,
        status,
        createdAt: Date.now(),
      });
      
      setName("");
      setPhone("");
      setInquiryType(INQUIRY_TYPES[0]);
      setNote("");
      setEventDate("");
      setGuestCount("");
      setSource(LeadSource.WHATSAPP);
      setStatus("NEW" as LeadStatus);
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              Ledger entry {nextId}
            </p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight">New entry</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Guest name *</label>
              <input className={inputCls} placeholder="e.g. Ananya Sharma" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp no.</label>
              <input className={inputCls} placeholder="+91 …" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Inquiry Type</label>
              <select className={inputCls} value={inquiryType} onChange={(e) => setInquiryType(e.target.value)}>
                {INQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Lead Source</label>
              <select className={inputCls} value={source} onChange={(e) => setSource(e.target.value as LeadSource)}>
                {Object.values(LeadSource).map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Event Date</label>
              <input type="date" className={inputCls} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Guest Count</label>
              <input type="number" min="1" className={inputCls} placeholder="e.g. 150" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Note (optional)</label>
            <textarea className={`${inputCls} min-h-16 resize-none`} placeholder="Special requests..." value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} disabled={isSubmitting} className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">Cancel</button>
          <button onClick={handleSave} disabled={!canSave || isSubmitting} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40">
            {isSubmitting ? "Saving..." : "Save entry"}
          </button>
        </div>
      </div>
    </div>
  );
}