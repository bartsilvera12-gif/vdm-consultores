VDM Consultores es una firma paraguaya de consultoría jurídica, empresarial y de inversiones. La marca habla como un asesor senior: seguro, claro, cercano y sin grandilocuencia. Acompaña a empresas e inversionistas nacionales y extranjeros.

## Voz y contenido

- Escribí en español neutro con **tú** ("tu empresa", "te acompañamos"), tal como los flyers. Nada de voseo en la web.
- Primera persona plural para la firma: "Protegemos", "Acompañamos", "Gestionamos".
- Titulares de área en mayúsculas en los flyers; en la web usá oración normal en `h2` y reservá las mayúsculas para `eyebrow`.
- Slogans oficiales, textuales:
  - Principal: **"Fortaleciendo empresas, potenciando inversiones."**
  - Secundario: **"Un solo equipo, soluciones integrales."**
- Listas de servicios separadas por ` · ` o en chips; nunca emoji.
- Las cuatro áreas, con sus titulares:
  - Estudio Jurídico — "La seguridad jurídica que tu empresa necesita"
  - Consultoría Empresarial — "Impulsamos el crecimiento de tu empresa"
  - Asesoría en Inversiones — "Tu próxima inversión puede estar en Paraguay"
  - Habilitaciones Industriales y Comerciales — "Tu negocio en regla, tu crecimiento en marcha"
- No inventes cifras, años de trayectoria ni clientes: solo lo que VDM confirme.

## Color

- La identidad es **azul + naranja sobre blanco**. El azul (`blue`) carga la marca; el naranja (`orange`) es la chispa de la V: usalo poco, como acento.
- Texto: `ink` y `ink-muted` sobre `surface` / `surface-alt`. Enlaces y énfasis en `blue`.
- **Nunca texto `orange` sobre blanco** (2.5:1). Para un eyebrow o cifra naranja sobre claro usá `orange-text`. Sobre `navy` el `orange` sí funciona como texto (5.9:1).
- `navy` es la superficie institucional profunda: hero, banda de cierre, footer. Encima, `on-navy` y `on-navy-muted`.
- Texto sobre relleno naranja: `on-orange` (azul tinta), nunca blanco.
- Botón primario: relleno `blue`, texto `on-blue`. Botón de acento (WhatsApp/CTA en hero): relleno `orange`, texto `on-orange`.

## Tipografía

- `display` (Montserrat, Google Fonts) para titulares: `hero`, `h2`, `h3`, `eyebrow`. Su geometría acompaña la del logo.
- `sans` (Source Sans 3, Google Fonts) para todo texto corrido: `lead`, `body`, `small`, `label`.
- `eyebrow` siempre en mayúsculas con tracking amplio, eco de "CONSULTORES".
- En móvil, `hero` baja a 36/40px y `h2` a 28/34px.

## Forma, espacio y profundidad

- La marca es de cortes rectos y diagonales (la V, las facetas de D y M). Radios mínimos: `radius-sm` chips, `radius-md` botones/tarjetas/campos, `radius-lg` paneles grandes.
- El motivo gráfico es la **diagonal de la V**: bandas y chevrons inclinados en `orange` y `blue` sobre `navy`. Nada de gradientes de color ni ilustraciones.
- Ritmo vertical: `space-24` por sección en desktop (64px en móvil); gutter `space-12` desktop, `space-4` móvil; tarjetas con `space-6` de padding.
- Bordes `line` antes que sombras. `shadow-card` solo en hover de tarjeta y en el header al hacer scroll.
- Foco de teclado: `focus-ring`, 2px sólido con 2px de separación en el color de fondo.

## Movimiento

- Entradas con ease-out (`cubic-bezier(.23,1,.32,1)`), menos de 300ms en UI, hasta 600ms en revelados de sección; solo `transform` y `opacity`.
- Respetá siempre `prefers-reduced-motion`: sin desplazamientos, solo aparición.

## Logo e iconografía

- Usá los archivos de **Logos**, nunca lo redibujes. `vdm-logo-color` sobre fondos claros; `vdm-logo-white` (V naranja, resto blanco) sobre `navy`.
- `vdm-mark-*` (solo "VDM") para el header compacto y favicon.
- Área de respeto: la altura de la "C" de CONSULTORES alrededor del logo. Ancho mínimo del logo completo: 140px.
- Íconos: trazo lineal de 1.5px en `blue`, estilo Lucide; ningún ícono relleno ni emoji.
