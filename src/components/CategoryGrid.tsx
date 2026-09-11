import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { categories } from "../data/catalog";
import { ArrowRight } from "./Icons";
import { Bolt, Sparkle, Star } from "./Decor";

export default function CategoryGrid() {
  const { t, pick } = useLang();

  return (
    <section className="relative container-x py-12 sm:py-16">
      <Sparkle className="absolute top-8 start-4 w-6 h-6 anim-twinkle hidden sm:block" />
      <Bolt className="absolute top-14 end-6 w-5 h-5 anim-float hidden sm:block" color="#ff8ac0" />

      <SectionTitle>{t("cat.title")}</SectionTitle>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.id === "offers" ? "/offers" : `/category/${cat.slug}`}
            className={[
              "group relative flex flex-col items-center rounded-[2rem] p-4 pt-6 text-center overflow-hidden",
              "bg-gradient-to-b shadow-card border-2 border-white transition hover:-translate-y-1.5 hover:shadow-soft",
              cat.tint,
            ].join(" ")}
          >
            {/* a little night sky behind every tile */}
            <span aria-hidden="true" className="absolute inset-0 star-dust opacity-80" />

            <div
              className={[
                "relative w-full aspect-square grid place-items-center",
                cat.photo ? "rounded-2xl overflow-hidden bg-white/60" : "",
              ].join(" ")}
            >
              {/* the characters stand on a glowing moon */}
              {!cat.photo && (
                <span
                  aria-hidden="true"
                  className="absolute inset-[10%] rounded-full bg-white/75 shadow-[0_0_30px_8px_rgba(255,255,255,.7)] transition duration-500 group-hover:scale-105"
                />
              )}
              <img
                src={cat.image}
                alt={pick(cat.nameAr, cat.nameEn)}
                loading="lazy"
                className={[
                  "relative transition duration-500 group-hover:scale-110",
                  cat.photo
                    ? "w-full h-full object-cover"
                    : "max-h-full max-w-full object-contain drop-shadow-[0_10px_12px_rgba(34,53,140,.22)] group-hover:-rotate-3",
                ].join(" ")}
              />
            </div>

            <div className="relative mt-2 flex items-center gap-2">
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
      <h2 className="flex-1 flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-4xl text-pink-500">
        <Star className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" color="#4cc3f1" />
        <span className="toon-title text-center">{children}</span>
        <Star className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" color="#4cc3f1" />
      </h2>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  );
}
