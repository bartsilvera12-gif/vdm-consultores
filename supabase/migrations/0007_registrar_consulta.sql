-- VDM Consultores — registro de consultas desde public/api/consulta.php.
-- La Edge Function `enviar-consulta` no está instalada en la Supabase
-- self-hosted. El script PHP del hosting envía el correo y guarda la consulta
-- con esta función, sin poner el service role en un hosting compartido.
-- RLS de `vdm_consultas` sigue cerrada: anon solo puede agregar por acá.

create or replace function public.vdm_registrar_consulta(
  p_nombre        text,
  p_empresa       text,
  p_email         text,
  p_telefono      text,
  p_area          text,
  p_mensaje       text,
  p_user_agent    text,
  p_ip            text,
  p_email_estado  text,
  p_email_detalle text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into public.vdm_consultas (
    nombre, empresa, email, telefono, area, mensaje,
    user_agent, ip, email_estado, email_detalle
  )
  values (
    p_nombre, nullif(p_empresa, ''), p_email, p_telefono,
    p_area::public.vdm_area_consulta, p_mensaje,
    left(p_user_agent, 400), nullif(p_ip, '')::inet,
    p_email_estado, left(p_email_detalle, 400)
  )
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.vdm_registrar_consulta(
  text, text, text, text, text, text, text, text, text, text
) from public;
grant execute on function public.vdm_registrar_consulta(
  text, text, text, text, text, text, text, text, text, text
) to anon;

notify pgrst, 'reload schema';
