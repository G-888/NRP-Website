import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "light" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div className={cn("mb-5 h-px w-16 bg-gold-450", align === "center" && "mx-auto")} />
      {eyebrow ? (
        <p className={cn("mb-3 text-sm font-semibold uppercase tracking-[0.18em]", tone === "dark" ? "text-gold-100" : "text-gold-700")}>{eyebrow}</p>
      ) : null}
      <h2 className={cn("font-serif text-4xl font-semibold leading-tight sm:text-5xl", tone === "dark" ? "text-white" : "text-ink")}>{title}</h2>
      {description ? <p className={cn("mt-5 text-base leading-8 sm:text-lg", tone === "dark" ? "text-white/72" : "text-muted")}>{description}</p> : null}
    </div>
  );
}
