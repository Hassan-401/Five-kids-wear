import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import { SectionTitle } from "../components/CategoryGrid";
import Newsletter from "../components/Newsletter";
import NotFound from "./NotFound";
import { categories, getProductBySlug, getRelated } from "../data/catalog";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";
import {
  BadgeIcon,
  CartIcon,
  CheckIcon,
  HeartIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
} from "../components/Icons";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const product = getProductBySlug(slug);
  const { t, pick, price } = useLang();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [size, setSize] = useState<string>("");
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);

  const related = useMemo(() => (product ? getRelated(product) : []), [product]);

  if (!product) return <NotFound />;

  const cat = categories.find((c) => c.id === product.category);
  const wished = isWishlisted(product.id);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    setError(false);
    addToCart(product, size, product.colors[colorIdx].nameEn, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <PageHeader
        title={pick(product.nameAr, product.nameEn)}
        crumbs={[
          cat
            ? {
                label: pick(cat.nameAr, cat.nameEn),
                to: `/category/${cat.slug}`,
              }
            : { label: t("shop.title"), to: "/shop" },
          { label: pick(product.nameAr, product.nameEn) },
        ]}
      />

      <div className="container-x py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* gallery */}
          <div className="card-soft p-4 sm:p-6 relative">
            <div className="absolute top-6 start-6 z-10 flex flex-col gap-2">
              {product.isNew && (
                <span className="rounded-full bg-sky-400 text-white text-xs font-extrabold px-3 py-1">
                  {t("common.new")}
                </span>
              )}
              {discount > 0 && (
                <span dir="ltr" className="rounded-full bg-pink-500 text-white text-xs font-extrabold px-3 py-1">
                  -{discount}%
                </span>
              )}
            </div>
            <div className="aspect-square rounded-3xl bg-gradient-to-b from-pink-50 to-white grid place-items-center overflow-hidden">
              <img
                key={product.images[shot]}
                src={product.images[shot]}
                alt={pick(product.nameAr, product.nameEn)}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setShot(i)}
                    aria-label={`${pick("صورة", "Image")} ${i + 1}`}
                    aria-pressed={shot === i}
                    className={[
                      "aspect-square rounded-2xl bg-pink-50 overflow-hidden border-2 transition",
                      shot === i ? "border-pink-400" : "border-transparent hover:border-pink-200",
                    ].join(" ")}
                  >
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* details */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4" filled={i < Math.round(product.rating)} />
                ))}
                <span className="text-sm font-bold text-navy-600/60">
                  {product.rating} ({product.reviews})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-600">
                {pick(product.nameAr, product.nameEn)}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-pink-600">
                {price(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg font-bold text-navy-600/40 line-through">
                  {price(product.oldPrice)}
                </span>
              )}
              <span className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-600 px-3 py-1 text-sm font-bold">
                <CheckIcon className="w-4 h-4" />
                {t("common.inStock")}
              </span>
            </div>

            <p className="font-semibold leading-relaxed text-navy-600/80">
              {pick(product.descAr, product.descEn)}
            </p>

            {/* size */}
            <div>
              <h3 className="font-bold text-navy-600 mb-2">{t("products.chooseSize")}</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setError(false);
                    }}
                    className={[
                      "min-w-14 rounded-full px-4 py-2 font-bold border-2 transition",
                      size === s
                        ? "bg-pink-500 border-pink-500 text-white"
                        : "border-pink-200 text-navy-600 hover:border-pink-400",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {error && (
                <p className="mt-2 text-sm font-bold text-pink-600 anim-pop">
                  {t("products.selectSizeFirst")}
                </p>
              )}
            </div>

            {/* color */}
            <div>
              <h3 className="font-bold text-navy-600 mb-2">
                {t("products.chooseColor")} —{" "}
                <span className="text-pink-600">
                  {pick(product.colors[colorIdx].nameAr, product.colors[colorIdx].nameEn)}
                </span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c.hex}
                    onClick={() => setColorIdx(i)}
                    aria-label={pick(c.nameAr, c.nameEn)}
                    className={[
                      "w-10 h-10 rounded-full border-4 transition",
                      colorIdx === i
                        ? "border-pink-500 scale-110"
                        : "border-white hover:border-pink-200",
                    ].join(" ")}
                    style={{ background: c.hex, boxShadow: "0 2px 10px rgba(0,0,0,.12)" }}
                  />
                ))}
              </div>
            </div>

            {/* qty + actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border-2 border-pink-200 overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 font-extrabold text-pink-600 hover:bg-pink-50"
                  aria-label="-"
                >
                  −
                </button>
                <span className="w-12 text-center font-extrabold text-navy-600">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="w-11 h-11 font-extrabold text-pink-600 hover:bg-pink-50"
                  aria-label="+"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={[
                  "btn-sky flex-1 min-w-48",
                  added ? "!bg-emerald-500 !bg-none" : "",
                ].join(" ")}
              >
                {added ? <CheckIcon className="w-5 h-5" /> : <CartIcon className="w-5 h-5" />}
                {added ? t("common.added") : t("common.addToCart")}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={wished}
                aria-label={t("common.wishlist")}
                className={[
                  "grid place-items-center w-12 h-12 rounded-full border-2 transition",
                  wished
                    ? "bg-pink-500 border-pink-500 text-white"
                    : "border-pink-200 text-pink-500 hover:bg-pink-50",
                ].join(" ")}
              >
                <HeartIcon className="w-5 h-5" filled={wished} />
              </button>
            </div>

            <Link to="/cart" className="btn-ghost">
              {t("cart.checkout")}
            </Link>

            {/* trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { Icon: TruckIcon, key: "feat.shipping.title" },
                { Icon: ShieldIcon, key: "feat.payment.title" },
                { Icon: BadgeIcon, key: "feat.quality.title" },
              ].map(({ Icon, key }) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-1.5 rounded-2xl bg-pink-50 px-2 py-4 text-center"
                >
                  <Icon className="w-6 h-6 text-pink-500" />
                  <span className="text-xs font-bold text-navy-600">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="pt-16">
          <SectionTitle>{t("products.related")}</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      <Newsletter />
    </>
  );
}
