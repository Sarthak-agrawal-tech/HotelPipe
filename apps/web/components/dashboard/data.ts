export const LEAD_STATUSES = [
  "new",
  "interested",
  "waiting",
  "follow up due",
  "booked",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: LeadStatus;
  createdAt: number;
  note?: string;
}

export const STATUS_META: Record<
  LeadStatus,
  { label: string; pill: string; dot: string }
> = {
  new: {
    label: "New",
    pill: "border border-border bg-secondary text-secondary-foreground",
    dot: "bg-foreground/60",
  },
  interested: {
    label: "Interested",
    pill: "border border-primary/30 bg-primary/10 text-primary",
    dot: "bg-primary-light",
  },
  waiting: {
    label: "Waiting",
    pill: "border border-border bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/50",
  },
  "follow up due": {
    label: "Follow-up due",
    pill: "border border-transparent bg-tag text-tag-foreground",
    dot: "bg-tag-foreground",
  },
  booked: {
    label: "Booked",
    pill: "border border-transparent bg-primary text-primary-foreground",
    dot: "bg-primary",
  },
  lost: {
    label: "Lost",
    pill: "border border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

const DAY = 86_400_000;
const daysAgo = (n: number) => Date.now() - n * DAY;

export const SEED_LEADS: Lead[] = [
  { id: "L-1041", name: "Ananya Sharma", phone: "+91 98220 41108", city: "Jaipur", status: "booked", createdAt: daysAgo(0), note: "Anniversary stay, 2 nights" },
  { id: "L-1040", name: "Rohan Mehta", phone: "+91 98110 23471", city: "Udaipur", status: "interested", createdAt: daysAgo(0), note: "Wedding party, 40 pax" },
  { id: "L-1039", name: "Fatima Sheikh", phone: "+91 99870 55214", city: "Goa", status: "follow up due", createdAt: daysAgo(0), note: "Asked for sea-view quote" },
  { id: "L-1038", name: "Vikram Reddy", phone: "+91 90000 81233", city: "Hyderabad", status: "new", createdAt: daysAgo(0) },
  { id: "L-1037", name: "Priyanka Nair", phone: "+91 98460 77120", city: "Kochi", status: "waiting", createdAt: daysAgo(1), note: "Sent rate card on WhatsApp" },
  { id: "L-1036", name: "Arjun Malhotra", phone: "+91 98100 34982", city: "Manali", status: "booked", createdAt: daysAgo(1), note: "Corporate offsite, 12 rooms" },
  { id: "L-1035", name: "Sneha Kulkarni", phone: "+91 98901 45567", city: "Pune", status: "lost", createdAt: daysAgo(2), note: "Chose OYO listing" },
  { id: "L-1034", name: "Kabir Singh Rathore", phone: "+91 94140 28815", city: "Jodhpur", status: "interested", createdAt: daysAgo(2), note: "Heritage suite enquiry" },
  { id: "L-1033", name: "Lakshmi Iyer", phone: "+91 98410 90345", city: "Chennai", status: "follow up due", createdAt: daysAgo(3), note: "Awaiting advance payment" },
  { id: "L-1032", name: "Devang Patel", phone: "+91 98250 61178", city: "Ahmedabad", status: "waiting", createdAt: daysAgo(4) },
];

/** Historical pipeline base so the demo numbers feel real before today's activity. */
export const BASE_TOTAL_LEADS = 38;
export const BASE_BOOKED_LEADS = 11;

/** Daily leads for the trailing 6 days (today is computed live and appended). */
export const DAILY_LEADS_BASE = [
  { label: "6d", value: 5 },
  { label: "5d", value: 9 },
  { label: "4d", value: 6 },
  { label: "3d", value: 8 },
  { label: "2d", value: 4 },
  { label: "1d", value: 7 },
];

/** Weekly conversion-rate history in percent; the live week is appended. */
export const CONVERSION_BASE = [
  { label: "W1", value: 14 },
  { label: "W2", value: 18 },
  { label: "W3", value: 16 },
  { label: "W4", value: 22 },
  { label: "W5", value: 21 },
  { label: "W6", value: 26 },
];
