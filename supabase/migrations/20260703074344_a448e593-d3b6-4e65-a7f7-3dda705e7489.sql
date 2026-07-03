ALTER TABLE public.license_keys
ADD COLUMN IF NOT EXISTS duration_days integer NOT NULL DEFAULT 360;

UPDATE public.license_keys
SET duration_days = 360
WHERE duration_days IS NULL OR duration_days <= 0;

CREATE OR REPLACE FUNCTION public.normalize_license_key(p_key text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT upper(regexp_replace(trim(both ' "''“”‘’`´\t\n\r' from coalesce(p_key, '')), '[^A-Za-z0-9-]', '', 'g'))
$$;

CREATE OR REPLACE FUNCTION public.ensure_admin_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_admin_email text := 'mamaezensuperapp@gmail.com';
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = v_admin_email LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.profiles (id, email, display_name)
    VALUES (v_user_id, v_admin_email, 'Admin Mamãe Zen')
    ON CONFLICT (id) DO UPDATE
      SET email = EXCLUDED.email,
          display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
          last_seen_at = now();
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_current_user_profile()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text;
  v_display_name text;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Not authenticated');
  END IF;

  SELECT
    lower(email),
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1))
  INTO v_email, v_display_name
  FROM auth.users
  WHERE id = v_user_id;

  INSERT INTO public.profiles (id, email, display_name, avatar_url, last_seen_at)
  SELECT
    v_user_id,
    v_email,
    v_display_name,
    raw_user_meta_data->>'avatar_url',
    now()
  FROM auth.users
  WHERE id = v_user_id
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        last_seen_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  IF v_email = 'mamaezensuperapp@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  INSERT INTO public.key_activations (user_id, license_key_id, source, activated_at, expires_at)
  SELECT v_user_id, NULL, 'trial', now(), now() + interval '7 days'
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.key_activations
    WHERE user_id = v_user_id
      AND expires_at > now()
  );

  RETURN json_build_object('success', true, 'is_admin', v_email = 'mamaezensuperapp@gmail.com');
END;
$$;

GRANT EXECUTE ON FUNCTION public.normalize_license_key(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.sync_current_user_profile() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.ensure_admin_role() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.activate_license_key(p_key text, p_device_id text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_key_id uuid;
  v_existing record;
  v_expires_at timestamptz;
  v_normalized_key text;
  v_duration_days integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Not authenticated');
  END IF;

  v_normalized_key := public.normalize_license_key(p_key);

  IF v_normalized_key !~ '^MZ-[A-Z0-9]{4,5}-[A-Z0-9]{4,5}-[A-Z0-9]{4,5}-[A-Z0-9]{4,5}$' THEN
    RETURN json_build_object('success', false, 'message', 'Invalid key format');
  END IF;

  SELECT * INTO v_existing
  FROM public.key_activations
  WHERE user_id = auth.uid()
    AND expires_at > now()
    AND source = 'key'
  ORDER BY expires_at DESC
  LIMIT 1;

  IF v_existing IS NOT NULL THEN
    RETURN json_build_object('success', true, 'message', 'Already activated', 'expires_at', v_existing.expires_at);
  END IF;

  SELECT id, duration_days INTO v_key_id, v_duration_days
  FROM public.license_keys
  WHERE public.normalize_license_key(key) = v_normalized_key
    AND is_used = false
  LIMIT 1;

  IF v_key_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid or already used key');
  END IF;

  UPDATE public.license_keys
  SET is_used = true,
      key = v_normalized_key
  WHERE id = v_key_id;

  v_expires_at := now() + make_interval(days => greatest(1, coalesce(v_duration_days, 360)));

  DELETE FROM public.key_activations WHERE user_id = auth.uid();

  INSERT INTO public.key_activations (user_id, license_key_id, device_id, source, activated_at, expires_at)
  VALUES (auth.uid(), v_key_id, left(coalesce(p_device_id, ''), 100), 'key', now(), v_expires_at);

  RETURN json_build_object('success', true, 'message', 'Key activated successfully', 'expires_at', v_expires_at);
END;
$$;

GRANT EXECUTE ON FUNCTION public.activate_license_key(text,text) TO authenticated, service_role;

SELECT public.ensure_admin_role();