#!/usr/bin/env node
/**
 * VDM Consultores — aplica las migraciones SQL de /supabase/migrations/
 * contra el Supabase self-hosted de Neura y, opcionalmente, crea el
 * usuario admin via Auth Admin API.
 *
 * Lee credenciales de .env.local (nunca commitea):
 *   DATABASE_URL                        postgresql://postgres:...@host:6432/postgres
 *   VITE_SUPABASE_URL                   https://api.neura.com.py
 *   SUPABASE_SERVICE_ROLE_KEY           eyJ... (service role)
 *
 * Uso:
 *   node scripts/apply-migrations.mjs                      # solo migra
 *   node scripts/apply-migrations.mjs --create-admin ...   # migra + crea admin
 *
 * Flags del admin:
 *   --email <email>      (requerido con --create-admin)
 *   --password <pass>    (requerido con --create-admin)
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "dotenv";
import pg from "pg";

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

config({ path: join(projectRoot, ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DATABASE_URL) {
  console.error("Falta DATABASE_URL en .env.local");
  process.exit(1);
}

// --- Parse de flags simples -------------------------------------------
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  return args[i + 1];
};
const createAdmin = args.includes("--create-admin");
const adminEmail = flag("--email");
const adminPassword = flag("--password");

if (createAdmin && (!adminEmail || !adminPassword)) {
  console.error("--create-admin requiere --email <mail> --password <pass>");
  process.exit(1);
}
if (createAdmin && (!SUPABASE_URL || !SERVICE_ROLE_KEY)) {
  console.error(
    "--create-admin requiere VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local",
  );
  process.exit(1);
}

// --- Aplicar migraciones en orden -------------------------------------
async function applyMigrations() {
  const migrationsDir = join(projectRoot, "supabase", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`\n== Supabase: aplicando ${files.length} migración(es) ==`);
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    for (const file of files) {
      const sql = readFileSync(join(migrationsDir, file), "utf8");
      process.stdout.write(`  · ${file} … `);
      await client.query(sql);
      console.log("ok");
    }
    // PostgREST cachea el schema al arrancar: hay que avisarle que recargue
    // la lista de tablas / columnas tras cada migración.
    await client.query("notify pgrst, 'reload schema';");
    console.log("  · PostgREST schema reload notified");
  } finally {
    await client.end();
  }
  console.log("Migraciones aplicadas.");
}

// --- Crear usuario admin via Auth Admin API ---------------------------
async function createAdminUser(email, password) {
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/admin/users`;
  console.log(`\n== Auth: creando usuario ${email} ==`);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin", source: "bootstrap-script" },
    }),
  });

  const bodyText = await res.text();
  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    body = bodyText;
  }

  if (res.ok) {
    const id = typeof body === "object" ? body.id : "(sin id)";
    console.log(`Usuario creado: ${email} · id ${id}`);
    return;
  }

  // 422 "User already registered" o similar: no es error fatal, lo reportamos.
  if (
    res.status === 422 ||
    (typeof body === "object" &&
      body?.msg?.toLowerCase().includes("already registered"))
  ) {
    console.log(`El usuario ${email} ya existía: lo dejamos tal cual.`);
    return;
  }

  console.error(`\nAuth API respondió ${res.status}:`);
  console.error(body);
  throw new Error("No pudimos crear el usuario admin.");
}

// --- Main --------------------------------------------------------------
try {
  await applyMigrations();
  if (createAdmin) {
    await createAdminUser(adminEmail, adminPassword);
  } else {
    console.log(
      "\n(No se creó usuario admin. Para crearlo:\n" +
        '  node scripts/apply-migrations.mjs --create-admin --email you@dominio --password "ClaveSegura!")',
    );
  }
  console.log("\nListo.");
} catch (err) {
  console.error("\nError:", err.message || err);
  process.exit(1);
}
