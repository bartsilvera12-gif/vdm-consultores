-- VDM Consultores — equipo como en el boceto de la clienta (2026-11-04):
-- orden, fotos del boceto, cargos nuevos y María Beatriz Montero. Además, el
-- "mundito" de Inversiones pasa a la escalera que sube.

begin;

-- Orden del boceto: primero las tres de cuerpo entero, después el resto.
update public.vdm_team_members m
set position  = v.position,
    photo_url = 'https://vdmconsultores.com.py/fotos-equipo/' || v.foto || '-boceto.webp'
from (values
  ('Mgtr. Giselle Vera',   10, 'giselle-vera'),
  ('Fernanda Portugal',    20, 'fernanda-portugal'),
  ('Arq. Roxana Montero',  30, 'roxana-montero'),
  ('Lic. Luis Alcaraz',    40, 'luis-alcaraz'),
  ('Lic. Tania Torres',    50, 'tania-torres'),
  ('Abg. Javier Martínez', 60, 'javier-martinez'),
  ('Lic. Maura Delvalle',  80, 'maura-delvalle')
) as v(name, position, foto)
where m.name = v.name;

update public.vdm_team_members
set role = 'Directora General y Responsable del área de Inversiones y Licencias Ambientales'
where name = 'Mgtr. Giselle Vera';

update public.vdm_team_members
set role = 'Asesora Comercial'
where name = 'Fernanda Portugal';

insert into public.vdm_team_members (name, role, photo_url, position)
select 'María Beatriz Montero', 'Asesora Comercial',
       'https://vdmconsultores.com.py/fotos-equipo/maria-beatriz-montero-boceto.webp', 70
where not exists (
  select 1 from public.vdm_team_members where name = 'María Beatriz Montero'
);

-- Ícono de Inversiones: escalera en vez del globo (Servicios y Experiencia).
update public.vdm_areas set icon = 'stairs' where slug = 'inversiones';
update public.vdm_sectors set icon = 'stairs' where title = 'Inversionistas extranjeros';

commit;
