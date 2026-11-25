import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Inbox,
  Loader2,
  LayoutDashboard,
  LogOut,
  Mail,
  Trash2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent } from "react";
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

import {
  fetchContactMessages,
  markContactMessageRead,
  type ContactMessage,
} from "@/lib/contact-messages";
import { fetchHelpRequests, deleteHelpRequest, updateHelpRequestStatus, formatReference, type AdminHelpRequest } from "@/lib/help-requests";
import {
  STATUS_LABELS,
  type RequestStatus,
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

type AuthState =
  | { kind: "loading" }
  | { kind: "signed_out" }
  | { kind: "not_admin"; email: string }
  | { kind: "admin"; email: string };

async function getSupabase() {
  return (await import("@/integrations/supabase/client")).supabase;
}

/** Reads the signed-in user (re-checked with the auth server) and whether they hold the admin role. */
async function resolveAuth(): Promise<AuthState> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { kind: "signed_out" };
  const email = data.user.email ?? "Signed-in account";
  // RLS only lets a user see their own role rows, so this cannot reveal other admins.
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin");
  return roles && roles.length > 0 ? { kind: "admin", email } : { kind: "not_admin", email };
}

function AdminPage() {
  const [auth, setAuth] = useState<AuthState>({ kind: "loading" });
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    const refresh = () => resolveAuth().then((next) => active && setAuth(next));
    refresh();
    getSupabase().then((supabase) => {
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
        queryClient.removeQueries({ queryKey: ["admin"] });
        refresh();
      });
      unsubscribe = () => data.subscription.unsubscribe();
      if (!active) unsubscribe();
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [queryClient]);

  const signOut = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    queryClient.removeQueries({ queryKey: ["admin"] });
    setAuth({ kind: "signed_out" });
  };

  if (auth.kind === "loading") {
    return (
      <div className="bg-hero flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }
  if (auth.kind === "admin") return <Dashboard email={auth.email} onSignOut={signOut} />;
  return <SignIn notAdminEmail={auth.kind === "not_admin" ? auth.email : null} onSignOut={signOut} />;
}

function SignIn({
  notAdminEmail,
  onSignOut,
}: {
  notAdminEmail: string | null;
  onSignOut: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      const supabase = await getSupabase();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) setError("Sign-in failed. Please check your email and password.");
      else setPassword("");
    } catch {
      setError("Couldn't reach the server. Please try again in a few minutes.");
    } finally {
      setBusy(false);
    }
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

          {notAdminEmail ? (
            <div role="alert" className="mt-6 space-y-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-destructive">
              <p className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{notAdminEmail}</span> is not an authorized
                  administrator.
                </span>
              </p>
              <Button variant="outline" size="sm" onClick={onSignOut}>
                <LogOut /> Sign out
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-base font-semibold">
                  Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  className="h-11 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-base font-semibold">
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  className="h-11 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error ? (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {error}
                </p>
              ) : null}
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
                Sign in
              </Button>
            </form>
          )}
          <p className="mt-5 text-sm text-muted-foreground">
            Admin accounts are created by the foundation.
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<"requests" | "messages">("requests");
  const requestsQuery = useQuery({ queryKey: ["admin", "help-requests"], queryFn: fetchHelpRequests });
  const requests = requestsQuery.data ?? [];
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const messagesQuery = useQuery({ queryKey: ["admin", "contact-messages"], queryFn: fetchContactMessages });
  const messages: ContactMessage[] = messagesQuery.data ?? [];
  const markRead = useMutation({
    mutationFn: markContactMessageRead,
    onMutate: (id: string) => {
      queryClient.setQueryData<ContactMessage[]>(["admin", "contact-messages"], (all) =>
        all?.map((m) => (m.id === id ? { ...m, read: true } : m)),
      );
    },
    onError: () => {
      toast.error("Couldn't mark the message as read. Please try again.");
      queryClient.invalidateQueries({ queryKey: ["admin", "contact-messages"] });
    },
  });
  const removeRequest = useMutation({
    mutationFn: deleteHelpRequest,
    onSuccess: (_, id) => {
      queryClient.setQueryData<AdminHelpRequest[]>(["admin", "help-requests"], (all) => all?.filter((r) => r.id !== id));
      setDeleteId(null);
      setOpenId(null);
      toast.success("Request deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin", "help-requests"] });
    },
    onError: () => toast.error("Couldn't delete the request. Please try again."),
  });
  const saveStatus = useMutation({
    mutationFn: updateHelpRequestStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "help-requests"] });
      setOpenId(null);
      toast.success("Request updated.");
    },
    onError: () => toast.error("Couldn't update the request. Please try again."),
  });
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
            Signed in as <span className="break-all font-semibold text-sidebar-foreground">{email}</span>
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
          {tab === "requests"
            ? "Help requests"
            : "Contact messages: real messages sent through the website."}
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

                {requestsQuery.isPending ? (
                  <p className="flex items-center justify-center gap-2 p-10 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Loading requests…</p>
                ) : requestsQuery.isError ? (
                  <div role="alert" className="p-10 text-center"><p className="text-destructive">Couldn't load requests.</p><Button variant="outline" onClick={() => requestsQuery.refetch()}>Try again</Button></div>
                ) : filtered.length === 0 ? (
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
                          <span className="text-sm font-semibold text-muted-foreground">{formatReference(r.id)}</span>
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
              {messagesQuery.isPending ? (
                <p className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Loading messages…
                </p>
              ) : messagesQuery.isError ? (
                <div role="alert" className="space-y-3 p-10 text-center">
                  <p className="text-destructive">Couldn't load messages. Please try again.</p>
                  <Button variant="outline" size="sm" onClick={() => messagesQuery.refetch()}>
                    Try again
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <p className="p-10 text-center text-muted-foreground">No messages yet.</p>
              ) : (
              <ul className="divide-y divide-border">
                {messages.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMsgId(m.id);
                        if (!m.read) markRead.mutate(m.id);
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
                          <span className="text-sm text-muted-foreground">{formatDate(m.created_at)}</span>
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
              )}
            </section>
          )}
        </div>
      </div>

      <RequestDialog
        request={open}
        onClose={() => setOpenId(null)}
        onSave={(updated) => saveStatus.mutate(updated)}
        onDelete={(id) => setDeleteId(id)}
        busy={saveStatus.isPending || removeRequest.isPending}
      />

      <Dialog open={deleteId !== null} onOpenChange={(o) => { if (!o && !removeRequest.isPending) setDeleteId(null); }}>
        <DialogContent className="max-w-md" showCloseButton={!removeRequest.isPending}>
          <DialogHeader>
            <DialogTitle>Delete help request?</DialogTitle>
            <DialogDescription>This permanently deletes {deleteId ? formatReference(deleteId) : "the request"}. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={removeRequest.isPending} onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" disabled={removeRequest.isPending} onClick={() => { if (deleteId) removeRequest.mutate(deleteId); }}>
              {removeRequest.isPending ? <Loader2 className="animate-spin" /> : <Trash2 />} Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!openMsg} onOpenChange={(o) => !o && setOpenMsgId(null)}>
        <DialogContent className="max-w-lg">
          {openMsg ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-primary-deep">{openMsg.subject}</DialogTitle>
                <DialogDescription>
                  From {openMsg.name} ({openMsg.email}) · {formatDate(openMsg.created_at)}
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
  onDelete,
  busy,
}: {
  request: AdminHelpRequest | null;
  onClose: () => void;
  onSave: (r: AdminHelpRequest) => void;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  return (
    <Dialog open={!!request} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        {request ? <RequestDetail key={request.id} request={request} onSave={onSave} onDelete={onDelete} busy={busy} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function RequestDetail({
  request,
  onSave,
  onDelete,
  busy,
}: {
  request: AdminHelpRequest;
  onSave: (r: AdminHelpRequest) => void;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  const [status, setStatus] = useState<RequestStatus>(request.status);


  return (
    <>
      <DialogHeader>
        <p className="text-sm font-semibold text-muted-foreground">{formatReference(request.id)}</p>
        <DialogTitle className="font-display text-2xl text-primary-deep">{request.fullName}</DialogTitle>
        <DialogDescription>
          {categoryTitle(request.category)} · Submitted {formatDate(request.submittedAt)}
        </DialogDescription>
      </DialogHeader>

      <dl className="grid gap-4 rounded-xl bg-muted p-4 text-sm sm:grid-cols-2">
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
      <DialogFooter className="gap-2">
        <Button variant="destructive" disabled={busy} onClick={() => onDelete(request.id)}><Trash2 /> Delete request</Button>
        <Button disabled={busy} onClick={() => onSave({ ...request, status })}>Save changes</Button>
      </DialogFooter>
    </>
  );
}
