<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Site-wide text that may change (name, tagline, placeholder contact details, help categories) lives in `src/lib/site.ts`; pages read from it so edits happen in one place.
- Form validation rules live as zod schemas in `src/lib/forms.ts` with tests beside them; forms validate on the client against these schemas.
- The public header/footer are rendered in `__root.tsx` and hidden on `/admin*`, which has its own layout.
- `/admin` uses real email/password sign-in (no sign-up in the app) and shows the dashboard only when the user has a `public.user_roles` admin row; RLS (`private.has_role`) is the real guard. Both tabs read real rows; help-request status updates and confirmed deletion use the session-scoped client and verify affected rows so denied operations cannot appear successful.
- `help_requests` and `contact_messages` are insert-only for visitors (column-level INSERT grant, no SELECT), so the browser creates the UUID itself and shows it as the reference; never add `.select()` to that insert.
- Sitemap URLs derive from required route decisions through the versioned helper; exclude private subtrees and omit dates without page-specific content timestamps to avoid exposing private pages or misleading crawlers.
