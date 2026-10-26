/**
 * VDM Consultores — Edge Function `enviar-consulta`.
 *
 * Recibe el payload del formulario, lo valida, lo guarda en `public.consultas`
 * y notifica por correo al equipo de VDM a través de Resend.
 *
 * Variables de entorno (configurar con `supabase secrets set`):
 *   - SUPABASE_URL                 (inyectada por el runtime)
 *   - SUPABASE_SERVICE_ROLE_KEY    (inyectada por el runtime)
 *   - RESEND_API_KEY               clave de Resend (https://resend.com)
 *   - EMAIL_FROM                   remitente verificado, ej. "VDM Consultores <no-reply@vdmconsultores.com.py>"
 *   - EMAIL_TO                     destinatario interno, ej. "contacto@vdmconsultores.com.py"
 *   - ALLOWED_ORIGINS              lista separada por coma, ej. "https://vdmconsultores.com.py,http://localhost:5173"
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

type AreaConsulta =
  | "Estudio Jurídico"
  | "Consultoría Empresarial"
  | "Asesoría en Inversiones"
  | "Habilitaciones Industriales y Comerciales"
  | "Otra consulta";

type Payload = {
  nombre: string;
  empresa?: string;
  email: string;
  telefono: string;
  area: AreaConsulta;
  mensaje: string;
};

const AREAS: ReadonlySet<AreaConsulta> = new Set([
  "Estudio Jurídico",
  "Consultoría Empresarial",
  "Asesoría en Inversiones",
  "Habilitaciones Industriales y Comerciales",
  "Otra consulta",
]);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function corsHeaders(origin: string | null) {
  const allowed = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allow =
    origin && allowed.includes(origin) ? origin : (allowed[0] ?? "*");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function clean(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, max);
}

function validate(body: unknown): { ok: true; data: Payload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "payload inválido" };
  const b = body as Record<string, unknown>;
  const nombre = clean(b.nombre, 120);
  const empresa = clean(b.empresa, 160) || undefined;
  const email = clean(b.email, 160).toLowerCase();
  const telefono = clean(b.telefono, 40);
  const area = clean(b.area, 80) as AreaConsulta;
  const mensaje = clean(b.mensaje, 4000);

  if (nombre.length < 2) return { ok: false, error: "nombre requerido" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "email inválido" };
  if (telefono.length < 4) return { ok: false, error: "teléfono requerido" };
  if (!AREAS.has(area)) return { ok: false, error: "área inválida" };
  if (mensaje.length < 5) return { ok: false, error: "mensaje demasiado corto" };

  return { ok: true, data: { nombre, empresa, email, telefono, area, mensaje } };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmail(data: Payload): { subject: string; html: string; text: string } {
  const subject = `Nueva consulta — ${data.area} — ${data.nombre}`;
  const rows: Array<[string, string]> = [
    ["Nombre", data.nombre],
    ["Empresa", data.empresa ?? "—"],
    ["Correo", data.email],
    ["Teléfono / WhatsApp", data.telefono],
    ["Área", data.area],
  ];
  const html = `
<!doctype html>
<html lang="es"><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0F1E33;background:#F3F6FA;margin:0;padding:24px;">
  <table role="presentation" style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #DCE3EC;border-radius:12px;overflow:hidden;">
    <tr><td style="background:#0A2747;color:#FFFFFF;padding:20px 24px;font-weight:600;">Nueva consulta — VDM Consultores</td></tr>
    <tr><td style="padding:20px 24px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:20px;">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 0;color:#4A5B70;width:160px;">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #DCE3EC;">
        <div style="color:#4A5B70;font-size:14px;margin-bottom:6px;">Mensaje</div>
        <div style="white-space:pre-wrap;font-size:15px;line-height:22px;">${escapeHtml(data.mensaje)}</div>
      </div>
    </td></tr>
    <tr><td style="padding:12px 24px;background:#F3F6FA;color:#4A5B70;font-size:12px;">Enviado desde el formulario del sitio institucional.</td></tr>
  </table>
</body></html>`;
  const text = [
    `Nueva consulta — VDM Consultores`,
    ``,
    ...rows.map(([k, v]) => `${k}: ${v}`),
    ``,
    `Mensaje:`,
    data.mensaje,
  ].join("\n");
  return { subject, html, text };
}

async function sendEmail(data: Payload): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  const to = Deno.env.get("EMAIL_TO");
  if (!apiKey || !from || !to) {
    return { ok: false, error: "email no configurado (RESEND_API_KEY / EMAIL_FROM / EMAIL_TO)" };
  }
  const { subject, html, text } = renderEmail(data);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: data.email,
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    return { ok: false, error: `resend ${res.status}: ${detail.slice(0, 300)}` };
  }
  return { ok: true };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "método no permitido" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const result = validate(body);
  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const userAgent = req.headers.get("user-agent");
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    null;

  const email = await sendEmail(result.data);
  const insert = await supabase
    .from("consultas")
    .insert({
      nombre: result.data.nombre,
      empresa: result.data.empresa ?? null,
      email: result.data.email,
      telefono: result.data.telefono,
      area: result.data.area,
      mensaje: result.data.mensaje,
      user_agent: userAgent,
      ip,
      email_estado: email.ok ? "enviado" : "error",
      email_detalle: email.ok ? null : email.error,
    })
    .select("id")
    .single();

  if (insert.error) {
    console.error("insert consultas", insert.error);
    return new Response(
      JSON.stringify({ error: "no pudimos guardar la consulta" }),
      {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      id: insert.data.id,
      emailStatus: email.ok ? "enviado" : "error",
    }),
    { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
  );
});
