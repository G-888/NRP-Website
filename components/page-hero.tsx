type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-radial text-white">
      <div className="pattern-soft absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="section relative py-16 lg:py-24">
        <div className="mb-5 h-px w-16 bg-gold-450" />
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold-100">{eyebrow}</p>
        <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/74 sm:text-lg">{description}</p>
      </div>
    </section>
  );
}
