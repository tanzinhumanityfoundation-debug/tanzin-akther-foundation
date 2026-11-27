import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, HeartHandshake, Lock, MessageCircleHeart, PhoneCall } from "lucide-react";

import heroImage from "@/assets/hero-community.jpg";
import { Button } from "@/components/ui/button";
import { CONTACT, HELP_CATEGORIES, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => {
    const title = `${SITE.name} — Humanity First`;
    const description =
      "Tanzin Akther Foundation is a Dhaka-based humanitarian initiative supporting education, financial hardship and medical needs with care and dignity.";
    const url = "https://tanzinhumanityfoundation.lovable.app/";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: HomePage,
});

const STEPS = [
  {
    icon: ClipboardList,
    title: "Share your situation",
    text: "Fill in a short form with your name, how to reach you and what kind of help you need.",
  },
  {
    icon: Lock,
    title: "We review it privately",
    text: "Only authorized members of our team can see your request. It is never shown publicly.",
  },
  {
    icon: PhoneCall,
    title: "We get in touch",
    text: "A team member contacts you using the method you chose to talk about next steps.",
  },
];

function HomePage() {
  return (
    <>
      {/* Introduction */}
      <section className="bg-hero overflow-hidden">
        <div className="container-page grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="eyebrow">Humanitarian support</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Humanity First.
              <span className="mt-2 block italic text-primary">Together, we can make a difference.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {SITE.name} stands beside people going through hard times — helping with education,
              financial difficulties, medical needs and other humanitarian situations, with care and
              respect.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to="/request-help">
                  Request Help <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="soft" size="lg">
                <Link to="/about">Learn about us</Link>
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4 text-primary" aria-hidden="true" />
              Your request stays private. It is only seen by our authorized team.
            </p>
          </div>

          <div className="relative animate-in fade-in zoom-in-95 duration-1000">
            <div className="absolute -inset-3 -z-0 rotate-2 rounded-[2rem] bg-secondary" aria-hidden="true" />
            <img
              src={heroImage}
              alt="A volunteer handing school books to a smiling student outside a school"
              width={1536}
              height={1024}
              className="relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-lift"
            />
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-border bg-background/95 p-4 shadow-soft backdrop-blur sm:left-auto sm:right-6 sm:max-w-xs">
              <p className="flex items-start gap-3 text-sm">
                <MessageCircleHeart className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <span>Every request is read by a real person who cares about helping.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container-page py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <p className="eyebrow">Our mission</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Practical help, offered with dignity.
            </h2>
          </div>
          <div className="space-y-5 text-lg text-muted-foreground">
            <p>
              Our mission is to support individuals and families when life becomes difficult — so a
              child can stay in school, a family can get through a hard month, or a patient can
              afford the care they need.
            </p>
            <p>
              We listen first, treat every person with respect, and keep personal information
              private. We are a small, people-centred initiative that believes kindness works best
              when we act together.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
            >
              Read more about us <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-sky-soft border-y border-border/60">
        <div className="container-page py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">How we can help</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Areas of support</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the area closest to your situation when you send a request. If you're not sure,
              choose “Other” — we'll read every request carefully.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HELP_CATEGORIES.map((cat) => (
              <li
                key={cat.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <cat.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{cat.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">{cat.summary}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                  {cat.examples.map((ex) => (
                    <li key={ex} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-sky" aria-hidden="true" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-20 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Three simple steps</h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-border p-6">
              <span className="font-display text-5xl font-semibold text-secondary-foreground/20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <step.icon className="absolute right-6 top-7 size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Call to action */}
      <section className="container-page pb-20 md:pb-24">
        <div className="bg-band relative overflow-hidden rounded-[2rem] px-6 py-14 text-center text-primary-foreground md:px-16 md:py-16">
          <div
            className="absolute -right-16 -top-16 size-64 rounded-full bg-primary-foreground/5"
            aria-hidden="true"
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold text-primary-foreground md:text-4xl">
            Going through a difficult time? You don't have to face it alone.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
            Send a short request. It only takes a few minutes and stays private.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="inverse" size="lg">
              <Link to="/request-help">
                Request Help <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
          <p className="relative mx-auto mt-8 flex max-w-xl items-start justify-center gap-2 text-base text-primary-foreground/85">
            <HeartHandshake className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>
              Want to support our work with a donation? Please contact us at{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-semibold underline underline-offset-4 hover:text-primary-foreground"
              >
                {CONTACT.email}
              </a>
              .
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
