import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { useCatalog } from "../context/CatalogContext";
import { ArrowLeft, ArrowRight, CartIcon } from "./Icons";
import { Sparkle, Star } from "./Decor";

/**
 * The home banner.
 *
 * It used to be one flat piece of artwork with the Arabic headline painted into
 * it, which meant the English build showed Arabic and the wording could only be
 * changed by re-exporting the image. The headline is real text now, so it
 * follows the language switch and stays sharp at any size, and each slide
 * borrows a photo from the live catalogue instead of shipping its own.
 */
type Banner = {
  titleKey: string;
  subKey: string;
  /** Slug of the product whose photo fills the slide. */
  productSlug: string;
  to: string;
  tint: string;
};

// Add another entry and the arrows and dots turn themselves back on.
const banners: Banner[] = [
  {
    titleKey: "promo.1.title",
    subKey: "promo.1.sub",
    productSlug: "lion-king-pajama",
    to: "/shop",
    tint: "from-sky-200 via-sky-100 to-pink-100",
  },
];

export default function PromoSlider() {
  const { t } = useLang();
  const { products } = useCatalog();
  const [index, setIndex] = useState(0);

  const count = banners.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (count < 2) return;
    const id = window.setInterval(next, 6000);
    return () => window.clearInterval(id);
  }, [next, count]);

  const banner = banners[index];
  // any product will do if that slug is gone — the slide is decorative
  const product =
    products.find((p) => p.slug === banner.productSlug) ?? products[0];

  return (
    <section className="container-x py-4 sm:py-8">
      <div
        className={`relative overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-l shadow-card ${banner.tint}`}
      >
        <div aria-hidden="true" className="absolute inset-0 star-dust opacity-60" />
        <Star className="absolute top-6 start-[42%] w-5 h-5 anim-twinkle hidden sm:block" />
        <Sparkle
          className="absolute bottom-8 start-[34%] w-6 h-6 anim-twinkle hidden sm:block"
          color="#ffffff"
        />

        <div className="relative flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:gap-8 sm:p-8 sm:text-start lg:p-10">
          <div className="min-w-0 flex-1">
            <h2 className="toon-title text-3xl leading-tight text-pink-600 sm:text-4xl lg:text-5xl">
              {t(banner.titleKey)}
            </h2>
            <p className="mt-2 text-lg font-extrabold text-navy-600 sm:text-xl lg:text-2xl">
              {t(banner.subKey)}
            </p>

            <Link
              to={banner.to}
              className="btn-primary btn-shine mt-5 w-fit px-7 py-2.5 text-sm sm:px-8 sm:py-3 sm:text-base"
            >
              <CartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              {t("common.shopNow")}
            </Link>
          </div>

          {product && (
            <div className="w-40 shrink-0 sm:w-52 lg:w-64">
              <img
                src={product.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="aspect-square w-full rounded-3xl bg-white/70 object-contain p-3 shadow-card"
              />
            </div>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute top-1/2 start-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-pink-600 shadow-md transition hover:bg-white"
            >
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute top-1/2 end-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-pink-600 shadow-md transition hover:bg-white"
            >
              <ArrowRight className="h-5 w-5 rtl:rotate-180" />
            </button>

            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === index}
                  className={[
                    "h-2.5 rounded-full transition-all",
                    i === index ? "w-7 bg-pink-500" : "w-2.5 bg-white/90 hover:bg-pink-200",
                  ].join(" ")}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
