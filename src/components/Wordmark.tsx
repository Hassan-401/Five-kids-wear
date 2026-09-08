import { useLang } from "../i18n/LanguageContext";

/**
 * The brand name set as type, so it reads at any size next to the logo mark.
 * Always laid out left-to-right — it is a Latin name even in the Arabic build.
 */
export default function Wordmark({
  size = "md",
  tagline = false,
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  /** Print the bilingual tagline under the name. */
  tagline?: boolean;
  className?: string;
}) {
  const { t } = useLang();

  const scale = {
    sm: {
      the: "text-[0.5rem] tracking-[0.32em]",
      name: "text-base",
      tag: "text-[0.55rem]",
    },
    md: {
      the: "text-[0.55rem] tracking-[0.34em]",
      name: "text-xl sm:text-[1.35rem]",
      tag: "text-[0.6rem]",
    },
    lg: {
      the: "text-[0.7rem] tracking-[0.4em]",
      name: "text-3xl sm:text-4xl",
      tag: "text-xs sm:text-sm",
    },
  }[size];

  return (
    <span dir="ltr" className={`block text-start leading-none ${className}`}>
      <span
        className={`block font-extrabold uppercase text-sky-500 ${scale.the}`}
      >
        The
      </span>
      <span
        className={`block font-extrabold text-pink-600 whitespace-nowrap ${scale.name}`}
      >
        Five Kids <span className="text-sky-500">Wear</span>
      </span>
      {tagline && (
        <span
          className={`block mt-1.5 font-bold text-navy-600/70 ${scale.tag}`}
        >
          {t("brand.tagline")}
        </span>
      )}
    </span>
  );
}
