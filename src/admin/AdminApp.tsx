import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import Login from "./Login";
import Overview from "./Overview";
import Products from "./Products";
import Categories from "./Categories";
import Orders from "./Orders";
import Shipping from "./Shipping";
import Settings from "./Settings";
import { Loading } from "./ui";
import {
  CartIcon,
  CloseIcon,
  GiftIcon,
  GlobeIcon,
  MenuIcon,
  TruckIcon,
} from "../components/Icons";

/**
 * The shop owner's dashboard.
 *
 * It lives at `/admin`, outside the storefront's header and footer, and is
 * lazy-loaded so shoppers never download it. The session is a cookie set by
 * `POST /api/admin/login`; every screen below assumes it is valid and lets the
 * API reject the call if it is not.
 */
export default function AdminApp() {
  const { pick, toggleLang, lang } = useLang();
  const navigate = useNavigate();

  const [state, setState] = useState<"checking" | "out" | "in">("checking");
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.admin
      .me()
      .then((me) => {
        setUsername(me.username);
        setState("in");
      })
      .catch(() => setState("out"));
  }, []);

  const signOut = async () => {
    await api.admin.logout().catch(() => {});
    setState("out");
    navigate("/admin");
  };

  if (state === "checking") {
    return <Loading label={pick("جاري التحميل...", "Loading...")} />;
  }

  if (state === "out") {
    return (
      <Login
        onSignedIn={(name) => {
          setUsername(name);
          setState("in");
        }}
      />
    );
  }

  const nav = [
    { to: "/admin", end: true, label: pick("نظرة عامة", "Overview"), Icon: GiftIcon },
    { to: "/admin/orders", end: false, label: pick("الطلبات", "Orders"), Icon: CartIcon },
    { to: "/admin/products", end: false, label: pick("المنتجات", "Products"), Icon: GiftIcon },
    { to: "/admin/categories", end: false, label: pick("الأقسام", "Categories"), Icon: GiftIcon },
    { to: "/admin/shipping", end: false, label: pick("الشحن", "Shipping"), Icon: TruckIcon },
    { to: "/admin/settings", end: false, label: pick("الإعدادات", "Settings"), Icon: GlobeIcon },
  ];

  const links = (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, end, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            [
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-bold transition",
              isActive
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")
          }
        >
          <Icon className="h-4.5 w-4.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-800">
      <div className="mx-auto flex max-w-[1400px]">
        {/* sidebar — a drawer below lg */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e border-slate-200 bg-white p-4 lg:flex">
          <Brand />
          <div className="mt-6 flex-1">{links}</div>
          <Footer username={username} onSignOut={signOut} onToggleLang={toggleLang} lang={lang} />
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setMenuOpen(false)}
              aria-label={pick("إغلاق", "Close")}
            />
            <div className="absolute inset-y-0 start-0 flex w-64 flex-col bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <Brand />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                  aria-label={pick("إغلاق", "Close")}
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 flex-1">{links}</div>
              <Footer
                username={username}
                onSignOut={signOut}
                onToggleLang={toggleLang}
                lang={lang}
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label={pick("القائمة", "Menu")}
            >
              <MenuIcon />
            </button>
            <Brand />
          </header>

          <div className="p-4 sm:p-6">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="settings" element={<Settings />} />
              <Route
                path="*"
                element={
                  <p className="py-20 text-center font-bold text-slate-400">
                    {pick("الصفحة غير موجودة", "Page not found")}
                  </p>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <a href="/" className="flex items-center gap-2" dir="ltr">
      <img src="/images/logo.webp" alt="" aria-hidden="true" className="h-9 w-auto" />
      <span className="text-sm font-extrabold text-slate-800">Five Kids Wear</span>
    </a>
  );
}

function Footer({
  username,
  onSignOut,
  onToggleLang,
  lang,
}: {
  username: string;
  onSignOut: () => void;
  onToggleLang: () => void;
  lang: string;
}) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <p className="px-3 text-xs font-bold text-slate-400">{username}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={onToggleLang}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          {lang === "ar" ? "English" : "العربية"}
        </button>
        <button
          onClick={onSignOut}
          className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
        >
          {lang === "ar" ? "خروج" : "Sign out"}
        </button>
      </div>
    </div>
  );
}
