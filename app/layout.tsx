import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopContactBar } from "@/components/top-contact-bar";
import { WhatsappFloatingButton } from "@/components/whatsapp-floating-button";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ms" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <TopContactBar />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsappFloatingButton />
      </body>
    </html>
  );
}
