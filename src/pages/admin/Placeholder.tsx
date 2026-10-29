import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function AdminPlaceholder({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-h2 leading-h2 font-semibold text-ink">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-body text-ink-muted">{body}</p>
      </header>
      <div className="rounded-lg border border-dashed border-line bg-surface p-6 text-small text-ink-muted">
        En desarrollo. Esta pantalla llega en la próxima iteración del admin.
      </div>
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-small font-semibold text-blue"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver al resumen
      </Link>
    </div>
  );
}
