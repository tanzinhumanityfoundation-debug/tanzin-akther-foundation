import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/site";

import { Logo } from "./Logo";

const linkBase =
  "rounded-full px-4 py-2 text-[0.95rem] font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary-deep";
const linkActive = "bg-primary-soft text-primary-deep";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.filter((l) => l.to !== "/request-help").map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={linkBase}
              activeProps={{ className: linkActive }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/request-help">Request Help</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden [&_svg]:size-6" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetHeader className="items-start text-left">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-lg font-medium text-foreground hover:bg-primary-soft"
                    activeProps={{ className: "bg-primary-soft text-primary-deep" }}
                    activeOptions={{ exact: link.to === "/" }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/privacy"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base text-muted-foreground hover:bg-primary-soft"
                >
                  Privacy Policy
                </Link>
              </nav>
              <div className="mt-6">
                <Button asChild size="lg" className="w-full">
                  <Link to="/request-help" onClick={() => setOpen(false)}>
                    Request Help
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
