import { X } from "lucide-react";
import { useState } from "react";
import { LEAD_STATUSES, STATUS_META, type Lead, type LeadStatus } from "./data";

interface NewEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  nextId: string;
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-ring/40";
const labelCls =
  "mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase";

export function NewEntryDialog({ open, onClose, onSave, nextId }: NewEntryDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<LeadStatus>("new");

  if (!open) return null;

  const canSave = name.trim().length > 0 && phone.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: nextId,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim() || "—",
      ...(note.trim() ? { note: note.trim() } : {}),
      status,
      createdAt: Date.now(),
    });
    setName("");
    setPhone("");
    setCity("");
    setNote("");
    setStatus("new");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              Ledger entry {nextId}
            </p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight">New entry</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className={labelCls} htmlFor="lead-name">Guest name</label>
            <input
              id="lead-name"
              className={inputCls}
              placeholder="e.g. Ananya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} htmlFor="lead-phone">WhatsApp no.</label>
              <input
                id="lead-phone"
                className={inputCls}
                placeholder="+91 …"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="lead-city">City</label>
              <input
                id="lead-city"
                className={inputCls}
                placeholder="Jaipur"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="lead-status">Status</label>
            <select
              id="lead-status"
              className={inputCls}
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="lead-note">Note (optional)</label>
            <textarea
              id="lead-note"
              className={`${inputCls} min-h-16 resize-none`}
              placeholder="Anniversary stay, 2 nights…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save entry
          </button>
        </div>
      </div>
    </div>
  );
}
