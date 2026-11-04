-- VDM Consultores — vuelve el área Estudio Jurídico (flyer 1 de la clienta).
-- Se había borrado desde el panel y la página Servicios quedó con 3 de las 4
-- áreas. Si ya existe (slug 'juridico'), no hace nada.

begin;

with nueva as (
  insert into public.vdm_areas (slug, position, eyebrow, title, description, summary, icon)
  values (
    'juridico',
    10,
    'Estudio Jurídico',
    'La seguridad jurídica que tu empresa necesita',
    'Protegemos tus intereses y acompañamos tus decisiones con asesoramiento jurídico especializado.',
    'Civil, comercial, laboral, administrativo',
    'scale'
  )
  on conflict (slug) do nothing
  returning id
)
insert into public.vdm_area_services (area_id, label, position)
select nueva.id, s.label, s.position
from nueva
cross join (values
  ('Derecho civil y comercial',            10),
  ('Societario y corporativo',             20),
  ('Administrativo',                       30),
  ('Laboral y ambiental',                  40),
  ('Propiedad intelectual',                50),
  ('Contratos y resolución de conflictos', 60)
) as s(label, position);

commit;
