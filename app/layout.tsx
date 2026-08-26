import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopContactBar } from "@/components/top-contact-bar";
import { WhatsappFloatingButton } from "@/components/whatsapp-floating-button";
import { firm } from "@/lib/site-data";

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
  address: {
    "@type": "PostalAddress",
    streetAddress: "11-2, Jln Puteri 3A/1, Bandar Puteri Bangi",
    postalCode: "43000",
    addressLocality: "Kajang",
    addressRegion: "Selangor",
    addressCountry: "MY"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    }
  ],
  areaServed: { "@type": "Country", name: "Malaysia" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ms" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main-content" className="focus-ring sr-only z-[100] rounded-md bg-white px-4 py-3 font-semibold text-navy-950 shadow-premium focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Langkau ke kandungan utama
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }} />
        <TopContactBar />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <WhatsappFloatingButton />
      </body>
    </html>
  );
}
