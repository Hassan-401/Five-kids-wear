import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { categories } from "../data/catalog";
import { ArrowRight } from "./Icons";
import { Heart, Sparkle } from "./Decor";

export default function CategoryGrid() {
  const { t, pick } = useLang();

  return (
    <section className="relative container-x py-12 sm:py-16">
      <Sparkle className="absolute top-8 start-4 w-6 h-6 anim-float-slow hidden sm:block" />
      <Heart className="absolute top-14 end-6 w-5 h-5 anim-float hidden sm:block" color="#ffb3d2" />

      <SectionTitle>{t("cat.title")}</SectionTitle>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.id === "offers" ? "/offers" : `/category/${cat.slug}`}
            className={[
              "group relative flex flex-col items-center rounded-[2rem] p-4 pt-6 text-center overflow-hidden",
              "bg-gradient-to-b shadow-card border border-white/70 transition hover:-translate-y-1.5 hover:shadow-soft",
              cat.tint,
            ].join(" ")}
          >
            <div className="w-full aspect-square grid place-items-center">
              <img
                src={cat.image}
                alt={pick(cat.nameAr, cat.nameEn)}
                loading="lazy"
                className="max-h-full w-auto object-contain transition duration-500 group-hover:scale-110"
              />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="font-extrabold text-pink-700">
                {pick(cat.nameAr, cat.nameEn)}
              </span>
              <span className="grid place-items-center w-7 h-7 rounded-full bg-sky-400 text-white shadow-sm transition group-hover:bg-pink-500">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7 sm:mb-9">
      <h2 className="flex-1 flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-4xl font-extrabold text-pink-600">
        <Heart className="w-5 h-5 sm:w-6 sm:h-6" color="#ec3f8c" />
        <span className="text-center">{children}</span>
        <Heart className="w-5 h-5 sm:w-6 sm:h-6" color="#ec3f8c" />
      </h2>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  );
}
