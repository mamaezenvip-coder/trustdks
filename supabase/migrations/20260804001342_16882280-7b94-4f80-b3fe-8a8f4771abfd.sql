DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Authenticated read media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media');

CREATE POLICY "Admins can update license keys" ON public.license_keys FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete license keys" ON public.license_keys FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
GRANT UPDATE, DELETE ON public.license_keys TO authenticated;