"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  History,
  ImageUp,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Save,
  Scale,
  Settings,
  Trash2,
  Users,
  X
} from "lucide-react";
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import type {
  AdminBlogPost,
  AdminContent,
  AdminFaq,
  AdminPageKey,
  AdminWhyItem
} from "@/lib/admin-content";
import { normalizeAdminContent } from "@/lib/admin-content";

type BaseService = {
  title: string;
  slug: string;
  description: string;
  details: string;
  labels: string[];
};

type BaseLawyer = {
  name: string;
  role: string;
  image: string;
  email?: string;
  highlight: string;
  qualifications: string[];
  practice: string;
  certificates: Array<{ negeri: string; title: string; href: string; type: "image" | "pdf" }>;
};

type AdminDashboardProps = {
  initialContent: AdminContent;
  baseServices: BaseService[];
  baseLawyers: BaseLawyer[];
};

type Tab = "overview" | "general" | "home" | "pages" | "services" | "lawyers" | "articles" | "faq";
type ApiState = "checking" | "setup" | "signed-out" | "signed-in" | "unavailable";
type Notice = { tone: "success" | "error" | "info"; message: string } | null;
type AuditEntry = { id: number; action: string; detail: string; created_at: string; username: string };

const tabs: Array<{ id: Tab; label: string; icon: typeof Settings }> = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "general", label: "Maklumat firma", icon: Building2 },
  { id: "home", label: "Laman utama", icon: Settings },
  { id: "pages", label: "Halaman", icon: FileText },
  { id: "services", label: "Bidang amalan", icon: BriefcaseBusiness },
  { id: "lawyers", label: "Peguam", icon: Users },
  { id: "articles", label: "Artikel", icon: BookOpenText },
  { id: "faq", label: "Soalan lazim", icon: CircleHelp }
];

const pageLabels: Record<AdminPageKey, string> = {
  about: "Tentang Kami",
  services: "Bidang Amalan",
  lawyers: "Peguam",
  articles: "Artikel",
  contact: "Hubungi Kami",
  appointment: "Temujanji",
  privacy: "Dasar Privasi"
};

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { credentials: "same-origin", ...options });
  const payload = (await response.json().catch(() => null)) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(payload?.error || `Permintaan gagal (${response.status})`);
  return payload as T;
}

export function AdminDashboard({ initialContent, baseServices, baseLawyers }: AdminDashboardProps) {
  const [apiState, setApiState] = useState<ApiState>("checking");
  const [content, setContent] = useState(() => deepClone(initialContent));
  const [savedContent, setSavedContent] = useState(() => deepClone(initialContent));
  const [csrf, setCsrf] = useState("");
  const [username, setUsername] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [history, setHistory] = useState<AuditEntry[]>([]);

  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(savedContent), [content, savedContent]);

  const loadContent = useCallback(async (token: string) => {
    const response = await apiRequest<{ content: Partial<AdminContent> }>("/api/content.php");
    const normalized = normalizeAdminContent(response.content);
    setContent(deepClone(normalized));
    setSavedContent(deepClone(normalized));
    setCsrf(token);
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const response = await apiRequest<{ entries: AuditEntry[] }>("/api/history.php");
      setHistory(response.entries);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest<{ authenticated: boolean; setupRequired?: boolean; csrf?: string; user?: { username: string } }>("/api/auth.php")
      .then(async (status) => {
        if (!active) return;
        if (status.setupRequired) {
          setApiState("setup");
          return;
        }
        if (!status.authenticated || !status.csrf) {
          setApiState("signed-out");
          return;
        }
        setUsername(status.user?.username || "Admin");
        await loadContent(status.csrf);
        if (active) {
          setApiState("signed-in");
          void loadHistory();
        }
      })
      .catch(() => active && setApiState("unavailable"));
    return () => { active = false; };
  }, [loadContent, loadHistory]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await apiRequest<{ csrf: string; user: { username: string } }>("/api/auth.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") })
      });
      setUsername(response.user.username);
      await loadContent(response.csrf);
      setApiState("signed-in");
      void loadHistory();
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Log masuk gagal." });
    } finally {
      setBusy(false);
    }
  }

  async function setup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (password !== String(form.get("confirmPassword") || "")) {
      setNotice({ tone: "error", message: "Pengesahan kata laluan tidak sepadan." });
      setBusy(false);
      return;
    }
    try {
      await apiRequest("/api/setup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupKey: form.get("setupKey"), username: form.get("username"), password })
      });
      setNotice({ tone: "success", message: "Akaun admin berjaya dicipta. Sila log masuk." });
      setApiState("signed-out");
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Pemasangan gagal." });
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await apiRequest("/api/auth.php", { method: "DELETE", headers: { "X-CSRF-Token": csrf } });
    } finally {
      setApiState("signed-out");
      setCsrf("");
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    setNotice({ tone: "info", message: "Menerbitkan perubahan ke GitHub..." });
    try {
      await apiRequest("/api/content.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({ content, message: `Update website content by ${username}` })
      });
      setSavedContent(deepClone(content));
      setNotice({ tone: "success", message: "Perubahan diterbitkan. Hostinger sedang membina versi baharu." });
      void loadHistory();
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Penerbitan gagal." });
    } finally {
      setBusy(false);
    }
  }

  async function reload() {
    if (dirty && !window.confirm("Buang perubahan yang belum diterbitkan?")) return;
    setBusy(true);
    try {
      await loadContent(csrf);
      setNotice({ tone: "success", message: "Kandungan dimuat semula daripada GitHub." });
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Muat semula gagal." });
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    const response = await apiRequest<{ path: string }>("/api/upload.php", {
      method: "POST",
      headers: { "X-CSRF-Token": csrf },
      body: form
    });
    setNotice({ tone: "success", message: "Imej dimuat naik. Terbitkan kandungan untuk menggunakannya." });
    return response.path;
  }

  if (apiState === "checking") return <StatusScreen icon={<LoaderCircle className="h-7 w-7 animate-spin" />} title="Memeriksa sesi admin" />;
  if (apiState === "unavailable") return <UnavailableScreen />;
  if (apiState === "setup") return <SetupScreen busy={busy} notice={notice} onSubmit={setup} />;
  if (apiState === "signed-out") return <LoginScreen busy={busy} notice={notice} onSubmit={login} />;

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center border border-slate-200 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Buka navigasi">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-bold text-[#0a1d2e]">NRP Website</p>
              <p className="text-xs text-slate-500">Pengurusan kandungan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`hidden text-xs font-semibold sm:inline ${dirty ? "text-amber-700" : "text-emerald-700"}`}>{dirty ? "Belum diterbitkan" : "Semua perubahan disimpan"}</span>
            <button type="button" onClick={reload} disabled={busy} className="admin-icon-button" title="Muat semula"><RefreshCw className="h-4 w-4" /></button>
            <button type="button" onClick={publish} disabled={busy || !dirty} className="inline-flex min-h-10 items-center gap-2 bg-[#0a1d2e] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45">
              {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Terbitkan
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className={`${menuOpen ? "fixed inset-0 z-40 block bg-black/30" : "hidden"} lg:static lg:block lg:bg-transparent`} onClick={() => setMenuOpen(false)}>
          <div className="h-full w-[280px] border-r border-slate-200 bg-white p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-auto" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <strong>Menu</strong><button className="admin-icon-button" onClick={() => setMenuOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <nav className="space-y-1" aria-label="Bahagian admin">
              {tabs.map((item) => {
                const Icon = item.icon;
                return <button key={item.id} type="button" onClick={() => { setTab(item.id); setMenuOpen(false); }} className={`flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm font-semibold ${tab === item.id ? "bg-[#0a1d2e] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}><Icon className="h-4 w-4" />{item.label}</button>;
              })}
            </nav>
            <div className="absolute bottom-4 left-4 right-4 border-t border-slate-200 pt-4">
              <p className="truncate px-2 text-xs text-slate-500">Log masuk sebagai <strong>{username}</strong></p>
              <button type="button" onClick={logout} className="mt-2 flex min-h-10 w-full items-center gap-3 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"><LogOut className="h-4 w-4" />Log keluar</button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-6 lg:p-8">
          {notice ? <NoticeBar notice={notice} onClose={() => setNotice(null)} /> : null}
          {tab === "overview" ? <Overview content={content} history={history} setTab={setTab} /> : null}
          {tab === "general" ? <GeneralEditor content={content} setContent={setContent} /> : null}
          {tab === "home" ? <HomeEditor content={content} setContent={setContent} uploadImage={uploadImage} /> : null}
          {tab === "pages" ? <PagesEditor content={content} setContent={setContent} uploadImage={uploadImage} /> : null}
          {tab === "services" ? <ServicesEditor content={content} setContent={setContent} baseServices={baseServices} /> : null}
          {tab === "lawyers" ? <LawyersEditor content={content} setContent={setContent} baseLawyers={baseLawyers} uploadImage={uploadImage} /> : null}
          {tab === "articles" ? <ArticlesEditor content={content} setContent={setContent} uploadImage={uploadImage} /> : null}
          {tab === "faq" ? <FaqEditor content={content} setContent={setContent} /> : null}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ busy, notice, onSubmit }: { busy: boolean; notice: Notice; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="flex min-h-screen items-center justify-center bg-[#071827] p-4"><div className="w-full max-w-md bg-white p-7 shadow-2xl sm:p-9"><Image src="/images/blue-logo-nrp.png" alt="Nuaim Razak & Partners" width={160} height={54} className="h-12 w-auto" priority /><div className="mt-8 border-t border-slate-200 pt-7"><h1 className="text-2xl font-bold text-[#0a1d2e]">Log masuk admin</h1><p className="mt-2 text-sm leading-6 text-slate-600">Gunakan akaun pentadbir laman web.</p></div>{notice ? <div className="mt-5"><NoticeBar notice={notice} /></div> : null}<form onSubmit={onSubmit} className="mt-6 space-y-5"><Field label="Nama pengguna" name="username" autoComplete="username" required /><Field label="Kata laluan" name="password" type="password" autoComplete="current-password" required /><button disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 bg-[#0a1d2e] px-5 font-semibold text-white disabled:opacity-50">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Log masuk</button></form><Link href="/" className="mt-6 block text-center text-sm font-semibold text-slate-600 hover:text-[#0a1d2e]">Kembali ke laman web</Link></div></div>;
}

function SetupScreen({ busy, notice, onSubmit }: { busy: boolean; notice: Notice; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="flex min-h-screen items-center justify-center bg-[#071827] p-4"><div className="w-full max-w-xl bg-white p-7 shadow-2xl sm:p-9"><Image src="/images/blue-logo-nrp.png" alt="Nuaim Razak & Partners" width={160} height={54} className="h-12 w-auto" priority /><div className="mt-8 border-t border-slate-200 pt-7"><h1 className="text-2xl font-bold text-[#0a1d2e]">Sediakan akaun admin</h1><p className="mt-2 text-sm leading-6 text-slate-600">Langkah ini hanya boleh dilakukan sekali. Gunakan kunci pemasangan daripada konfigurasi pelayan.</p></div>{notice ? <div className="mt-5"><NoticeBar notice={notice} /></div> : null}<form onSubmit={onSubmit} className="mt-6 grid gap-5"><Field label="Kunci pemasangan" name="setupKey" type="password" autoComplete="off" required /><Field label="Nama pengguna admin" name="username" autoComplete="username" required /><div className="grid gap-5 sm:grid-cols-2"><Field label="Kata laluan" name="password" type="password" autoComplete="new-password" required hint="Minimum 12 aksara." /><Field label="Sahkan kata laluan" name="confirmPassword" type="password" autoComplete="new-password" required /></div><button disabled={busy} className="flex min-h-12 items-center justify-center gap-2 bg-[#0a1d2e] px-5 font-semibold text-white disabled:opacity-50">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}Cipta akaun admin</button></form></div></div>;
}

function UnavailableScreen() {
  return <StatusScreen icon={<AlertCircle className="h-7 w-7" />} title="API admin belum dikonfigurasi" copy="Sediakan pangkalan data MySQL dan fail nrp-admin-config.php di Hostinger, kemudian muat semula halaman ini." />;
}

function StatusScreen({ icon, title, copy }: { icon: ReactNode; title: string; copy?: string }) {
  return <div className="flex min-h-screen items-center justify-center bg-[#071827] p-6"><div className="max-w-lg bg-white p-8 text-center shadow-2xl"><span className="mx-auto flex h-14 w-14 items-center justify-center bg-amber-50 text-amber-700">{icon}</span><h1 className="mt-5 text-xl font-bold text-[#0a1d2e]">{title}</h1>{copy ? <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p> : null}</div></div>;
}

function NoticeBar({ notice, onClose }: { notice: NonNullable<Notice>; onClose?: () => void }) {
  const styles = notice.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : notice.tone === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-blue-200 bg-blue-50 text-blue-900";
  return <div role="status" className={`mb-6 flex items-start justify-between gap-4 border px-4 py-3 text-sm font-medium ${styles}`}><span>{notice.message}</span>{onClose ? <button type="button" onClick={onClose} aria-label="Tutup"><X className="h-4 w-4" /></button> : null}</div>;
}

function PageTitle({ title, copy }: { title: string; copy: string }) {
  return <div className="mb-7"><h1 className="text-2xl font-bold text-[#0a1d2e] sm:text-3xl">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{copy}</p></div>;
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mb-6 border border-slate-200 bg-white"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-[#0a1d2e]">{title}</h2></div><div className="p-5">{children}</div></section>;
}

function Field({ label, name, value, onChange, type = "text", required, autoComplete, hint }: { label: string; name?: string; value?: string; onChange?: (value: string) => void; type?: string; required?: boolean; autoComplete?: string; hint?: string }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<input name={name} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} type={type} required={required} autoComplete={autoComplete} className="mt-2 min-h-11 w-full border border-slate-300 bg-white px-3 font-normal text-slate-950 outline-none focus:border-[#b8921e] focus:ring-1 focus:ring-[#b8921e]" />{hint ? <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span> : null}</label>;
}

function TextArea({ label, value, onChange, rows = 4, hint }: { label: string; value: string; onChange: (value: string) => void; rows?: number; hint?: string }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}<textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-2 w-full resize-y border border-slate-300 bg-white px-3 py-2 font-normal leading-6 text-slate-950 outline-none focus:border-[#b8921e] focus:ring-1 focus:ring-[#b8921e]" />{hint ? <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span> : null}</label>;
}

function ImageField({ label, value, onChange, uploadImage }: { label: string; value: string; onChange: (value: string) => void; uploadImage: (file: File) => Promise<string> }) {
  const [uploading, setUploading] = useState(false);
  async function upload(file?: File) { if (!file) return; setUploading(true); try { onChange(await uploadImage(file)); } finally { setUploading(false); } }
  return <div><Field label={label} value={value} onChange={onChange} hint="Gunakan laluan /images/... atau muat naik fail baharu." /><label className="mt-2 inline-flex min-h-10 cursor-pointer items-center gap-2 border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">{uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}Muat naik imej<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(e) => void upload(e.target.files?.[0])} /></label></div>;
}

function ArrayHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return <div className="mb-4 flex items-center justify-between gap-4"><h2 className="font-bold text-[#0a1d2e]">{title}</h2><button type="button" onClick={onAdd} className="inline-flex min-h-10 items-center gap-2 border border-slate-300 bg-white px-3 text-sm font-semibold hover:bg-slate-50"><Plus className="h-4 w-4" />Tambah</button></div>;
}

function RemoveButton({ onClick, label = "Buang" }: { onClick: () => void; label?: string }) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-9 items-center gap-2 px-2 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" />{label}</button>;
}

function Overview({ content, history, setTab }: { content: AdminContent; history: AuditEntry[]; setTab: (tab: Tab) => void }) {
  const stats = [{ label: "Bidang amalan", value: 6 - content.hiddenServices.length + content.customServices.length, tab: "services" as Tab, icon: BriefcaseBusiness }, { label: "Profil peguam", value: 3 - content.hiddenLawyers.length + content.customLawyers.length, tab: "lawyers" as Tab, icon: Users }, { label: "Artikel", value: content.blogPosts.length, tab: "articles" as Tab, icon: BookOpenText }, { label: "Soalan lazim", value: content.faqs.length, tab: "faq" as Tab, icon: CircleHelp }];
  return <><PageTitle title="Ringkasan laman" copy="Urus kandungan utama dan terbitkan perubahan terus ke laman produksi." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, tab, icon: Icon }) => <button type="button" onClick={() => setTab(tab)} key={label} className="border border-slate-200 bg-white p-5 text-left hover:border-[#b8921e]"><Icon className="h-5 w-5 text-[#b8921e]" /><strong className="mt-5 block text-3xl text-[#0a1d2e]">{value}</strong><span className="mt-1 block text-sm text-slate-500">{label}</span></button>)}</div><div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><Panel title="Aliran penerbitan"><ol className="space-y-4 text-sm leading-6 text-slate-600"><li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 text-emerald-600" />Edit kandungan dalam bahagian yang berkaitan.</li><li className="flex gap-3"><Save className="mt-0.5 h-5 w-5 text-[#b8921e]" />Klik Terbitkan untuk menyimpan perubahan ke GitHub.</li><li className="flex gap-3"><RefreshCw className="mt-0.5 h-5 w-5 text-blue-600" />GitHub Actions membina laman statik dan mengemas kini Hostinger.</li></ol></Panel><Panel title="Aktiviti terkini">{history.length ? <div className="divide-y divide-slate-100">{history.slice(0, 6).map((entry) => <div key={entry.id} className="py-3 text-sm"><div className="flex items-center gap-2 font-semibold text-slate-800"><History className="h-4 w-4 text-slate-400" />{entry.action}</div><p className="mt-1 truncate text-xs text-slate-500">{entry.username} · {entry.created_at}</p></div>)}</div> : <p className="text-sm text-slate-500">Belum ada aktiviti direkodkan.</p>}</Panel></div></>;
}

function GeneralEditor({ content, setContent }: EditorProps) {
  const update = (key: keyof AdminContent["site"], value: string) => setContent((current) => ({ ...current, site: { ...current.site, [key]: value } }));
  return <><PageTitle title="Maklumat firma" copy="Butiran ini digunakan pada header, footer, borang, pautan WhatsApp dan data carian berstruktur." /><Panel title="Identiti"><div className="grid gap-5 md:grid-cols-2"><Field label="Nama firma" value={content.site.name} onChange={(v) => update("name", v)} /><Field label="Tagline" value={content.site.tagline} onChange={(v) => update("tagline", v)} /><div className="md:col-span-2"><Field label="Kedudukan firma" value={content.site.positioning} onChange={(v) => update("positioning", v)} /></div></div></Panel><Panel title="Hubungan dan lokasi"><div className="grid gap-5 md:grid-cols-2"><Field label="Paparan nombor telefon" value={content.site.phoneDisplay} onChange={(v) => update("phoneDisplay", v)} /><Field label="Nombor WhatsApp" value={content.site.whatsappNumber} onChange={(v) => update("whatsappNumber", v)} hint="Nombor sahaja dengan kod negara, contoh 601165055757." /><Field label="Email" type="email" value={content.site.email} onChange={(v) => update("email", v)} /><Field label="Waktu operasi" value={content.site.hours} onChange={(v) => update("hours", v)} /><div className="md:col-span-2"><TextArea label="Alamat" value={content.site.address} onChange={(v) => update("address", v)} rows={3} /></div><div className="md:col-span-2"><Field label="Pautan Google Maps" value={content.site.mapHref} onChange={(v) => update("mapHref", v)} /></div></div></Panel></>;
}

type EditorProps = { content: AdminContent; setContent: React.Dispatch<React.SetStateAction<AdminContent>> };
type UploadEditorProps = EditorProps & { uploadImage: (file: File) => Promise<string> };

function HomeEditor({ content, setContent, uploadImage }: UploadEditorProps) {
  const heroUpdate = (key: "eyebrow" | "title" | "paragraph", value: string) => setContent((c) => ({ ...c, hero: { ...c.hero, [key]: value } }));
  const image = content.hero.images[0];
  const updateImage = (key: "src" | "alt" | "label", value: string) => setContent((c) => ({ ...c, hero: { ...c.hero, images: [{ ...c.hero.images[0], [key]: value }, ...c.hero.images.slice(1)] } }));
  const updateWhy = (index: number, key: keyof AdminWhyItem, value: string) => setContent((c) => ({ ...c, whyChooseUs: c.whyChooseUs.map((item, i) => i === index ? { ...item, [key]: value } : item) }));
  return <><PageTitle title="Laman utama" copy="Kawal tajuk utama, imej hero dan sebab pelanggan memilih firma." /><Panel title="Hero utama"><div className="grid gap-5"><Field label="Teks kecil" value={content.hero.eyebrow} onChange={(v) => heroUpdate("eyebrow", v)} /><TextArea label="Tajuk" value={content.hero.title} onChange={(v) => heroUpdate("title", v)} rows={5} hint="Setiap baris dipaparkan sebagai satu baris tajuk." /><TextArea label="Penerangan" value={content.hero.paragraph} onChange={(v) => heroUpdate("paragraph", v)} rows={4} /><ImageField label="Imej hero" value={image?.src || ""} onChange={(v) => updateImage("src", v)} uploadImage={uploadImage} /><Field label="Teks alternatif imej" value={image?.alt || ""} onChange={(v) => updateImage("alt", v)} /></div></Panel><Panel title="Mengapa pilih kami"><div className="grid gap-4 lg:grid-cols-2">{content.whyChooseUs.map((item, index) => <div key={index} className="border border-slate-200 p-4"><Field label="Tajuk" value={item.title} onChange={(v) => updateWhy(index, "title", v)} /><div className="mt-4"><TextArea label="Penerangan" value={item.copy} onChange={(v) => updateWhy(index, "copy", v)} rows={3} /></div></div>)}</div></Panel></>;
}

function PagesEditor({ content, setContent, uploadImage }: UploadEditorProps) {
  const updateHero = (page: AdminPageKey, key: "eyebrow" | "title" | "description", value: string) => setContent((c) => ({ ...c, pageHeroes: { ...c.pageHeroes, [page]: { ...c.pageHeroes[page], [key]: value } } }));
  const updateAbout = (key: "heading" | "image" | "imageAlt", value: string) => setContent((c) => ({ ...c, about: { ...c.about, [key]: value } }));
  return <><PageTitle title="Halaman" copy="Edit tajuk setiap halaman serta kandungan dan imej Kisah Firma." /><Panel title="Tajuk halaman"><div className="space-y-3">{(Object.keys(pageLabels) as AdminPageKey[]).map((page) => <details key={page} className="border border-slate-200"><summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-slate-800">{pageLabels[page]}<ChevronDown className="h-4 w-4" /></summary><div className="grid gap-4 border-t border-slate-200 p-4"><Field label="Teks kecil" value={content.pageHeroes[page].eyebrow} onChange={(v) => updateHero(page, "eyebrow", v)} /><Field label="Tajuk" value={content.pageHeroes[page].title} onChange={(v) => updateHero(page, "title", v)} /><TextArea label="Penerangan" value={content.pageHeroes[page].description} onChange={(v) => updateHero(page, "description", v)} rows={3} /></div></details>)}</div></Panel><Panel title="Kisah firma"><div className="grid gap-5"><Field label="Tajuk bahagian" value={content.about.heading} onChange={(v) => updateAbout("heading", v)} /><ImageField label="Imej" value={content.about.image} onChange={(v) => updateAbout("image", v)} uploadImage={uploadImage} /><Field label="Teks alternatif imej" value={content.about.imageAlt} onChange={(v) => updateAbout("imageAlt", v)} />{content.about.paragraphs.map((paragraph, index) => <TextArea key={index} label={`Perenggan ${index + 1}`} value={paragraph} onChange={(v) => setContent((c) => ({ ...c, about: { ...c.about, paragraphs: c.about.paragraphs.map((p, i) => i === index ? v : p) } }))} rows={4} />)}</div></Panel><Panel title="Nilai firma"><div className="grid gap-4 md:grid-cols-3">{content.about.values.map((item, index) => <div key={index} className="border border-slate-200 p-4"><Field label="Tajuk" value={item.title} onChange={(v) => setContent((c) => ({ ...c, about: { ...c.about, values: c.about.values.map((x, i) => i === index ? { ...x, title: v } : x) } }))} /><div className="mt-4"><TextArea label="Penerangan" value={item.copy} onChange={(v) => setContent((c) => ({ ...c, about: { ...c.about, values: c.about.values.map((x, i) => i === index ? { ...x, copy: v } : x) } }))} rows={5} /></div></div>)}</div></Panel></>;
}

function ServicesEditor({ content, setContent, baseServices }: EditorProps & { baseServices: BaseService[] }) {
  const updateBase = (name: string, key: string, value: string | string[]) => setContent((c) => ({ ...c, services: { ...c.services, [name]: { ...(c.services[name] || {}), [key]: value } } }));
  const toggleHidden = (name: string) => setContent((c) => ({ ...c, hiddenServices: c.hiddenServices.includes(name) ? c.hiddenServices.filter((x) => x !== name) : [...c.hiddenServices, name] }));
  const addCustom = () => setContent((c) => ({ ...c, customServices: [...c.customServices, { title: "Bidang baharu", slug: `bidang-${Date.now()}`, description: "", details: "", labels: [], iconKey: "document" }] }));
  return <><PageTitle title="Bidang amalan" copy="Edit penerangan, skop dan status paparan setiap perkhidmatan." /><Panel title="Perkhidmatan sedia ada"><div className="space-y-4">{baseServices.map((base) => { const value = { ...base, ...(content.services[base.title] || {}) }; const hidden = content.hiddenServices.includes(base.title); return <details key={base.title} className="border border-slate-200"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3"><span><strong className="block text-slate-900">{value.title}</strong><span className="text-xs text-slate-500">{hidden ? "Disembunyikan" : "Dipaparkan"}</span></span><ChevronDown className="h-4 w-4" /></summary><div className="grid gap-4 border-t border-slate-200 p-4"><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={!hidden} onChange={() => toggleHidden(base.title)} className="h-4 w-4" />Paparkan pada laman</label><Field label="Tajuk" value={value.title} onChange={(v) => updateBase(base.title, "title", v)} /><Field label="Slug pautan" value={value.slug} onChange={(v) => updateBase(base.title, "slug", v)} /><TextArea label="Penerangan ringkas" value={value.description} onChange={(v) => updateBase(base.title, "description", v)} /><TextArea label="Butiran" value={value.details} onChange={(v) => updateBase(base.title, "details", v)} /><Field label="Label (pisahkan dengan koma)" value={value.labels.join(", ")} onChange={(v) => updateBase(base.title, "labels", v.split(",").map((x) => x.trim()).filter(Boolean))} /></div></details>; })}</div></Panel><section className="border border-slate-200 bg-white p-5"><ArrayHeader title="Perkhidmatan tambahan" onAdd={addCustom} /><div className="space-y-4">{content.customServices.map((service, index) => <div key={index} className="border border-slate-200 p-4"><div className="mb-4 flex justify-end"><RemoveButton onClick={() => setContent((c) => ({ ...c, customServices: c.customServices.filter((_, i) => i !== index) }))} /></div><div className="grid gap-4 md:grid-cols-2"><Field label="Tajuk" value={service.title} onChange={(v) => setContent((c) => ({ ...c, customServices: c.customServices.map((x, i) => i === index ? { ...x, title: v } : x) }))} /><Field label="Slug" value={service.slug || ""} onChange={(v) => setContent((c) => ({ ...c, customServices: c.customServices.map((x, i) => i === index ? { ...x, slug: v } : x) }))} /><div className="md:col-span-2"><TextArea label="Penerangan" value={service.description} onChange={(v) => setContent((c) => ({ ...c, customServices: c.customServices.map((x, i) => i === index ? { ...x, description: v } : x) }))} /></div></div></div>)}</div></section></>;
}

function LawyersEditor({ content, setContent, baseLawyers, uploadImage }: UploadEditorProps & { baseLawyers: BaseLawyer[] }) {
  const updateBase = (name: string, key: string, value: string | string[]) => setContent((c) => ({ ...c, lawyers: { ...c.lawyers, [name]: { ...(c.lawyers[name] || {}), [key]: value } } }));
  const toggleHidden = (name: string) => setContent((c) => ({ ...c, hiddenLawyers: c.hiddenLawyers.includes(name) ? c.hiddenLawyers.filter((x) => x !== name) : [...c.hiddenLawyers, name] }));
  const addCustom = () => setContent((c) => ({ ...c, customLawyers: [...c.customLawyers, { name: "Peguam baharu", role: "Peguam Syarie", image: "/images/nuaim-majemi.jpeg", email: "", highlight: "", practice: "", qualifications: [] }] }));
  return <><PageTitle title="Peguam" copy="Urus profil, imej, kelayakan, bidang amalan dan sijil peguam." /><Panel title="Profil sedia ada"><div className="space-y-4">{baseLawyers.map((base) => { const override = content.lawyers[base.name] || {}; const value = { ...base, ...override, name: override.displayName || base.name }; const hidden = content.hiddenLawyers.includes(base.name); const certificates = content.certificates[base.name] || base.certificates; return <details key={base.name} className="border border-slate-200"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3"><span><strong className="block">{value.name}</strong><span className="text-xs text-slate-500">{hidden ? "Disembunyikan" : value.role}</span></span><ChevronDown className="h-4 w-4" /></summary><div className="grid gap-4 border-t border-slate-200 p-4"><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={!hidden} onChange={() => toggleHidden(base.name)} className="h-4 w-4" />Paparkan profil</label><div className="grid gap-4 md:grid-cols-2"><Field label="Nama paparan" value={value.name} onChange={(v) => updateBase(base.name, "displayName", v)} /><Field label="Jawatan" value={value.role} onChange={(v) => updateBase(base.name, "role", v)} /><Field label="Email" value={value.email || ""} onChange={(v) => updateBase(base.name, "email", v)} /><ImageField label="Imej profil" value={value.image} onChange={(v) => updateBase(base.name, "image", v)} uploadImage={uploadImage} /></div><TextArea label="Sorotan" value={value.highlight} onChange={(v) => updateBase(base.name, "highlight", v)} /><TextArea label="Bidang amalan" value={value.practice} onChange={(v) => updateBase(base.name, "practice", v)} /><TextArea label="Kelayakan (satu setiap baris)" value={value.qualifications.join("\n")} onChange={(v) => updateBase(base.name, "qualifications", v.split("\n").filter(Boolean))} rows={7} /><div className="border-t border-slate-200 pt-4"><ArrayHeader title="Sijil" onAdd={() => setContent((c) => ({ ...c, certificates: { ...c.certificates, [base.name]: [...certificates, { negeri: "", title: "", href: "", type: "image" }] } }))} />{certificates.map((cert, index) => <div key={index} className="mb-3 grid gap-3 border border-slate-200 p-3 md:grid-cols-3"><Field label="Negeri" value={cert.negeri} onChange={(v) => updateCertificate(setContent, base.name, certificates, index, "negeri", v)} /><Field label="Tajuk" value={cert.title} onChange={(v) => updateCertificate(setContent, base.name, certificates, index, "title", v)} /><Field label="Fail / pautan" value={cert.href} onChange={(v) => updateCertificate(setContent, base.name, certificates, index, "href", v)} /><div className="md:col-span-3"><RemoveButton onClick={() => setContent((c) => ({ ...c, certificates: { ...c.certificates, [base.name]: certificates.filter((_, i) => i !== index) } }))} /></div></div>)}</div></div></details>; })}</div></Panel><section className="border border-slate-200 bg-white p-5"><ArrayHeader title="Peguam tambahan" onAdd={addCustom} /><div className="space-y-4">{content.customLawyers.map((lawyer, index) => <div key={index} className="border border-slate-200 p-4"><div className="mb-4 flex justify-end"><RemoveButton onClick={() => setContent((c) => ({ ...c, customLawyers: c.customLawyers.filter((_, i) => i !== index) }))} /></div><div className="grid gap-4 md:grid-cols-2"><Field label="Nama" value={lawyer.name} onChange={(v) => updateCustomLawyer(setContent, index, "name", v)} /><Field label="Jawatan" value={lawyer.role} onChange={(v) => updateCustomLawyer(setContent, index, "role", v)} /><Field label="Email" value={lawyer.email || ""} onChange={(v) => updateCustomLawyer(setContent, index, "email", v)} /><ImageField label="Imej" value={lawyer.image} onChange={(v) => updateCustomLawyer(setContent, index, "image", v)} uploadImage={uploadImage} /></div><div className="mt-4 grid gap-4"><TextArea label="Sorotan" value={lawyer.highlight} onChange={(v) => updateCustomLawyer(setContent, index, "highlight", v)} /><TextArea label="Bidang amalan" value={lawyer.practice} onChange={(v) => updateCustomLawyer(setContent, index, "practice", v)} /><TextArea label="Kelayakan (satu setiap baris)" value={lawyer.qualifications.join("\n")} onChange={(v) => updateCustomLawyer(setContent, index, "qualifications", v.split("\n").filter(Boolean))} /></div></div>)}</div></section></>;
}

function updateCertificate(setContent: EditorProps["setContent"], name: string, certificates: AdminContent["certificates"][string], index: number, key: "negeri" | "title" | "href", value: string) { setContent((c) => ({ ...c, certificates: { ...c.certificates, [name]: certificates.map((x, i) => i === index ? { ...x, [key]: value } : x) } })); }
function updateCustomLawyer(setContent: EditorProps["setContent"], index: number, key: string, value: string | string[]) { setContent((c) => ({ ...c, customLawyers: c.customLawyers.map((x, i) => i === index ? { ...x, [key]: value } : x) })); }

function ArticlesEditor({ content, setContent, uploadImage }: UploadEditorProps) {
  const add = () => setContent((c) => ({ ...c, blogPosts: [{ title: "Artikel baharu", category: "Umum", date: new Date().toLocaleDateString("en-GB"), excerpt: "", image: "/images/blog-malaysia.png", href: "" }, ...c.blogPosts] }));
  const update = (index: number, key: keyof AdminBlogPost, value: string) => setContent((c) => ({ ...c, blogPosts: c.blogPosts.map((x, i) => i === index ? { ...x, [key]: value } : x) }));
  return <><PageTitle title="Artikel" copy="Tambah, susun dan kemas kini kad artikel yang dipaparkan pada laman." /><section className="border border-slate-200 bg-white p-5"><ArrayHeader title={`${content.blogPosts.length} artikel`} onAdd={add} /><div className="space-y-4">{content.blogPosts.map((post, index) => <details key={`${post.title}-${index}`} className="border border-slate-200"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3"><span><strong className="block">{post.title}</strong><span className="text-xs text-slate-500">{post.category} · {post.date}</span></span><ChevronDown className="h-4 w-4" /></summary><div className="grid gap-4 border-t border-slate-200 p-4"><div className="flex justify-end"><RemoveButton onClick={() => setContent((c) => ({ ...c, blogPosts: c.blogPosts.filter((_, i) => i !== index) }))} /></div><div className="grid gap-4 md:grid-cols-2"><Field label="Tajuk" value={post.title} onChange={(v) => update(index, "title", v)} /><Field label="Kategori" value={post.category} onChange={(v) => update(index, "category", v)} /><Field label="Tarikh" value={post.date} onChange={(v) => update(index, "date", v)} /><Field label="Pautan artikel" value={post.href} onChange={(v) => update(index, "href", v)} /><div className="md:col-span-2"><ImageField label="Imej" value={post.image} onChange={(v) => update(index, "image", v)} uploadImage={uploadImage} /></div></div><TextArea label="Ringkasan" value={post.excerpt} onChange={(v) => update(index, "excerpt", v)} rows={4} /></div></details>)}</div></section></>;
}

function FaqEditor({ content, setContent }: EditorProps) {
  const add = () => setContent((c) => ({ ...c, faqs: [...c.faqs, { question: "Soalan baharu", answer: "" }] }));
  const update = (index: number, key: keyof AdminFaq, value: string) => setContent((c) => ({ ...c, faqs: c.faqs.map((x, i) => i === index ? { ...x, [key]: value } : x) }));
  return <><PageTitle title="Soalan lazim" copy="Jawapan ringkas kepada soalan awal pelanggan." /><section className="border border-slate-200 bg-white p-5"><ArrayHeader title={`${content.faqs.length} soalan`} onAdd={add} /><div className="space-y-4">{content.faqs.map((faq, index) => <div key={index} className="border border-slate-200 p-4"><div className="mb-4 flex justify-end"><RemoveButton onClick={() => setContent((c) => ({ ...c, faqs: c.faqs.filter((_, i) => i !== index) }))} /></div><Field label={`Soalan ${index + 1}`} value={faq.question} onChange={(v) => update(index, "question", v)} /><div className="mt-4"><TextArea label="Jawapan" value={faq.answer} onChange={(v) => update(index, "answer", v)} rows={4} /></div></div>)}</div></section></>;
}
