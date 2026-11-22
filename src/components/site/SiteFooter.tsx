import { Link } from "@tanstack/react-router";

import { CONTACT, NAV_LINKS, SITE } from "@/lib/site";

import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-band text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo inverse />
          <p className="mt-4 font-display text-xl italic leading-snug text-primary-foreground/90">
            “{SITE.tagline}”
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground/70">
            Pages
          </h2>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/90 hover:text-primary-foreground hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/privacy" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground/70">
            Contact
          </h2>
          <ul className="mt-4 space-y-2 text-primary-foreground/90">
            <li>{CONTACT.email}</li>
            <li>{CONTACT.phone}</li>
            <li>{CONTACT.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-primary-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <Link to="/admin" className="hover:text-primary-foreground hover:underline">
            Administrator sign-in
          </Link>
        </div>
      </div>
    </footer>
  );
}
