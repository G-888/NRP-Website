import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { PageHero } from "@/components/page-hero";
import { firm } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Dasar Privasi",
  description: "Cara Nuaim Razak & Partners mengendalikan maklumat yang diberikan melalui borang pertanyaan dan saluran komunikasi firma.",
  alternates: { canonical: "/dasar-privasi" }
};

const sections = [
  {
    title: "Maklumat yang dikumpulkan",
    copy: "Maklumat yang anda pilih untuk berikan boleh merangkumi nama, nombor telefon, alamat email, jenis kes, tarikh temujanji pilihan dan ringkasan pertanyaan."
  },
  {
    title: "Tujuan penggunaan",
    copy: "Maklumat tersebut digunakan untuk memahami pertanyaan awal, menghubungi anda semula, menetapkan temujanji dan mengurus komunikasi berkaitan khidmat guaman Syarie."
  },
  {
    title: "Penghantaran melalui WhatsApp",
    copy: "Borang pertanyaan menyediakan mesej WhatsApp pada peranti anda. Mesej hanya dihantar kepada firma selepas anda menyemak dan menekan butang hantar dalam WhatsApp. Penggunaan WhatsApp tertakluk kepada dasar privasi penyedia tersebut."
  },
  {
    title: "Kerahsiaan dan perkongsian",
    copy: "Firma mengambil langkah munasabah untuk menjaga kerahsiaan maklumat yang diterima. Maklumat tidak dijual dan hanya digunakan atau dikongsi apabila diperlukan untuk mengendalikan pertanyaan, memberikan perkhidmatan, atau memenuhi kewajipan undang-undang."
  },
  {
    title: "Pilihan anda",
    copy: "Anda boleh meminta pembetulan atau pertanyaan lanjut tentang maklumat yang telah diberikan dengan menghubungi firma melalui email atau WhatsApp. Elakkan menghantar dokumen sulit sebelum pihak firma mengesahkan saluran penghantaran yang sesuai."
  }
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privasi"
        title="Dasar Privasi"
        description="Maklumat ringkas tentang cara firma mengendalikan butiran yang anda berikan ketika membuat pertanyaan."
      />
      <section className="section">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 border-b border-line pb-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-50 text-gold-700 ring-1 ring-gold-200/70">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold text-ink">Nuaim Razak & Partners</p>
              <p className="mt-1 text-sm text-muted">Dikemas kini pada 26 Ogos 2026</p>
            </div>
          </div>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-2xl font-semibold text-ink">{section.title}</h2>
                <p className="mt-3 leading-8 text-muted">{section.copy}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <h2 className="font-serif text-2xl font-semibold text-ink">Hubungi firma</h2>
            <p className="mt-3 leading-8 text-muted">Untuk pertanyaan tentang privasi atau maklumat yang telah diberikan, hubungi pihak firma melalui saluran berikut.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={firm.emailHref} variant="secondary">
                <Mail className="mr-2 h-4 w-4" />
                Email Firma
              </ButtonLink>
              <ButtonLink href={firm.whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Firma
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
