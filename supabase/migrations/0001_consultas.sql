-- VDM Consultores — tabla de consultas del formulario público.
-- Vive en `public` con prefijo `vdm_` para no colisionar con otros
-- proyectos de Neura que compartan esta misma instancia de Supabase.
-- (No usamos un schema `vdm` dedicado porque PostgREST sólo expone los
-- schemas listados en PGRST_DB_SCHEMAS; mantenernos en `public` evita
-- tocar la configuración del server.)
--
-- Diseñada para INSERT desde cliente web con RLS cerrada: solo el service
-- role puede leer. El envío de email se dispara desde la Edge Function
-- `enviar-consulta`, que corre con service role y crea la fila.

create extension if not exists "pgcrypto";

-- Enum de áreas (idempotente).
do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'vdm_area_consulta' and n.nspname = 'public'
  ) then
    create type public.vdm_area_consulta as enum (
      'Estudio Jurídico',
      'Consultoría Empresarial',
      'Asesoría en Inversiones',
      'Habilitaciones Industriales y Comerciales',
      'Otra consulta'
    );
  end if;
end $$;

create table if not exists public.vdm_consultas (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  nombre          text not null check (char_length(nombre) between 2 and 120),
  empresa         text check (empresa is null or char_length(empresa) <= 160),
  email           text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono        text not null check (char_length(telefono) between 4 and 40),
  area            public.vdm_area_consulta not null,
  mensaje         text not null check (char_length(mensaje) between 5 and 4000),
  user_agent      text,
  ip              inet,
  email_estado    text not null default 'pendiente'
                   check (email_estado in ('pendiente', 'enviado', 'error')),
  email_detalle   text
);

comment on table public.vdm_consultas is
  'VDM Consultores — consultas enviadas desde el formulario público.';

create index if not exists vdm_consultas_created_at_idx
  on public.vdm_consultas (created_at desc);

create index if not exists vdm_consultas_area_idx
  on public.vdm_consultas (area);

-- RLS: ningún rol del cliente escribe/lee directo. Solo service role.
alter table public.vdm_consultas enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant all on public.vdm_consultas to service_role;
