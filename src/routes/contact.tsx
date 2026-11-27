import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Loader2, Mail, MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";

import { describedBy, FormField } from "@/components/site/FormField";
import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/contact-messages";
import { contactSchema } from "@/lib/forms";
import { CONTACT, SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => {
    const title = `Contact Us — ${SITE.name}`;
    const description =
      "Contact Tanzin Akther Foundation in Mirpur, Dhaka with questions, ideas or offers to help. Send a message or email us for donation enquiries.";
    const url = "https://tanzinhumanityfoundation.lovable.app/contact";

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
  component: ContactPage,
});

const EMPTY = { name: "", email: "", subject: "", message: "" };
type Field = keyof typeof EMPTY;

const DETAILS = [
  { icon: Mail, label: "Email", value: CONTACT.email },
  { icon: MapPin, label: "Address", value: CONTACT.address },
];

function ContactPage() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (key: Field, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSubmitError(null);
    setSent(false);
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
    setSending(true);
    try {
      await submitContactMessage(values);
      setSent(true);
      setValues(EMPTY);
    } catch (err) {
      console.error("Contact message failed", err);
      setSubmitError(
        "Sorry, we couldn't send your message right now. Please check your internet connection and try again in a few minutes.",
      );
    } finally {
      setSending(false);
    }
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
            {sent ? (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary-soft p-4 text-base text-primary-deep"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <span>Thank you! Your message has been received. We'll reply by email.</span>
              </div>
            ) : null}
            {submitError ? (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-base text-destructive"
              >
                <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <span>{submitError}</span>
              </div>
            ) : null}
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                "Send message"
              )}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
