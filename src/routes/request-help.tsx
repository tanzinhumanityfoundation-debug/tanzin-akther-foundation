import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";

import { describedBy, FormField } from "@/components/site/FormField";
import { PageIntro } from "@/components/site/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_METHODS,
  DESCRIPTION_MAX,
  helpRequestSchema,
  type ContactMethodId,
} from "@/lib/forms";
import { HELP_CATEGORIES } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/request-help")({
  head: () => ({
    meta: [
      { title: "Request Help — Tanzin Akther Foundation" },
      {
        name: "description",
        content:
          "Send a short, private request for help with education, financial hardship, medical needs or another humanitarian situation.",
      },
      { property: "og:title", content: "Request Help — Tanzin Akther Foundation" },
      {
        property: "og:description",
        content: "A simple, private form to ask Tanzin Akther Foundation for support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequestHelpPage,
});

type Errors = Partial<Record<string, string>>;

const EMPTY = {
  fullName: "",
  contactMethod: "" as ContactMethodId | "",
  contactDetail: "",
  category: "",
  description: "",
  consent: false,
};

const selectClass =
  "field flex w-full rounded-md border border-input px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function RequestHelpPage() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = helpRequestSchema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }
    // Preview version: nothing is sent or stored yet.
    setSubmittedName(result.data.fullName);
    setValues(EMPTY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isEmail = values.contactMethod === "email";

  return (
    <>
      <PageIntro eyebrow="Request help" title="Tell us how we can help">
        <p>
          Fill in this short form. It takes a few minutes, and only our authorized team will see
          your request.
        </p>
      </PageIntro>

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
          {submittedName ? (
            <div
              role="status"
              className="rounded-2xl border border-primary/25 bg-primary-soft p-8 md:p-10"
            >
              <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-semibold md:text-3xl">
                Thank you, {submittedName}.
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Your request has been received. A member of our team will review it and contact you
                using the method you chose.
              </p>
              <p className="mt-4 rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
                Preview version: requests are not sent or saved yet. This screen shows what people
                will see once the form is connected.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => setSubmittedName(null)}>Send another request</Button>
                <Button asChild variant="soft">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              aria-label="Request help form"
              className="space-y-7 rounded-2xl border border-border bg-card p-6 shadow-soft md:p-10"
            >
              <FormField id="fullName" label="Your name" required error={errors["fullName"]}>
                <Input
                  id="fullName"
                  autoComplete="name"
                  className="h-11 text-base"
                  value={values.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  aria-invalid={!!errors["fullName"]}
                  aria-describedby={describedBy("fullName", false, errors["fullName"])}
                  maxLength={100}
                />
              </FormField>

              <fieldset className="space-y-3">
                <legend className="text-base font-semibold text-foreground">
                  How should we contact you?
                  <span className="ml-1 text-destructive" aria-hidden="true">
                    *
                  </span>
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {CONTACT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={cn(
                        "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base transition-colors",
                        values.contactMethod === m.id
                          ? "border-primary bg-primary-soft text-primary-deep"
                          : "border-input hover:bg-muted",
                      )}
                    >
                      <input
                        type="radio"
                        name="contactMethod"
                        id={m.id === CONTACT_METHODS[0].id ? "contactMethod" : undefined}
                        value={m.id}
                        checked={values.contactMethod === m.id}
                        onChange={() => set("contactMethod", m.id)}
                        className="size-4 accent-primary"
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
                {errors["contactMethod"] ? (
                  <p role="alert" className="text-sm font-medium text-destructive">
                    {errors["contactMethod"]}
                  </p>
                ) : null}
              </fieldset>

              <FormField
                id="contactDetail"
                label={isEmail ? "Email address" : "Phone number"}
                hint={
                  values.contactMethod
                    ? undefined
                    : "Choose a contact method above, then enter your phone number or email."
                }
                required
                error={errors["contactDetail"]}
              >
                <Input
                  id="contactDetail"
                  type={isEmail ? "email" : "tel"}
                  inputMode={isEmail ? "email" : "tel"}
                  autoComplete={isEmail ? "email" : "tel"}
                  className="h-11 text-base"
                  value={values.contactDetail}
                  onChange={(e) => set("contactDetail", e.target.value)}
                  aria-invalid={!!errors["contactDetail"]}
                  aria-describedby={describedBy(
                    "contactDetail",
                    !values.contactMethod,
                    errors["contactDetail"],
                  )}
                  maxLength={255}
                />
              </FormField>

              <FormField id="category" label="What kind of help do you need?" required error={errors["category"]}>
                <select
                  id="category"
                  className={selectClass}
                  value={values.category}
                  onChange={(e) => set("category", e.target.value)}
                  aria-invalid={!!errors["category"]}
                  aria-describedby={describedBy("category", false, errors["category"])}
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {HELP_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                id="description"
                label="Briefly describe your situation"
                hint="A few sentences is enough. Please do not include ID numbers, bank details, passwords or medical reports."
                required
                error={errors["description"]}
              >
                <Textarea
                  id="description"
                  rows={6}
                  className="text-base"
                  value={values.description}
                  onChange={(e) => set("description", e.target.value)}
                  aria-invalid={!!errors["description"]}
                  aria-describedby={describedBy("description", true, errors["description"])}
                  maxLength={DESCRIPTION_MAX}
                />
                <p className="text-right text-sm text-muted-foreground" aria-live="polite">
                  {values.description.length} / {DESCRIPTION_MAX}
                </p>
              </FormField>

              <div className="space-y-2">
                <label
                  htmlFor="consent"
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-input bg-muted p-4"
                >
                  <input
                    id="consent"
                    type="checkbox"
                    checked={values.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    className="mt-1 size-5 shrink-0 accent-primary"
                    aria-invalid={!!errors["consent"]}
                    aria-describedby={errors["consent"] ? "consent-error" : undefined}
                  />
                  <span className="text-base">
                    I agree that{" "}
                    <span className="font-semibold">Tanzin Akther Foundation</span> may use the
                    information in this form to review my request and contact me. I have read the{" "}
                    <Link to="/privacy" className="font-semibold text-primary underline underline-offset-2">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {errors["consent"] ? (
                  <p id="consent-error" role="alert" className="text-sm font-medium text-destructive">
                    {errors["consent"]}
                  </p>
                ) : null}
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto">
                Send my request
              </Button>
            </form>
          )}

          <aside className="space-y-5">
            <div className="rounded-2xl bg-sky-soft p-6">
              <Lock className="size-6 text-secondary-foreground" aria-hidden="true" />
              <h2 className="mt-3 text-xl font-semibold">Your privacy matters</h2>
              <p className="mt-2 text-base text-muted-foreground">
                Requests are never published. Only authorized administrators can read them.
              </p>
            </div>
            <div className="rounded-2xl border border-warm/50 bg-warm-soft p-6">
              <AlertTriangle className="size-6 text-foreground" aria-hidden="true" />
              <h2 className="mt-3 text-xl font-semibold">Please don't share</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-muted-foreground">
                <li>National ID numbers</li>
                <li>Bank or card details</li>
                <li>Passwords</li>
                <li>Medical reports or documents</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              In a life-threatening emergency, please contact your local emergency services first.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
