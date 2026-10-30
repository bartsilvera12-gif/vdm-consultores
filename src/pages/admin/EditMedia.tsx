import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const BUCKET = "vdm-media";
const PREFIX = "media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

type MediaItem = {
  path: string;    // media/xxxx.jpg
  name: string;    // nombre original limpio para mostrar
  url: string;     // URL pública
  size: number;    // bytes
  createdAt: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s.-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function prettifyName(fileName: string) {
  // media/1793-xxxxxx-foto-equipo.jpg → foto-equipo.jpg
  const parts = fileName.split("-");
  if (parts.length <= 2) return fileName;
  return parts.slice(2).join("-");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

export function EditMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchAll() {
    const client = getSupabase();
    if (!client) return;
    setLoading(true);
    const { data, error } = await client.storage
      .from(BUCKET)
      .list(PREFIX, {
        limit: 500,
        sortBy: { column: "created_at", order: "desc" },
      });
    setLoading(false);
    if (error) {
      toast.error("No pudimos listar las imágenes", {
        description: error.message,
      });
      return;
    }
    const mapped: MediaItem[] = (data ?? [])
      .filter((f) => f.name && !f.name.endsWith("/"))
      .map((f) => {
        const path = `${PREFIX}/${f.name}`;
        const { data: pub } = client.storage.from(BUCKET).getPublicUrl(path);
        return {
          path,
          name: prettifyName(f.name),
          url: pub.publicUrl,
          size: (f.metadata as { size?: number } | null)?.size ?? 0,
          createdAt:
            (f.created_at as string | undefined) ??
            (f as { updated_at?: string }).updated_at ??
            "",
        };
      });
    setItems(mapped);
  }

  useEffect(() => {
    void fetchAll();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const client = getSupabase();
    if (!client) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!ALLOWED.includes(file.type)) {
        toast.error(`${file.name}: formato no soportado`, {
          description: "PNG, JPG, WEBP, GIF o SVG.",
        });
        continue;
      }
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name}: pesa más de 5 MB`);
        continue;
      }
      const safe = slugify(file.name);
      const stamp = Date.now().toString(36);
      const rand = Math.random().toString(36).slice(2, 6);
      const path = `${PREFIX}/${stamp}-${rand}-${safe}`;
      const { error } = await client.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        toast.error(`${file.name}: no se subió`, {
          description: error.message,
        });
      }
    }
    setUploading(false);
    toast.success("Imágenes subidas");
    if (fileInputRef.current) fileInputRef.current.value = "";
    void fetchAll();
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copiada al portapapeles");
    } catch {
      toast.error("No pudimos copiar al portapapeles");
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`¿Eliminar "${item.name}"?\nEsto es permanente.`)) return;
    const client = getSupabase();
    if (!client) return;
    setDeletingPath(item.path);
    const { error } = await client.storage.from(BUCKET).remove([item.path]);
    setDeletingPath(null);
    if (error) {
      toast.error("No pudimos eliminar", { description: error.message });
      return;
    }
    toast.success("Imagen eliminada");
    void fetchAll();
  }

  if (loading) {
    return (
      <div className="grid min-h-48 place-items-center" aria-busy="true">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 leading-h2 font-semibold text-ink">
            Imágenes
          </h1>
          <p className="mt-2 max-w-xl text-body text-ink-muted">
            Banco de imágenes del sitio. Subí fotos y logos acá; después podés
            copiar la URL de cada una y pegarla donde la necesites (textos,
            equipo, áreas, etc.). PNG, JPG, WEBP, GIF o SVG · hasta 5 MB.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="sr-only"
            onChange={(e) => void handleFiles(e.target.files)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Subiendo…
              </>
            ) : (
              <>
                <Upload className="size-4" aria-hidden="true" />
                Subir imágenes
              </>
            )}
          </Button>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center">
          <ImageIcon
            className="mx-auto mb-3 size-10 text-line-strong"
            aria-hidden="true"
          />
          <p className="text-body text-ink-muted">
            Todavía no hay imágenes. Subí la primera con el botón de arriba.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.path}
              className="grid grid-rows-[auto_1fr] overflow-hidden rounded-lg border border-line bg-surface"
            >
              <div className="aspect-video overflow-hidden bg-surface-alt">
                <img
                  src={item.url}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid gap-2 p-3">
                <p
                  className="truncate font-display text-small font-semibold text-ink"
                  title={item.name}
                >
                  {item.name}
                </p>
                <p className="text-small text-ink-muted">
                  {formatBytes(item.size)}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyUrl(item.url)}
                  >
                    <Copy className="size-4" aria-hidden="true" />
                    Copiar URL
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deletingPath === item.path}
                    aria-label="Eliminar"
                    title="Eliminar"
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:border-[#B3261E] hover:text-[#B3261E]",
                      deletingPath === item.path && "opacity-40",
                    )}
                  >
                    {deletingPath === item.path ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Trash2 className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
