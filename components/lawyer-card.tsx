import Image from "next/image";
import Link from "next/link";

type LawyerCardProps = {
  name: string;
  role: string;
  image: string;
  highlight: string;
};

export function LawyerCard({ name, role, image, highlight }: LawyerCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-line bg-white shadow-subtle transition duration-300 hover:-translate-y-1.5 hover:shadow-premium">
      <div className="relative overflow-hidden">
        <Image src={image} alt={name} width={640} height={960} className="aspect-[4/5] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-950/65 to-transparent" />
      </div>
      <div className="p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-700">{role}</p>
        <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">{name}</h3>
        <p className="mt-4 min-h-14 text-sm leading-7 text-muted">{highlight}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-line bg-ivory px-3 py-1 text-xs font-semibold text-navy-800">Mahkamah Syariah</span>
          <span className="rounded-full border border-line bg-ivory px-3 py-1 text-xs font-semibold text-navy-800">Guaman Syarie</span>
        </div>
        <Link href="/peguam" className="mt-6 inline-flex rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy-900 transition hover:border-gold-450 hover:text-gold-700">
          Lihat profil
        </Link>
      </div>
    </article>
  );
}
