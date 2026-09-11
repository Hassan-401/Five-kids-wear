import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { EmptyState } from "./Cart";
import { colorLabel, governorates } from "../data/catalog";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";
import { CheckIcon, ShieldIcon, TruckIcon } from "../components/Icons";
import { Star } from "../components/Decor";

const SHIPPING = 60;
const FREE_SHIPPING_OVER = 1000;

type Payment = "cod" | "card" | "wallet";

export default function Checkout() {
  const { t, pick, price } = useLang();
  const { cart, subtotal, lineProduct, placeOrder, user } = useStore();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<Payment>("cod");
  const [placed, setPlaced] = useState<string | null>(null);

  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING;
  const total = subtotal + shipping;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder(total);
    setPlaced(order.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <>
        <PageHeader title={t("checkout.title")} crumbs={[{ label: t("checkout.title") }]} />
        <div className="container-x py-14">
          <div className="card-soft max-w-lg mx-auto p-12 text-center relative overflow-hidden">
            <Star className="absolute top-6 start-8 w-5 h-5 anim-float" color="#ffb3d2" />
            <Star className="absolute bottom-8 end-10 w-6 h-6 anim-float-slow" color="#ff8ac0" />

            <span className="grid place-items-center w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600">
              <CheckIcon className="w-10 h-10" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-navy-600">
              {t("checkout.success")}
            </h2>
            <p className="mt-2 font-semibold text-navy-600/65">
              {t("checkout.successSub")}
            </p>
            <p className="mt-4 inline-block rounded-full bg-pink-50 px-5 py-2 font-extrabold text-pink-600">
              {t("checkout.orderNumber")}: {placed}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              <Link to="/account" className="btn-primary">
                {t("account.orders")}
              </Link>
              <Link to="/shop" className="btn-ghost">
                {t("cart.continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <PageHeader title={t("checkout.title")} crumbs={[{ label: t("checkout.title") }]} />
        <div className="container-x py-10">
          <EmptyState
            title={t("cart.empty")}
            sub={t("cart.emptySub")}
            cta={t("cart.continueShopping")}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t("checkout.title")} crumbs={[{ label: t("checkout.title") }]} />

      <form onSubmit={submit} className="container-x py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="flex flex-col gap-6">
            {/* contact */}
            <fieldset className="card-soft p-6">
              <legend className="text-lg font-extrabold text-pink-600 px-2">
                {t("checkout.contact")}
              </legend>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <Field label={t("checkout.fullName")} defaultValue={user?.name} required />
                <Field
                  label={t("checkout.email")}
                  type="email"
                  defaultValue={user?.email}
                  required
                />
                <Field label={t("checkout.phone")} type="tel" required />
              </div>
            </fieldset>

            {/* shipping */}
            <fieldset className="card-soft p-6">
              <legend className="text-lg font-extrabold text-pink-600 px-2">
                {t("checkout.shipping")}
              </legend>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <label className="flex flex-col gap-1.5">
                  <span className="font-bold text-navy-600 text-sm">
                    {t("checkout.city")}
                  </span>
                  <select className="field" required defaultValue="">
                    <option value="" disabled>
                      —
                    </option>
                    {governorates.map((g) => (
                      <option key={g.en} value={g.en}>
                        {pick(g.ar, g.en)}
                      </option>
                    ))}
                  </select>
                </label>
                <Field label={t("checkout.address")} required />
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="font-bold text-navy-600 text-sm">
                    {t("checkout.notes")}{" "}
                    <span className="text-navy-600/50">({t("common.optional")})</span>
                  </span>
                  <textarea rows={3} className="field" />
                </label>
              </div>
            </fieldset>

            {/* payment */}
            <fieldset className="card-soft p-6">
              <legend className="text-lg font-extrabold text-pink-600 px-2">
                {t("checkout.payment")}
              </legend>
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                {(
                  [
                    { id: "cod", label: "checkout.cod", Icon: TruckIcon },
                    { id: "card", label: "checkout.card", Icon: ShieldIcon },
                    { id: "wallet", label: "checkout.wallet", Icon: ShieldIcon },
                  ] as const
                ).map(({ id, label, Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setPayment(id)}
                    className={[
                      "flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5 font-bold transition",
                      payment === id
                        ? "border-pink-500 bg-pink-50 text-pink-600"
                        : "border-pink-100 text-navy-600 hover:border-pink-300",
                    ].join(" ")}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm text-center">{t(label)}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-navy-600/50 mt-4">
                {t("common.demoNote")}
              </p>
            </fieldset>
          </div>

          {/* summary */}
          <aside className="card-soft p-6 lg:sticky lg:top-40">
            <h2 className="text-xl font-extrabold text-pink-600 mb-5">
              {t("cart.orderSummary")}
            </h2>

            <ul className="flex flex-col gap-3 max-h-72 overflow-y-auto pe-1">
              {cart.map((line) => {
                const p = lineProduct(line);
                if (!p) return null;
                return (
                  <li key={line.key} className="flex items-center gap-3">
                    <div className="relative shrink-0 w-14 h-14 rounded-xl bg-pink-50 overflow-hidden">
                      <img
                        src={p.image}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -end-1 grid place-items-center w-5 h-5 rounded-full bg-pink-500 text-white text-[11px] font-bold">
                        {line.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy-600 line-clamp-1">
                        {pick(p.nameAr, p.nameEn)}
                      </p>
                      <p className="text-xs font-semibold text-navy-600/55">
                        <bdi>{line.size}</bdi> · {colorLabel(p, line.color, pick)}
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-pink-600 whitespace-nowrap">
                      {price(p.price * line.qty)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <dl className="space-y-3 font-bold text-navy-600 mt-5 pt-5 border-t border-pink-100">
              <div className="flex justify-between">
                <dt>{t("common.subtotal")}</dt>
                <dd>{price(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{t("common.shipping")}</dt>
                <dd>{shipping === 0 ? t("common.free") : price(shipping)}</dd>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-pink-100">
                <dt>{t("common.total")}</dt>
                <dd className="text-pink-600 font-extrabold">{price(total)}</dd>
              </div>
            </dl>

            <button type="submit" className="btn-primary w-full mt-6">
              {t("checkout.placeOrder")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="btn-ghost w-full mt-3"
            >
              {t("common.back")}
            </button>
          </aside>
        </div>
      </form>
    </>
  );
}

function Field({
  label,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold text-navy-600 text-sm">{label}</span>
      <input
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="field"
      />
    </label>
  );
}
