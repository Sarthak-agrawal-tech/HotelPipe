export enum LeadStatus {
  NEW = "NEW",
  INTERESTED = "INTERESTED",
  WAITING = "WAITING",
  FOLLOWUP_DUE = "FOLLOWUP_DUE",
  BOOKED = "BOOKED",
  LOST = "LOST"
}

export enum LeadSource {
  WHATSAPP = "WHATSAPP",
  CALL = "CALL",
  WALKIN = "WALKIN",
  EXCEL_IMPORT = "EXCEL_IMPORT"
}
export const LEAD_STATUSES = Object.values(LeadStatus);

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string; // UI uses this name, maps to Prisma's 'inquiryType'
  source: LeadSource;
  eventDate?: number | null; 
  guestCount?: number | null;
  note?: string | null; // Maps to Prisma's 'notes'
  status: LeadStatus;
  createdAt: number;
}
export const STATUS_META: Record<
  LeadStatus,
  { label: string; pill: string; dot: string }
> = {
  NEW: {
    label: "New",
    pill: "border border-border bg-secondary text-secondary-foreground",
    dot: "bg-foreground/60",
  },
  INTERESTED: {
    label: "Interested",
    pill: "border border-primary/30 bg-primary/10 text-primary",
    dot: "bg-primary-light",
  },
  WAITING: {
    label: "Waiting",
    pill: "border border-border bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/50",
  },
  FOLLOWUP_DUE: {
    label: "Follow-up due",
    pill: "border border-transparent bg-tag text-tag-foreground",
    dot: "bg-tag-foreground",
  },
  BOOKED: {
    label: "Booked",
    pill: "border border-transparent bg-primary text-primary-foreground",
    dot: "bg-primary",
  },
  LOST: {
    label: "Lost",
    pill: "border border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};