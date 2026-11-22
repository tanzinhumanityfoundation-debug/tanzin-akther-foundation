-- 1. rls_auto_enable: keep the event trigger, remove direct execution by API roles.
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- 2. Remove privileges that bypass or sit outside RLS (TRUNCATE ignores RLS entirely).
REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON public.help_requests FROM PUBLIC, anon, authenticated;
REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON public.user_roles FROM PUBLIC, anon, authenticated;

-- 3. Stop future tables created by postgres from granting these to API roles.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLES FROM anon, authenticated;

-- 4. Self-check: the event trigger must still enable RLS on a new table.
DO $$
DECLARE enabled boolean;
BEGIN
  CREATE TABLE public.zz_rls_selfcheck (id int);
  SELECT relrowsecurity INTO enabled FROM pg_class WHERE oid = 'public.zz_rls_selfcheck'::regclass;
  DROP TABLE public.zz_rls_selfcheck;
  IF NOT enabled THEN
    RAISE EXCEPTION 'rls_auto_enable no longer enables RLS on new tables';
  END IF;
END $$;