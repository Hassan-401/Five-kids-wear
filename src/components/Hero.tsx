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
import PhotoCollage from "./PhotoCollage";
import usePointerParallax from "./usePointerParallax";
import { Bolt, CloudDivider, Moon, Sparkle, Star } from "./Decor";
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
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-pink-100"
    >
      {/* soft drifting blobs over a dusting of stars */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 star-dust" />
        <div className="absolute -top-32 -start-24 w-[38rem] h-[38rem] rounded-full bg-white/45 blur-2xl anim-drift" />
        <div
          className="absolute top-10 start-[28%] w-[26rem] h-[26rem] rounded-full bg-pink-200/45 blur-2xl anim-drift"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute -bottom-40 end-[-6rem] w-[34rem] h-[34rem] rounded-full bg-sky-300/35 blur-2xl anim-drift"
          style={{ animationDelay: "-11s" }}
        />
      </div>

      {/* night-sky trinkets */}
      <Moon className="absolute top-[6%] end-[5%] w-12 h-12 sm:w-16 sm:h-16 anim-float-slow drop-shadow-[0_0_18px_rgba(255,226,138,.9)]" />
      <Star className="absolute top-[12%] start-[5%] w-6 h-6 anim-twinkle" />
      <Star
        className="absolute bottom-[22%] start-[45%] w-5 h-5 anim-twinkle hidden lg:block"
        color="#ffffff"
        style={{ animationDelay: "-1.4s" }}
      />
      <Sparkle
        className="absolute top-[36%] end-[3%] w-7 h-7 anim-twinkle"
        color="#ffffff"
        style={{ animationDelay: "-0.7s" }}
      />
      <Bolt className="absolute bottom-[16%] start-[6%] w-8 h-8 anim-float hidden sm:block" />
      <Bolt
        className="absolute top-[14%] start-[47%] w-6 h-6 anim-float-slow hidden lg:block"
        color="#ff8ac0"
      />

      <div className="container-x relative py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-6">
          {/* the crew + the name — the start half of the split */}
          <div className="order-1 lg:w-1/2 shrink-0 flex flex-col items-center text-center">
            {/* characters with the name set across their feet, like the logo */}
            <div className="flex flex-col items-center">
              <div
                className="parallax-layer w-72 sm:w-[21rem] xl:w-[23rem]"
                style={{ "--depth": 0.8 } as React.CSSProperties}
              >
                <img
                  src="/images/characters/team.webp"
                  alt=""
                  aria-hidden="true"
                  width={820}
                  height={764}
                  className="w-full h-auto select-none pointer-events-none anim-bob drop-shadow-[0_22px_22px_rgba(34,53,140,.22)]"
                  style={{ animationDuration: "6s" }}
                />
              </div>

              <h1 className="relative z-10 -mt-14 sm:-mt-16 anim-pop">
                <Wordmark size="lg" className="!text-center" />
              </h1>
            </div>

            <p className="mt-4 text-base sm:text-lg font-extrabold text-navy-600">
              {t("hero.subtitle")}
            </p>

            <div className="mt-4 flex items-center gap-2.5">
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

            <div className="mt-5 flex items-center gap-3">
              <Link to="/shop" className="btn-primary btn-shine text-lg px-9 py-3.5">
                <CartIcon className="w-5 h-5" />
                {t("common.shopNow")}
              </Link>
              <Link
                to="/wishlist"
                aria-label={t("common.wishlist")}
                className="grid place-items-center w-[3.35rem] h-[3.35rem] rounded-2xl bg-white text-pink-500 shadow-[0_5px_0_var(--color-sky-200)] transition hover:-translate-y-1 hover:text-pink-600"
              >
                <HeartIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* photo collage — the end half of the split; phones skip it */}
          <div className="order-2 hidden sm:block w-full lg:w-1/2 min-w-0">
            <PhotoCollage />
          </div>
        </div>
      </div>

      <CloudDivider className="absolute -bottom-px inset-x-0 w-full h-8 sm:h-14" fill="#f6fbff" />
    </section>
  );
}
