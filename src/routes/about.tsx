import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, HandHeart, Scale, ShieldCheck, Sprout, Target, Users } from "lucide-react";

import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "About Us — Tanzin Akther Foundation" },
      {
        name: "description",
        content:
          "Learn about the mission, vision and values of Tanzin Akther Foundation, a people-centred humanitarian initiative.",
      },
      { property: "og:title", content: "About Us — Tanzin Akther Foundation" },
      {
        property: "og:description",
        content: "Our mission, vision and the values that guide how we help people in need.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: HandHeart, title: "Compassion", text: "We listen with kindness and without judgement." },
  { icon: ShieldCheck, title: "Privacy", text: "Personal information is kept confidential and safe." },
  { icon: Scale, title: "Fairness", text: "Every request is reviewed carefully and respectfully." },
  { icon: Users, title: "Togetherness", text: "We believe communities are stronger when they help each other." },
];

function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About us" title={`Who we are`}>
        <p>
          {SITE.name} is a humanitarian initiative created to support people facing hardship. We
          focus on education, financial difficulties, medical needs and other urgent humanitarian
          situations.
        </p>
      </PageIntro>

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-primary-soft p-8">
            <Target className="size-8 text-primary" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold md:text-3xl">Our mission</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              To provide practical, respectful support to individuals and families in difficult
              situations — helping them continue their education, meet urgent needs and access
              medical care.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-secondary p-8">
            <Eye className="size-8 text-secondary-foreground" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold md:text-3xl">Our vision</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A caring community where no one is left without help in a moment of need, and where
              everyone has a fair chance to learn, stay healthy and live with dignity.
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted">
        <div className="container-page grid gap-10 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-24">
          <div>
            <Sprout className="size-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Our story</h2>
          </div>
          <div className="space-y-5 text-lg text-muted-foreground">
            <p>
              Tanzin Akther Foundation began with a simple belief:{" "}
              <strong className="text-foreground">humanity comes first</strong>. In every community,
              there are families who quietly struggle — a child who may have to leave school because
              fees cannot be paid, a family that cannot afford medicine, a household that loses its
              income overnight. Often, a little help at the right time can change what happens next.
            </p>
            <p>
              We are a small, people-centred initiative based in Dhaka. We listen to people facing
              hardship and help where we can, with a focus on education, financial difficulties,
              medical needs and other urgent humanitarian situations.
            </p>
            <p>
              We are growing carefully. Every request is read by a real person, every story is
              treated with respect, and personal information is never made public. Our promise is
              simple: to stand beside people in hard times with kindness and dignity.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <p className="eyebrow">What guides us</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Our values</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <li key={v.title} className="rounded-2xl border border-border p-6 shadow-soft">
              <v.icon className="size-7 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-muted-foreground">{v.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl bg-sky-soft p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-medium text-foreground">Need support, or want to get in touch?</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/request-help">Request Help</Link>
            </Button>
            <Button asChild variant="soft">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
