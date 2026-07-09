import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  labels?: string[];
  icon: LucideIcon;
  detailed?: boolean;
  details?: string;
};

export function ServiceCard({ title, description, labels = [], icon: Icon, detailed, details }: ServiceCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-subtle transition duration-300 hover:-translate-y-1.5 hover:border-gold-450 hover:shadow-premium">
      <div className="absolute inset-x-7 top-0 h-1 bg-gold-450 opacity-0 transition group-hover:opacity-100" />
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50 text-navy-900 ring-1 ring-gold-200/70">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 font-serif text-2xl font-semibold text-ink">{title}</h3>
      <p className="mt-3 leading-7 text-muted">{description}</p>
      {detailed && details ? <p className="mt-4 text-sm leading-7 text-muted">{details}</p> : null}
      {labels.length ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {labels.map((label) => (
            <span key={label} className="rounded-full border border-line bg-ivory px-3 py-1 text-xs font-semibold text-navy-800">
              {label}
            </span>
          ))}
        </div>
      ) : null}
      <Link href="/bidang-amalan" className="mt-auto pt-7 inline-flex items-center gap-2 text-sm font-semibold text-gold-700">
        Ketahui lanjut
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
