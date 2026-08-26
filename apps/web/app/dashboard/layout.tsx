import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads Ledger — HotelPipe Dashboard",
  description: "HotelPipe's leads ledger: daily leads, conversion rate, live booking status and the WhatsApp pipeline.",
  robots: "noindex", // Prevents Google from indexing the protected dashboard
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}