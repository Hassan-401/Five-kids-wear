import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
  WhatsappIcon,
} from "./Icons";
import { Moon, Sparkle, Star } from "./Decor";

const socials = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: TiktokIcon, href: "#", label: "TikTok" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube" },
  { Icon: WhatsappIcon, href: "#", label: "WhatsApp" },
];

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const links = [
    { to: "/", key: "nav.home" },
    { to: "/about", key: "nav.about" },
    { to: "/privacy", key: "footer.privacy" },
    { to: "/terms", key: "footer.terms" },
    { to: "/contact", key: "nav.contact" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-sky-100 to-pink-100 pt-14 pb-8 mt-4">
      <div aria-hidden="true" className="absolute inset-0 star-dust opacity-70" />
      <Moon className="absolute top-8 start-[8%] w-10 h-10 anim-float-slow drop-shadow-[0_0_14px_rgba(255,226,138,.9)]" />
      <Sparkle className="absolute top-12 end-[30%] w-6 h-6 anim-twinkle" color="#ffffff" />
      <Star className="absolute bottom-20 start-[24%] w-5 h-5 anim-twinkle" color="#ff8ac0" />

      {/* Owlette gliding in from the corner beside the logo */}
      <img
        src="/images/characters/owlette.webp"
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute bottom-6 end-[1.5%] w-32 lg:w-40 select-none pointer-events-none anim-float-slow drop-shadow-[0_16px_18px_rgba(34,53,140,.2)]"
      />

      <div className="container-x relative">
        <div className="grid gap-10 md:grid-cols-3 md:items-start text-center md:text-start">
          {/* social */}
          <div className="flex flex-col items-center md:items-start order-3 md:order-1">
            <h3 className="text-lg font-extrabold text-pink-600 mb-4">
              {t("footer.follow")}
            </h3>
            <div className="flex items-center gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid place-items-center w-10 h-10 rounded-full bg-white text-sky-600 shadow-sm hover:bg-sky-500 hover:text-white hover:-translate-y-0.5 transition"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <p className="mt-6 font-bold text-navy-600">{t("footer.slogan")}</p>
          </div>

          {/* quick links */}
          <div className="order-2">
            <h3 className="text-lg font-extrabold text-pink-600 mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="inline-flex items-center gap-2 text-navy-600 hover:text-pink-600 font-semibold transition"
                  >
                    <Star className="w-3.5 h-3.5" color="#4cc3f1" />
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* brand */}
          <div className="flex flex-col items-center md:items-start gap-3 order-1 md:order-3">
            <img src="/images/logo.webp" alt={t("brand.name")} className="h-32 w-auto" />
            <p className="text-sm font-semibold text-navy-600/80">
              {t("brand.tagline")}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-sky-200 text-center text-sm text-navy-600/70 font-semibold">
          {t("footer.rights")} <span dir="ltr">© {year} Five PJ Masks.</span>
        </div>
      </div>
    </footer>
  );
}
