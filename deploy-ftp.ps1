# Deploy FTP a Hostinger — sube el contenido de dist/ al servidor.
#
# Uso:
#   1. npm run build        (genera dist/)
#   2. Completá FTP_HOST / FTP_USER / FTP_PASS / FTP_REMOTE_DIR en .env.local
#   3. npm run deploy       (o: powershell -ExecutionPolicy Bypass -File deploy-ftp.ps1)
#
# La contraseña se lee de .env.local (gitignoreado) y nunca se commitea.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$distDir = Join-Path $root "dist"
$envFile = Join-Path $root ".env.local"

if (-not (Test-Path $distDir)) {
  throw "No existe dist/. Corré 'npm run build' primero."
}
if (-not (Test-Path $envFile)) {
  throw "No existe .env.local. Copiá las líneas FTP_* de .env.example y completá tus datos."
}

# --- Leer variables FTP_* de .env.local ---
$cfg = @{}
foreach ($line in Get-Content $envFile) {
  if ($line -match '^\s*#' -or $line -notmatch '=') { continue }
  $k, $v = $line -split '=', 2
  $cfg[$k.Trim()] = $v.Trim()
}
foreach ($req in @("FTP_HOST", "FTP_USER", "FTP_PASS", "FTP_REMOTE_DIR")) {
  if (-not $cfg.ContainsKey($req) -or [string]::IsNullOrWhiteSpace($cfg[$req])) {
    throw "Falta $req en .env.local"
  }
}

$ftpHost   = $cfg["FTP_HOST"] -replace '^ftp://', ''
$ftpUser   = $cfg["FTP_USER"]
$ftpPass   = $cfg["FTP_PASS"]
$remoteDir = $cfg["FTP_REMOTE_DIR"].TrimEnd('/')
$cred      = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)

function Ensure-FtpDir($path) {
  $uri = "ftp://$ftpHost$path"
  try {
    $req = [System.Net.FtpWebRequest]::Create($uri)
    $req.Credentials = $cred
    $req.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
    $req.GetResponse().Close()
    Write-Host "  + creada carpeta $path"
  } catch {
    # Ya existe: ignorar (552/550).
  }
}

function Upload-File($localPath, $remotePath) {
  $uri = "ftp://$ftpHost$remotePath"
  $req = [System.Net.FtpWebRequest]::Create($uri)
  $req.Credentials = $cred
  $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
  $req.UseBinary = $true
  $req.KeepAlive = $false
  $bytes = [System.IO.File]::ReadAllBytes($localPath)
  $req.ContentLength = $bytes.Length
  $stream = $req.GetRequestStream()
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Close()
  $resp = $req.GetResponse()
  $resp.Close()
  Write-Host "  ↑ $remotePath"
}

Write-Host "Deploy a ftp://$ftpHost$remoteDir ..." -ForegroundColor Cyan
Ensure-FtpDir $remoteDir

# -Force incluye archivos ocultos (dot files como .htaccess). Sin esto,
# el .htaccess del SPA fallback nunca se subía y /admin, /servicios, ...
# devolvían el 404 del hosting en lugar de que React Router los resolviera.
$files = Get-ChildItem -Path $distDir -Recurse -File -Force
# Crear subcarpetas primero (p. ej. /assets).
$dirs = Get-ChildItem -Path $distDir -Recurse -Directory -Force
foreach ($d in $dirs) {
  $rel = $d.FullName.Substring($distDir.Length).Replace('\', '/')
  Ensure-FtpDir "$remoteDir$rel"
}
foreach ($f in $files) {
  $rel = $f.FullName.Substring($distDir.Length).Replace('\', '/')
  Upload-File $f.FullName "$remoteDir$rel"
}

Write-Host "Listo. Verificá https://vdmconsultores.com.py/" -ForegroundColor Green
Write-Host "Si queda la pantalla en blanco, borrá del servidor la carpeta /src y el index.html viejo por el Administrador de archivos." -ForegroundColor Yellow
