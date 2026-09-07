import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DeptShell from "../../components/dept/DeptShell";
import DeptProductCard from "../../components/dept/DeptProductCard";
import useReveal from "../../components/dept/useReveal";
import NotFound from "../NotFound";
import { useLang } from "../../i18n/LanguageContext";
import { useStore } from "../../context/StoreContext";
import {
  departments,
  deptProductsOf,
  getDeptProduct,
  relatedDeptProducts,
  sizeLabel,
  subCategory,
  type Dept,
} from "../../data/departments";
import {
  CartIcon,
  CheckIcon,
  HeartIcon,
  StarIcon,
  TruckIcon,
} from "../../components/Icons";

export default function DeptProduct({ dept }: { dept: Dept }) {
  const { slug = "" } = useParams();
  const { t, pick, price } = useLang();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const rootRef = useReveal<HTMLDivElement>();

  const product = getDeptProduct(dept, slug);

  const [size, setSize] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [frame, setFrame] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>("details");

  const related = useMemo(
    () => (product ? relatedDeptProducts(product) : []),
    [product],
  );

  /* the three department photographs, product shot first */
  const gallery = useMemo(() => {
    if (!product) return [];
    const others = Array.from(
      new Set(deptProductsOf(dept).map((p) => p.image)),
    ).filter((src) => src !== product.image);
    return [product.image, ...others];
  }, [product, dept]);

  if (!product) return <NotFound />;

  const meta = departments[dept];
  const category = subCategory(dept, product.sub);
  const wished = isWishlisted(product.id);
  const isWomen = dept === "women";
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAdd = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, size, product.colors[colorIdx].nameEn, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const panels = [
    {
      id: "details",
      title: pick("تفاصيل المنتج", "Product details"),
      body: pick(product.descAr, product.descEn),
    },
    {
      id: "fabric",
      title: pick("الخامة والعناية", "Fabric & care"),
      body: pick(
        "غسيل على ٣٠ درجة بلون مشابه، من غير مبيّض. كي على حرارة متوسطة من الداخل.",
        "Machine wash at 30°C with like colours, no bleach. Iron inside-out on a medium setting.",
      ),
    },
    {
      id: "shipping",
      title: pick("الشحن والاستبدال", "Shipping & returns"),
      body: pick(
        "شحن لكل محافظات مصر خلال ٢–٤ أيام عمل، مع إمكانية الدفع عند الاستلام. الاستبدال متاح خلال ١٤ يوم.",
        "Delivered across Egypt in 2–4 working days, cash on delivery available. Exchanges within 14 days.",
      ),
    },
  ];

  return (
    <DeptShell dept={dept}>
      <div ref={rootRef} className="dept-wrap py-10 lg:py-14">
        {/* --------------------------------------------------- breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] mb-8"
          style={{ color: "var(--d-muted)" }}
        >
          <Link to="/" className="hover:opacity-70 transition">
            {t("common.home")}
          </Link>
          <span className="opacity-50">/</span>
          <Link to={`/${dept}`} className="hover:opacity-70 transition">
            {pick(meta.name.ar, meta.name.en)}
          </Link>
          {category && (
            <>
              <span className="opacity-50">/</span>
              <Link
                to={`/${dept}/${category.slug}`}
                className="hover:opacity-70 transition"
              >
                {pick(category.name.ar, category.name.en)}
              </Link>
            </>
          )}
        </nav>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
          {/* ------------------------------------------------------ gallery */}
          <div className="lg:sticky lg:top-40">
            <div
              className={[
                "relative overflow-hidden",
                isWomen ? "dept-arch" : "",
              ].join(" ")}
              style={{ background: "var(--d-panel)" }}
            >
              <img
                key={gallery[frame]}
                src={gallery[frame]}
                alt={pick(product.nameAr, product.nameEn)}
                className="w-full aspect-[3/4] object-cover dept-reveal is-in"
              />

              {/* the women's frame is an arch, so its top corners are cut
                  away — the badges hang off the straight bottom edge there */}
              <div
                className={[
                  "absolute start-5 flex flex-col items-start gap-1.5",
                  isWomen ? "bottom-5" : "top-4",
                ].join(" ")}
              >
                {product.isNew && (
                  <span className="pcard-badge static">{t("common.new")}</span>
                )}
                {discount > 0 && (
                  <span className="pcard-badge pcard-badge-sale static" dir="ltr">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setFrame(i)}
                  aria-label={`${pick("صورة", "Image")} ${i + 1}`}
                  aria-pressed={frame === i}
                  className="overflow-hidden border transition"
                  style={{
                    borderColor: frame === i ? "var(--d-accent)" : "var(--d-line)",
                    borderRadius: "var(--d-radius)",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="w-full aspect-[3/4] object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------ details */}
          <div>
            <div className="flex items-center gap-2 mb-4" style={{ color: "var(--d-muted)" }}>
              <span className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-3.5 h-3.5"
                    filled={i < Math.round(product.rating)}
                  />
                ))}
              </span>
              <span className="text-xs font-semibold" dir="ltr">
                {product.rating} · {product.reviews}
              </span>
            </div>

            <h1 className="dept-h1 text-2xl sm:text-[2.1rem]">
              {pick(product.nameAr, product.nameEn)}
            </h1>

            <div className="mt-5 flex items-baseline gap-3">
              {product.fromPrice && (
                <span className="text-sm" style={{ color: "var(--d-muted)" }}>
                  {pick("ابتداءً من", "From")}
                </span>
              )}
              <span className="text-2xl font-extrabold">
                <bdi>{price(product.price)}</bdi>
              </span>
              {product.oldPrice && (
                <span
                  className="text-base line-through"
                  style={{ color: "var(--d-muted)" }}
                >
                  <bdi>{price(product.oldPrice)}</bdi>
                </span>
              )}
            </div>

            <hr className="dept-rule my-8" />

            {/* colour */}
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] mb-3">
                {t("common.color")}
                <span className="ms-2 font-semibold tracking-normal normal-case" style={{ color: "var(--d-muted)" }}>
                  {pick(
                    product.colors[colorIdx].nameAr,
                    product.colors[colorIdx].nameEn,
                  )}
                </span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={c.hex}
                    onClick={() => setColorIdx(i)}
                    aria-label={pick(c.nameAr, c.nameEn)}
                    aria-pressed={colorIdx === i}
                    className="w-9 h-9 border-2 transition"
                    style={{
                      background: c.hex,
                      borderRadius: "var(--d-radius)",
                      borderColor: colorIdx === i ? "var(--d-accent)" : "transparent",
                      outline: "1px solid rgba(0,0,0,.08)",
                      outlineOffset: colorIdx === i ? "2px" : "0",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* size */}
            <div className="mt-8">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] mb-3">
                {t("products.chooseSize")}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    aria-pressed={size === s}
                    className="min-w-14 border px-4 py-2.5 text-sm font-semibold transition"
                    style={{
                      borderRadius: "var(--d-radius)",
                      borderColor: size === s ? "var(--d-accent)" : "var(--d-line)",
                      background: size === s ? "var(--d-accent)" : "transparent",
                      color: size === s ? "var(--d-on-accent)" : "var(--d-ink)",
                    }}
                  >
                    <bdi>{sizeLabel(s, pick)}</bdi>
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="mt-3 text-sm font-bold" style={{ color: "#c0392b" }}>
                  {t("products.selectSizeFirst")}
                </p>
              )}
            </div>

            {/* quantity + actions */}
            <div className="mt-8 flex flex-wrap items-stretch gap-3">
              <div
                className="flex items-center border"
                style={{ borderColor: "var(--d-line)", borderRadius: "var(--d-radius)" }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-11 h-full font-bold hover:opacity-60 transition"
                  aria-label="-"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold" dir="ltr">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="w-11 h-full font-bold hover:opacity-60 transition"
                  aria-label="+"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="dept-btn flex-1 min-w-52"
                style={added ? { background: "#2f7d55", borderColor: "#2f7d55" } : undefined}
              >
                {added ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <CartIcon className="w-4 h-4" />
                )}
                {added ? t("common.added") : t("common.addToCart")}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={wished}
                aria-label={t("common.wishlist")}
                className="grid place-items-center w-12 border transition"
                style={{
                  borderRadius: "var(--d-radius)",
                  borderColor: wished ? "var(--d-accent)" : "var(--d-line)",
                  background: wished ? "var(--d-accent)" : "transparent",
                  color: wished ? "var(--d-on-accent)" : "var(--d-ink)",
                }}
              >
                <HeartIcon className="w-5 h-5" filled={wished} />
              </button>
            </div>

            <p
              className="mt-5 flex items-center gap-2.5 text-xs font-semibold"
              style={{ color: "var(--d-muted)" }}
            >
              <TruckIcon className="w-4 h-4" />
              {pick(
                "شحن مجاني للطلبات فوق ٢٠٠٠ ج.م",
                "Free delivery on orders over EGP 2,000",
              )}
            </p>

            {/* accordions */}
            <div className="mt-9 border-t" style={{ borderColor: "var(--d-line)" }}>
              {panels.map((p) => {
                const open = openPanel === p.id;
                return (
                  <div key={p.id} className="border-b" style={{ borderColor: "var(--d-line)" }}>
                    <button
                      onClick={() => setOpenPanel(open ? null : p.id)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between gap-4 py-4 text-start text-[0.78rem] font-bold uppercase tracking-[0.16em]"
                    >
                      {p.title}
                      <span className="text-lg leading-none" aria-hidden="true">
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open && (
                      <p
                        className="pb-5 text-sm leading-7"
                        style={{ color: "var(--d-muted)" }}
                      >
                        {p.body}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- related */}
        <section className="pt-16 lg:pt-24">
          <header className={isWomen ? "text-center mb-10" : "mb-10"}>
            <span className="dept-eyebrow">{pick("يتناسب معه", "Styled with")}</span>
            <h2 className="dept-h2 mt-4 text-2xl sm:text-3xl">
              {t("products.related")}
            </h2>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <div key={p.id} className="dept-reveal">
                <DeptProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </DeptShell>
  );
}
