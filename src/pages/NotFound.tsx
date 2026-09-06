import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { FloatingHearts, Rainbow } from "../components/Decor";

export default function NotFound() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-sky-100 via-pink-50 to-pink-100 py-20">
      <FloatingHearts />
      <Rainbow className="absolute bottom-4 end-8 w-28 opacity-80" />

      <div className="container-x relative text-center">
        <img
          src="/images/avatars/bear.png"
          alt=""
          aria-hidden="true"
          className="w-44 mx-auto anim-float-slow"
        />
        <p className="text-7xl sm:text-8xl font-extrabold text-pink-500 drop-shadow-sm">
          404
        </p>
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
