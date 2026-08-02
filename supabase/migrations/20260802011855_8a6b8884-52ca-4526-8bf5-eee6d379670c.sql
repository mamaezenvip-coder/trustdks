-- 1) Restrict license_keys SELECT to admins only
DROP POLICY IF EXISTS "Authenticated users can check keys" ON public.license_keys;
CREATE POLICY "Admins can view license keys"
ON public.license_keys
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Lock down SECURITY DEFINER / internal functions
REVOKE ALL ON FUNCTION public.ensure_admin_role() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.set_media_tracks_updated_at() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;

REVOKE ALL ON FUNCTION public.activate_license_key(text, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.activate_license_key(text, text) TO authenticated;

REVOKE ALL ON FUNCTION public.sync_current_user_profile() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.sync_current_user_profile() TO authenticated;

REVOKE ALL ON FUNCTION public.normalize_license_key(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.normalize_license_key(text) TO authenticated;