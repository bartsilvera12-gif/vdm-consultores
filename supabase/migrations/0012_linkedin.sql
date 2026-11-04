-- VDM Consultores — LinkedIn de la empresa en el footer.
-- La fila tenía pegado "In: LinkedIn https://..." como enlace y quedaba marcada
-- como pendiente, por eso no aparecía.

begin;

update public.vdm_contact_info
set linkedin_label   = 'LinkedIn',
    linkedin_value   = 'linkedin.com/company/vdm-consultores-paraguay',
    linkedin_href    = 'https://www.linkedin.com/company/vdm-consultores-paraguay/',
    linkedin_pending = false
where id = 'default';

commit;
