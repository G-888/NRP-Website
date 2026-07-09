import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: "primary" | "secondary" | "gold" | "ghost";
};

export function ButtonLink({ className, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition",
        variant === "primary" && "bg-navy-900 text-white shadow-subtle hover:bg-navy-800",
        variant === "secondary" &&
          "border border-line bg-white text-navy-900 hover:border-gold-450 hover:text-navy-950",
        variant === "gold" && "bg-gold-450 text-navy-950 shadow-subtle hover:bg-gold-550",
        variant === "ghost" && "text-navy-800 hover:bg-navy-50",
        className
      )}
      {...props}
    />
  );
}
