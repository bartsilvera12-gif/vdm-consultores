# Supabase — setup para VDM Consultores

Este archivo cubre todo lo necesario para que el formulario de contacto
guarde la consulta en Supabase y notifique por correo al equipo de VDM.

## Resumen

- **Tabla**: `public.consultas` (ver `supabase/migrations/0001_consultas.sql`).
- **RLS**: cerrada. Solo la Edge Function (que usa el service role) escribe.
- **Edge Function**: `enviar-consulta` (ver `supabase/functions/enviar-consulta/index.ts`).
  Valida, inserta la fila y envía el correo a VDM vía [Resend](https://resend.com).
- **Cliente**: `src/lib/supabase.ts` llama a `supabase.functions.invoke("enviar-consulta", { body })`.

## 1 · Crear el proyecto Supabase

1. Entrar a <https://supabase.com> y crear un nuevo proyecto (región São Paulo
   suele ser la más cercana para Paraguay).
2. Guardar la **Project URL** y el **anon key** (Settings → API).
3. Guardar también el **service role key** (solo para variables de la función,
   nunca para el frontend).

## 2 · Aplicar la migración de la tabla

Opción recomendada (con la Supabase CLI):

```bash
npx supabase link --project-ref TU_PROJECT_REF
npx supabase db push
```

Alternativa manual: abrir **SQL Editor** en el dashboard y pegar el contenido de
`supabase/migrations/0001_consultas.sql`.

## 3 · Configurar Resend para el envío de correo

1. Crear una cuenta en <https://resend.com>.
2. Verificar el dominio desde el que se enviarán correos (típicamente el mismo
   dominio corporativo de VDM; se agregan 3 registros DNS).
3. Crear una API key (sección _API Keys_).

> Mientras Resend verifica el dominio se puede testear con el remitente de
> prueba `onboarding@resend.dev`, pero solo entrega al correo del dueño de la
> cuenta Resend. Para producción el dominio tiene que estar verificado.

## 4 · Deploy de la Edge Function

```bash
# Secrets (una sola vez; se vuelven a correr si cambian).
npx supabase secrets set RESEND_API_KEY=re_xxx \
  EMAIL_FROM="VDM Consultores <no-reply@vdmconsultores.com.py>" \
  EMAIL_TO="contacto@vdmconsultores.com.py" \
  ALLOWED_ORIGINS="https://vdmconsultores.com.py,http://localhost:5173"

# Deploy de la función.
npx supabase functions deploy enviar-consulta --no-verify-jwt
```

`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` las inyecta automáticamente el
runtime, no hay que configurarlas como secret.

`ALLOWED_ORIGINS` controla el CORS: tiene que incluir el dominio final del
sitio y, en desarrollo, `http://localhost:5173`.

## 5 · Variables del frontend

Copiar `.env.example` a `.env.local` y completar:

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

En desarrollo, si estas variables no están configuradas, el formulario cae a
"modo preview" (no envía, solo muestra un toast informativo). En producción
tienen que estar presentes al momento del build.

## 6 · Verificar punta a punta

1. `npm run dev`
2. Llenar el formulario con un correo real de prueba.
3. Confirmar en el dashboard de Supabase (Table Editor → `consultas`) que se
   creó la fila y que `email_estado = 'enviado'`.
4. Confirmar que el correo llegó a `EMAIL_TO`.

Si `email_estado = 'error'`, mirar `email_detalle` en la fila y los logs de la
función (`npx supabase functions logs enviar-consulta`).

## 7 · Operación / consulta de datos

- Panel administrador (siguiente iteración): leerá `public.consultas` con un
  usuario autenticado y una policy de admin.
- Mientras tanto, para ver las consultas: Supabase Dashboard → **Table Editor** →
  `consultas`. Las filas más recientes salen arriba por el índice
  `consultas_created_at_idx`.
