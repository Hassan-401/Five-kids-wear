import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { FloatingStars, Moon } from "../components/Decor";

export default function NotFound() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-sky-100 via-sky-50 to-pink-100 py-20">
      <FloatingStars />
      <Moon className="absolute top-8 end-10 w-14 h-14 anim-float-slow drop-shadow-[0_0_16px_rgba(255,226,138,.9)]" />

      <div className="container-x relative text-center">
        <img
          src="/images/characters/catboy.webp"
          alt=""
          aria-hidden="true"
          className="w-48 mx-auto anim-float-slow"
        />
        <p className="toon-title text-7xl sm:text-8xl text-pink-500">404</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-navy-600">
          {t("notfound.title")}
        </h1>
        <p className="mt-2 font-semibold text-navy-600/70">{t("notfound.sub")}</p>
        <Link to="/" className="btn-primary mt-7">
          {t("notfound.cta")}
        </Link>
      </div>
    </section>
  );
}
