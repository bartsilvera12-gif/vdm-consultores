-- VDM Consultores — bucket público general de imágenes.
--
-- Pensado para subir imágenes sueltas desde /admin/imagenes y usarlas
-- después donde haga falta (banner, portada, fotos de servicios, etc.).
--
-- - Bucket público: las URL funcionan sin auth.
-- - 5 MiB por archivo, cualquier tipo de imagen.
-- - Policies: authenticated puede INSERT/UPDATE/DELETE/LIST; público lee
--   gracias al flag public del bucket.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vdm-media',
  'vdm-media',
  true,
  5242880, -- 5 MiB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "vdm_media_insert" on storage.objects;
create policy "vdm_media_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vdm-media');

drop policy if exists "vdm_media_update" on storage.objects;
create policy "vdm_media_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vdm-media')
  with check (bucket_id = 'vdm-media');

drop policy if exists "vdm_media_delete" on storage.objects;
create policy "vdm_media_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vdm-media');

-- Para que el admin pueda listar los archivos del bucket desde el UI.
drop policy if exists "vdm_media_list" on storage.objects;
create policy "vdm_media_list"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'vdm-media');
