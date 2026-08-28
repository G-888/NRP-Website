import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { getAdminContent } from "@/lib/admin-content";
import { getManagedFirm, getManagedServices } from "@/lib/managed-content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nuaimrazak.com"),
  title: {
    default: "Nuaim Razak & Partners | Khidmat Guaman Syarie",
    template: "%s | Nuaim Razak & Partners"
  },
  description:
    "Khidmat guaman Syarie dan nasihat perundangan Syariah untuk kes perkahwinan, keluarga Islam, faraid, hibah, wasiat, pengantaraan keluarga dan jenayah Syariah.",
  applicationName: "Nuaim Razak & Partners",
  authors: [{ name: "Nuaim Razak & Partners" }],
  creator: "Nuaim Razak & Partners",
  publisher: "Nuaim Razak & Partners",
  icons: {
    icon: "/images/blue-logo-nrp.png",
    apple: "/images/blue-logo-nrp.png"
  },
  openGraph: {
    type: "website",
    locale: "ms_MY",
    url: "https://www.nuaimrazak.com",
    siteName: "Nuaim Razak & Partners",
    title: "Nuaim Razak & Partners | Khidmat Guaman Syarie",
    description: "Khidmat guaman Syarie dan nasihat perundangan Syariah untuk individu dan keluarga.",
    images: [{ url: "/images/hero-partners-generated-v2.webp", width: 1672, height: 941, alt: "Rakan kongsi Nuaim Razak & Partners" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuaim Razak & Partners | Khidmat Guaman Syarie",
    description: "Khidmat guaman Syarie dan nasihat perundangan Syariah untuk individu dan keluarga.",
    images: ["/images/hero-partners-generated-v2.webp"]
  },
  keywords: [
    "Peguam Syarie",
    "Khidmat guaman Syarie",
    "Peguam Syariah Selangor",
    "Peguam Syarie Bangi",
    "Mahkamah Syariah",
    "Faraid",
    "Hibah",
    "Wasiat",
    "Hadhanah",
    "Nafkah",
    "Perceraian",
    "Jenayah Syariah"
  ]
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const adminContent = await getAdminContent();
  const firm = getManagedFirm(adminContent);
  const services = getManagedServices(adminContent).map(({ title, slug }) => ({ title, slug }));
  const legalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: firm.name,
    url: "https://www.nuaimrazak.com",
    logo: "https://www.nuaimrazak.com/images/blue-logo-nrp.png",
    image: "https://www.nuaimrazak.com/images/hero-partners-generated-v2.webp",
    telephone: `+${firm.whatsappNumber}`,
    email: firm.email,
    description: firm.positioning,
    sameAs: [firm.facebookHref, firm.tiktokHref].filter(Boolean),
    address: { "@type": "PostalAddress", streetAddress: firm.address, addressCountry: "MY" },
    areaServed: { "@type": "Country", name: "Malaysia" }
  };

  return (
    <html lang="ms" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }} />
        <SiteShell firm={firm} services={services}>{children}</SiteShell>
      </body>
    </html>
  );
}
