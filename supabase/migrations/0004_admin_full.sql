-- VDM Consultores — fase 2 del CMS: control completo desde /admin.
--
-- Agrega las últimas piezas que faltaban para que el admin pueda editar
-- todo el contenido del sitio sin tocar código:
--
--   public.vdm_areas          Áreas de servicio (eyebrow, title, description, summary)
--   public.vdm_area_services  Lista de servicios dentro de cada área
--   public.vdm_sectors        Tarjetas de "A quiénes acompañamos"
--   public.vdm_disciplines    Chips de disciplinas del equipo
--   public.vdm_consultas      + columnas atendida / atendida_at para el panel
--   public.vdm_site_content   + seeds de muchos más textos editables
--
-- RLS: lectura pública (anon + authenticated), escritura solo authenticated.
-- No borra ni toca tablas / policies previas: todo es ADDITIVO.

create extension if not exists "pgcrypto";

-- ========================================================================
-- vdm_areas
-- ========================================================================
create table if not exists public.vdm_areas (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null check (char_length(slug) between 2 and 60),
  position    int not null default 0,
  eyebrow     text not null,
  title       text not null,
  description text not null,
  summary     text not null default '',
  icon        text not null default 'briefcase',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.vdm_areas is 'Áreas de servicio del sitio. Editables desde /admin.';

create index if not exists vdm_areas_position_idx
  on public.vdm_areas (position asc, created_at asc);

alter table public.vdm_areas enable row level security;

drop policy if exists vdm_areas_read on public.vdm_areas;
create policy vdm_areas_read on public.vdm_areas
  for select to anon, authenticated using (true);

drop policy if exists vdm_areas_write on public.vdm_areas;
create policy vdm_areas_write on public.vdm_areas
  for all to authenticated using (true) with check (true);

grant select on public.vdm_areas to anon, authenticated;
grant insert, update, delete on public.vdm_areas to authenticated;
grant all on public.vdm_areas to service_role;

-- Seeds (idempotente por slug): los 4 áreas con los valores actuales.
insert into public.vdm_areas (slug, position, eyebrow, title, description, summary, icon) values
  ('juridico', 10, 'Estudio Jurídico',
    'La seguridad jurídica que tu empresa necesita',
    'Protegemos tus intereses y acompañamos tus decisiones con asesoramiento jurídico especializado.',
    'Civil, comercial, laboral, administrativo',
    'scale'),
  ('consultoria', 20, 'Consultoría Empresarial',
    'Impulsamos el crecimiento de tu empresa',
    'Te acompañamos desde la constitución de tu empresa hasta el desarrollo y consolidación de tus negocios en Paraguay.',
    'Constitución de empresas, régimen maquila, contabilidad y tributación',
    'trending-up'),
  ('inversiones', 30, 'Asesoría en Inversiones',
    'Tu próxima inversión puede estar en Paraguay',
    'Acompañamos a inversionistas nacionales y extranjeros para desarrollar sus proyectos con seguridad jurídica y visión estratégica.',
    'Radicaciones, registro de marcas y patentes, adquisición de inmuebles',
    'globe'),
  ('habilitaciones', 40, 'Habilitaciones Industriales y Comerciales',
    'Tu negocio en regla, tu crecimiento en marcha',
    'Gestionamos los estudios, permisos y habilitaciones necesarios para desarrollar tus actividades industriales y comerciales.',
    'Licencia ambiental y municipal, trámites administrativos',
    'factory')
on conflict (slug) do nothing;

-- ========================================================================
-- vdm_area_services (hijos de vdm_areas)
-- ========================================================================
create table if not exists public.vdm_area_services (
  id          uuid primary key default gen_random_uuid(),
  area_id     uuid not null references public.vdm_areas(id) on delete cascade,
  label       text not null,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists vdm_area_services_area_idx
  on public.vdm_area_services (area_id, position asc, created_at asc);

alter table public.vdm_area_services enable row level security;

drop policy if exists vdm_area_services_read on public.vdm_area_services;
create policy vdm_area_services_read on public.vdm_area_services
  for select to anon, authenticated using (true);

drop policy if exists vdm_area_services_write on public.vdm_area_services;
create policy vdm_area_services_write on public.vdm_area_services
  for all to authenticated using (true) with check (true);

grant select on public.vdm_area_services to anon, authenticated;
grant insert, update, delete on public.vdm_area_services to authenticated;
grant all on public.vdm_area_services to service_role;

-- Seeds: lista de servicios de cada área (los valores actuales del sitio).
do $$
declare
  v_area_id uuid;
begin
  -- Jurídico
  select id into v_area_id from public.vdm_areas where slug = 'juridico';
  if not exists (select 1 from public.vdm_area_services where area_id = v_area_id) then
    insert into public.vdm_area_services (area_id, label, position) values
      (v_area_id, 'Derecho civil y comercial', 10),
      (v_area_id, 'Societario y corporativo', 20),
      (v_area_id, 'Administrativo', 30),
      (v_area_id, 'Laboral y ambiental', 40),
      (v_area_id, 'Propiedad intelectual', 50),
      (v_area_id, 'Contratos y resolución de conflictos', 60);
  end if;

  -- Consultoría
  select id into v_area_id from public.vdm_areas where slug = 'consultoria';
  if not exists (select 1 from public.vdm_area_services where area_id = v_area_id) then
    insert into public.vdm_area_services (area_id, label, position) values
      (v_area_id, 'Constitución de sociedades', 10),
      (v_area_id, 'Planes de negocios', 20),
      (v_area_id, 'Maquila, Régimen de Origen y otros', 30),
      (v_area_id, 'Contabilidad y asesoría tributaria', 40),
      (v_area_id, 'Apertura de cuentas bancarias', 50),
      (v_area_id, 'Comercio exterior', 60);
  end if;

  -- Inversiones
  select id into v_area_id from public.vdm_areas where slug = 'inversiones';
  if not exists (select 1 from public.vdm_area_services where area_id = v_area_id) then
    insert into public.vdm_area_services (area_id, label, position) values
      (v_area_id, 'Radicaciones', 10),
      (v_area_id, 'Residencia fiscal', 20),
      (v_area_id, 'Representaciones y domicilio fiscal', 30),
      (v_area_id, 'Inversiones inmobiliarias', 40),
      (v_area_id, 'Negociaciones y gestión documental', 50);
  end if;

  -- Habilitaciones
  select id into v_area_id from public.vdm_areas where slug = 'habilitaciones';
  if not exists (select 1 from public.vdm_area_services where area_id = v_area_id) then
    insert into public.vdm_area_services (area_id, label, position) values
      (v_area_id, 'Estudios de impacto ambiental', 10),
      (v_area_id, 'Licencias y permisos', 20),
      (v_area_id, 'Habilitaciones municipales', 30),
      (v_area_id, 'Planos arquitectónicos y técnicos', 40),
      (v_area_id, 'Protección contra Incendios (PCI)', 50);
  end if;
end $$;

-- ========================================================================
-- vdm_sectors (tarjetas de "A quiénes acompañamos")
-- ========================================================================
create table if not exists public.vdm_sectors (
  id          uuid primary key default gen_random_uuid(),
  position    int not null default 0,
  title       text not null,
  body        text not null,
  icon        text not null default 'briefcase',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists vdm_sectors_position_idx
  on public.vdm_sectors (position asc, created_at asc);

alter table public.vdm_sectors enable row level security;

drop policy if exists vdm_sectors_read on public.vdm_sectors;
create policy vdm_sectors_read on public.vdm_sectors
  for select to anon, authenticated using (true);

drop policy if exists vdm_sectors_write on public.vdm_sectors;
create policy vdm_sectors_write on public.vdm_sectors
  for all to authenticated using (true) with check (true);

grant select on public.vdm_sectors to anon, authenticated;
grant insert, update, delete on public.vdm_sectors to authenticated;
grant all on public.vdm_sectors to service_role;

-- Seed solo si la tabla está vacía (para no duplicar en runs).
insert into public.vdm_sectors (position, title, body, icon)
select * from (values
  (10, 'Empresas en formación', 'Constitución de empresas, planes de negocios y apertura de cuentas bancarias personales y corporativas.', 'briefcase'),
  (20, 'Empresas consolidadas', 'Asesoría jurídica en materia civil y comercial. Servicio de contabilidad y asesoría tributaria. Due diligence.', 'trending-up'),
  (30, 'Inversionistas extranjeros', 'Radicaciones, Investor Pass, residencia fiscal, representación y domicilio fiscal, adquisición de inmuebles u otros bienes en Paraguay.', 'globe'),
  (40, 'Industria y maquila', 'Régimen de maquila, licencias ambientales, PCI y habilitaciones.', 'factory'),
  (50, 'Comercio exterior', 'Importación, exportación y gestión documental.', 'ship'),
  (60, 'Inversión inmobiliaria', 'Búsqueda de propiedades urbanas y rurales. Análisis y gestión documental. Tramites para adquisición de inmuebles por mandato.', 'key')
) as t(position, title, body, icon)
where not exists (select 1 from public.vdm_sectors);

-- ========================================================================
-- vdm_disciplines (chips de /nosotros)
-- ========================================================================
create table if not exists public.vdm_disciplines (
  id          uuid primary key default gen_random_uuid(),
  position    int not null default 0,
  label       text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists vdm_disciplines_position_idx
  on public.vdm_disciplines (position asc, created_at asc);

alter table public.vdm_disciplines enable row level security;

drop policy if exists vdm_disciplines_read on public.vdm_disciplines;
create policy vdm_disciplines_read on public.vdm_disciplines
  for select to anon, authenticated using (true);

drop policy if exists vdm_disciplines_write on public.vdm_disciplines;
create policy vdm_disciplines_write on public.vdm_disciplines
  for all to authenticated using (true) with check (true);

grant select on public.vdm_disciplines to anon, authenticated;
grant insert, update, delete on public.vdm_disciplines to authenticated;
grant all on public.vdm_disciplines to service_role;

insert into public.vdm_disciplines (position, label)
select * from (values
  (10, 'Jurídica'),
  (20, 'Tributaria'),
  (30, 'Empresarial'),
  (40, 'Ambiental'),
  (50, 'Migratoria'),
  (60, 'Industrial'),
  (70, 'Comercio exterior'),
  (80, 'Registro de Marcas')
) as t(position, label)
where not exists (select 1 from public.vdm_disciplines);

-- ========================================================================
-- vdm_consultas: columnas para marcar leída desde el admin
-- ========================================================================
alter table public.vdm_consultas
  add column if not exists atendida boolean not null default false,
  add column if not exists atendida_at timestamptz;

-- El admin autenticado necesita leer / actualizar las consultas.
drop policy if exists vdm_consultas_read_admin on public.vdm_consultas;
create policy vdm_consultas_read_admin on public.vdm_consultas
  for select to authenticated using (true);

drop policy if exists vdm_consultas_update_admin on public.vdm_consultas;
create policy vdm_consultas_update_admin on public.vdm_consultas
  for update to authenticated using (true) with check (true);

grant select, update on public.vdm_consultas to authenticated;

-- ========================================================================
-- vdm_site_content: nuevos textos editables
-- ========================================================================
insert into public.vdm_site_content (key, value) values
  -- Hero
  ('hero.eyebrow',    to_jsonb('VDM Consultores · Paraguay'::text)),
  ('hero.title_main', to_jsonb('Fortaleciendo empresas,'::text)),
  ('hero.title_em',   to_jsonb('potenciando inversiones.'::text)),
  -- Panel de áreas (dentro del hero navy)
  ('hero.panel_eyebrow', to_jsonb('Áreas de servicio'::text)),
  ('hero.panel_title',   to_jsonb('Un solo equipo, soluciones integrales.'::text)),
  -- CTA band
  ('cta.title',  to_jsonb('¿Vas a invertir o hacer crecer tu empresa en Paraguay?'::text)),
  ('cta.body',   to_jsonb('Cuéntanos tu proyecto. Te orientamos sobre los pasos, permisos y la estructura que necesitas.'::text)),
  ('cta.button', to_jsonb('Agenda tu consulta'::text)),
  -- About
  ('about.title', to_jsonb('Un solo equipo, soluciones integrales.'::text)),
  ('about.slogan', to_jsonb('Fortaleciendo empresas, potenciando inversiones.'::text)),
  -- Servicios (apartado)
  ('servicios.title', to_jsonb('Cuatro áreas, un mismo acompañamiento.'::text)),
  ('servicios.lead',  to_jsonb('Desde la constitución de tu empresa hasta la concreción de tu inversión, cada área trabaja coordinada con las demás.'::text)),
  -- Experiencia (apartado)
  ('experiencia.title', to_jsonb('A quiénes acompañamos.'::text)),
  ('experiencia.lead',  to_jsonb('Empresas en cada etapa e inversionistas que llegan a Paraguay.'::text)),
  -- Equipo (apartado)
  ('equipo.title', to_jsonb('Profesionales especializados en cada área.'::text)),
  ('equipo.lead',  to_jsonb('Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente.'::text)),
  -- Contacto (apartado)
  ('contacto.title', to_jsonb('Paraguay, país de oportunidades'::text)),
  ('contacto.lead',  to_jsonb('Agenda tu consulta'::text))
on conflict (key) do nothing;

-- ========================================================================
-- updated_at triggers (reutiliza la función public.vdm_set_updated_at
-- creada en la migración 0002).
-- ========================================================================
drop trigger if exists vdm_areas_updated_at on public.vdm_areas;
create trigger vdm_areas_updated_at before update on public.vdm_areas
  for each row execute function public.vdm_set_updated_at();

drop trigger if exists vdm_area_services_updated_at on public.vdm_area_services;
create trigger vdm_area_services_updated_at before update on public.vdm_area_services
  for each row execute function public.vdm_set_updated_at();

drop trigger if exists vdm_sectors_updated_at on public.vdm_sectors;
create trigger vdm_sectors_updated_at before update on public.vdm_sectors
  for each row execute function public.vdm_set_updated_at();

drop trigger if exists vdm_disciplines_updated_at on public.vdm_disciplines;
create trigger vdm_disciplines_updated_at before update on public.vdm_disciplines
  for each row execute function public.vdm_set_updated_at();
