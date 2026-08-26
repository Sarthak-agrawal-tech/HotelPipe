import { Menu, Plus, Upload } from "lucide-react";
import { useRef } from "react";

interface DashboardHeaderProps {
  onMenu: () => void;
  onNewEntry: () => void;
  onImportCsv: (file: File) => void;
  importNote: string | null;
}

export function DashboardHeader({
  onMenu,
  onNewEntry,
  onImportCsv,
  importNote,
}: DashboardHeaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="rounded-md border border-border p-2 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground uppercase">
              HotelPipe Console
            </p>
            <h1 className="text-base leading-tight font-extrabold tracking-tight">
              Leads Ledger
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {importNote && (
            <span className="hidden font-mono text-[10px] tracking-wide text-primary sm:block">
              {importNote}
            </span>
          )}
          <button
            onClick={onNewEntry}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">New entry</span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Upload size={15} />
            <span className="hidden sm:inline">Import from CSV</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImportCsv(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </header>
  );
}
