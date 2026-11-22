import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/site/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_METHODS } from "@/lib/forms";
import {
  SAMPLE_MESSAGES,
  SAMPLE_REQUESTS,
  STATUS_LABELS,
  type RequestStatus,
  type SampleHelpRequest,
} from "@/lib/sample-data";
import { categoryTitle, HELP_CATEGORIES } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Tanzin Akther Foundation" },
      { name: "description", content: "Private area for authorized administrators." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard — Tanzin Akther Foundation" },
      { property: "og:description", content: "Private area for authorized administrators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const STATUS_STYLES: Record<RequestStatus, string> = {
  new: "bg-secondary text-secondary-foreground",
  in_review: "bg-warm-soft text-foreground",
  approved: "bg-primary-soft text-primary-deep",
  closed: "bg-muted text-muted-foreground",
};

const selectClass =
  "field flex w-full rounded-md border border-input px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function AdminPage() {
  // Design preview only: real, secure sign-in is added when a database is connected.
  const [signedIn, setSignedIn] = useState(false);
  return signedIn ? (
    <Dashboard onSignOut={() => setSignedIn(false)} />
  ) : (
    <SignIn onSignIn={() => setSignedIn(true)} />
  );
}

function SignIn({ onSignIn }: { onSignIn: () => void }) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSignIn();
  };
  return (
    <div className="bg-hero flex min-h-screen flex-col">
      <div className="container-page flex items-center justify-between py-5">
        <Logo />
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Back to website
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
          <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-semibold">Administrator sign-in</h1>
          <p className="mt-2 text-muted-foreground">
            This area is only for authorized team members.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-base font-semibold">
                Email
              </Label>
              <Input id="admin-email" type="email" autoComplete="username" className="h-11 text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-base font-semibold">
                Password
              </Label>
              <Input id="admin-password" type="password" autoComplete="current-password" className="h-11 text-base" />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="mt-5 rounded-lg bg-warm-soft p-3 text-sm text-foreground">
            Design preview: sign-in is not active yet, so any entry opens the sample dashboard.
            Real protection will be added when the database is connected.
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<"requests" | "messages">("requests");
  const [requests, setRequests] = useState<SampleHelpRequest[]>(SAMPLE_REQUESTS);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [openMsgId, setOpenMsgId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<RequestStatus, number> = { new: 0, in_review: 0, approved: 0, closed: 0 };
    for (const r of requests) c[r.status] += 1;
    return c;
  }, [requests]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...requests]
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
      .filter((r) => statusFilter === "all" || r.status === statusFilter)
      .filter((r) => categoryFilter === "all" || r.category === categoryFilter)
      .filter(
        (r) =>
          !q ||
          r.fullName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
  }, [requests, statusFilter, categoryFilter, query]);

  const open = requests.find((r) => r.id === openId) ?? null;
  const openMsg = messages.find((m) => m.id === openMsgId) ?? null;
  const unread = messages.filter((m) => !m.read).length;

  const nav = [
    { id: "requests" as const, label: "Help requests", icon: Inbox, count: counts.new },
    { id: "messages" as const, label: "Contact messages", icon: Mail, count: unread },
  ];

  return (
    <div className="min-h-screen bg-muted lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <aside className="bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between gap-3 p-5 lg:flex-col lg:items-start">
          <Logo inverse />
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
          >
            <LogOut /> Sign out
          </Button>
        </div>
        <nav aria-label="Dashboard" className="flex gap-2 overflow-x-auto px-5 pb-4 lg:flex-col lg:px-3">
          {nav.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setTab(n.id)}
              aria-current={tab === n.id ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[0.95rem] font-medium transition-colors",
                tab === n.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
              )}
            >
              <n.icon className="size-5" aria-hidden="true" />
              <span className="flex-1">{n.label}</span>
              {n.count > 0 ? (
                <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-xs font-bold text-sidebar-primary-foreground">
                  {n.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="hidden p-5 lg:absolute lg:bottom-0 lg:block lg:w-full">
          <div className="rounded-xl border border-sidebar-border p-4 text-sm text-sidebar-foreground/80">
            Signed in as <span className="font-semibold text-sidebar-foreground">Sample Admin</span>
          </div>
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="mt-3 w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0">
        <div className="border-b border-border bg-warm-soft px-5 py-2.5 text-center text-sm text-foreground md:px-8">
          Sample data only — these are fictional entries for design preview.
        </div>

        <div className="mx-auto max-w-6xl space-y-8 p-5 md:p-8">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <LayoutDashboard className="size-4" /> Admin dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                {tab === "requests" ? "Help requests" : "Contact messages"}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">Visible only to authorized administrators.</p>
          </header>

          {tab === "requests" ? (
            <>
              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {(Object.keys(STATUS_LABELS) as RequestStatus[]).map((s) => (
                  <li key={s} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <p className="text-sm font-medium text-muted-foreground">{STATUS_LABELS[s]}</p>
                    <p className="mt-1 font-display text-4xl font-semibold text-primary-deep">{counts[s]}</p>
                  </li>
                ))}
              </ul>

              <section aria-label="Requests" className="rounded-2xl border border-border bg-card shadow-soft">
                <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:p-5">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      aria-label="Search requests"
                      placeholder="Search by name, reference or text"
                      className="h-11 text-base pl-9"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <select
                    aria-label="Filter by status"
                    className={cn(selectClass, "md:w-44")}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "all")}
                  >
                    <option value="all">All statuses</option>
                    {(Object.keys(STATUS_LABELS) as RequestStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Filter by category"
                    className={cn(selectClass, "md:w-52")}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All categories</option>
                    {HELP_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {filtered.length === 0 ? (
                  <p className="p-10 text-center text-muted-foreground">No requests match these filters.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {filtered.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => setOpenId(r.id)}
                          className="grid w-full gap-2 p-4 text-left transition-colors hover:bg-muted md:grid-cols-[7rem_1fr_10rem_7rem_6.5rem] md:items-center md:gap-4 md:px-5"
                        >
                          <span className="text-sm font-semibold text-muted-foreground">{r.id}</span>
                          <span className="min-w-0">
                            <span className="block font-semibold text-foreground">{r.fullName}</span>
                            <span className="block truncate text-sm text-muted-foreground">{r.description}</span>
                          </span>
                          <span className="text-sm text-foreground">{categoryTitle(r.category)}</span>
                          <span className="text-sm text-muted-foreground">{formatDate(r.submittedAt)}</span>
                          <span>
                            <Badge className={cn("rounded-full border-0 shadow-none", STATUS_STYLES[r.status])}>
                              {STATUS_LABELS[r.status]}
                            </Badge>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          ) : (
            <section aria-label="Messages" className="rounded-2xl border border-border bg-card shadow-soft">
              <ul className="divide-y divide-border">
                {messages.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMsgId(m.id);
                        setMessages((all) => all.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
                      }}
                      className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-muted md:px-5"
                    >
                      <span
                        className={cn("mt-2 size-2.5 shrink-0 rounded-full", m.read ? "bg-border" : "bg-primary")}
                        aria-label={m.read ? "Read" : "Unread"}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className={cn("text-foreground", !m.read && "font-semibold")}>{m.subject}</span>
                          <span className="text-sm text-muted-foreground">{formatDate(m.receivedAt)}</span>
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {m.name} · {m.email}
                        </span>
                        <span className="mt-1 block truncate text-sm text-muted-foreground">{m.message}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <RequestDialog
        request={open}
        onClose={() => setOpenId(null)}
        onSave={(updated) => {
          setRequests((all) => all.map((r) => (r.id === updated.id ? updated : r)));
          setOpenId(null);
          toast.success(`${updated.id} updated`, { description: "Sample data — changes are not saved." });
        }}
      />

      <Dialog open={!!openMsg} onOpenChange={(o) => !o && setOpenMsgId(null)}>
        <DialogContent className="max-w-lg">
          {openMsg ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-primary-deep">{openMsg.subject}</DialogTitle>
                <DialogDescription>
                  From {openMsg.name} ({openMsg.email}) · {formatDate(openMsg.receivedAt)}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-line text-foreground">{openMsg.message}</p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequestDialog({
  request,
  onClose,
  onSave,
}: {
  request: SampleHelpRequest | null;
  onClose: () => void;
  onSave: (r: SampleHelpRequest) => void;
}) {
  return (
    <Dialog open={!!request} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        {request ? <RequestDetail key={request.id} request={request} onSave={onSave} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function RequestDetail({
  request,
  onSave,
}: {
  request: SampleHelpRequest;
  onSave: (r: SampleHelpRequest) => void;
}) {
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [note, setNote] = useState(request.note);
  const method = CONTACT_METHODS.find((m) => m.id === request.contactMethod)?.label;

  return (
    <>
      <DialogHeader>
        <p className="text-sm font-semibold text-muted-foreground">{request.id}</p>
        <DialogTitle className="font-display text-2xl text-primary-deep">{request.fullName}</DialogTitle>
        <DialogDescription>
          {categoryTitle(request.category)} · Submitted {formatDate(request.submittedAt)}
        </DialogDescription>
      </DialogHeader>

      <dl className="grid gap-4 rounded-xl bg-muted p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-foreground">Preferred contact</dt>
          <dd className="text-muted-foreground">{method}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Contact detail</dt>
          <dd className="break-words text-muted-foreground">{request.contactDetail}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-foreground">Consent</dt>
          <dd className="text-muted-foreground">Given when submitted</dd>
        </div>
      </dl>

      <div>
        <h3 className="font-sans text-sm font-semibold text-foreground">Description</h3>
        <p className="mt-1 text-foreground">{request.description}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="font-semibold">
          Status
        </Label>
        <select
          id="status"
          className={selectClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as RequestStatus)}
        >
          {(Object.keys(STATUS_LABELS) as RequestStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="note" className="font-semibold">
          Internal note (only visible to admins)
        </Label>
        <Textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
      </div>

      <DialogFooter className="gap-2">
        <Button onClick={() => onSave({ ...request, status, note })}>Save changes</Button>
      </DialogFooter>
    </>
  );
}
