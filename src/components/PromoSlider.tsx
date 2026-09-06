import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { ArrowLeft, ArrowRight, CartIcon } from "./Icons";

type Banner = {
  src: string;
  /** natural size of the artwork, so the frame keeps its exact aspect ratio */
  width: number;
  height: number;
  to: string;
  /** CTA placement over the artwork, in % of the frame. Physical (not logical)
   *  because the headline is painted into the artwork and never flips. */
  cta: { left: number; top: number };
};

// Drop more artwork in here and the arrows and dots turn themselves back on.
const banners: Banner[] = [
  {
    src: "/images/promo-kids.png",
    width: 2170,
    height: 725,
    to: "/shop",
    cta: { left: 5, top: 72 },
  },
];

export default function PromoSlider() {
  const { t } = useLang();
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

  return (
    <section className="container-x py-4 sm:py-8">
      <div
        className="relative rounded-[2rem] overflow-hidden shadow-card border border-pink-100 bg-pink-50"
        style={
          {
            "--cta-left": `${banner.cta.left}%`,
            "--cta-top": `${banner.cta.top}%`,
          } as React.CSSProperties
        }
      >
        {/* the artwork is shown whole — the frame takes its aspect ratio */}
        <img
          key={banner.src}
          src={banner.src}
          alt=""
          aria-hidden="true"
          width={banner.width}
          height={banner.height}
          className="block w-full h-auto"
        />

        {/* the frame is only ~110px tall on phones, so the CTA sits under the
            artwork there and moves on top of it from `sm` up */}
        <Link
          to={banner.to}
          className="btn-primary btn-shine mx-auto my-3 flex w-fit px-6 py-2 text-sm sm:absolute sm:my-0 sm:px-8 sm:py-3 sm:text-base sm:left-[var(--cta-left)] sm:top-[var(--cta-top)]"
        >
          <CartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          {t("common.shopNow")}
        </Link>

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute top-1/2 -translate-y-1/2 start-3 grid place-items-center w-10 h-10 rounded-full bg-white/85 text-pink-600 shadow-md hover:bg-white transition"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute top-1/2 -translate-y-1/2 end-3 grid place-items-center w-10 h-10 rounded-full bg-white/85 text-pink-600 shadow-md hover:bg-white transition"
            >
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
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
