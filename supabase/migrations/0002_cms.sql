-- VDM Consultores — CMS mínimo, en `public` con prefijo `vdm_`.
--
--   public.vdm_contact_info   singleton con WhatsApp, correo, oficina, LinkedIn
--   public.vdm_team_members   perfiles del equipo
--   public.vdm_site_content   textos editables (key/value JSON)
--
-- RLS: lectura pública (anon + authenticated), escritura solo authenticated.
-- VDM crea un usuario desde Auth → Users en Supabase y entra con email +
-- password al /admin.

create extension if not exists "pgcrypto";

-- =======================================================================
-- vdm_contact_info (singleton: id='default')
-- =======================================================================
create table if not exists public.vdm_contact_info (
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
  constraint vdm_contact_info_single_row check (id = 'default')
);

comment on table public.vdm_contact_info is
  'VDM — datos de contacto editables desde /admin. Fila única id="default".';

alter table public.vdm_contact_info enable row level security;

drop policy if exists vdm_contact_info_read on public.vdm_contact_info;
create policy vdm_contact_info_read on public.vdm_contact_info
  for select to anon, authenticated using (true);

drop policy if exists vdm_contact_info_write on public.vdm_contact_info;
create policy vdm_contact_info_write on public.vdm_contact_info
  for all to authenticated using (true) with check (true);

insert into public.vdm_contact_info (
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

-- =======================================================================
-- vdm_team_members
-- =======================================================================
create table if not exists public.vdm_team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  role        text not null check (char_length(role) between 1 and 160),
  photo_url   text,
  position    int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.vdm_team_members is
  'VDM — perfiles del equipo. Ordenados por position asc.';

create index if not exists vdm_team_members_position_idx
  on public.vdm_team_members (position asc, created_at asc);

alter table public.vdm_team_members enable row level security;

drop policy if exists vdm_team_members_read on public.vdm_team_members;
create policy vdm_team_members_read on public.vdm_team_members
  for select to anon, authenticated using (true);

drop policy if exists vdm_team_members_write on public.vdm_team_members;
create policy vdm_team_members_write on public.vdm_team_members
  for all to authenticated using (true) with check (true);

insert into public.vdm_team_members (name, role, position) values
  ('Nombre y apellido', 'Socio · Estudio Jurídico', 10),
  ('Nombre y apellido', 'Consultoría Empresarial',  20),
  ('Nombre y apellido', 'Asesoría en Inversiones',  30),
  ('Nombre y apellido', 'Habilitaciones',           40)
on conflict do nothing;

-- =======================================================================
-- vdm_site_content (textos editables indexados por "slug")
-- =======================================================================
create table if not exists public.vdm_site_content (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

comment on table public.vdm_site_content is
  'VDM — textos editables desde /admin. Clave estable (p. ej. "hero.lead"), valor JSON.';

alter table public.vdm_site_content enable row level security;

drop policy if exists vdm_site_content_read on public.vdm_site_content;
create policy vdm_site_content_read on public.vdm_site_content
  for select to anon, authenticated using (true);

drop policy if exists vdm_site_content_write on public.vdm_site_content;
create policy vdm_site_content_write on public.vdm_site_content
  for all to authenticated using (true) with check (true);

insert into public.vdm_site_content (key, value) values
  ('hero.lead',
    to_jsonb('Firma paraguaya de consultoría jurídica, empresarial y de inversiones. Acompañamos a empresas e inversionistas nacionales y extranjeros con asesoramiento integral y seguridad jurídica en cada decisión.'::text)),
  ('about.intro',
    to_jsonb('Somos VDM Consultores, una firma paraguaya de consultoría jurídica, empresarial y de inversiones, especializada en brindar asesoramiento integral a empresas e inversionistas nacionales y extranjeros.'::text)),
  ('about.commitment',
    to_jsonb('Nuestro compromiso es brindar un servicio profesional, personalizado e integral, orientado a proteger los intereses de nuestros clientes, fortalecer sus estructuras empresariales y potenciar sus proyectos de inversión.'::text))
on conflict (key) do nothing;

-- =======================================================================
-- updated_at automático (función namespaced con prefijo vdm_)
-- =======================================================================
create or replace function public.vdm_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists vdm_contact_info_updated_at on public.vdm_contact_info;
create trigger vdm_contact_info_updated_at before update on public.vdm_contact_info
  for each row execute function public.vdm_set_updated_at();

drop trigger if exists vdm_team_members_updated_at on public.vdm_team_members;
create trigger vdm_team_members_updated_at before update on public.vdm_team_members
  for each row execute function public.vdm_set_updated_at();

drop trigger if exists vdm_site_content_updated_at on public.vdm_site_content;
create trigger vdm_site_content_updated_at before update on public.vdm_site_content
  for each row execute function public.vdm_set_updated_at();

-- =======================================================================
-- Grants explícitos para los roles del Supabase self-host.
-- En Supabase Cloud estos vienen por defecto; en algunos self-host no.
-- =======================================================================
grant usage on schema public to anon, authenticated, service_role;

grant select on public.vdm_contact_info to anon, authenticated;
grant insert, update, delete on public.vdm_contact_info to authenticated;
grant all on public.vdm_contact_info to service_role;

grant select on public.vdm_team_members to anon, authenticated;
grant insert, update, delete on public.vdm_team_members to authenticated;
grant all on public.vdm_team_members to service_role;

grant select on public.vdm_site_content to anon, authenticated;
grant insert, update, delete on public.vdm_site_content to authenticated;
grant all on public.vdm_site_content to service_role;
