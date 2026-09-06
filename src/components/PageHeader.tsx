import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { CloudDivider, FloatingHearts } from "./Decor";

type Crumb = { label: string; to?: string };

export default function PageHeader({
  title,
  subtitle,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
}) {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-sky-100 via-pink-50 to-pink-100 pt-10 pb-16">
      <FloatingHearts />
      <div className="container-x relative text-center">
        <nav
          aria-label="breadcrumb"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-navy-600/70 mb-3"
        >
          <Link to="/" className="hover:text-pink-600 transition">
            {t("common.home")}
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <span className="text-pink-300">•</span>
              {c.to ? (
                <Link to={c.to} className="hover:text-pink-600 transition">
                  {c.label}
                </Link>
              ) : (
                <span className="text-pink-600">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-pink-600 drop-shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl mx-auto font-semibold text-navy-600/80">
            {subtitle}
          </p>
        )}
      </div>
      <CloudDivider
        className="absolute -bottom-px inset-x-0 w-full h-8 sm:h-12"
        fill="#fffaf5"
      />
    </section>
  );
}
