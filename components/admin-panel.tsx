"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import { Eye, EyeOff, ImagePlus, Plus, Save, Upload, X } from "lucide-react";
import type { AdminCertificate, AdminContent, AdminCustomLawyer, AdminCustomService, AdminHeroImage } from "@/lib/admin-content";

type AdminPanelProps = {
  initialContent: AdminContent;
  lawyers: Array<{
    name: string;
    role?: string;
    email?: string;
    image: string;
    highlight: string;
    practice: string;
    qualifications: string[];
  }>;
  services: Array<{
    title: string;
    description: string;
    details: string;
    labels: string[];
  }>;
};

type SaveState = "idle" | "saving" | "saved" | "error";
type Tab = "hero" | "services" | "lawyers" | "certificates";

export function AdminPanel({ initialContent, lawyers, services }: AdminPanelProps) {
  const [content, setContent] = useState(initialContent);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [tab, setTab] = useState<Tab>("hero");
  const [selectedLawyer, setSelectedLawyer] = useState(lawyers[0]?.name ?? "");
  const [selectedService, setSelectedService] = useState(services[0]?.title ?? "");
  const [certificateForm, setCertificateForm] = useState({
    negeri: "",
    title: "",
    file: null as File | null
  });
  const [heroImageForm, setHeroImageForm] = useState({
    label: "",
    alt: "",
    file: null as File | null
  });
  const [newLawyer, setNewLawyer] = useState<AdminCustomLawyer>({
    name: "",
    role: "Rakan Kongsi",
    image: "/images/blue-logo-nrp.png",
    email: "",
    highlight: "",
    practice: "",
    qualifications: []
  });
  const [newService, setNewService] = useState<AdminCustomService>({
    title: "",
    description: "",
    details: "",
    labels: [],
    iconKey: "document"
  });

  const allLawyers = [...lawyers, ...content.customLawyers];
  const allServices = [...services, ...content.customServices];
  const lawyer = allLawyers.find((item) => item.name === selectedLawyer) ?? allLawyers[0];
  const service = allServices.find((item) => item.title === selectedService) ?? allServices[0];
  const isCustomLawyer = content.customLawyers.some((item) => item.name === selectedLawyer);
  const isCustomService = content.customServices.some((item) => item.title === selectedService);
  const selectedCertificates = useMemo(
    () => content.certificates[selectedLawyer] ?? [],
    [content.certificates, selectedLawyer]
  );

  async function save(nextContent = content) {
    setSaveState("saving");
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextContent)
    });

    setSaveState(response.ok ? "saved" : "error");
  }

  function updateHero(field: keyof AdminContent["hero"], value: string | AdminHeroImage[]) {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [field]: value
      }
    }));
    setSaveState("idle");
  }

  function updateService(field: "description" | "details" | "labels", value: string) {
    if (!service) return;

    if (isCustomService) {
      setContent((current) => ({
        ...current,
        customServices: current.customServices.map((item) =>
          item.title === service.title
            ? {
                ...item,
                [field]: field === "labels" ? value.split(",").map((entry) => entry.trim()).filter(Boolean) : value
              }
            : item
        )
      }));
      setSaveState("idle");
      return;
    }

    setContent((current) => ({
      ...current,
      services: {
        ...current.services,
        [service.title]: {
          ...current.services[service.title],
          [field]: field === "labels" ? value.split(",").map((item) => item.trim()).filter(Boolean) : value
        }
      }
    }));
    setSaveState("idle");
  }

  function updateLawyer(field: "image" | "role" | "email" | "highlight" | "practice" | "qualifications", value: string) {
    if (!lawyer) return;

    if (isCustomLawyer) {
      setContent((current) => ({
        ...current,
        customLawyers: current.customLawyers.map((item) =>
          item.name === lawyer.name
            ? {
                ...item,
                [field]: field === "qualifications" ? value.split("\n").map((entry) => entry.trim()).filter(Boolean) : value
              }
            : item
        )
      }));
      setSaveState("idle");
      return;
    }

    setContent((current) => ({
      ...current,
      lawyers: {
        ...current.lawyers,
        [lawyer.name]: {
          ...current.lawyers[lawyer.name],
          [field]: field === "qualifications" ? value.split("\n").map((item) => item.trim()).filter(Boolean) : value
        }
      }
    }));
    setSaveState("idle");
  }

  async function uploadFile(file: File, folder: "images" | "certificates", name: string) {
    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("name", name);
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Upload failed");
    return (await response.json()) as { href: string; type: "image" | "pdf" };
  }

  async function handleHeroImageSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!heroImageForm.file) return;

    try {
      setSaveState("saving");
      const upload = await uploadFile(heroImageForm.file, "images", `hero-${heroImageForm.label || heroImageForm.file.name}`);
      const nextContent = {
        ...content,
        hero: {
          ...content.hero,
          images: [
            ...content.hero.images,
            {
              src: upload.href,
              alt: heroImageForm.alt || heroImageForm.label || "Hero image",
              label: heroImageForm.label || "Hero image"
            }
          ]
        }
      };
      setContent(nextContent);
      setHeroImageForm({ label: "", alt: "", file: null });
      await save(nextContent);
    } catch {
      setSaveState("error");
    }
  }

  async function uploadLawyerPhoto(event: ChangeEvent<HTMLInputElement>) {
    if (!lawyer || !event.target.files?.[0]) return;

    try {
      setSaveState("saving");
      const upload = await uploadFile(event.target.files[0], "images", `lawyer-${lawyer.name}`);
      const nextContent = {
        ...content,
        ...(isCustomLawyer
          ? {
              customLawyers: content.customLawyers.map((item) =>
                item.name === lawyer.name ? { ...item, image: upload.href } : item
              )
            }
          : {
              lawyers: {
                ...content.lawyers,
                [lawyer.name]: {
                  ...content.lawyers[lawyer.name],
                  image: upload.href
                }
              }
            })
      };
      setContent(nextContent);
      await save(nextContent);
    } catch {
      setSaveState("error");
    }
  }

  async function handleCertificateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedLawyer || !certificateForm.file) return;

    try {
      setSaveState("saving");
      const upload = await uploadFile(certificateForm.file, "certificates", `${selectedLawyer}-${certificateForm.negeri}-${certificateForm.title}`);
      const certificate: AdminCertificate = {
        negeri: certificateForm.negeri,
        title: certificateForm.title,
        href: upload.href,
        type: upload.type
      };

      const nextContent = {
        ...content,
        certificates: {
          ...content.certificates,
          [selectedLawyer]: [...(content.certificates[selectedLawyer] ?? []), certificate]
        }
      };

      setContent(nextContent);
      setCertificateForm({ negeri: "", title: "", file: null });
      await save(nextContent);
    } catch {
      setSaveState("error");
    }
  }

  async function removeCertificate(certificate: AdminCertificate) {
    const nextContent = {
      ...content,
      certificates: {
        ...content.certificates,
        [selectedLawyer]: selectedCertificates.filter((item) => item.href !== certificate.href)
      }
    };

    setContent(nextContent);
    await save(nextContent);
  }

  async function removeHeroImage(image: AdminHeroImage) {
    const nextContent = {
      ...content,
      hero: {
        ...content.hero,
        images: content.hero.images.filter((item) => item.src !== image.src)
      }
    };

    setContent(nextContent);
    await save(nextContent);
  }

  async function addLawyer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newLawyer.name) return;

    const nextContent = {
      ...content,
      customLawyers: [...content.customLawyers, newLawyer]
    };
    setContent(nextContent);
    setSelectedLawyer(newLawyer.name);
    setNewLawyer({
      name: "",
      role: "Rakan Kongsi",
      image: "/images/blue-logo-nrp.png",
      email: "",
      highlight: "",
      practice: "",
      qualifications: []
    });
    await save(nextContent);
  }

  async function removeLawyer(name: string) {
    const nextContent = {
      ...content,
      customLawyers: content.customLawyers.filter((item) => item.name !== name),
      certificates: Object.fromEntries(Object.entries(content.certificates).filter(([key]) => key !== name))
    };
    setContent(nextContent);
    setSelectedLawyer(lawyers[0]?.name ?? "");
    await save(nextContent);
  }

  async function toggleBaseLawyer(name: string) {
    const hidden = content.hiddenLawyers.includes(name);
    const nextContent = {
      ...content,
      hiddenLawyers: hidden ? content.hiddenLawyers.filter((item) => item !== name) : [...content.hiddenLawyers, name]
    };
    setContent(nextContent);
    await save(nextContent);
  }

  async function addService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newService.title) return;

    const nextContent = {
      ...content,
      customServices: [...content.customServices, newService]
    };
    setContent(nextContent);
    setSelectedService(newService.title);
    setNewService({ title: "", description: "", details: "", labels: [], iconKey: "document" });
    await save(nextContent);
  }

  async function removeService(title: string) {
    const nextContent = {
      ...content,
      customServices: content.customServices.filter((item) => item.title !== title)
    };
    setContent(nextContent);
    setSelectedService(services[0]?.title ?? "");
    await save(nextContent);
  }

  async function toggleBaseService(title: string) {
    const hidden = content.hiddenServices.includes(title);
    const nextContent = {
      ...content,
      hiddenServices: hidden ? content.hiddenServices.filter((item) => item !== title) : [...content.hiddenServices, title]
    };
    setContent(nextContent);
    await save(nextContent);
  }

  const lawyerOverride = lawyer ? content.lawyers[lawyer.name] ?? {} : {};
  const serviceOverride = service ? content.services[service.title] ?? {} : {};

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
        Admin ini menyimpan perubahan ke fail tempatan projek. Sesuai untuk pengurusan sendiri sebelum deploy. Jika deploy ke hosting seperti Vercel, perubahan fail mungkin tidak kekal tanpa CMS/database.
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["hero", "Hero"],
          ["services", "Bidang Amalan"],
          ["lawyers", "Peguam"],
          ["certificates", "Sijil Amalan"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value as Tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === value ? "bg-navy-900 text-white" : "border border-line bg-white text-ink hover:border-gold-450"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "hero" ? (
        <section className="rounded-[2rem] border border-line bg-white p-6 shadow-subtle">
          <h2 className="font-serif text-3xl font-semibold text-ink">Hero Homepage</h2>
          <div className="mt-6 grid gap-5">
            <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => updateHero("eyebrow", value)} />
            <TextArea label="H1 Title" rows={4} value={content.hero.title} onChange={(value) => updateHero("title", value)} helper="Setiap baris akan dipaparkan sebagai line break dalam hero." />
            <TextArea label="Paragraph" rows={5} value={content.hero.paragraph} onChange={(value) => updateHero("paragraph", value)} />
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white" type="button" onClick={() => save()}>
            <Save className="h-4 w-4" />
            Simpan Hero
          </button>

          <div className="mt-10 border-t border-line pt-8">
            <h3 className="font-semibold text-ink">Hero Images</h3>
            <form onSubmit={handleHeroImageSubmit} className="mt-4 grid gap-4 lg:grid-cols-3">
              <Field label="Label" value={heroImageForm.label} onChange={(value) => setHeroImageForm((current) => ({ ...current, label: value }))} required />
              <Field label="Alt text" value={heroImageForm.alt} onChange={(value) => setHeroImageForm((current) => ({ ...current, alt: value }))} />
              <FileInput label="Upload image" accept="image/*" onChange={(file) => setHeroImageForm((current) => ({ ...current, file }))} required />
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white lg:col-span-3" type="submit">
                <ImagePlus className="h-4 w-4" />
                Tambah Hero Image
              </button>
            </form>
            <div className="mt-5 grid gap-3">
              {content.hero.images.map((image) => (
                <ManagedRow key={image.src} title={image.label} subtitle={image.src} onRemove={() => removeHeroImage(image)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "services" && service ? (
        <section className="rounded-[2rem] border border-line bg-white p-6 shadow-subtle">
          <h2 className="font-serif text-3xl font-semibold text-ink">Bidang Amalan</h2>
          <Select label="Pilih service" value={selectedService} options={allServices.map((item) => item.title)} onChange={setSelectedService} />
          <div className="mt-6 grid gap-5">
            <TextArea label="Description" rows={3} value={serviceOverride.description ?? service.description} onChange={(value) => updateService("description", value)} />
            <TextArea label="Details" rows={4} value={serviceOverride.details ?? service.details} onChange={(value) => updateService("details", value)} />
            <Field label="Labels/tags, pisahkan dengan koma" value={(serviceOverride.labels ?? service.labels).join(", ")} onChange={(value) => updateService("labels", value)} />
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white" type="button" onClick={() => save()}>
            <Save className="h-4 w-4" />
            Simpan Service
          </button>
          {isCustomService ? (
            <button className="ml-3 mt-6 inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800" type="button" onClick={() => removeService(service.title)}>
              <X className="h-4 w-4" />
              Buang Service
            </button>
          ) : null}

          <div className="mt-10 border-t border-line pt-8">
            <h3 className="font-semibold text-ink">Tambah Service Baru</h3>
            <form onSubmit={addService} className="mt-4 grid gap-4">
              <Field label="Nama service" value={newService.title} onChange={(value) => setNewService((current) => ({ ...current, title: value }))} required />
              <TextArea label="Description" rows={3} value={newService.description} onChange={(value) => setNewService((current) => ({ ...current, description: value }))} />
              <TextArea label="Details" rows={4} value={newService.details} onChange={(value) => setNewService((current) => ({ ...current, details: value }))} />
              <Field label="Labels/tags, pisahkan dengan koma" value={newService.labels.join(", ")} onChange={(value) => setNewService((current) => ({ ...current, labels: value.split(",").map((item) => item.trim()).filter(Boolean) }))} />
              <Select label="Icon" value={newService.iconKey} options={["shield", "family", "marriage", "mediation", "estate", "document"]} onChange={(value) => setNewService((current) => ({ ...current, iconKey: value as AdminCustomService["iconKey"] }))} />
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white" type="submit">
                <Plus className="h-4 w-4" />
                Tambah Service
              </button>
            </form>
            <h3 className="mt-8 font-semibold text-ink">Show / Hide Service Asal</h3>
            <div className="mt-3 grid gap-2">
              {services.map((item) => {
                const hidden = content.hiddenServices.includes(item.title);
                return (
                  <button key={item.title} type="button" onClick={() => toggleBaseService(item.title)} className="flex items-center justify-between rounded-2xl border border-line bg-ivory p-4 text-left text-sm font-semibold text-ink">
                    {item.title}
                    {hidden ? <EyeOff className="h-4 w-4 text-muted" /> : <Eye className="h-4 w-4 text-gold-700" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "lawyers" && lawyer ? (
        <section className="rounded-[2rem] border border-line bg-white p-6 shadow-subtle">
          <h2 className="font-serif text-3xl font-semibold text-ink">Profil Peguam</h2>
          <Select label="Pilih peguam" value={selectedLawyer} options={allLawyers.map((item) => item.name)} onChange={setSelectedLawyer} />
          <div className="mt-6 grid gap-5">
            <Field label="Role" value={lawyerOverride.role ?? lawyer.role ?? "Rakan Kongsi"} onChange={(value) => updateLawyer("role", value)} />
            <Field label="Email" value={lawyerOverride.email ?? lawyer.email ?? ""} onChange={(value) => updateLawyer("email", value)} />
            <Field label="Highlight" value={lawyerOverride.highlight ?? lawyer.highlight} onChange={(value) => updateLawyer("highlight", value)} />
            <TextArea label="Practice text" rows={4} value={lawyerOverride.practice ?? lawyer.practice} onChange={(value) => updateLawyer("practice", value)} />
            <TextArea label="Qualifications, satu baris satu item" rows={6} value={(lawyerOverride.qualifications ?? lawyer.qualifications).join("\n")} onChange={(value) => updateLawyer("qualifications", value)} />
            <div>
              <p className="text-sm font-semibold text-ink">Current image</p>
              <p className="mt-1 break-all text-sm text-muted">{lawyerOverride.image ?? lawyer.image}</p>
              <input type="file" accept="image/*" onChange={uploadLawyerPhoto} className="mt-3 block w-full rounded-2xl border border-line bg-ivory/50 px-4 py-3 text-sm" />
            </div>
          </div>
          <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white" type="button" onClick={() => save()}>
            <Save className="h-4 w-4" />
            Simpan Peguam
          </button>
          {isCustomLawyer ? (
            <button className="ml-3 mt-6 inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800" type="button" onClick={() => removeLawyer(lawyer.name)}>
              <X className="h-4 w-4" />
              Buang Peguam
            </button>
          ) : null}

          <div className="mt-10 border-t border-line pt-8">
            <h3 className="font-semibold text-ink">Tambah Peguam Baru</h3>
            <form onSubmit={addLawyer} className="mt-4 grid gap-4">
              <Field label="Nama" value={newLawyer.name} onChange={(value) => setNewLawyer((current) => ({ ...current, name: value }))} required />
              <Field label="Role" value={newLawyer.role} onChange={(value) => setNewLawyer((current) => ({ ...current, role: value }))} />
              <Field label="Email" value={newLawyer.email ?? ""} onChange={(value) => setNewLawyer((current) => ({ ...current, email: value }))} />
              <Field label="Image path" value={newLawyer.image} onChange={(value) => setNewLawyer((current) => ({ ...current, image: value }))} />
              <Field label="Highlight" value={newLawyer.highlight} onChange={(value) => setNewLawyer((current) => ({ ...current, highlight: value }))} />
              <TextArea label="Practice text" rows={4} value={newLawyer.practice} onChange={(value) => setNewLawyer((current) => ({ ...current, practice: value }))} />
              <TextArea label="Qualifications, satu baris satu item" rows={5} value={newLawyer.qualifications.join("\n")} onChange={(value) => setNewLawyer((current) => ({ ...current, qualifications: value.split("\n").map((item) => item.trim()).filter(Boolean) }))} />
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white" type="submit">
                <Plus className="h-4 w-4" />
                Tambah Peguam
              </button>
            </form>
            <h3 className="mt-8 font-semibold text-ink">Show / Hide Peguam Asal</h3>
            <div className="mt-3 grid gap-2">
              {lawyers.map((item) => {
                const hidden = content.hiddenLawyers.includes(item.name);
                return (
                  <button key={item.name} type="button" onClick={() => toggleBaseLawyer(item.name)} className="flex items-center justify-between rounded-2xl border border-line bg-ivory p-4 text-left text-sm font-semibold text-ink">
                    {item.name}
                    {hidden ? <EyeOff className="h-4 w-4 text-muted" /> : <Eye className="h-4 w-4 text-gold-700" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "certificates" ? (
        <section className="rounded-[2rem] border border-line bg-white p-6 shadow-subtle">
          <h2 className="font-serif text-3xl font-semibold text-ink">Sijil Amalan</h2>
          <form onSubmit={handleCertificateSubmit} className="mt-6 grid gap-5 lg:grid-cols-2">
            <Select label="Peguam" value={selectedLawyer} options={allLawyers.map((item) => item.name)} onChange={setSelectedLawyer} />
            <Field label="Negeri" value={certificateForm.negeri} onChange={(value) => setCertificateForm((current) => ({ ...current, negeri: value }))} required />
            <Field label="Tajuk Sijil" value={certificateForm.title} onChange={(value) => setCertificateForm((current) => ({ ...current, title: value }))} required />
            <FileInput label="Gambar / PDF Sijil" accept="image/*,.pdf" onChange={(file) => setCertificateForm((current) => ({ ...current, file }))} required />
            <div className="lg:col-span-2">
              <button className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white" type="submit">
                <Upload className="h-4 w-4" />
                Upload & Simpan Sijil
              </button>
            </div>
          </form>

          <div className="mt-8 grid gap-3">
            {selectedCertificates.map((certificate) => (
              <ManagedRow key={certificate.href} title={`${certificate.negeri} - ${certificate.title}`} subtitle={certificate.href} onRemove={() => removeCertificate(certificate)} />
            ))}
            {!selectedCertificates.length ? <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">Belum ada sijil untuk peguam ini.</p> : null}
          </div>
        </section>
      ) : null}

      <p className="text-sm font-semibold text-muted">
        Status: {saveState === "idle" ? "Belum disimpan" : saveState === "saving" ? "Menyimpan..." : saveState === "saved" ? "Disimpan" : "Ralat simpan"}
      </p>
    </div>
  );
}

function ManagedRow({ title, subtitle, onRemove }: { title: string; subtitle: string; onRemove: () => void }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-ivory p-4 sm:flex-row sm:items-center">
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <a className="mt-1 inline-flex break-all text-sm font-semibold text-gold-700" href={subtitle} target="_blank" rel="noreferrer">
          {subtitle}
        </a>
      </div>
      <button className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink" type="button" onClick={onRemove}>
        <X className="h-4 w-4" />
        Buang
      </button>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-ivory/50 px-4 outline-none focus:border-gold-450">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, accept, onChange, required }: { label: string; accept: string; onChange: (file: File | null) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink">{label}</label>
      <input type="file" accept={accept} onChange={(event) => onChange(event.target.files?.[0] ?? null)} required={required} className="mt-2 block w-full rounded-2xl border border-line bg-ivory/50 px-4 py-3 text-sm" />
    </div>
  );
}

function TextArea({ label, value, onChange, rows, helper }: { label: string; value: string; onChange: (value: string) => void; rows: number; helper?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink">{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className="mt-2 w-full rounded-2xl border border-line bg-ivory/50 px-4 py-3 outline-none focus:border-gold-450" />
      {helper ? <p className="mt-2 text-xs text-muted">{helper}</p> : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-ink">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-ivory/50 px-4 outline-none focus:border-gold-450"
      />
    </div>
  );
}
