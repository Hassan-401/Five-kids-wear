import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import { useStore } from "../../context/StoreContext";
import { productHref, sizeLabel, type DeptProduct } from "../../data/departments";
import { CartIcon, CheckIcon, HeartIcon } from "../Icons";

/**
 * The department product card. Deliberately identical in the men's and the
 * women's sections — only the surrounding page changes between them.
 */
export default function DeptProductCard({ product }: { product: DeptProduct }) {
  const { t, pick, price, lang } = useLang();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const name = pick(product.nameAr, product.nameEn);
  const href = productHref(product);
  const wished = isWishlisted(product.id);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(
      product,
      product.sizes[1] ?? product.sizes[0],
      product.colors[0].nameEn,
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="pcard">
      <div className="pcard-media">
        <img src={product.image} alt={name} loading="lazy" />
        <Link to={href} className="absolute inset-0" aria-label={name} />

        <div className="absolute top-0 start-0 z-10 flex flex-col items-start gap-1 p-2.5">
          {product.isNew && (
            <span className="pcard-badge static">{t("common.new")}</span>
          )}
          {discount > 0 && (
            <span className="pcard-badge pcard-badge-sale static" dir="ltr">
              -{discount}%
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={t("common.wishlist")}
          className={["pcard-wish", wished ? "is-on" : ""].join(" ")}
        >
          <HeartIcon className="w-4 h-4" filled={wished} />
        </button>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={t("common.addToCart")}
          className={["pcard-add", justAdded ? "is-added" : ""].join(" ")}
        >
          {justAdded ? (
            <CheckIcon className="w-[18px] h-[18px]" />
          ) : (
            <CartIcon className="w-[18px] h-[18px]" />
          )}
        </button>
      </div>

      <div className="pcard-body">
        <Link to={href} className="pcard-name hover:underline">
          {name}
        </Link>

        <p className="pcard-price">
          {product.fromPrice && (
            <span className="font-medium">
              {pick("ابتداءً من ", "From ")}
            </span>
          )}
          <bdi>{price(product.price)}</bdi>
          {product.oldPrice && (
            <bdi className="pcard-price-old">{price(product.oldPrice)}</bdi>
          )}
        </p>

        {product.colors.length > 1 && (
          <div className="pcard-swatches" aria-hidden="true">
            {product.colors.map((c) => (
              <span
                key={c.hex}
                className="pcard-swatch"
                style={{ background: c.hex }}
                title={pick(c.nameAr, c.nameEn)}
              />
            ))}
          </div>
        )}

        <p className="pcard-sizes" dir={lang === "ar" ? "rtl" : "ltr"}>
          {product.sizes.map((s) => (
            <span key={s}>{sizeLabel(s, pick)}</span>
          ))}
        </p>
      </div>
    </article>
  );
}
