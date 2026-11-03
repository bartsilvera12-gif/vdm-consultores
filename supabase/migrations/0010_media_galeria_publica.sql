-- VDM Consultores — la galería de /nosotros lista las fotos de /admin/imagenes.
-- El bucket ya es público (cada URL se ve sin login), pero listar sus archivos
-- solo lo podía el admin. Esto deja listar al visitante, solo en 'vdm-media'.

begin;

drop policy if exists "vdm_media_list_public" on storage.objects;
create policy "vdm_media_list_public"
  on storage.objects for select
  to anon
  using (bucket_id = 'vdm-media');

commit;
