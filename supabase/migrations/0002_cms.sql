-- VDM Consultores — CMS mínimo.
-- Tres tablas para editar sin redeploy:
--   contact_info  (singleton: WhatsApp, correo, oficina, LinkedIn)
--   team_members  (perfiles del equipo)
--   site_content  (key/value: textos de hero, about, destacados, etc.)
--
-- RLS: lectura pública (anon y authenticated), escritura solo authenticated.
-- VDM crea un usuario en el dashboard de Supabase (Auth → Users) y entra con
-- email + password al /admin.

create extension if not exists "pgcrypto";

-- ===========================================================================
-- contact_info (singleton: id='default')
-- ===========================================================================
create table if not exists public.contact_info (
  id              text primary key default 'default',
  whatsapp_label  text not null default 'WhatsApp',
  whatsapp_value  text not null default '',
  whatsapp_href   text,
  whatsapp_pending boolean not null default true,
  email_label     text not null default 'Correo',
  email_value     text not null default '',
  email_href      text,
  email_pending   boolean not null default true,
  office_label    text not null default 'Oficina',
  office_value    text not null default '',
  office_pending  boolean not null default true,
  linkedin_label  text not null default 'LinkedIn y redes',
  linkedin_value  text not null default '',
  linkedin_href   text,
  linkedin_pending boolean not null default true,
  updated_at      timestamptz not null default now(),
  constraint contact_info_single_row check (id = 'default')
);

comment on table public.contact_info is 'Datos de contacto editables desde /admin. Fila única id="default".';

alter table public.contact_info enable row level security;

drop policy if exists contact_info_read on public.contact_info;
create policy contact_info_read on public.contact_info
  for select to anon, authenticated using (true);

drop policy if exists contact_info_write on public.contact_info;
create policy contact_info_write on public.contact_info
  for all to authenticated using (true) with check (true);

-- Seed con los valores "a confirmar" actuales de src/content/contact.ts.
insert into public.contact_info (
  id,
  whatsapp_value, whatsapp_href,
  email_value, email_href,
  office_value,
  linkedin_value, linkedin_href
) values (
  'default',
  '+595 9XX XXX XXX', 'https://wa.me/595000000000',
  'contacto@dominio', 'mailto:contacto@dominio',
  'Dirección a confirmar · Paraguay',
  'Enlaces a confirmar', '#'
) on conflict (id) do nothing;

-- ===========================================================================
-- team_members
-- ===========================================================================
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  role        text not null check (char_length(role) between 1 and 160),
  photo_url   text,
  position    int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.team_members is 'Perfiles del equipo. Ordenados por position asc.';

create index if not exists team_members_position_idx
  on public.team_members (position asc, created_at asc);

alter table public.team_members enable row level security;

drop policy if exists team_members_read on public.team_members;
create policy team_members_read on public.team_members
  for select to anon, authenticated using (true);

drop policy if exists team_members_write on public.team_members;
create policy team_members_write on public.team_members
  for all to authenticated using (true) with check (true);

-- Seed con los 4 placeholders actuales de src/content/team.ts.
insert into public.team_members (name, role, position) values
  ('Nombre y apellido', 'Socio · Estudio Jurídico', 10),
  ('Nombre y apellido', 'Consultoría Empresarial',  20),
  ('Nombre y apellido', 'Asesoría en Inversiones',  30),
  ('Nombre y apellido', 'Habilitaciones',           40)
on conflict do nothing;

-- ===========================================================================
-- site_content (textos editables indexados por "slug")
-- ===========================================================================
create table if not exists public.site_content (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

comment on table public.site_content is
  'Textos editables desde /admin. Clave estable (ej. "hero.lead", "about.intro"), valor JSON.';

alter table public.site_content enable row level security;

drop policy if exists site_content_read on public.site_content;
create policy site_content_read on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists site_content_write on public.site_content;
create policy site_content_write on public.site_content
  for all to authenticated using (true) with check (true);

-- Seed de los textos editables más frecuentes.
insert into public.site_content (key, value) values
  ('hero.lead',
    to_jsonb('Firma paraguaya de consultoría jurídica, empresarial y de inversiones. Acompañamos a empresas e inversionistas nacionales y extranjeros con asesoramiento integral y seguridad jurídica en cada decisión.'::text)),
  ('about.intro',
    to_jsonb('Somos VDM Consultores, una firma paraguaya de consultoría jurídica, empresarial y de inversiones, especializada en brindar asesoramiento integral a empresas e inversionistas nacionales y extranjeros.'::text)),
  ('about.commitment',
    to_jsonb('Nuestro compromiso es brindar un servicio profesional, personalizado e integral, orientado a proteger los intereses de nuestros clientes, fortalecer sus estructuras empresariales y potenciar sus proyectos de inversión.'::text))
on conflict (key) do nothing;

-- ===========================================================================
-- updated_at automático
-- ===========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists contact_info_updated_at on public.contact_info;
create trigger contact_info_updated_at before update on public.contact_info
  for each row execute function public.set_updated_at();

drop trigger if exists team_members_updated_at on public.team_members;
create trigger team_members_updated_at before update on public.team_members
  for each row execute function public.set_updated_at();

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();
