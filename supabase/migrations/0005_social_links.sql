-- VDM Consultores — redes sociales en contact_info.
--
-- Agrega 2 bloques de redes al singleton public.vdm_contact_info:
--   facebook_*  (label, value, href, pending)
--   instagram_* (label, value, href, pending)
--
-- Y carga los enlaces reales que pasó el cliente.
-- Idempotente: ADD COLUMN IF NOT EXISTS + UPDATE del único row.

alter table public.vdm_contact_info
  add column if not exists facebook_label   text not null default 'Facebook',
  add column if not exists facebook_value   text not null default '',
  add column if not exists facebook_href    text,
  add column if not exists facebook_pending boolean not null default true,
  add column if not exists instagram_label   text not null default 'Instagram',
  add column if not exists instagram_value   text not null default '',
  add column if not exists instagram_href    text,
  add column if not exists instagram_pending boolean not null default true;

update public.vdm_contact_info
   set facebook_value   = 'facebook.com/vdmconsultores.py',
       facebook_href    = 'https://www.facebook.com/vdmconsultores.py',
       facebook_pending = false,
       instagram_value   = '@vdmconsultores',
       instagram_href    = 'https://www.instagram.com/vdmconsultores/',
       instagram_pending = false
 where id = 'default';
