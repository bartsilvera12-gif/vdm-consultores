-- VDM Consultores — bucket público para fotos del equipo.
--
-- El admin sube PNG/JPG desde la PC a este bucket (vía storage.from('vdm-team').upload()),
-- obtiene la URL pública y la guarda en public.vdm_team_members.photo_url.
--
-- Diseño:
--   - Bucket público (public = true) → las imágenes se sirven sin token.
--   - RLS sobre storage.objects: solo authenticated puede insertar / actualizar
--     / borrar objetos del bucket. SELECT lo cubre el flag public del bucket.
--   - Prefijo del archivo libre (lo decide el admin: ej. `team/<uuid>.jpg`).

-- -----------------------------------------------------------------------
-- Bucket (idempotente)
-- -----------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vdm-team',
  'vdm-team',
  true,
  2097152, -- 2 MiB; alineado con el límite del frontend.
  array['image/png', 'image/jpeg']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------------------------
-- Policies de escritura (solo authenticated). SELECT lo da el bucket público.
-- -----------------------------------------------------------------------
drop policy if exists "vdm_team_insert" on storage.objects;
create policy "vdm_team_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vdm-team');

drop policy if exists "vdm_team_update" on storage.objects;
create policy "vdm_team_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vdm-team')
  with check (bucket_id = 'vdm-team');

drop policy if exists "vdm_team_delete" on storage.objects;
create policy "vdm_team_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vdm-team');
