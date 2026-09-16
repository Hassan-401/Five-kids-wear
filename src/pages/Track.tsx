import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useLang } from "../i18n/LanguageContext";
import { api, type TrackedOrder } from "../lib/api";
import { CheckIcon, SearchIcon, TruckIcon } from "../components/Icons";
import { Star } from "../components/Decor";

/**
 * Order tracking — the site has no customer accounts, so an order is looked up
 * with its reference plus the phone number it was placed with.
 */
export default function Track() {
  const { t } = useLang();
  const [params] = useSearchParams();

  const [id, setId] = useState(params.get("id") ?? "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      setOrder(await api.trackOrder(id.trim(), phone.trim()));
    } catch {
      setError(t("track.notFound"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("track.title")}
        subtitle={t("track.sub")}
        crumbs={[{ label: t("track.title") }]}
      />

      <div className="container-x py-10">
        <form onSubmit={submit} className="card-soft max-w-xl mx-auto p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-bold text-navy-600 text-sm">{t("track.orderId")}</span>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="FKW-10248"
                dir="ltr"
                required
                className="field text-start"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-bold text-navy-600 text-sm">{t("track.phone")}</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                required
                className="field"
              />
            </label>
          </div>

          <button type="submit" className="btn-primary w-full mt-5" disabled={loading}>
            <SearchIcon className="w-5 h-5" />
            {loading ? t("common.loading") : t("track.cta")}
          </button>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 text-center"
            >
              {error}
            </p>
          )}
        </form>

        {order && <OrderCard order={order} />}
      </div>
    </>
  );
}

/** The five states an order moves through, in order, for the little timeline. */
const FLOW = ["pending", "confirmed", "shipped", "delivered"] as const;

function OrderCard({ order }: { order: TrackedOrder }) {
  const { t, pick, price } = useLang();

  const cancelled = order.status === "cancelled";
  const reached = FLOW.indexOf(order.status as (typeof FLOW)[number]);

  return (
    <section className="card-soft max-w-3xl mx-auto mt-8 p-6 sm:p-8 relative overflow-hidden">
      <Star className="absolute top-5 end-6 w-5 h-5 anim-twinkle" color="#ffb3d2" />

      <header className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-pink-100">
        <div>
          <p className="text-xl font-extrabold text-navy-600" dir="ltr">
            {order.id}
          </p>
          <p className="text-sm font-semibold text-navy-600/60 mt-1">
            {t("track.placedOn")}: <bdi>{order.createdAt.slice(0, 10)}</bdi>
          </p>
        </div>
        <span
          className={[
            "rounded-full px-4 py-1.5 font-extrabold",
            cancelled ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700",
          ].join(" ")}
        >
          {t(`status.${order.status}`)}
        </span>
      </header>

      {!cancelled && (
        <ol className="flex items-center gap-2 py-6">
          {FLOW.map((step, i) => {
            const done = i <= reached;
            return (
              <li key={step} className="flex-1 flex flex-col items-center gap-2 text-center">
                <span
                  className={[
                    "grid place-items-center w-9 h-9 rounded-full shrink-0 transition",
                    done ? "bg-sky-500 text-white" : "bg-sky-100 text-sky-400",
                  ].join(" ")}
                >
                  {done ? <CheckIcon className="w-5 h-5" /> : <TruckIcon className="w-4 h-4" />}
                </span>
                <span
                  className={[
                    "text-xs font-bold leading-tight",
                    done ? "text-navy-600" : "text-navy-600/45",
                  ].join(" ")}
                >
                  {t(`status.${step}`)}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <h3 className="font-extrabold text-pink-600 mb-3 mt-2">{t("track.items")}</h3>
      <ul className="flex flex-col gap-3">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl bg-sky-50/70 p-3">
            <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0">
              <img
                src={item.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-navy-600 line-clamp-1">
                {pick(item.nameAr, item.nameEn)}
              </p>
              <p className="text-xs font-semibold text-navy-600/55">
                <bdi>{item.size}</bdi> · {item.color} · ×{item.qty}
              </p>
            </div>
            <span className="font-extrabold text-pink-600 whitespace-nowrap">
              {price(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="space-y-2.5 font-bold text-navy-600 mt-6 pt-5 border-t border-pink-100">
        <div className="flex justify-between">
          <dt>{t("common.subtotal")}</dt>
          <dd>{price(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{t("common.shipping")}</dt>
          <dd>{order.shipping === 0 ? t("common.free") : price(order.shipping)}</dd>
        </div>
        <div className="flex justify-between text-lg pt-3 border-t border-pink-100">
          <dt>{t("common.total")}</dt>
          <dd className="text-pink-600 font-extrabold">{price(order.total)}</dd>
        </div>
      </dl>
    </section>
  );
}
