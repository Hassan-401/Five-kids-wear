import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";
import type { Product } from "../data/catalog";
import { CartIcon, CheckIcon, HeartIcon, StarIcon } from "./Icons";

export default function ProductCard({ product }: { product: Product }) {
  const { t, pick, price } = useLang();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const wished = isWishlisted(product.id);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product, product.sizes[1] ?? product.sizes[0], product.colors[0].nameEn);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="group relative flex flex-col rounded-3xl bg-white border border-pink-100 shadow-card overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
      {/* badges */}
      <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="rounded-full bg-sky-400 text-white text-[11px] font-extrabold px-2.5 py-1 shadow-sm">
            {t("common.new")}
          </span>
        )}
        {discount > 0 && (
          <span className="rounded-full bg-pink-500 text-white text-[11px] font-extrabold px-2.5 py-1 shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      <button
        onClick={() => toggleWishlist(product.id)}
        aria-label={t("common.wishlist")}
        aria-pressed={wished}
        className={[
          "absolute top-3 end-3 z-10 grid place-items-center w-9 h-9 rounded-full shadow-sm transition",
          wished
            ? "bg-pink-500 text-white"
            : "bg-white/90 text-pink-400 hover:bg-pink-100 hover:text-pink-600",
        ].join(" ")}
      >
        <HeartIcon className="w-[18px] h-[18px]" filled={wished} />
      </button>

      <Link to={`/product/${product.slug}`} className="block bg-white">
        <div className="aspect-square overflow-hidden bg-gradient-to-b from-pink-50/60 to-white">
          <img
            src={product.image}
            alt={pick(product.nameAr, product.nameEn)}
            loading="lazy"
            className="w-full h-full object-contain p-3 transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-1 gap-2 p-4 pt-2 text-center">
        <div className="flex items-center justify-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className="w-3.5 h-3.5"
              filled={i < Math.round(product.rating)}
            />
          ))}
          <span className="text-[11px] text-navy-600/60 font-bold ms-1">
            ({product.reviews})
          </span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="font-bold text-navy-600 hover:text-pink-600 transition leading-snug line-clamp-2"
        >
          {pick(product.nameAr, product.nameEn)}
        </Link>

        <div className="flex items-center justify-center gap-2 mt-auto">
          <span className="text-lg font-extrabold text-pink-600">
            {price(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm font-semibold text-navy-600/45 line-through">
              {price(product.oldPrice)}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className={[
            "mt-1 w-full rounded-full py-2.5 font-bold text-white text-sm inline-flex items-center justify-center gap-2 transition",
            justAdded
              ? "bg-emerald-500"
              : "bg-gradient-to-l from-sky-500 to-sky-400 hover:brightness-105",
          ].join(" ")}
        >
          {justAdded ? (
            <>
              <CheckIcon className="w-4 h-4" />
              {t("common.added")}
            </>
          ) : (
            <>
              <CartIcon className="w-4 h-4" />
              {t("common.addToCart")}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
