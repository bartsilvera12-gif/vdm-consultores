import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LANG, pathFor, type Lang, type PageKey } from "./langs";
import { messages, type Messages } from "./messages";
import { translateContent } from "./content";

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): Lang {
  return useContext(LangContext);
}

/** Textos fijos del sitio en el idioma actual. */
export function useT(): Messages {
  return messages[useLang()];
}

/** Dirección de una página en el idioma actual (con ancla opcional). */
export function usePath() {
  const lang = useLang();
  return (page: PageKey, hash?: string) => pathFor(page, lang, hash);
}

/** Traduce un texto que viene de la base (cargado en español). */
export function useTr() {
  const lang = useLang();
  return (text: string) => translateContent(text, lang);
}
