import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";
import {
  CartIcon,
  CloseIcon,
  FacebookIcon,
  GiftIcon,
  GlobeIcon,
  HeartIcon,
  InstagramIcon,
  MenuIcon,
  SearchIcon,
  TiktokIcon,
  UserIcon,
  YoutubeIcon,
} from "./Icons";
import Wordmark from "./Wordmark";

const socials = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: TiktokIcon, href: "#", label: "TikTok" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube" },
];

const navItems = [
  { to: "/", key: "nav.home", end: true },
  { to: "/category/boys", key: "nav.boys" },
  { to: "/category/girls", key: "nav.girls" },
  { to: "/category/pajamas", key: "nav.pajamas" },
  { to: "/category/newborn", key: "nav.newborn" },
  { to: "/men", key: "nav.men" },
  { to: "/women", key: "nav.women" },
];

export default function Header() {
  const { t, toggleLang, lang } = useLang();
  const { cartCount, wishlist, user } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* top utility bar */}
      <div className="bg-gradient-to-l from-pink-100 via-pink-50 to-sky-100 border-b border-pink-100">
        <div className="container-x flex items-center gap-3 py-2">
          <form onSubmit={submitSearch} className="order-2 flex-1 max-w-md mx-auto relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("common.search")}
              aria-label={t("common.searchShort")}
              className="w-full rounded-full bg-white/90 border border-pink-200 py-2 ps-10 pe-4 text-sm outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition"
            />
            <button
              type="submit"
              aria-label={t("common.searchShort")}
              className="absolute inset-y-0 start-0 ps-3.5 flex items-center text-pink-500"
            >
              <SearchIcon className="w-4 h-4" />
            </button>
          </form>

          <div className="order-1 flex items-center gap-1.5 sm:gap-3 text-sm">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full bg-white/80 hover:bg-white px-3 py-1.5 font-semibold text-navy-600 shadow-sm transition"
              aria-label={lang === "ar" ? "Switch to English" : "التحويل للعربية"}
            >
              <GlobeIcon className="w-4 h-4" />
              <span className="hidden xs:inline">{t("common.language")}</span>
            </button>

            <Link
              to={user ? "/account" : "/login"}
              className="hidden sm:flex items-center gap-1.5 text-navy-600 hover:text-pink-600 transition"
            >
              <UserIcon className="w-5 h-5" />
              <span className="whitespace-nowrap">
                {user ? user.name.split(" ")[0] : t("common.login")}
              </span>
            </Link>

            <Link
              to="/wishlist"
              aria-label={t("common.wishlist")}
              className="relative grid place-items-center w-9 h-9 rounded-full bg-white/80 hover:bg-white text-pink-500 shadow-sm transition"
            >
              <HeartIcon className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -end-1 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-pink-500 text-white text-[11px] font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label={t("common.cart")}
              className="relative grid place-items-center w-9 h-9 rounded-full bg-white/80 hover:bg-white text-navy-600 shadow-sm transition"
            >
              <CartIcon className="w-5 h-5" />
              <span className="absolute -top-1 -end-1 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-pink-500 text-white text-[11px] font-bold">
                {cartCount}
              </span>
            </Link>
          </div>

          <div className="order-3 hidden sm:flex items-center gap-1.5 text-pink-600">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid place-items-center w-8 h-8 rounded-full bg-white/80 hover:bg-white hover:text-pink-700 transition shadow-sm"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* main nav bar */}
      <div className="bg-white/95 backdrop-blur border-b border-pink-100 shadow-[0_4px_18px_-14px_rgba(236,63,140,.5)]">
        <div className="container-x flex items-center gap-4 h-16 sm:h-[72px]">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden grid place-items-center w-10 h-10 rounded-full bg-pink-50 text-pink-600 shrink-0"
            aria-label="Menu"
          >
            <MenuIcon />
          </button>

          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "relative px-4 py-2 rounded-full font-bold transition",
                    isActive
                      ? "text-sky-500"
                      : "text-navy-600 hover:text-pink-500 hover:bg-pink-50",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {t(item.key)}
                    {isActive && (
                      <span className="absolute inset-x-4 -bottom-0.5 h-[3px] rounded-full bg-sky-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <NavLink
              to="/offers"
              className={({ isActive }) =>
                [
                  "flex items-center gap-1.5 px-4 py-2 rounded-full font-bold transition",
                  isActive
                    ? "text-sky-500"
                    : "text-navy-600 hover:text-pink-500 hover:bg-pink-50",
                ].join(" ")
              }
            >
              {t("nav.offers")}
              <GiftIcon className="w-5 h-5 text-pink-500" />
            </NavLink>
          </nav>

          <Link
            to="/"
            dir="ltr"
            className="shrink-0 ms-auto lg:ms-0 flex items-center gap-2"
            aria-label={t("brand.name")}
          >
            <img
              src="/images/logo.png"
              alt=""
              aria-hidden="true"
              className="h-20 sm:h-24 w-auto drop-shadow-sm -mb-7 -mt-1"
            />
            {/* the `lg` band is tight on width, so the name shrinks there */}
            <Wordmark className="lg:hidden xl:block" />
            <Wordmark size="sm" className="hidden lg:block xl:hidden" />
          </Link>
        </div>
      </div>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-navy-700/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute inset-y-0 end-0 w-[82%] max-w-xs bg-white shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" dir="ltr" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <img src="/images/logo.png" alt="" aria-hidden="true" className="h-14 w-auto" />
                <Wordmark size="sm" />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="grid place-items-center w-9 h-9 rounded-full bg-pink-50 text-pink-600"
                aria-label="Close"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {[...navItems, { to: "/offers", key: "nav.offers" }, { to: "/shop", key: "nav.shop" }].map(
                (item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "rounded-2xl px-4 py-3 font-bold transition",
                        isActive
                          ? "bg-sky-100 text-sky-500"
                          : "text-navy-600 hover:bg-pink-50",
                      ].join(" ")
                    }
                  >
                    {t(item.key)}
                  </NavLink>
                ),
              )}
              <hr className="my-3 border-pink-100" />
              {[
                { to: "/about", key: "nav.about" },
                { to: "/contact", key: "nav.contact" },
                { to: user ? "/account" : "/login", key: user ? "common.account" : "common.login" },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 font-semibold text-navy-600 hover:bg-pink-50"
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2 mt-6 text-pink-600">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid place-items-center w-9 h-9 rounded-full bg-pink-50"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
