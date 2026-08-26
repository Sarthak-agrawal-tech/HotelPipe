import { Link } from "@tanstack/react-router";
import {
  X,
  LayoutDashboard,
  Users,
  Columns3,
  BellRing,
  FileUp,
  Settings,
  ArrowLeft,
} from "lucide-react";

const OPTIONS = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Users, label: "Leads Ledger", active: false },
  { icon: Columns3, label: "Pipeline Board", active: false },
  { icon: BellRing, label: "Follow-ups", active: false },
  { icon: FileUp, label: "Import & Export", active: false },
  { icon: Settings, label: "Settings", active: false },
];

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export function Drawer({ open, onClose }: DrawerProps) {
  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-sm bg-primary" />
            <span className="text-sm font-extrabold tracking-tighter">HOTELPIPE</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <p className="px-5 pt-5 pb-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Console
        </p>
        <nav className="flex-1 space-y-1 px-3">
          {OPTIONS.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back to website
          </Link>
          <p className="px-3 pt-3 font-mono text-[9px] tracking-[0.15em] text-muted-foreground/70 uppercase">
            Ledger v0.1 · Pilot build
          </p>
        </div>
      </aside>
    </>
  );
}
