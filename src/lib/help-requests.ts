import { CONTACT_METHODS, helpRequestSchema } from "./forms";

/** The exact columns a visitor is allowed to send. Status and date are set by the database. */
export interface HelpRequestRow {
  id: string;
  name: string;
  contact: string;
  category: string;
  description: string;
}

/** Short, human-friendly reference shown to the visitor, e.g. "TAF-3F9A1C2B". */
export function formatReference(id: string) {
  return `TAF-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/** Validates form values and turns them into a database row. Throws if the values are invalid. */
export function toHelpRequestRow(values: unknown, id: string): HelpRequestRow {
  const data = helpRequestSchema.parse(values);
  const method = CONTACT_METHODS.find((m) => m.id === data.contactMethod)?.label ?? data.contactMethod;
  return {
    id,
    name: data.fullName,
    contact: `${method}: ${data.contactDetail}`,
    category: data.category,
    description: data.description,
  };
}

/**
 * Saves a help request. Visitors can only add requests — they can never read them back —
 * so the ID is created here and used as the visitor's reference.
 */
export async function submitHelpRequest(values: unknown) {
  const { supabase } = await import("@/integrations/supabase/client");
  const id = crypto.randomUUID();
  const row = toHelpRequestRow(values, id);
  // No .select(): visitors have no read access, so the insert must not ask for the row back.
  const { error } = await supabase.from("help_requests").insert(row);
  if (error) throw new Error(error.message);
  return { id, reference: formatReference(id), name: row.name };
}
