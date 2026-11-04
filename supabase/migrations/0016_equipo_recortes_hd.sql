-- VDM Consultores — retratos del equipo recortados a resolución completa
-- (los anteriores estaban achicados a 720 px). Otro nombre de archivo porque
-- el hosting guarda las imágenes en caché un año.

begin;

update public.vdm_team_members
set photo_url = replace(photo_url, '-recorte.webp', '-hd.webp')
where photo_url like 'https://vdmconsultores.com.py/fotos-equipo/%-recorte.webp';

commit;
