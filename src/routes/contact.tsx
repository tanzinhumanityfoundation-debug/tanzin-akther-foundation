import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { describedBy, FormField } from "@/components/site/FormField";
import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/forms";
import { CONTACT } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Tanzin Akther Foundation" },
      {
        name: "description",
        content: "Get in touch with Tanzin Akther Foundation with a question, idea or offer to help.",
      },
      { property: "og:title", content: "Contact Us — Tanzin Akther Foundation" },
      {
        property: "og:description",
        content: "Send a message to Tanzin Akther Foundation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const EMPTY = { name: "", email: "", subject: "", message: "" };
type Field = keyof typeof EMPTY;

const DETAILS = [
  { icon: Mail, label: "Email", value: CONTACT.email },
  { icon: Phone, label: "Phone", value: CONTACT.phone },
  { icon: MapPin, label: "Address", value: CONTACT.address },
  { icon: Clock, label: "Office hours", value: CONTACT.hours },
];

function ContactPage() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const set = (key: Field, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }
    // Preview version: nothing is sent or stored yet.
    toast.success("Thank you! Your message has been received.", {
      description: "Preview version: messages are not sent or saved yet.",
    });
    setValues(EMPTY);
  };

  return (
    <>
      <PageIntro eyebrow="Contact us" title="We'd love to hear from you">
        <p>
          Have a question, an idea, or want to offer help? Send us a message. If you need support
          for yourself or someone else, please use the Request Help form instead.
        </p>
      </PageIntro>

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-14">
          <aside>
            <h2 className="text-2xl font-semibold">Contact details</h2>
            <ul className="mt-6 space-y-4">
              {DETAILS.map((d) => (
                <li key={d.label} className="flex items-start gap-4 rounded-xl border border-border p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                    <d.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{d.label}</span>
                    <span className="block text-muted-foreground">{d.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <form
            onSubmit={onSubmit}
            noValidate
            aria-label="Contact form"
            className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft md:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField id="name" label="Your name" required error={errors.name}>
                <Input
                  id="name"
                  autoComplete="name"
                  className="h-11 text-base"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy("name", false, errors.name)}
                  maxLength={100}
                />
              </FormField>
              <FormField id="email" label="Email address" required error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="h-11 text-base"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy("email", false, errors.email)}
                  maxLength={255}
                />
              </FormField>
            </div>
            <FormField id="subject" label="Subject" required error={errors.subject}>
              <Input
                id="subject"
                className="h-11 text-base"
                value={values.subject}
                onChange={(e) => set("subject", e.target.value)}
                aria-invalid={!!errors.subject}
                aria-describedby={describedBy("subject", false, errors.subject)}
                maxLength={120}
              />
            </FormField>
            <FormField id="message" label="Message" required error={errors.message}>
              <Textarea
                id="message"
                rows={6}
                className="text-base"
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy("message", false, errors.message)}
                maxLength={1000}
              />
            </FormField>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Send message
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
