"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { caseTypes } from "@/lib/site-data";

type FormState = "idle" | "error";

export function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [state, setState] = useState<FormState>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setState("error");
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const preferredDate = String(data.get("preferredDate") || "Belum ditetapkan");
    const message = [
      "Assalamualaikum, saya ingin membuat pertanyaan guaman Syarie.",
      "",
      `Nama: ${String(data.get("name") || "")}`,
      `No. telefon: ${String(data.get("phone") || "")}`,
      `Email: ${String(data.get("email") || "")}`,
      `Jenis kes: ${String(data.get("caseType") || "")}`,
      `Tarikh pilihan: ${preferredDate}`,
      "",
      "Ringkasan isu:",
      String(data.get("message") || "")
    ].join("\n");

    window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-line bg-white p-6 shadow-subtle sm:p-8">
      <div>
        <div className="h-px w-14 bg-gold-450" />
        <h2 className="mt-5 font-serif text-3xl font-semibold text-ink">Borang Temujanji</h2>
        <p className="mt-3 text-sm leading-7 text-muted">Lengkapkan maklumat ringkas untuk memulakan pertanyaan melalui WhatsApp.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama penuh" name="name" required autoComplete="name" />
        <Field label="No. telefon" name="phone" type="tel" required autoComplete="tel" />
      </div>
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="caseType">
          Jenis kes
        </label>
        <select
          id="caseType"
          name="caseType"
          required
          className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-ivory/50 px-4 text-ink outline-none transition focus:border-gold-450 focus:bg-white"
        >
          <option value="">Pilih jenis kes</option>
          {caseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <Field label="Tarikh temujanji pilihan" name="preferredDate" type="date" />
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="message">
          Ringkasan isu
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-2 w-full rounded-2xl border border-line bg-ivory/50 px-4 py-3 text-ink outline-none transition focus:border-gold-450 focus:bg-white"
        />
        <p className="mt-2 text-xs leading-5 text-muted">Berikan ringkasan sahaja. Elakkan memasukkan nombor pengenalan atau dokumen sulit pada peringkat ini.</p>
      </div>
      <label className="flex gap-3 text-sm leading-6 text-muted">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-line text-gold-550" />
        <span>
          Saya bersetuju untuk dihubungi oleh pihak Nuaim Razak & Partners dan telah membaca{" "}
          <Link href="/dasar-privasi" className="font-semibold text-gold-700 underline underline-offset-2">
            Dasar Privasi
          </Link>
          .
        </span>
      </label>
      <button className="focus-ring min-h-12 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-subtle transition hover:bg-navy-800" type="submit">
        Teruskan ke WhatsApp
      </button>
      {state === "error" ? (
        <p role="alert" aria-live="assertive" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          Sila lengkapkan maklumat yang diperlukan sebelum menghantar pertanyaan.
        </p>
      ) : null}
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
};

function Field({ label, name, type = "text", required, autoComplete }: FieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-ivory/50 px-4 text-ink outline-none transition focus:border-gold-450 focus:bg-white"
      />
    </div>
  );
}
