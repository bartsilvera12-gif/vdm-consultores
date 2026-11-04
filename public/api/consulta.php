<?php
/**
 * VDM Consultores — recibe el formulario de contacto, envía el correo a VDM y
 * guarda la consulta en `vdm_consultas` (visible en /admin/consultas).
 *
 * Reemplaza a la Edge Function `enviar-consulta`, que no está instalada en la
 * Supabase self-hosted. Los errores salen con 200/4xx y cuerpo JSON: un 5xx lo
 * reescribe el proxy y el formulario perdería el mensaje.
 *
 * Configuración en api/config.php (no va al repo, ver config.example.php).
 */

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const AREAS = [
    'Estudio Jurídico',
    'Consultoría Empresarial',
    'Asesoría en Inversiones',
    'Habilitaciones Industriales y Comerciales',
    'Otra consulta',
];
const MAX_POR_HORA = 10;

function responder(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function campo(array $body, string $key, int $max): string
{
    $value = $body[$key] ?? '';
    return is_string($value) ? mb_substr(trim($value), 0, $max) : '';
}

function validar(array $body): array
{
    $datos = [
        'nombre' => campo($body, 'nombre', 120),
        'empresa' => campo($body, 'empresa', 160),
        'email' => mb_strtolower(campo($body, 'email', 160)),
        'telefono' => campo($body, 'telefono', 40),
        'area' => campo($body, 'area', 80),
        'mensaje' => campo($body, 'mensaje', 4000),
    ];
    if (mb_strlen($datos['nombre']) < 2) responder(400, ['ok' => false, 'error' => 'Escribe tu nombre.']);
    if (!filter_var($datos['email'], FILTER_VALIDATE_EMAIL)) responder(400, ['ok' => false, 'error' => 'Revisa el correo.']);
    if (mb_strlen($datos['telefono']) < 4) responder(400, ['ok' => false, 'error' => 'Deja un número para contactarte.']);
    if (!in_array($datos['area'], AREAS, true)) responder(400, ['ok' => false, 'error' => 'Elige el servicio de tu consulta.']);
    if (mb_strlen($datos['mensaje']) < 5) responder(400, ['ok' => false, 'error' => 'Escribe tu consulta.']);
    return $datos;
}

function ipCliente(): string
{
    $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0]);
    if (!filter_var($ip, FILTER_VALIDATE_IP)) $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '';
}

/** Tope por IP: cada envío llega al buzón de VDM. */
function limiteSuperado(string $ip): bool
{
    $archivo = sys_get_temp_dir() . '/vdm-consulta-' . hash('sha256', $ip);
    $ahora = time();
    $marcas = is_file($archivo) ? (json_decode((string) file_get_contents($archivo), true) ?: []) : [];
    $marcas = array_values(array_filter($marcas, fn ($t) => $t > $ahora - 3600));
    if (count($marcas) >= MAX_POR_HORA) return true;
    $marcas[] = $ahora;
    file_put_contents($archivo, json_encode($marcas), LOCK_EX);
    return false;
}

function enviarCorreo(array $d, array $config): bool
{
    $lineas = [
        'Nueva consulta desde el sitio web de VDM Consultores',
        '',
        "Nombre: {$d['nombre']}",
        'Empresa: ' . ($d['empresa'] !== '' ? $d['empresa'] : '—'),
        "Correo: {$d['email']}",
        "Teléfono / WhatsApp: {$d['telefono']}",
        "Servicio: {$d['area']}",
        '',
        'Mensaje:',
        $d['mensaje'],
    ];
    $asunto = mb_encode_mimeheader("Nueva consulta — {$d['area']} — {$d['nombre']}", 'UTF-8', 'B', "\r\n");
    // El correo ya pasó FILTER_VALIDATE_EMAIL: no puede traer saltos de línea.
    $headers = [
        "From: {$config['email_from']}",
        "Reply-To: {$d['email']}",
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ];
    $cuerpo = chunk_split(base64_encode(implode("\n", $lineas)));
    return mail($config['email_to'], $asunto, $cuerpo, implode("\r\n", $headers), '-f' . $config['email_from']);
}

function guardar(array $d, bool $correoOk, string $ip, array $config): bool
{
    $ch = curl_init(rtrim($config['supabase_url'], '/') . '/rest/v1/rpc/vdm_registrar_consulta');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            "apikey: {$config['supabase_anon_key']}",
            "Authorization: Bearer {$config['supabase_anon_key']}",
        ],
        CURLOPT_POSTFIELDS => json_encode([
            'p_nombre' => $d['nombre'],
            'p_empresa' => $d['empresa'],
            'p_email' => $d['email'],
            'p_telefono' => $d['telefono'],
            'p_area' => $d['area'],
            'p_mensaje' => $d['mensaje'],
            'p_user_agent' => (string) ($_SERVER['HTTP_USER_AGENT'] ?? ''),
            'p_ip' => $ip,
            'p_email_estado' => $correoOk ? 'enviado' : 'error',
            'p_email_detalle' => $correoOk ? null : 'mail() rechazó el envío',
        ], JSON_UNESCAPED_UNICODE),
    ]);
    curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    return $status >= 200 && $status < 300;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, ['ok' => false, 'error' => 'Método no permitido.']);
}

$config = require __DIR__ . '/config.php';

$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!in_array($origen, $config['origenes'], true)) {
    responder(403, ['ok' => false, 'error' => 'Origen no permitido.']);
}

$body = json_decode((string) file_get_contents('php://input', false, null, 0, 16384), true);
if (!is_array($body)) {
    responder(400, ['ok' => false, 'error' => 'Datos inválidos.']);
}

// Campo oculto: una persona lo deja vacío. Al bot se le responde como si nada.
if (campo($body, 'sitio', 200) !== '') {
    responder(200, ['ok' => true, 'emailStatus' => 'enviado']);
}

$datos = validar($body);
$ip = ipCliente();
if (limiteSuperado($ip)) {
    responder(429, ['ok' => false, 'error' => 'Recibimos muchas consultas seguidas. Intenta más tarde.']);
}

$correoOk = enviarCorreo($datos, $config);
$guardado = guardar($datos, $correoOk, $ip, $config);

if (!$correoOk && !$guardado) {
    responder(200, ['ok' => false, 'error' => 'No pudimos registrar tu consulta. Intenta de nuevo.']);
}
responder(200, ['ok' => true, 'emailStatus' => $correoOk ? 'enviado' : 'error']);
