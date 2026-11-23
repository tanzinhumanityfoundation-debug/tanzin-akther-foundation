import { contactSchema } from "./forms";

/** The exact columns a visitor is allowed to send. "read" and the date are set by the database. */
export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactMessageRow {
  read: boolean;
  created_at: string;
}

/** Validates form values and turns them into a database row. Throws if the values are invalid. */
export function toContactMessageRow(values: unknown, id: string): ContactMessageRow {
  const data = contactSchema.parse(values);
  return { id, name: data.name, email: data.email, subject: data.subject, message: data.message };
}

async function client() {
  return (await import("@/integrations/supabase/client")).supabase;
}

/** Saves a contact message. Visitors can only add messages — never read them back. */
export async function submitContactMessage(values: unknown) {
  const supabase = await client();
  const row = toContactMessageRow(values, crypto.randomUUID());
  // No .select(): visitors have no read access.
  const { error } = await supabase.from("contact_messages").insert(row);
  if (error) throw new Error(error.message);
}

/** Admin only (enforced by the database): newest messages first. */
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const supabase = await client();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, read, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data;
}

/** Admin only (enforced by the database). */
export async function markContactMessageRead(id: string) {
  const supabase = await client();
  const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", id);
  if (error) throw new Error(error.message);
}
