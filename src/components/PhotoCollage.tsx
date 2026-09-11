import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { products } from "../data/catalog";

type Card = {
  /** product slug, or "lifestyle" for the campaign photo in the middle */
  slug: string;
  /** placement inside the collage box, in % of its width/height */
  x: number;
  y: number;
  w: number;
  rotate: number;
  /** how far the card lags behind the pointer (0 = pinned, 1.6 = floats most) */
  depth: number;
  delay: number;
  bob: number;
  z: number;
};

const cards: Card[] = [
  { slug: "tom-jerry-pajama", x: 2, y: 1, w: 25, rotate: -7, depth: 1.5, delay: 0.05, bob: 5.5, z: 10 },
  { slug: "blue-dragon-pajama", x: 56, y: 0, w: 25, rotate: 6, depth: 1.3, delay: 0.15, bob: 6.4, z: 10 },
  { slug: "teddy-bows-pajama", x: -3, y: 33, w: 24, rotate: -4, depth: 1.8, delay: 0.25, bob: 5.1, z: 8 },
  { slug: "lifestyle", x: 26, y: 15, w: 36, rotate: 2, depth: 0.5, delay: 0, bob: 7.2, z: 20 },
  { slug: "lion-king-pajama", x: 66, y: 32, w: 25, rotate: 7, depth: 1.7, delay: 0.32, bob: 5.8, z: 8 },
  { slug: "girl-bodysuit-pack-panda", x: 10, y: 64, w: 25, rotate: 5, depth: 1.1, delay: 0.4, bob: 6.8, z: 12 },
  { slug: "snoopy-pajama", x: 48, y: 66, w: 25, rotate: -6, depth: 1.4, delay: 0.48, bob: 6.1, z: 12 },
];

/** tape colours alternate between the two brand colours */
const tapes = ["var(--color-sky-300)", "var(--color-pink-300)"];

export default function PhotoCollage() {
  const { pick } = useLang();

  return (
    <div className="relative w-full aspect-[10/8] max-w-[640px] mx-auto">
      {cards.map((card, i) => {
        const product =
          card.slug === "lifestyle"
            ? undefined
            : products.find((p) => p.slug === card.slug);

        const label = product ? pick(product.nameAr, product.nameEn) : "";
        const href = product ? `/product/${product.slug}` : "/shop";

        return (
          <div
            key={card.slug}
            className="absolute parallax-layer"
            style={
              {
                insetInlineStart: `${card.x}%`,
                top: `${card.y}%`,
                width: `${card.w}%`,
                zIndex: card.z,
                "--depth": card.depth,
              } as React.CSSProperties
            }
          >
            <div
              className="anim-bob"
              style={{ animationDuration: `${card.bob}s`, animationDelay: `${card.delay}s` }}
            >
              <Link
                to={href}
                aria-label={label}
                className="anim-deal polaroid relative block"
                style={
                  {
                    transform: `rotate(${card.rotate}deg)`,
                    animationDelay: `${card.delay}s`,
                    "--tape": tapes[i % 2],
                  } as React.CSSProperties
                }
              >
                <div className="overflow-hidden rounded-md bg-sky-50 aspect-[4/5]">
                  <img
                    src={product ? product.image : "/images/promo-home.webp"}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    className="w-full h-full object-cover"
                    style={
                      product
                        ? { objectFit: "contain", padding: "4%" }
                        : { objectPosition: "72% center" }
                    }
                  />
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
