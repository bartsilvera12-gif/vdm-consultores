import { Link, useLocation } from "react-router-dom";
import { useLang, useT } from "@/i18n/context";
import { LANGS, LANG_NAMES, LANG_TAG, switchPath } from "@/i18n/langs";
import { cn } from "@/lib/utils";
import { Flag } from "./Flag";

/** ES · EN · PT: lleva a la misma página en el otro idioma. */
export function LanguageSwitcher({
  className,
  onNavigate,
  flagsOnly = false,
}: {
  className?: string;
  onNavigate?: () => void;
  /** Solo banderas (header), con el idioma como nombre accesible. */
  flagsOnly?: boolean;
}) {
  const lang = useLang();
  const t = useT();
  const { pathname, hash } = useLocation();
  return (
    <nav aria-label={t.common.language} className={cn("flex items-center", className)}>
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className={cn("h-3.5 w-px bg-line-strong", flagsOnly ? "mx-0.5" : "mx-1")} />}
          <Link
            to={switchPath(pathname, hash, l)}
            hrefLang={LANG_TAG[l]}
            lang={LANG_TAG[l]}
            aria-label={LANG_NAMES[l]}
            aria-current={l === lang ? "true" : undefined}
            onClick={onNavigate}
            className={cn(
              "group inline-flex items-center gap-1.5 rounded px-1.5 py-1 font-display text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors",
              l === lang ? "text-blue" : "text-ink-muted hover:text-ink",
              flagsOnly && "relative px-1 py-2",
            )}
            title={LANG_NAMES[l]}
          >
            <Flag
              lang={l}
              className={cn(
                flagsOnly ? "h-[16px] w-[24px] flex-none" : "h-[13px] w-[19.5px] flex-none",
                " rounded-[2px] shadow-[0_0_0_1px_rgba(10,39,71,0.15)] transition-opacity",
                l === lang ? "opacity-100" : "opacity-75 group-hover:opacity-100",
              )}
            />
            {flagsOnly && l === lang && (
              <span aria-hidden="true" className="absolute inset-x-1 bottom-0.5 h-[2px] rounded-full bg-blue" />
            )}
            {!flagsOnly && l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
