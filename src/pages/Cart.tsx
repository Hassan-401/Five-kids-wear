import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";
import { colorLabel } from "../data/catalog";
import { productHref } from "../data/departments";
import { TrashIcon } from "../components/Icons";

const SHIPPING = 60;
const FREE_SHIPPING_OVER = 1000;

export default function Cart() {
  const { t, pick, price } = useLang();
  const { cart, subtotal, updateQty, removeLine, lineProduct } = useStore();
  const [coupon, setCoupon] = useState("");

  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING;
  const total = subtotal + shipping;

  return (
    <>
      <PageHeader title={t("cart.title")} crumbs={[{ label: t("cart.title") }]} />

      <div className="container-x py-10">
        {cart.length === 0 ? (
          <EmptyState
            title={t("cart.empty")}
            sub={t("cart.emptySub")}
            cta={t("cart.continueShopping")}
          />
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            <div className="flex flex-col gap-4">
              {cart.map((line) => {
                const p = lineProduct(line);
                if (!p) return null;
                return (
                  <div
                    key={line.key}
                    className="card-soft flex items-center gap-4 p-4"
                  >
                    <Link
                      to={productHref(p)}
                      className="shrink-0 w-24 h-24 rounded-2xl bg-pink-50 overflow-hidden"
                    >
                      <img
                        src={p.image}
                        alt={pick(p.nameAr, p.nameEn)}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={productHref(p)}
                        className="font-bold text-navy-600 hover:text-pink-600 transition line-clamp-2"
                      >
                        {pick(p.nameAr, p.nameEn)}
                      </Link>
                      <p className="text-sm font-semibold text-navy-600/60 mt-1">
                        {t("common.size")}: <bdi>{line.size}</bdi> ·{" "}
                        {t("common.color")}: {colorLabel(p, line.color, pick)}
                      </p>
                      <p className="font-extrabold text-pink-600 mt-1">
                        {price(p.price)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center rounded-full border-2 border-pink-200 overflow-hidden">
                        <button
                          onClick={() => updateQty(line.key, line.qty - 1)}
                          className="w-9 h-9 font-extrabold text-pink-600 hover:bg-pink-50"
                          aria-label="-"
                        >
                          −
                        </button>
                        <span className="w-9 text-center font-extrabold text-navy-600">
                          {line.qty}
                        </span>
                        <button
                          onClick={() => updateQty(line.key, line.qty + 1)}
                          className="w-9 h-9 font-extrabold text-pink-600 hover:bg-pink-50"
                          aria-label="+"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeLine(line.key)}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-600/50 hover:text-pink-600 transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                        {t("common.remove")}
                      </button>
                    </div>
                  </div>
                );
              })}

              <Link to="/shop" className="btn-ghost self-start">
                {t("cart.continueShopping")}
              </Link>
            </div>

            {/* summary */}
            <aside className="card-soft p-6 lg:sticky lg:top-40">
              <h2 className="text-xl font-extrabold text-pink-600 mb-5">
                {t("cart.orderSummary")}
              </h2>

              <div className="flex gap-2 mb-5">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder={t("cart.coupon")}
                  className="field flex-1"
                />
                <button className="btn-ghost px-5 py-2">{t("cart.applyCoupon")}</button>
              </div>

              <dl className="space-y-3 font-bold text-navy-600">
                <Row label={t("common.subtotal")} value={price(subtotal)} />
                <Row
                  label={t("common.shipping")}
                  value={shipping === 0 ? t("common.free") : price(shipping)}
                />
                <div className="pt-3 border-t border-pink-100 flex items-center justify-between text-lg">
                  <dt>{t("common.total")}</dt>
                  <dd className="text-pink-600 font-extrabold">{price(total)}</dd>
                </div>
              </dl>

              <Link to="/checkout" className="btn-primary w-full mt-6">
                {t("cart.checkout")}
              </Link>

              <p className="text-xs text-navy-600/50 font-semibold text-center mt-4">
                {t("common.demoNote")}
              </p>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function EmptyState({
  title,
  sub,
  cta,
  to = "/shop",
}: {
  title: string;
  sub: string;
  cta: string;
  to?: string;
}) {
  return (
    <div className="card-soft max-w-lg mx-auto p-12 text-center">
      <img
        src="/images/characters/gekko.webp"
        alt=""
        aria-hidden="true"
        className="w-40 mx-auto mb-4 anim-float-slow"
      />
      <h2 className="text-2xl font-extrabold text-navy-600">{title}</h2>
      <p className="mt-2 font-semibold text-navy-600/65">{sub}</p>
      <Link to={to} className="btn-primary mt-6">
        {cta}
      </Link>
    </div>
  );
}
