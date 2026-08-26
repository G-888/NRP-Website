import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminContent } from "@/lib/admin-content";
import { lawyers, services } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Pengurusan Laman",
  robots: { index: false, follow: false }
};

export default async function AdminPage() {
  const content = await getAdminContent();
  const baseServices = services.map(({ icon: _icon, ...service }) => service);
  const baseLawyers = lawyers.map(({ certificates, ...lawyer }) => ({ ...lawyer, certificates }));

  return <AdminDashboard initialContent={content} baseServices={baseServices} baseLawyers={baseLawyers} />;
}
