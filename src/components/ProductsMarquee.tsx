import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { ArrowLeft, ArrowRight, BadgeIcon, GiftIcon, UserIcon } from "./Icons";
import { Bolt, Heart, Moon, Sparkle, Star } from "./Decor";

type Item = {
  ar: string;
  en: string;
  image: string;
  to: string;
  Icon: React.ComponentType<{ className?: string; color?: string }>;
  /** card colour — tints the bottom of the photo and the icon */
  color: string;
};

const items: Item[] = [
  { ar: "بيجامات شتوي", en: "Winter pajamas", image: "/images/products/lion-king-pajama-1.jpg", to: "/category/pajamas", Icon: Moon, color: "#2f5fd0" },
  { ar: "أطقم رجلان", en: "Raglan sets", image: "/images/products/space-raglan-set-1.jpg", to: "/category/pajamas", Icon: Bolt, color: "#19a9e1" },
  { ar: "أطقم صيفي", en: "Summer sets", image: "/images/products/spiderman-summer-set-1.jpg", to: "/category/boys", Icon: Sparkle, color: "#e0344b" },
  { ar: "ملابس أولاد", en: "Boys", image: "/images/products/sonic-summer-set-1.jpg", to: "/category/boys", Icon: Star, color: "#1e7fd8" },
  { ar: "ملابس بنات", en: "Girls", image: "/images/products/minnie-summer-set-1.jpg", to: "/category/girls", Icon: Heart, color: "#f9569f" },
  { ar: "تيشيرتات بنات", en: "Girls tees", image: "/images/products/girl-tee-pack-mermaid-1.jpg", to: "/category/girls", Icon: Sparkle, color: "#8b5cf6" },
  { ar: "مواليد", en: "Newborn", image: "/images/products/newbaby-bodysuit-pack-1.jpg", to: "/category/newborn", Icon: Heart, color: "#2fae4e" },
  { ar: "رومبيرات", en: "Sleepsuits", image: "/images/products/blue-stripe-sleepsuit-1.jpg", to: "/category/newborn", Icon: Moon, color: "#0f9e9a" },
  { ar: "فانلات قطن", en: "Cotton vests", image: "/images/products/boy-vest-pack-1.jpg", to: "/category/newborn", Icon: BadgeIcon, color: "#f59e0b" },
  { ar: "عروض خاصة", en: "Special offers", image: "/images/products/teddy-bows-pajama-1.jpg", to: "/offers", Icon: GiftIcon, color: "#ec3f8c" },
  { ar: "منتجات رجالي", en: "Men", image: "/images/men/men-1.jpg", to: "/men", Icon: UserIcon, color: "#22358c" },
  { ar: "منتجات حريمي", en: "Women", image: "/images/women/women-1.jpg", to: "/women", Icon: UserIcon, color: "#d92a76" },
];

/** px per second the strip drifts to the left */
const SPEED = 42;

/**
 * "Our products" strip: a row of cards drifting to the left forever, paused
 * while the pointer (or keyboard focus) is on it, with arrows to step through.
 *
 * The list is rendered twice and the track is laid out left-to-right in both
 * languages, so "left" is physical and the loop can wrap seamlessly by half
 * the track width. Each card sets its own direction back for the text.
 */
export default function ProductsMarquee() {
  const { t, pick, lang } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const motion = useRef({ x: 0, target: null as number | null, paused: false, half: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const m = motion.current;

    const measure = () => {
      m.half = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      if (m.target !== null) {
        // ease towards the arrow's target
        const d = m.target - m.x;
        if (Math.abs(d) < 0.5) {
          m.x = m.target;
          m.target = null;
        } else {
          m.x += d * Math.min(1, dt / 110);
        }
      } else if (!m.paused && !reduce) {
        m.x -= (SPEED * dt) / 1000;
      }

      // keep x inside (-half, 0] so the doubled list always covers the view
      if (m.half > 0) {
        while (m.x <= -m.half) {
          m.x += m.half;
          if (m.target !== null) m.target += m.half;
        }
        while (m.x > 0) {
          m.x -= m.half;
          if (m.target !== null) m.target -= m.half;
        }
      }

      track.style.transform = `translate3d(${m.x}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  /** Step one card; `dir` is physical: -1 slides the cards left, 1 right. */
  const step = (dir: -1 | 1) => {
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    const width = card?.getBoundingClientRect().width ?? 200;
    const m = motion.current;
    m.target = (m.target ?? m.x) + dir * width;
  };

  const pause = (paused: boolean) => () => {
    motion.current.paused = paused;
  };

  const textDir = lang === "ar" ? "rtl" : "ltr";
  const otherDir = lang === "ar" ? "ltr" : "rtl";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-pink-100/60 to-sky-50 py-12 sm:py-16">
      <span aria-hidden="true" className="absolute inset-0 star-dust" />

      <header className="container-x relative text-center">
        <h2 className="toon-title text-3xl sm:text-4xl text-pink-500">
          {t("ourProducts.title")}
        </h2>
        {/* hand-drawn underline */}
        <svg
          aria-hidden="true"
          viewBox="0 0 140 14"
          className="mx-auto mt-2 w-32 h-3.5 text-sky-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
        >
          <path d="M3 9c12-6 22-6 34 0s22 6 34 0 22-6 34 0 20 5 32-1" />
        </svg>
        <p className="mt-3 flex items-center justify-center gap-2 font-semibold text-navy-600/75">
          {t("ourProducts.sub")}
          <GiftIcon className="w-5 h-5 text-pink-500" />
        </p>
      </header>

      <div
        className="relative mt-8"
        onMouseEnter={pause(true)}
        onMouseLeave={pause(false)}
        onFocus={pause(true)}
        onBlur={pause(false)}
      >
        <div dir="ltr" className="overflow-hidden py-3">
          <div ref={trackRef} className="flex w-max will-change-transform">
            {[0, 1].map((copy) =>
              items.map((item) => (
                <div key={`${copy}-${item.en}`} className="shrink-0 px-2 sm:px-2.5">
                  <Link
                    to={item.to}
                    dir={textDir}
                    aria-hidden={copy === 1 || undefined}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="group relative block w-40 sm:w-44 lg:w-48 aspect-[4/5] rounded-[1.4rem] overflow-hidden border-[3px] border-white bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-soft"
                  >
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${item.color} 0%, ${item.color}d9 26%, ${item.color}00 60%)`,
                      }}
                    />
                    <span
                      className="absolute top-3 start-3 grid place-items-center w-9 h-9 rounded-xl bg-white/90 shadow-sm"
                      style={{ color: item.color }}
                    >
                      <item.Icon className="w-5 h-5" color="currentColor" />
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-3.5 text-start text-white">
                      <span className="block font-extrabold leading-tight drop-shadow-sm">
                        {pick(item.ar, item.en)}
                      </span>
                      <span dir={otherDir} className="block mt-0.5 text-[0.7rem] font-semibold text-white/85 text-start">
                        {pick(item.en, item.ar)}
                      </span>
                    </span>
                  </Link>
                </div>
              )),
            )}
          </div>
        </div>

        {/* soft fade at both edges */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-pink-50 to-transparent" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-pink-50 to-transparent" />

        <button
          type="button"
          onClick={() => step(1)}
          aria-label={pick("السابق", "Previous")}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white text-pink-600 shadow-md hover:bg-pink-50 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={pick("التالي", "Next")}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white text-pink-600 shadow-md hover:bg-pink-50 transition"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
