-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Help requests
CREATE TABLE public.help_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 100),
  contact text NOT NULL CHECK (char_length(btrim(contact)) BETWEEN 3 AND 300),
  category text NOT NULL CHECK (category IN ('education', 'financial', 'medical', 'other')),
  description text NOT NULL CHECK (char_length(btrim(description)) BETWEEN 20 AND 1000),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Review', 'Approved', 'Closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Visitors may only supply these columns; status and created_at always use defaults.
GRANT INSERT (id, name, contact, category, description) ON public.help_requests TO anon;
GRANT INSERT (id, name, contact, category, description) ON public.help_requests TO authenticated;
-- Admin reads/status updates (still restricted to admins by RLS below).
GRANT SELECT ON public.help_requests TO authenticated;
GRANT UPDATE (status) ON public.help_requests TO authenticated;
GRANT ALL ON public.help_requests TO service_role;

ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a pending help request"
ON public.help_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'Pending');

CREATE POLICY "Admins can view help requests"
ON public.help_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update help request status"
ON public.help_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX help_requests_created_at_idx ON public.help_requests (created_at DESC);