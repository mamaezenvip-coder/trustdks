ALTER TABLE public.key_activations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paused_days_left INTEGER;

ALTER TABLE public.key_activations
  DROP CONSTRAINT IF EXISTS key_activations_status_check;
ALTER TABLE public.key_activations
  ADD CONSTRAINT key_activations_status_check CHECK (status IN ('active','paused','blocked'));

-- Admins can read and manage all activations
DROP POLICY IF EXISTS "Admins can view all activations" ON public.key_activations;
CREATE POLICY "Admins can view all activations"
ON public.key_activations FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all activations" ON public.key_activations;
CREATE POLICY "Admins can update all activations"
ON public.key_activations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert activations" ON public.key_activations;
CREATE POLICY "Admins can insert activations"
ON public.key_activations FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Renew: extends (or creates) a manual activation for a user
CREATE OR REPLACE FUNCTION public.admin_renew_client(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_act public.key_activations;
  v_base TIMESTAMPTZ;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF p_days IS NULL OR p_days <= 0 OR p_days > 3650 THEN
    RAISE EXCEPTION 'invalid days';
  END IF;

  SELECT * INTO v_act FROM public.key_activations
  WHERE user_id = p_user_id ORDER BY expires_at DESC LIMIT 1;

  IF v_act.id IS NULL THEN
    INSERT INTO public.key_activations (user_id, expires_at, source, status)
    VALUES (p_user_id, now() + (p_days || ' days')::interval, 'admin', 'active')
    RETURNING * INTO v_act;
  ELSE
    v_base := GREATEST(v_act.expires_at, now());
    UPDATE public.key_activations
      SET expires_at = v_base + (p_days || ' days')::interval,
          status = 'active',
          paused_at = NULL,
          paused_days_left = NULL,
          source = 'admin'
      WHERE id = v_act.id
      RETURNING * INTO v_act;
  END IF;

  RETURN jsonb_build_object('success', true, 'expires_at', v_act.expires_at, 'status', v_act.status);
END;
$$;

-- Status control: active / paused / blocked
CREATE OR REPLACE FUNCTION public.admin_set_client_status(p_user_id UUID, p_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_act public.key_activations;
  v_left INTEGER;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF p_status NOT IN ('active','paused','blocked') THEN
    RAISE EXCEPTION 'invalid status';
  END IF;

  SELECT * INTO v_act FROM public.key_activations
  WHERE user_id = p_user_id ORDER BY expires_at DESC LIMIT 1;

  IF v_act.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cliente sem ativação');
  END IF;

  IF p_status = 'paused' THEN
    v_left := GREATEST(0, CEIL(EXTRACT(EPOCH FROM (v_act.expires_at - now())) / 86400))::INTEGER;
    UPDATE public.key_activations
      SET status = 'paused', paused_at = now(), paused_days_left = v_left
      WHERE id = v_act.id RETURNING * INTO v_act;
  ELSIF p_status = 'active' THEN
    IF v_act.status = 'paused' AND v_act.paused_days_left IS NOT NULL THEN
      UPDATE public.key_activations
        SET status = 'active',
            expires_at = now() + (v_act.paused_days_left || ' days')::interval,
            paused_at = NULL, paused_days_left = NULL
        WHERE id = v_act.id RETURNING * INTO v_act;
    ELSE
      UPDATE public.key_activations
        SET status = 'active', paused_at = NULL, paused_days_left = NULL
        WHERE id = v_act.id RETURNING * INTO v_act;
    END IF;
  ELSE
    UPDATE public.key_activations
      SET status = 'blocked'
      WHERE id = v_act.id RETURNING * INTO v_act;
  END IF;

  RETURN jsonb_build_object('success', true, 'status', v_act.status, 'expires_at', v_act.expires_at);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_renew_client(UUID, INTEGER) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_client_status(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_renew_client(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_client_status(UUID, TEXT) TO authenticated;