import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
  WhatsappIcon,
} from "./Icons";
import { Heart, PaperPlane } from "./Decor";

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
    <footer className="relative overflow-hidden bg-gradient-to-b from-pink-50 to-pink-100 pt-14 pb-8 mt-4">
      <Heart className="absolute top-10 start-[12%] w-6 h-6 anim-float-slow" color="#ffc4da" />
      <Heart className="absolute bottom-16 end-[10%] w-5 h-5 anim-float" color="#ff8ac0" />
      <PaperPlane className="absolute top-16 end-[22%] w-8 h-8 opacity-70 anim-float-slow" />

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
                  className="grid place-items-center w-10 h-10 rounded-full bg-white text-pink-500 shadow-sm hover:bg-pink-500 hover:text-white hover:-translate-y-0.5 transition"
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
                    <Heart className="w-3 h-3" color="#ff8ac0" />
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* brand */}
          <div className="flex flex-col items-center md:items-start gap-3 order-1 md:order-3">
            <img src="/images/logo.png" alt={t("brand.name")} className="h-28 w-auto" />
            <p className="text-sm font-semibold text-navy-600/80">
              {t("brand.tagline")}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-pink-200/70 text-center text-sm text-navy-600/70 font-semibold">
          {t("footer.rights")} <span dir="ltr">© {year} Five Kids Wear.</span>
        </div>
      </div>
    </footer>
  );
}
