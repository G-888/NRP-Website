"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);

    if (!response.ok) {
      setError("Kata laluan tidak sah.");
      return;
    }

    router.replace(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-line bg-white p-6 shadow-subtle sm:p-8">
      <div className="h-px w-14 bg-gold-450" />
      <h1 className="mt-5 font-serif text-4xl font-semibold text-ink">Admin Login</h1>
      <p className="mt-3 leading-7 text-muted">Masukkan kata laluan admin untuk mengurus kandungan website.</p>
      <label className="mt-6 block text-sm font-semibold text-ink" htmlFor="password">
        Kata laluan
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-ivory/50 px-4 outline-none focus:border-gold-450"
        required
        autoFocus
      />
      <button className="mt-6 min-h-12 w-full rounded-md bg-navy-900 px-5 text-sm font-semibold text-white transition hover:bg-navy-800" type="submit" disabled={loading}>
        {loading ? "Menyemak..." : "Masuk Admin"}
      </button>
      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p> : null}
    </form>
  );
}
