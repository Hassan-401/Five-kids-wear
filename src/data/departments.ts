/**
 * Men's + Women's departments.
 *
 * These two sections run on their own design system (see `.dept-men` /
 * `.dept-women` in `styles/departments.css`) and keep their own catalogue,
 * separate from the kids catalogue in `catalog.ts`. The catalogue is empty
 * for now — both departments show a "coming soon" state until real products
 * are added to `deptProducts` below.
 */

import type { Swatch } from "./catalog";

export type Dept = "men" | "women";

export type Bilingual = { ar: string; en: string };

export type SubCategory = {
  slug: string;
  name: Bilingual;
  blurb: Bilingual;
  image: string;
};

export type DeptProduct = {
  id: string;
  slug: string;
  dept: Dept;
  sub: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  oldPrice?: number;
  /** Renders the price as "starting from …" — used for multi-variant lines. */
  fromPrice?: boolean;
  image: string;
  sizes: string[];
  colors: Swatch[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  popularity: number;
  createdAt: string;
};

/* photography for the subcategory tiles */
const M1 = "/images/men/men-1.jpg";
const M2 = "/images/men/men-2.jpg";
const M3 = "/images/men/men-3.jpg";
const W1 = "/images/women/women-1.jpg";
const W2 = "/images/women/women-2.jpg";
const W3 = "/images/women/women-3.jpg";

/* ------------------------------------------------------------------ */
/* departments                                                         */
/* ------------------------------------------------------------------ */

export const departments: Record<
  Dept,
  {
    slug: Dept;
    name: Bilingual;
    tagline: Bilingual;
    heroTitle: Bilingual;
    heroLead: Bilingual;
    heroImage: string;
    heroAside: string;
    editorial: { title: Bilingual; body: Bilingual; image: string };
    marquee: Bilingual;
    subs: SubCategory[];
  }
> = {
  men: {
    slug: "men",
    name: { ar: "رجالي", en: "Men" },
    tagline: { ar: "خزانة يومية بخامات تفضل معاك", en: "An everyday wardrobe built to last" },
    heroTitle: { ar: "أساسيات الرجل العصري", en: "Modern Essentials" },
    heroLead: {
      ar: "قطع هادئة الألوان، قصّات مضبوطة، وخامات ثقيلة تتحمّل الاستخدام اليومي. اختر القطعة ورَكِّبها كما تحب.",
      en: "Quiet colours, considered cuts and heavyweight fabrics made for daily wear. Pick a piece, build the fit.",
    },
    heroImage: M2,
    heroAside: M1,
    editorial: {
      title: { ar: "طبقات الخريف", en: "The Layering Edit" },
      body: {
        ar: "أوفر شيرت صوف فوق تيشيرت قطن ثقيل وجينز مغسول — تركيبة واحدة تنفع من الصبح للمساء.",
        en: "A wool overshirt over a heavyweight tee and washed denim — one formula that carries you from morning to night.",
      },
      image: M3,
    },
    marquee: {
      ar: "قطن ثقيل · قصّات مضبوطة · شحن سريع · خامات مستوردة",
      en: "Heavyweight cotton · Considered cuts · Fast delivery · Premium fabrics",
    },
    subs: [
      {
        slug: "tshirts",
        name: { ar: "تيشيرتات وقمصان", en: "T-shirts & Shirts" },
        blurb: { ar: "قطن مُمشّط بأوزان مختلفة", en: "Combed cotton in every weight" },
        image: M1,
      },
      {
        slug: "hoodies",
        name: { ar: "هوديز وسويت شيرت", en: "Hoodies & Sweats" },
        blurb: { ar: "وزن ثقيل ووبر داخلي ناعم", en: "Heavy loopback, brushed inside" },
        image: M3,
      },
      {
        slug: "pants",
        name: { ar: "بناطيل وجينز", en: "Trousers & Denim" },
        blurb: { ar: "من الجينز المغسول للشينو", en: "From washed denim to chino" },
        image: M3,
      },
      {
        slug: "outerwear",
        name: { ar: "جاكيتات", en: "Outerwear" },
        blurb: { ar: "أوفر شيرت وجاكيتات صوف", en: "Overshirts and wool jackets" },
        image: M2,
      },
      {
        slug: "shoes",
        name: { ar: "أحذية", en: "Footwear" },
        blurb: { ar: "سنيكرز جلد وسويد", en: "Leather and suede sneakers" },
        image: M1,
      },
      {
        slug: "accessories",
        name: { ar: "إكسسوارات", en: "Accessories" },
        blurb: { ar: "كابات، ساعات، نضارات", en: "Caps, watches, eyewear" },
        image: M2,
      },
    ],
  },

  women: {
    slug: "women",
    name: { ar: "نسائي", en: "Women" },
    tagline: { ar: "قطع ناعمة لأيام هادئة", en: "Soft pieces for slow days" },
    heroTitle: { ar: "تشكيلة الصيف", en: "The Summer Edit" },
    heroLead: {
      ar: "فساتين خفيفة، أقمشة تتنفّس، وألوان مستوحاة من ضوء الصباح. تشكيلة صُنعت لتلبسيها كل يوم.",
      en: "Airy dresses, breathable cloth and colours borrowed from early light — made to be worn every day.",
    },
    heroImage: W1,
    heroAside: W3,
    editorial: {
      title: { ar: "حكاية الفستان المزهّر", en: "A Story in Florals" },
      body: {
        ar: "طبعات صغيرة على قماش خفيف، كشكش هادئ، وخصر مضبوط — الفستان اللي بيشتغل مع الصندل الجلد والكعب الأبيض بنفس السهولة.",
        en: "Ditsy prints on featherweight cloth, a soft ruffle and a defined waist — the dress that works with leather sandals and white heels alike.",
      },
      image: W2,
    },
    marquee: {
      ar: "أقمشة تتنفّس · طبعات محدودة · شحن سريع · قصّات مريحة",
      en: "Breathable cloth · Limited prints · Fast delivery · Easy cuts",
    },
    subs: [
      {
        slug: "dresses",
        name: { ar: "فساتين", en: "Dresses" },
        blurb: { ar: "ميدي وميني بطبعات صيفية", en: "Midi and mini in summer prints" },
        image: W1,
      },
      {
        slug: "tops",
        name: { ar: "توبات وبلوزات", en: "Tops & Blouses" },
        blurb: { ar: "شيفون وقطن مطبوع", en: "Chiffon and printed cotton" },
        image: W2,
      },
      {
        slug: "bottoms",
        name: { ar: "تنانير وبناطيل", en: "Skirts & Trousers" },
        blurb: { ar: "قصّات واسعة ومريحة", en: "Relaxed, roomy cuts" },
        image: W3,
      },
      {
        slug: "outerwear",
        name: { ar: "كارديجان وجاكيتات", en: "Cardigans & Jackets" },
        blurb: { ar: "طبقات خفيفة للمساء", en: "Light layers for the evening" },
        image: W3,
      },
      {
        slug: "shoes",
        name: { ar: "أحذية وشنط", en: "Shoes & Bags" },
        blurb: { ar: "صنادل جلد وكعب مربّع", en: "Leather sandals, block heels" },
        image: W1,
      },
      {
        slug: "accessories",
        name: { ar: "إكسسوارات", en: "Accessories" },
        blurb: { ar: "لمسات صغيرة تكمّل الإطلالة", en: "The small finishing touches" },
        image: W2,
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* catalogue                                                           */
/* ------------------------------------------------------------------ */

export const deptProducts: DeptProduct[] = [];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export const deptProductsOf = (dept: Dept) =>
  deptProducts.filter((p) => p.dept === dept);

export const subCategory = (dept: Dept, slug: string) =>
  departments[dept].subs.find((s) => s.slug === slug);

export const getDeptProduct = (dept: Dept, slug: string) =>
  deptProducts.find((p) => p.dept === dept && p.slug === slug);

export function relatedDeptProducts(product: DeptProduct, limit = 4) {
  const pool = deptProductsOf(product.dept).filter((p) => p.id !== product.id);
  return [
    ...pool.filter((p) => p.sub === product.sub),
    ...pool.filter((p) => p.sub !== product.sub),
  ].slice(0, limit);
}

/** Cart/wishlist links have to know which department a product lives in. */
export function productHref(p: { slug: string; dept?: Dept }) {
  return p.dept ? `/${p.dept}/product/${p.slug}` : `/product/${p.slug}`;
}

/** "One size" is stored in English (it ends up in cart lines) but shown localised. */
export function sizeLabel(size: string, pick: <T>(ar: T, en: T) => T) {
  return size === "One size" ? pick("مقاس واحد", "One size") : size;
}

export type DeptSort = "newest" | "priceAsc" | "priceDesc" | "popular";

export function sortDeptProducts(list: DeptProduct[], sort: DeptSort) {
  const out = list.slice();
  switch (sort) {
    case "priceAsc":
      return out.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return out.sort((a, b) => b.price - a.price);
    case "popular":
      return out.sort((a, b) => b.popularity - a.popularity);
    default:
      return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
