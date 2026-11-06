import { Link, useLocation } from "react-router-dom";
import { useLang, useT } from "@/i18n/context";
import { LANGS, LANG_NAMES, LANG_TAG, switchPath } from "@/i18n/langs";
import { cn } from "@/lib/utils";

/** ES · EN · PT: lleva a la misma página en el otro idioma. */
export function LanguageSwitcher({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const lang = useLang();
  const t = useT();
  const { pathname, hash } = useLocation();
  return (
    <nav aria-label={t.common.language} className={cn("flex items-center", className)}>
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className="mx-1 h-3.5 w-px bg-line-strong" />}
          <Link
            to={switchPath(pathname, hash, l)}
            hrefLang={LANG_TAG[l]}
            lang={LANG_TAG[l]}
            aria-label={LANG_NAMES[l]}
            aria-current={l === lang ? "true" : undefined}
            onClick={onNavigate}
            className={cn(
              "rounded px-1.5 py-1 font-display text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors",
              l === lang ? "text-blue" : "text-ink-muted hover:text-ink",
            )}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
