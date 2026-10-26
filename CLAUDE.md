# VDM Consultores — Web institucional

Cliente de Neura. Firma paraguaya de consultoría jurídica, empresarial y de inversiones.
Alcance y criterios de aceptación: `docs/checklist-proyecto.pdf` (web institucional + correo corporativo).

## Qué hay en este repo

- `index.html` — prototipo aprobado para revisión (HTML/CSS/JS plano, una sola página). Es la referencia visual y de contenido.
- `design-system/` — `README.md` (voz, color, tipografía, forma, movimiento, uso del logo), `tokens.json` (fuente de verdad) y `tokens.css` (variables CSS generadas, tema claro/oscuro).
- `assets/logos/` — logo color, logo blanco (V naranja + resto blanco para fondos navy), solo "VDM" y lockups sin la bajada. Derivados de `vdm-logo-original.jpg`; reemplazar por el vector cuando llegue.
- `docs/contenido.md` — todos los textos entregados por el cliente.
- `docs/pendientes.md` — lo que falta confirmar con VDM.

## Stack objetivo

React + Vite + TypeScript + Tailwind CSS + shadcn/ui + Supabase (referencia: `bartsilvera12-gif/tradexpar-digital-hub`).
- Mapear `design-system/tokens.css` a variables de Tailwind/shadcn; no hardcodear colores.
- Supabase: tabla de consultas del formulario + contenidos editables (panel administrador, punto 09 del checklist).
- El formulario debe enviar la consulta al correo de VDM (punto 06) y guardarla en Supabase.
- Hosting: servidor de Neura (AWS Lightsail).

## Reglas de diseño (resumen, ver design-system/README.md)

- Azul `blue` carga la marca; `orange` solo como acento. Nunca texto naranja sobre blanco (usar `orange-text`).
- Titulares Montserrat, texto Source Sans 3 (Google Fonts).
- Motivo gráfico: la diagonal de la V del logo. Sin gradientes ni ilustraciones.
- Radios mínimos (2/6/12px), bordes antes que sombras.
- Animaciones: estilo Emil Kowalski, solo transform/opacity, ease-out con cubic-bezier propio, <300ms en UI, `prefers-reduced-motion` siempre. Sonner para toasts, Vaul para drawers.
- Copy en español neutro con "tú" (como los flyers). No inventar cifras, años ni clientes.

## Secciones (orden)

Inicio · Quiénes somos · Áreas de servicio (Jurídico, Consultoría Empresarial, Inversiones, Habilitaciones) · Servicios destacados · Equipo · Experiencia · CTA · Contacto · Footer. Botón flotante de WhatsApp.
