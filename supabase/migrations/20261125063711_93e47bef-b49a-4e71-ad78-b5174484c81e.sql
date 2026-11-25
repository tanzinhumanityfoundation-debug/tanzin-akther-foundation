DO $$
DECLARE
  target_id uuid;
BEGIN
  SELECT id INTO STRICT target_id FROM auth.users WHERE email = 'tanzinhumanityfoundation@gmail.com';
  INSERT INTO public.user_roles (user_id, role) VALUES (target_id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
END
$$;