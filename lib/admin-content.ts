import { promises as fs } from "node:fs";
import path from "node:path";

export type AdminCertificate = {
  negeri: string;
  title: string;
  href: string;
  type: "image" | "pdf";
};

export type AdminHeroImage = {
  src: string;
  alt: string;
  label: string;
};

export type AdminLawyerOverride = {
  image?: string;
  role?: string;
  email?: string;
  highlight?: string;
  practice?: string;
  qualifications?: string[];
};

export type AdminCustomLawyer = {
  name: string;
  role: string;
  image: string;
  email?: string;
  highlight: string;
  practice: string;
  qualifications: string[];
};

export type AdminServiceOverride = {
  description?: string;
  details?: string;
  labels?: string[];
};

export type AdminCustomService = {
  title: string;
  description: string;
  details: string;
  labels: string[];
  iconKey: "shield" | "family" | "marriage" | "mediation" | "estate" | "document";
};

export type AdminContent = {
  hero: {
    eyebrow: string;
    title: string;
    paragraph: string;
    images: AdminHeroImage[];
  };
  certificates: Record<string, AdminCertificate[]>;
  lawyers: Record<string, AdminLawyerOverride>;
  services: Record<string, AdminServiceOverride>;
  customLawyers: AdminCustomLawyer[];
  hiddenLawyers: string[];
  customServices: AdminCustomService[];
  hiddenServices: string[];
};

export const defaultAdminContent: AdminContent = {
  hero: {
    eyebrow: "Nuaim Razak & Partners",
    title: "Khidmat\nGuaman Syarie\nYang Profesional,\nTelus & Berpengalaman",
    paragraph:
      "Nuaim Razak & Partners menyediakan khidmat guaman Syarie dan nasihat perundangan Syariah bagi membantu individu dan keluarga menyelesaikan isu berkaitan perkahwinan, kekeluargaan Islam, faraid, hibah, wasiat, pengantaraan keluarga dan jenayah Syariah.",
    images: [
      {
        src: "/images/founders.png",
        alt: "Pasukan Nuaim Razak & Partners",
        label: "Rakan Kongsi"
      },
      {
        src: "/images/nuaim-majemi.jpeg",
        alt: "Muhammad Nuaim Bin Majemi",
        label: "Muhammad Nuaim Bin Majemi"
      },
      {
        src: "/images/abdul-razak.jpeg",
        alt: "Abdul Razak Bin Mohamad Rawi",
        label: "Abdul Razak Bin Mohamad Rawi"
      }
    ]
  },
  certificates: {},
  lawyers: {},
  services: {},
  customLawyers: [],
  hiddenLawyers: [],
  customServices: [],
  hiddenServices: []
};

const contentPath = path.join(process.cwd(), "data", "admin-content.json");

export async function getAdminContent(): Promise<AdminContent> {
  try {
    const raw = await fs.readFile(contentPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<AdminContent>;

    return {
      hero: {
        ...defaultAdminContent.hero,
        ...(parsed.hero ?? {}),
        images: parsed.hero?.images?.length ? parsed.hero.images : defaultAdminContent.hero.images
      },
      certificates: parsed.certificates ?? {},
      lawyers: parsed.lawyers ?? {},
      services: parsed.services ?? {},
      customLawyers: parsed.customLawyers ?? [],
      hiddenLawyers: parsed.hiddenLawyers ?? [],
      customServices: parsed.customServices ?? [],
      hiddenServices: parsed.hiddenServices ?? []
    };
  } catch {
    return defaultAdminContent;
  }
}

export async function saveAdminContent(content: AdminContent) {
  await fs.mkdir(path.dirname(contentPath), { recursive: true });
  await fs.writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
