import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import {
  CartIcon,
  FacebookIcon,
  HeartIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "./Icons";
import TransparentVideo from "./TransparentVideo";
import PhotoCollage from "./PhotoCollage";
import usePointerParallax from "./usePointerParallax";
import { CloudDivider, Crown, Heart, PaperPlane, Sparkle } from "./Decor";
import Wordmark from "./Wordmark";

const socials = [
  { Icon: FacebookIcon, href: "#", label: "Facebook", color: "text-[#1877f2]" },
  { Icon: InstagramIcon, href: "#", label: "Instagram", color: "text-[#e1306c]" },
  { Icon: TiktokIcon, href: "#", label: "TikTok", color: "text-[#111]" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube", color: "text-[#ff0000]" },
];

export default function Hero() {
  const { t } = useLang();
  const rootRef = usePointerParallax<HTMLElement>(20);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-pink-100">
      {/* soft drifting blobs */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -start-24 w-[38rem] h-[38rem] rounded-full bg-pink-50/80 blur-2xl anim-drift" />
        <div
          className="absolute top-10 start-[28%] w-[26rem] h-[26rem] rounded-full bg-sky-100/70 blur-2xl anim-drift"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute -bottom-40 end-[-6rem] w-[34rem] h-[34rem] rounded-full bg-pink-200/60 blur-2xl anim-drift"
          style={{ animationDelay: "-11s" }}
        />
      </div>

      {/* floating trinkets */}
      <Heart className="absolute top-[12%] start-[6%] w-6 h-6 anim-float" color="#ff8ac0" />
      <Heart className="absolute top-[30%] end-[4%] w-8 h-8 anim-float-slow" color="#ffffff" />
      <Heart className="absolute bottom-[18%] start-[42%] w-5 h-5 anim-float" color="#ffb3d2" />
      <Heart className="absolute bottom-[26%] end-[16%] w-6 h-6 anim-float-slow" color="#ff8ac0" />
      <Sparkle className="absolute top-[8%] end-[30%] w-7 h-7 anim-float-slow" />
      <Crown className="absolute top-[16%] end-[13%] w-9 h-9 anim-float hidden sm:block" color="#ffffff" />
      <PaperPlane className="absolute bottom-[14%] start-[8%] w-8 h-8 opacity-70 anim-float-slow hidden sm:block" />

      <div className="container-x relative py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-6">
          {/* teddy + copy — the start half of the split */}
          <div className="order-1 lg:w-1/2 shrink-0 flex flex-col items-center text-center gap-3">
            <p className="badge-shimmer inline-flex items-center justify-center text-center leading-snug gap-2 rounded-3xl sm:rounded-full bg-white/85 backdrop-blur px-4 py-2 text-xs sm:text-sm font-bold text-navy-600 shadow-sm border border-white anim-pop">
              <Sparkle className="w-4 h-4 shrink-0" />
              {t("hero.badge")}
            </p>

            {/* teddy — transparent looping video, muted */}
            <div
              className="w-44 sm:w-52 lg:w-56 xl:w-60 anim-float-slow parallax-layer"
              style={{ "--depth": 0.8 } as React.CSSProperties}
            >
              <TransparentVideo
                src="/images/teddy-bear.webm"
                width={450}
                height={800}
                className="w-full h-auto select-none pointer-events-none drop-shadow-[0_24px_24px_rgba(180,120,150,.22)]"
              />
            </div>

            {/* brand name, set as type so it reads at any width */}
            <Wordmark size="lg" className="!text-center anim-pop" />

            <h1 className="text-xl sm:text-2xl font-extrabold leading-snug">
              <span className="text-pink-600">{t("hero.title1")} </span>
              <span className="text-sky-500 whitespace-nowrap">
                {t("hero.title2")}
                <Heart className="inline-block w-4 h-4 ms-2 -mb-0.5" color="#ec3f8c" />
              </span>
            </h1>

            <p className="text-sm sm:text-base font-bold text-navy-600/80">
              {t("hero.subtitle")}
            </p>

            <div className="flex items-center gap-2.5">
              {socials.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`grid place-items-center w-10 h-10 rounded-full bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-1">
              <Link to="/shop" className="btn-primary btn-shine text-lg px-9 py-3.5">
                <CartIcon className="w-5 h-5" />
                {t("common.shopNow")}
              </Link>
              <Link
                to="/wishlist"
                aria-label={t("common.wishlist")}
                className="grid place-items-center w-[3.35rem] h-[3.35rem] rounded-2xl bg-white text-pink-500 shadow-md transition hover:-translate-y-1 hover:text-pink-600 hover:shadow-lg"
              >
                <HeartIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* photo collage — the end half of the split */}
          <div className="order-2 w-full lg:w-1/2 min-w-0">
            <PhotoCollage />
          </div>
        </div>
      </div>

      <CloudDivider className="absolute -bottom-px inset-x-0 w-full h-8 sm:h-14" fill="#fffaf5" />
    </section>
  );
}
