-- VDM Consultores — integrantes reales del equipo (página /equipo).
-- Borra solo los placeholders "Nombre y apellido" del seed de 0002 y carga
-- los 7 perfiles entregados por VDM. Las fotos se sirven desde el hosting
-- (public/fotos-equipo/; no usar public/equipo: taparía la ruta /equipo); desde /admin/equipo se pueden cambiar como siempre.

begin;

delete from public.vdm_team_members
where lower(name) = 'nombre y apellido'
  and photo_url is null;

insert into public.vdm_team_members (name, role, photo_url, position) values
  ('Mgtr. Giselle Vera',   'Directora General',                                          'https://vdmconsultores.com.py/fotos-equipo/giselle-vera.webp',      10),
  ('Abg. Javier Martínez', 'Responsable del Área Jurídico',                              'https://vdmconsultores.com.py/fotos-equipo/javier-martinez.webp',   20),
  ('Lic. Tania Torres',    'Responsable del área administrativa y tributaria',           'https://vdmconsultores.com.py/fotos-equipo/tania-torres.webp',      30),
  ('Lic. Maura Delvalle',  'Coordinadora de Ética, Cumplimiento y Desarrollo Organizacional', 'https://vdmconsultores.com.py/fotos-equipo/maura-delvalle.webp', 40),
  ('Lic. Luis Alcaraz',    'Asesor Tributario',                                          'https://vdmconsultores.com.py/fotos-equipo/luis-alcaraz.webp',      50),
  ('Arq. Roxana Montero',  'Responsable del área Arquitectura',                          'https://vdmconsultores.com.py/fotos-equipo/roxana-montero.webp',    60),
  ('Fernanda Portugal',    'Asesora',                                                    'https://vdmconsultores.com.py/fotos-equipo/fernanda-portugal.webp', 70);

commit;
