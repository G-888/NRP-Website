import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminPanel } from "@/components/admin-panel";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminContent } from "@/lib/admin-content";
import { lawyers, services } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin panel tempatan untuk kandungan Nuaim Razak & Partners."
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/admin");
  }

  const content = await getAdminContent();
  const adminLawyers = lawyers.map((lawyer) => ({
    name: lawyer.name,
    role: lawyer.role,
    email: lawyer.email,
    image: lawyer.image,
    highlight: lawyer.highlight,
    practice: lawyer.practice,
    qualifications: lawyer.qualifications
  }));
  const adminServices = services.map((service) => ({
    title: service.title,
    description: service.description,
    details: service.details,
    labels: service.labels
  }));

  return (
    <main className="min-h-screen bg-ivory">
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-6 flex justify-end">
            <AdminLogoutButton />
          </div>
          <div className="mb-5 h-px w-16 bg-gold-450" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-700">Admin</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">Urus Kandungan Website</h1>
          <p className="mt-4 max-w-2xl leading-8 text-muted">
            Edit wording hero, upload sijil amalan dan simpan perubahan ke fail projek.
          </p>
        </div>
        <AdminPanel initialContent={content} lawyers={adminLawyers} services={adminServices} />
      </section>
    </main>
  );
}
