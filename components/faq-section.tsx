import { SectionHeading } from "@/components/section-heading";
import type { AdminFaq } from "@/lib/admin-content";

export function FaqSection({ faqs }: { faqs: AdminFaq[] }) {
  return (
    <section className="section">
      <SectionHeading
        eyebrow="Ada soalan?"
        title="Soalan Lazim"
        description="Jawapan ringkas untuk pertanyaan awal berkaitan firma dan khidmat guaman Syarie kami."
        align="center"
      />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-subtle">
        {faqs.map((faq, index) => (
          <details key={faq.question} className="group p-7" open={index === 0}>
            <summary className="cursor-pointer list-none font-semibold text-ink">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span className="text-xl text-gold-700 group-open:hidden">+</span>
                <span className="hidden text-xl text-gold-700 group-open:inline">-</span>
              </span>
            </summary>
            <p className="mt-4 leading-8 text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
