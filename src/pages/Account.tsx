import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";
import { governorates } from "../data/catalog";
import { PinIcon, UserIcon } from "../components/Icons";

type Tab = "profile" | "orders" | "addresses";

const statusStyles: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

export default function Account() {
  const { t, pick, price } = useLang();
  const { user, signOut, orders } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");

  if (!user) {
    return (
      <>
        <PageHeader title={t("account.title")} crumbs={[{ label: t("account.title") }]} />
        <div className="container-x py-14">
          <div className="card-soft max-w-md mx-auto p-12 text-center">
            <span className="grid place-items-center w-20 h-20 mx-auto rounded-full bg-pink-100 text-pink-500">
              <UserIcon className="w-10 h-10" />
            </span>
            <h2 className="mt-5 text-xl font-extrabold text-navy-600">
              {t("auth.loginSub")}
            </h2>
            <Link to="/login" className="btn-primary mt-6">
              {t("common.login")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: t("account.profile") },
    { id: "orders", label: t("account.orders") },
    { id: "addresses", label: t("account.addresses") },
  ];

  return (
    <>
      <PageHeader title={t("account.title")} crumbs={[{ label: t("account.title") }]} />

      <div className="container-x py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
          <aside className="card-soft p-5">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-pink-100">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-pink-100 text-pink-500 shrink-0">
                <UserIcon className="w-6 h-6" />
              </span>
              <div className="min-w-0">
                <p className="font-extrabold text-navy-600 truncate">{user.name}</p>
                <p className="text-sm font-semibold text-navy-600/60 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={[
                    "text-start rounded-full px-4 py-2.5 font-bold transition",
                    tab === item.id
                      ? "bg-pink-100 text-pink-700"
                      : "text-navy-600 hover:bg-pink-50",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="btn-ghost w-full mt-5"
            >
              {t("common.logout")}
            </button>
          </aside>

          <section className="card-soft p-6 sm:p-8">
            {tab === "profile" && (
              <>
                <h2 className="text-xl font-extrabold text-pink-600 mb-5">
                  {t("account.profile")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("checkout.fullName")} defaultValue={user.name} />
                  <Field label={t("checkout.email")} defaultValue={user.email} />
                  <Field label={t("checkout.phone")} defaultValue="01000000000" />
                  <label className="flex flex-col gap-1.5">
                    <span className="font-bold text-navy-600 text-sm">
                      {t("checkout.city")}
                    </span>
                    <select className="field" defaultValue="Cairo">
                      {governorates.map((g) => (
                        <option key={g.en} value={g.en}>
                          {pick(g.ar, g.en)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button className="btn-primary mt-6">{t("common.save")}</button>
              </>
            )}

            {tab === "orders" && (
              <>
                <h2 className="text-xl font-extrabold text-pink-600 mb-5">
                  {t("account.orders")}
                </h2>
                {orders.length === 0 ? (
                  <p className="font-semibold text-navy-600/60">
                    {t("account.noOrders")}
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-3xl border border-pink-100 p-5"
                      >
                        <div className="flex flex-wrap items-center gap-3 justify-between">
                          <div>
                            <p className="font-extrabold text-navy-600">{order.id}</p>
                            <p className="text-sm font-semibold text-navy-600/55">
                              {order.date}
                            </p>
                          </div>
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-sm font-bold",
                              statusStyles[order.status],
                            ].join(" ")}
                          >
                            {t(`account.orderStatus.${order.status}`)}
                          </span>
                          <span className="font-extrabold text-pink-600">
                            {price(order.total)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-2xl bg-pink-50 p-2 pe-4"
                            >
                              <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0">
                                <img
                                  src={item.image}
                                  alt=""
                                  aria-hidden="true"
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <div className="text-sm">
                                <p className="font-bold text-navy-600">{item.name}</p>
                                <p className="font-semibold text-navy-600/55">
                                  ×{item.qty}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "addresses" && (
              <>
                <h2 className="text-xl font-extrabold text-pink-600 mb-5">
                  {t("account.addresses")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: pick("المنزل", "Home"), city: pick("القاهرة", "Cairo") },
                    { label: pick("العمل", "Work"), city: pick("الجيزة", "Giza") },
                  ].map((a) => (
                    <div
                      key={a.label}
                      className="rounded-3xl border-2 border-pink-100 p-5 flex gap-3"
                    >
                      <PinIcon className="w-6 h-6 text-pink-500 shrink-0" />
                      <div>
                        <p className="font-extrabold text-navy-600">{a.label}</p>
                        <p className="font-semibold text-navy-600/65 text-sm mt-1">
                          {a.city} — {pick("١٢ شارع النيل", "12 Nile Street")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold text-navy-600 text-sm">{label}</span>
      <input defaultValue={defaultValue} className="field" />
    </label>
  );
}
