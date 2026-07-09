import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login admin Nuaim Razak & Partners."
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense>
          <AdminLoginForm />
        </Suspense>
        <p className="mt-5 text-center text-xs leading-6 text-muted">
          Tetapkan `ADMIN_PASSWORD` dalam `.env.local` untuk menukar kata laluan.
        </p>
      </div>
    </main>
  );
}
