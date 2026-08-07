-- 1) Restrict media bucket reads to files belonging to active media tracks (or admins)
DROP POLICY IF EXISTS "Authenticated read media" ON storage.objects;

CREATE POLICY "Read published media files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'media'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.media_tracks mt
      WHERE mt.is_active = true
        AND (mt.audio_path = storage.objects.name OR mt.cover_path = storage.objects.name)
    )
  )
);

-- 2) Owner-scoped UPDATE policy for support tickets
DROP POLICY IF EXISTS "Users can update own tickets" ON public.support_tickets;

CREATE POLICY "Users can update own tickets"
ON public.support_tickets
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Ensure the admin update policy also has a WITH CHECK clause
DROP POLICY IF EXISTS "Admins can update tickets" ON public.support_tickets;

CREATE POLICY "Admins can update tickets"
ON public.support_tickets
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));