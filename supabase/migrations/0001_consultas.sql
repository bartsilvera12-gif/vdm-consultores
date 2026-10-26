-- VDM Consultores — tabla de consultas del formulario público.
-- Diseñada para INSERT desde cliente web con RLS cerrada: solo el service
-- role puede leer. El envío de email se dispara desde la Edge Function
-- `enviar-consulta`, que corre con service role y crea la fila.

create extension if not exists "pgcrypto";

-- Enum de áreas de servicio (coincide con el formulario y src/content/areas.ts).
do $$
begin
  if not exists (select 1 from pg_type where typname = 'area_consulta') then
    create type public.area_consulta as enum (
      'Estudio Jurídico',
      'Consultoría Empresarial',
      'Asesoría en Inversiones',
      'Habilitaciones Industriales y Comerciales',
      'Otra consulta'
    );
  end if;
end $$;

create table if not exists public.consultas (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  nombre          text not null check (char_length(nombre) between 2 and 120),
  empresa         text check (empresa is null or char_length(empresa) <= 160),
  email           text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono        text not null check (char_length(telefono) between 4 and 40),
  area            public.area_consulta not null,
  mensaje         text not null check (char_length(mensaje) between 5 and 4000),
  -- metadatos opcionales para auditoría y anti-abuso.
  user_agent      text,
  ip              inet,
  -- estado de entrega del correo a VDM (lo actualiza la Edge Function).
  email_estado    text not null default 'pendiente'
                   check (email_estado in ('pendiente', 'enviado', 'error')),
  email_detalle   text
);

comment on table public.consultas is 'Consultas enviadas desde el formulario público del sitio institucional.';

create index if not exists consultas_created_at_idx
  on public.consultas (created_at desc);

create index if not exists consultas_area_idx
  on public.consultas (area);

-- Row Level Security: nadie puede leer/escribir desde el cliente anónimo.
-- La Edge Function usa el service role y bypassa RLS.
alter table public.consultas enable row level security;

-- (Sin policies: solo service role puede operar sobre la tabla.)
