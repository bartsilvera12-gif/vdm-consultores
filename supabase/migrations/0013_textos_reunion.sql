-- VDM Consultores — textos pedidos por la clienta en la reunión del 2026-11-04.
-- Servicios de Estudio Jurídico, Investor Pass en Inversiones, dos sectores de
-- Experiencia y el cargo de Javier Martínez.

begin;

-- Estudio Jurídico: la lista completa, en el orden que dictó.
delete from public.vdm_area_services
where area_id = (select id from public.vdm_areas where slug = 'juridico');

insert into public.vdm_area_services (area_id, label, position)
select a.id, s.label, s.position
from public.vdm_areas a
cross join (values
  ('Derecho civil y comercial',            10),
  ('Contencioso-administrativo',           20),
  ('Propiedad intelectual',                30),
  ('Derecho societario y corporativo',     40),
  ('Laboral y ambiental',                  50),
  ('Contratos y resolución de conflictos', 60)
) as s(label, position)
where a.slug = 'juridico';

-- Asesoría en Inversiones: Investor Pass justo debajo de Radicaciones (10).
insert into public.vdm_area_services (area_id, label, position)
select a.id, 'Investor Pass', 15
from public.vdm_areas a
where a.slug = 'inversiones'
  and not exists (
    select 1 from public.vdm_area_services s
    where s.area_id = a.id and s.label = 'Investor Pass'
  );

-- Experiencia: régimen de origen y el texto largo de comercio exterior.
update public.vdm_sectors
set body = 'Régimen de maquila, régimen de origen, licencias ambientales, PCI y habilitaciones.'
where title = 'Industria y maquila';

update public.vdm_sectors
set body = 'Asesoría en gestiones de importación y exportación, manejo de ventanillas únicas, gestión documental, gestiones bancarias y despacho.'
where title = 'Comercio exterior';

-- Equipo: "Área Jurídica", no "Jurídico".
update public.vdm_team_members
set role = 'Responsable del Área Jurídica'
where name = 'Abg. Javier Martínez';

commit;
