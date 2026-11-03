-- VDM Consultores — fotos del equipo con el mismo fondo blanco.
-- Giselle, Fernanda y Roxana tenían fondo gris; las nuevas llevan otro nombre
-- porque el hosting cachea las imágenes un año.

begin;

update public.vdm_team_members
set photo_url = replace(photo_url, '.webp', '-blanco.webp')
where photo_url in (
  'https://vdmconsultores.com.py/fotos-equipo/giselle-vera.webp',
  'https://vdmconsultores.com.py/fotos-equipo/fernanda-portugal.webp',
  'https://vdmconsultores.com.py/fotos-equipo/roxana-montero.webp'
);

commit;
