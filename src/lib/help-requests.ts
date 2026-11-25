import { CONTACT_METHODS, helpRequestSchema } from "./forms";
import type { RequestStatus } from "./sample-data";

export interface AdminHelpRequest {
  id: string;
  fullName: string;
  contactDetail: string;
  category: string;
  description: string;
  status: RequestStatus;
  submittedAt: string;
}

const DATABASE_STATUSES: Record<RequestStatus, string> = {
  new: "Pending", in_review: "In Review", approved: "Approved", closed: "Closed",
};

export async function fetchHelpRequests(): Promise<AdminHelpRequest[]> {
  const { supabase } = await import("@/integrations/supabase/client");
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from("help_requests")
      .select("id,name,contact,category,description,status,created_at")
      .order("created_at", { ascending: false }).order("id").range(offset, offset + 499);
    if (error) throw new Error(error.message);
    rows.push(...data);
    if (data.length < 500) break;
  }
  return rows.map((r) => ({
    id: r.id, fullName: r.name, contactDetail: r.contact, category: r.category,
    description: r.description, submittedAt: r.created_at,
    status: (Object.keys(DATABASE_STATUSES) as RequestStatus[]).find((s) => DATABASE_STATUSES[s] === r.status) ?? "new",
  }));
}

export async function updateHelpRequestStatus(request: AdminHelpRequest) {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.from("help_requests")
    .update({ status: DATABASE_STATUSES[request.status] }).eq("id", request.id).select("id");
  if (error) throw new Error(error.message);
  if (data.length !== 1) throw new Error("Request not updated. Check your access and try again.");
}

/** RLS authorizes deletion; the returned ID proves that the row was actually removed. */
export async function deleteHelpRequest(id: string) {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.from("help_requests").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (data.length !== 1) throw new Error("Request not deleted. Check your access and try again.");
  return data[0]?.id;
}

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
