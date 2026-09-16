import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { EmptyState } from "./Cart";
import { colorLabel } from "../data/catalog";
import { useLang } from "../i18n/LanguageContext";
import { useCatalog } from "../context/CatalogContext";
import { useStore } from "../context/StoreContext";
import { ApiError, api } from "../lib/api";
import { CheckIcon, TruckIcon } from "../components/Icons";
import { Star } from "../components/Decor";

/**
 * Checkout.
 *
 * The browser sends product ids and quantities; the Worker prices the order
 * from the database and returns the reference. Nothing here is trusted server
 * side, so the totals on screen are a preview of the same calculation.
 */
export default function Checkout() {
  const { t, pick, price } = useLang();
  const { cart, subtotal, lineProduct, clearCart } = useStore();
  const { shipping, settings, shippingFor } = useCatalog();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    governorate: "",
    address: "",
    notes: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const shippingCost = form.governorate ? shippingFor(form.governorate, subtotal) : null;
  const total = subtotal + (shippingCost ?? 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);

    try {
      const order = await api.createOrder({
        name: form.name,
        phone: form.phone,
        email: form.email,
        governorate: form.governorate,
        address: form.address,
        notes: form.notes,
        payment: "cod",
        items: cart.map((line) => ({
          productId: line.productId,
          size: line.size,
          color: line.color,
          qty: line.qty,
        })),
      });

      setPlaced(order.id);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "network";
      setError(
        code === "orders_closed"
          ? t("checkout.closed")
          : code === "invalid_phone"
            ? pick("رقم التليفون غير صحيح", "That phone number does not look right")
            : t("checkout.failed"),
      );
    } finally {
      setSending(false);
    }
  };

  /* ------------------------------------------------------- order placed */

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
            <p className="mt-2 font-semibold text-navy-600/65">{t("checkout.successSub")}</p>
            <p className="mt-4 inline-block rounded-full bg-pink-50 px-5 py-2 font-extrabold text-pink-600">
              {t("checkout.orderNumber")}: <bdi>{placed}</bdi>
            </p>
            <p className="mt-3 text-sm font-bold text-navy-600/60">
              {t("checkout.saveNumber")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              <Link to={`/track?id=${encodeURIComponent(placed)}`} className="btn-primary">
                {t("checkout.trackOrder")}
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

  /* ------------------------------------------------------- empty states */

  if (!settings.ordersOpen) {
    return (
      <>
        <PageHeader title={t("checkout.title")} crumbs={[{ label: t("checkout.title") }]} />
        <div className="container-x py-10">
          <EmptyState
            title={t("checkout.closed")}
            sub={t("cart.emptySub")}
            cta={t("cart.continueShopping")}
          />
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

  /* -------------------------------------------------------------- form */

  return (
    <>
      <PageHeader title={t("checkout.title")} crumbs={[{ label: t("checkout.title") }]} />

      <form onSubmit={submit} className="container-x py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="flex flex-col gap-6">
            {/* contact */}
            <fieldset className="card-soft p-6" disabled={sending}>
              <legend className="text-lg font-extrabold text-pink-600 px-2">
                {t("checkout.contact")}
              </legend>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <Field
                  label={t("checkout.fullName")}
                  value={form.name}
                  onChange={set("name")}
                  required
                />
                <Field
                  label={t("checkout.phone")}
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                />
                <Field
                  label={`${t("checkout.email")} (${t("common.optional")})`}
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                />
              </div>
            </fieldset>

            {/* shipping */}
            <fieldset className="card-soft p-6" disabled={sending}>
              <legend className="text-lg font-extrabold text-pink-600 px-2">
                {t("checkout.shipping")}
              </legend>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <label className="flex flex-col gap-1.5">
                  <span className="font-bold text-navy-600 text-sm">{t("checkout.city")}</span>
                  <select
                    className="field"
                    required
                    value={form.governorate}
                    onChange={set("governorate")}
                  >
                    <option value="" disabled>
                      —
                    </option>
                    {shipping.rates.map((g) => (
                      <option key={g.en} value={g.en}>
                        {pick(g.ar, g.en)} — {g.price} {pick("ج.م", "EGP")}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label={t("checkout.address")}
                  value={form.address}
                  onChange={set("address")}
                  required
                />
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="font-bold text-navy-600 text-sm">
                    {t("checkout.notes")}{" "}
                    <span className="text-navy-600/50">({t("common.optional")})</span>
                  </span>
                  <textarea
                    rows={3}
                    className="field"
                    value={form.notes}
                    onChange={set("notes")}
                  />
                </label>
              </div>
            </fieldset>

            {/* payment — cash on delivery is the only method wired up */}
            <fieldset className="card-soft p-6">
              <legend className="text-lg font-extrabold text-pink-600 px-2">
                {t("checkout.payment")}
              </legend>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-pink-500 bg-pink-50 px-4 py-4">
                <TruckIcon className="w-6 h-6 text-pink-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-pink-700">{t("checkout.cod")}</p>
                  <p className="text-sm font-semibold text-navy-600/70">
                    {t("common.orderNote")}
                  </p>
                </div>
              </div>
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
                <dd>
                  {shippingCost === null ? (
                    <span className="text-sm font-semibold text-navy-600/60">
                      {t("checkout.pickCity")}
                    </span>
                  ) : shippingCost === 0 ? (
                    t("common.free")
                  ) : (
                    price(shippingCost)
                  )}
                </dd>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-pink-100">
                <dt>{t("common.total")}</dt>
                <dd className="text-pink-600 font-extrabold">{price(total)}</dd>
              </div>
            </dl>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
              >
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full mt-6" disabled={sending}>
              {sending ? t("checkout.sending") : t("checkout.placeOrder")}
            </button>
            <Link to="/cart" className="btn-ghost w-full mt-3">
              {t("common.back")}
            </Link>
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
  value,
  onChange,
  inputMode,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: "tel" | "text" | "email";
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold text-navy-600 text-sm">{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        required={required}
        value={value}
        onChange={onChange}
        className="field"
      />
    </label>
  );
}
