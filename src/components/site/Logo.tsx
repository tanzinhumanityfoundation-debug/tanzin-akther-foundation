import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";

import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label={`${SITE.name} home`}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-xl transition-transform group-hover:-rotate-6",
          inverse ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary text-primary-foreground",
        )}
        aria-hidden="true"
      >
        <HeartHandshake className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold",
            inverse ? "text-primary-foreground" : "text-primary-deep",
          )}
        >
          Tanzin Akther
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
            inverse ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          Foundation
        </span>
      </span>
    </Link>
  );
}
