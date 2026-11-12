CREATE OR REPLACE FUNCTION public.sync_current_user_profile()
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text;
  v_display_name text;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Not authenticated');
  END IF;
  SELECT lower(email), COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1))
  INTO v_email, v_display_name FROM auth.users WHERE id = v_user_id;

  INSERT INTO public.profiles (id, email, display_name, avatar_url, last_seen_at)
  SELECT v_user_id, v_email, v_display_name, raw_user_meta_data->>'avatar_url', now()
  FROM auth.users WHERE id = v_user_id
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        last_seen_at = now();

  INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  IF v_email = 'mamaezensuperapp@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  -- Trial only once per user; never conflicts with an existing (even expired) activation
  INSERT INTO public.key_activations (user_id, license_key_id, source, activated_at, expires_at)
  VALUES (v_user_id, NULL, 'trial', now(), now() + interval '7 days')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN json_build_object('success', true, 'is_admin', v_email = 'mamaezensuperapp@gmail.com');
END;
$function$;
