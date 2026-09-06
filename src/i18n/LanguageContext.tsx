import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Lang } from "./translations";

type LanguageValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  isRTL: boolean;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  /** Picks the Arabic or English half of a bilingual value. */
  pick: <T>(ar: T, en: T) => T;
  /** Formats a price with the active locale + currency label. */
  price: (value: number) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

const STORAGE_KEY = "fkw.lang";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "ar";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "ar" ? stored : "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    document.title =
      lang === "ar"
        ? "The Five Kids Wear | ملابس أطفال بكل حب"
        : "The Five Kids Wear | Kids clothes made with love";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === "ar" ? "en" : "ar")),
    [],
  );

  const value = useMemo<LanguageValue>(() => {
    const t = (key: string) => translations[lang][key] ?? key;
    return {
      lang,
      dir,
      isRTL: dir === "rtl",
      setLang,
      toggleLang,
      t,
      pick: <T,>(ar: T, en: T) => (lang === "ar" ? ar : en),
      // Western digits in both languages — Arabic storefronts price this way.
      price: (v: number) =>
        lang === "ar"
          ? `${v.toLocaleString("en-US")} ${translations.ar["common.currency"]}`
          : `${translations.en["common.currency"]} ${v.toLocaleString("en-US")}`,
    };
  }, [lang, dir, setLang, toggleLang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
