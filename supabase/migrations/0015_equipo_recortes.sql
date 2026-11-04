-- VDM Consultores — Equipo con los retratos recortados (fondo transparente)
-- para que se vean sobre las formas de color de la página /equipo.

begin;

update public.vdm_team_members
set photo_url = replace(photo_url, '-boceto.webp', '-recorte.webp')
where photo_url like 'https://vdmconsultores.com.py/fotos-equipo/%-boceto.webp';

commit;
