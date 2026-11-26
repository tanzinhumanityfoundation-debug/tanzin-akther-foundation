import { useEffect, useState } from "react";
import { HeartHandshake, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const KEY = "taf-welcome-seen";

/** Short welcome animation shown once per browser session. */
export function WelcomeIntro() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
    setOpen(true);
  }, []);

  const close = () => {
    setLeaving(true);
    window.setTimeout(() => setOpen(false), 450);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className={`fixed inset-0 z-[100] grid place-items-center bg-hero px-6 transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close welcome"
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-5" />
      </button>

      <div className="mx-auto max-w-xl text-center">
        <span className="welcome-pop mx-auto grid size-20 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-soft">
          <HeartHandshake className="welcome-beat size-10" />
        </span>
        <p className="welcome-rise eyebrow mt-8" style={{ animationDelay: "0.35s" }}>
          Welcome to
        </p>
        <h1
          id="welcome-title"
          className="welcome-rise mt-2 font-display text-4xl font-semibold text-primary-deep sm:text-5xl"
          style={{ animationDelay: "0.5s" }}
        >
          {SITE.name}
        </h1>
        <p className="welcome-rise mt-5 text-lg text-foreground/80" style={{ animationDelay: "0.8s" }}>
          No one should face hard times alone. A small kindness today can change
          someone's tomorrow.
        </p>
        <p className="welcome-rise mt-3 text-base text-muted-foreground" style={{ animationDelay: "1.05s" }}>
          Whether you need support or want to help others, please feel free to
          reach out to us — we are here to listen.
        </p>
        <p className="welcome-rise mt-6 font-display text-lg italic text-primary" style={{ animationDelay: "1.3s" }}>
          “{SITE.tagline}”
        </p>
        <div className="welcome-rise mt-8" style={{ animationDelay: "1.55s" }}>
          <Button size="lg" onClick={close}>
            Enter website
          </Button>
        </div>
      </div>
    </div>
  );
}
