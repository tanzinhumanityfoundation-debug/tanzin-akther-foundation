import { createFileRoute, Link } from "@tanstack/react-router";

import { PageIntro } from "@/components/site/PageIntro";
import { CONTACT, SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Tanzin Akther Foundation" },
      {
        name: "description",
        content:
          "What information Tanzin Akther Foundation collects, why we collect it, and how we keep it private and protected.",
      },
      { property: "og:title", content: "Privacy Policy — Tanzin Akther Foundation" },
      {
        property: "og:description",
        content: "How Tanzin Akther Foundation collects, uses and protects your information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Privacy policy" title="How we look after your information">
        <p>
          We only ask for what we need to help you, and we keep it private. This page explains what
          we collect, why, and how we protect it.
        </p>
        <p className="mt-3 text-sm">Last updated: November 2026</p>
      </PageIntro>

      <section className="container-page py-12 md:py-16">
        <div className="prose-policy max-w-3xl">
          <h2>1. Information we collect</h2>
          <p>
            <strong>When you request help</strong>, we ask for:
          </p>
          <ul>
            <li>Your name</li>
            <li>How you would like to be contacted (phone call, text message or email)</li>
            <li>Your phone number or email address</li>
            <li>The category of help you need</li>
            <li>A short description of your situation, written by you</li>
            <li>Your consent to use this information</li>
          </ul>
          <p>
            <strong>When you contact us</strong>, we ask for your name, email address, a subject and
            your message.
          </p>
          <p>
            <strong>We do not ask for</strong> national ID numbers, bank or card details, passwords,
            medical reports or document uploads. Please do not include these in your messages.
          </p>

          <h2>2. Why we collect it</h2>
          <ul>
            <li>To understand your situation and review your request fairly.</li>
            <li>To contact you using the method you chose.</li>
            <li>To answer questions sent through the contact form.</li>
          </ul>
          <p>
            We do not sell your information, use it for advertising, or share it with anyone outside
            our authorized team unless you agree or the law requires it.
          </p>

          <h2>3. How we protect it</h2>
          <ul>
            <li>Requests and messages are never published on this website.</li>
            <li>There are no public request lists or public comments.</li>
            <li>Only authorized administrators can sign in to view submissions.</li>
            <li>We keep information only for as long as we need it to help you.</li>
          </ul>

          <h2>4. Website visit statistics</h2>
          <p>
            This website uses Lovable's built-in visitor analytics to understand how the site is
            used. It uses no cookies, stores nothing on your device, doesn't keep IP addresses and
            doesn't identify visitors. Lovable collects this data for us.{" "}
            <a href="https://lovable.dev/privacy" target="_blank" rel="noreferrer">
              Lovable's privacy policy
            </a>{" "}
            explains how it handles it.
          </p>
          <p>
            It records the pages visited, where visitors came from, their country, browser,
            operating system and device type, how long they stay, how fast pages load, errors, and
            which buttons and links are clicked. This is recorded for every visitor. Detailed data
            is kept for 90 days and daily summaries for a year.
          </p>
          <p>
            The site loads its fonts from Google Fonts, which means your browser connects to Google
            to download them.
          </p>

          <h2>5. Your choices</h2>
          <p>
            You can ask us to see, correct or delete the information you sent us. Contact us using
            the details on our <Link to="/contact">Contact page</Link>.
          </p>

          <h2>6. Contact</h2>
          <p>
            {SITE.name} — {CONTACT.email}
          </p>
          <p>
            This policy may be updated as our services grow. Any changes will appear on this page.
          </p>
        </div>
      </section>
    </>
  );
}
