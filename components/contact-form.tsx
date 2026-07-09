"use client";

import { FormEvent, useState } from "react";
import { caseTypes } from "@/lib/site-data";

type FormState = "idle" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setState("error");
      form.reportValidity();
      return;
    }

    // TODO: Connect this form to an email/API provider such as Resend, Nodemailer, Formspree or an existing backend.
    form.reset();
    setState("success");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-line bg-white p-6 shadow-subtle sm:p-8">
      <div>
        <div className="h-px w-14 bg-gold-450" />
        <h2 className="mt-5 font-serif text-3xl font-semibold text-ink">Borang Temujanji</h2>
        <p className="mt-3 text-sm leading-7 text-muted">Lengkapkan maklumat ringkas untuk dihubungi semula oleh pihak firma.</p>
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
      </div>
      <label className="flex gap-3 text-sm leading-6 text-muted">
        <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-line text-gold-550" />
        Saya bersetuju untuk dihubungi oleh pihak Nuaim Razak & Partners berkenaan pertanyaan ini.
      </label>
      <button className="focus-ring min-h-12 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-subtle transition hover:bg-navy-800" type="submit">
        Hantar Pertanyaan
      </button>
      {state === "success" ? (
        <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          Terima kasih. Pertanyaan anda telah direkodkan di borang ini. Integrasi penghantaran email masih perlu disambungkan.
        </p>
      ) : null}
      {state === "error" ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
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
