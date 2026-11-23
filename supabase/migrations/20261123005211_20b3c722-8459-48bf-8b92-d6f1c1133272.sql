CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(btrim(email)) BETWEEN 3 AND 255 AND email LIKE '%_@_%'),
  subject text NOT NULL CHECK (char_length(btrim(subject)) BETWEEN 2 AND 120),
  message text NOT NULL CHECK (char_length(btrim(message)) BETWEEN 10 AND 1000),
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Visitors may only supply these columns; read and created_at always use defaults.
GRANT INSERT (id, name, email, subject, message) ON public.contact_messages TO anon;
GRANT INSERT (id, name, email, subject, message) ON public.contact_messages TO authenticated;
-- Admin reads / mark as read (restricted to admins by RLS below).
GRANT SELECT ON public.contact_messages TO authenticated;
GRANT UPDATE (read) ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send an unread contact message"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (read = false);

CREATE POLICY "Admins can view contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can mark contact messages read"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE INDEX contact_messages_created_at_idx ON public.contact_messages (created_at DESC);