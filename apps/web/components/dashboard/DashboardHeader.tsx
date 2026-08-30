import { Menu, Plus, Upload, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenu}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-mono text-sm font-semibold tracking-wide uppercase">
          Ledger
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {importNote && (
          <span className="hidden text-xs text-muted-foreground sm:inline-block">
            {importNote}
          </span>
        )}

        <input
          type="file"
          accept=".csv"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImportCsv(file);
              e.target.value = ""; // Reset so they can import again
            }
          }}
        />


        
        <button
          onClick={onNewEntry}
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New entry</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="hidden items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted sm:flex"
        >
          <Upload size={16} />
          Import
        </button>

        <Link 
          href="/dashboard/settings"
          className="flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Hotel Settings"
        >
          <Settings size={18} />
        </Link>

        <div className="ml-2 flex items-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
}