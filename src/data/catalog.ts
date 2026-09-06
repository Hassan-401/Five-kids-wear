export type CategoryId =
  | "boys"
  | "girls"
  | "pajamas"
  | "accessories"
  | "offers";

export type Category = {
  id: CategoryId;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  tint: string;
};

export const categories: Category[] = [
  {
    id: "boys",
    slug: "boys",
    nameAr: "ملابس أولاد",
    nameEn: "Boys clothing",
    image: "/images/categories/boys.png",
    tint: "from-sky-100 to-sky-200",
  },
  {
    id: "girls",
    slug: "girls",
    nameAr: "ملابس بنات",
    nameEn: "Girls clothing",
    image: "/images/categories/girls.png",
    tint: "from-pink-100 to-pink-200",
  },
  {
    id: "pajamas",
    slug: "pajamas",
    nameAr: "بيجامات",
    nameEn: "Pajamas",
    image: "/images/categories/pajamas.png",
    tint: "from-sky-100 to-pink-100",
  },
  {
    id: "accessories",
    slug: "accessories",
    nameAr: "إكسسوارات",
    nameEn: "Accessories",
    image: "/images/categories/accessories.png",
    tint: "from-pink-100 to-pink-200",
  },
  {
    id: "offers",
    slug: "offers",
    nameAr: "عروض خاصة",
    nameEn: "Special offers",
    image: "/images/categories/offers.png",
    tint: "from-pink-200 to-sky-100",
  },
];

export type Product = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: CategoryId;
  gender: "boys" | "girls";
  sizes: string[];
  colors: { nameAr: string; nameEn: string; hex: string }[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  popularity: number;
  createdAt: string;
};

const PINK = { nameAr: "وردي", nameEn: "Pink", hex: "#f9a8c9" };
const BLUE = { nameAr: "أزرق", nameEn: "Blue", hex: "#74b8f5" };
const CREAM = { nameAr: "بيج", nameEn: "Cream", hex: "#f2e3cf" };
const GREEN = { nameAr: "زيتي", nameEn: "Olive", hex: "#5c6f4a" };
const NAVY = { nameAr: "كحلي", nameEn: "Navy", hex: "#2a4d94" };
const LILAC = { nameAr: "ليلكي", nameEn: "Lilac", hex: "#c3aef0" };

const KID_SIZES = ["2-3", "4-5", "6-7", "8-9", "10-11"];

export const products: Product[] = [
  {
    id: "p1",
    slug: "little-princess",
    nameAr: "طقم بناتي ليتل برنسيس",
    nameEn: "Little Princess Girls Set",
    descAr:
      "طقم بناتي من بلوزة شيفون كريمي بأكمام كشكش وبنطلون واسع بلون الوردي المدخن، مع فيونكة ناعمة تعطي إطلالة أنيقة لكل المناسبات.",
    descEn:
      "A girls set of a cream chiffon ruffle-sleeve blouse and dusty pink wide-leg trousers, finished with a soft bow for an elegant look on any occasion.",
    price: 470,
    oldPrice: 560,
    image: "/images/products/little-princess.png",
    category: "girls",
    gender: "girls",
    sizes: KID_SIZES,
    colors: [PINK, CREAM],
    rating: 4.8,
    reviews: 42,
    isNew: true,
    popularity: 96,
    createdAt: "2026-08-28",
  },
  {
    id: "p2",
    slug: "mini-diva",
    nameAr: "طقم بناتي ميني ديفا",
    nameEn: "Mini Diva Girls Set",
    descAr:
      "طقم بناتي عصري بخامة قطنية مريحة وتفاصيل ناعمة، مناسب للخروج واللعب في نفس الوقت.",
    descEn:
      "A modern girls set in comfy cotton with delicate details — perfect for outings and playtime alike.",
    price: 450,
    image: "/images/products/mini-diva.png",
    category: "girls",
    gender: "girls",
    sizes: KID_SIZES,
    colors: [PINK, LILAC],
    rating: 4.6,
    reviews: 28,
    isNew: true,
    popularity: 88,
    createdAt: "2026-08-26",
  },
  {
    id: "p3",
    slug: "sweet-bloom",
    nameAr: "طقم بناتي سويت بلوم",
    nameEn: "Sweet Bloom Girls Set",
    descAr:
      "تصميم مزهر مبهج بخامة خفيفة تناسب الجو الدافئ، بألوان هادئة تليق على طفلتك.",
    descEn:
      "A cheerful floral design in a light fabric made for warm days, in soft colors that suit your little one.",
    price: 430,
    oldPrice: 490,
    image: "/images/products/sweet-bloom.png",
    category: "girls",
    gender: "girls",
    sizes: KID_SIZES,
    colors: [PINK, CREAM],
    rating: 4.7,
    reviews: 35,
    popularity: 91,
    createdAt: "2026-08-20",
  },
  {
    id: "p4",
    slug: "little-boss",
    nameAr: "طقم أولادي ليتل بوس",
    nameEn: "Little Boss Boys Set",
    descAr:
      "طقم أولادي أنيق بقصة عصرية وخامة قطنية ناعمة، يجمع بين الشياكة والراحة.",
    descEn:
      "A smart boys set with a modern cut and soft cotton fabric — style and comfort in one.",
    price: 460,
    image: "/images/products/little-boss.png",
    category: "boys",
    gender: "boys",
    sizes: KID_SIZES,
    colors: [NAVY, CREAM],
    rating: 4.7,
    reviews: 51,
    isNew: true,
    popularity: 94,
    createdAt: "2026-08-27",
  },
  {
    id: "p5",
    slug: "mini-trend",
    nameAr: "طقم أولادي ميني تريند",
    nameEn: "Mini Trend Boys Set",
    descAr:
      "إطلالة كاجوال مريحة بخامة تتحمل حركة الأطفال طول اليوم مع ألوان عملية.",
    descEn:
      "A relaxed casual look in a fabric that stands up to all-day play, in practical colors.",
    price: 440,
    oldPrice: 520,
    image: "/images/products/mini-trend.png",
    category: "boys",
    gender: "boys",
    sizes: KID_SIZES,
    colors: [GREEN, NAVY],
    rating: 4.5,
    reviews: 33,
    popularity: 85,
    createdAt: "2026-08-18",
  },
  {
    id: "p6",
    slug: "urban-kid",
    nameAr: "طقم كاجوال أولادي أوربان كيد",
    nameEn: "Urban Kid Casual Boys Set",
    descAr:
      "طقم كاجوال بروح شبابية، مناسب للمدرسة والنزهات مع خامة تتحمل الغسيل المتكرر.",
    descEn:
      "A casual set with a youthful vibe — great for school and outings, in a fabric that handles frequent washing.",
    price: 480,
    image: "/images/products/urban-kid.png",
    category: "boys",
    gender: "boys",
    sizes: KID_SIZES,
    colors: [GREEN, NAVY],
    rating: 4.6,
    reviews: 24,
    popularity: 82,
    createdAt: "2026-08-15",
  },
  {
    id: "p7",
    slug: "dino-dream",
    nameAr: "بيجامة أولادي دينو دريم",
    nameEn: "Dino Dream Boys Pajama",
    descAr:
      "بيجامة أولادي برسومات ديناصورات مرحة من قطن ناعم يمنح طفلك نوماً مريحاً.",
    descEn:
      "A boys pajama with playful dinosaur prints in soft cotton for a comfortable night's sleep.",
    price: 380,
    image: "/images/products/dino-dream.png",
    category: "pajamas",
    gender: "boys",
    sizes: KID_SIZES,
    colors: [GREEN, CREAM],
    rating: 4.9,
    reviews: 67,
    isNew: true,
    popularity: 99,
    createdAt: "2026-08-29",
  },
  {
    id: "p8",
    slug: "little-hero",
    nameAr: "بيجامة أولادي ليتل هيرو",
    nameEn: "Little Hero Boys Pajama",
    descAr:
      "بيجامة بطابع رياضي مبهج، خامة قطنية تسمح بمرور الهواء وتناسب كل الفصول.",
    descEn:
      "A sporty pajama in breathable cotton that works across every season.",
    price: 360,
    oldPrice: 420,
    image: "/images/products/little-hero.png",
    category: "pajamas",
    gender: "boys",
    sizes: KID_SIZES,
    colors: [BLUE, NAVY],
    rating: 4.6,
    reviews: 41,
    popularity: 89,
    createdAt: "2026-08-12",
  },
  {
    id: "p9",
    slug: "racing-kid",
    nameAr: "بيجامة أولادي ريسينج كيد",
    nameEn: "Racing Kid Boys Pajama",
    descAr:
      "بيجامة برسومات سيارات سباق يحبها الأولاد، بخامة ناعمة لا تسبب أي حساسية.",
    descEn:
      "A racing-car printed pajama boys love, in a gentle fabric that won't irritate the skin.",
    price: 370,
    image: "/images/products/racing-kid.png",
    category: "pajamas",
    gender: "boys",
    sizes: KID_SIZES,
    colors: [BLUE, CREAM],
    rating: 4.5,
    reviews: 19,
    popularity: 78,
    createdAt: "2026-08-10",
  },
  {
    id: "p10",
    slug: "lovely-bear",
    nameAr: "بيجامة بناتي لافلي بير",
    nameEn: "Lovely Bear Girls Pajama",
    descAr:
      "بيجامة بناتي برسمة دب كيوت وألوان وردية هادئة، من قطن ناعم على البشرة.",
    descEn:
      "A girls pajama with a cute bear print in calm pink tones, made of skin-soft cotton.",
    price: 390,
    oldPrice: 450,
    image: "/images/products/lovely-bear.png",
    category: "pajamas",
    gender: "girls",
    sizes: KID_SIZES,
    colors: [PINK, CREAM],
    rating: 4.9,
    reviews: 73,
    isNew: true,
    popularity: 98,
    createdAt: "2026-08-30",
  },
  {
    id: "p11",
    slug: "sweet-moon",
    nameAr: "بيجامة بناتي سويت مون",
    nameEn: "Sweet Moon Girls Pajama",
    descAr:
      "رسومات قمر ونجوم تجعل وقت النوم أحلى، مع خامة قطنية دافئة ومريحة.",
    descEn:
      "Moon and stars prints that make bedtime sweeter, in a warm and comfortable cotton.",
    price: 400,
    image: "/images/products/sweet-moon.png",
    category: "pajamas",
    gender: "girls",
    sizes: KID_SIZES,
    colors: [LILAC, PINK],
    rating: 4.8,
    reviews: 46,
    popularity: 92,
    createdAt: "2026-08-22",
  },
  {
    id: "p12",
    slug: "dreamy-girl",
    nameAr: "بيجامة بناتي دريمي جيرل",
    nameEn: "Dreamy Girl Pajama",
    descAr:
      "بيجامة ناعمة بتصميم بسيط وألوان هادئة، الاختيار المثالي لليالي المريحة.",
    descEn:
      "A soft pajama with a simple design and calm colors — the perfect pick for cozy nights.",
    price: 385,
    image: "/images/products/dreamy-girl.png",
    category: "pajamas",
    gender: "girls",
    sizes: KID_SIZES,
    colors: [PINK, LILAC],
    rating: 4.7,
    reviews: 30,
    popularity: 86,
    createdAt: "2026-08-08",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelated(product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(
      products.filter(
        (p) => p.id !== product.id && p.category !== product.category,
      ),
    )
    .slice(0, limit);
}

export const onSale = products.filter((p) => p.oldPrice);

export const governorates = [
  { ar: "القاهرة", en: "Cairo" },
  { ar: "الجيزة", en: "Giza" },
  { ar: "الإسكندرية", en: "Alexandria" },
  { ar: "القليوبية", en: "Qalyubia" },
  { ar: "الدقهلية", en: "Dakahlia" },
  { ar: "الشرقية", en: "Sharqia" },
  { ar: "الغربية", en: "Gharbia" },
  { ar: "المنوفية", en: "Monufia" },
  { ar: "البحيرة", en: "Beheira" },
  { ar: "أسيوط", en: "Asyut" },
  { ar: "المنيا", en: "Minya" },
  { ar: "سوهاج", en: "Sohag" },
  { ar: "الأقصر", en: "Luxor" },
  { ar: "أسوان", en: "Aswan" },
  { ar: "بورسعيد", en: "Port Said" },
];

/** Resolves a cart line's stored (English) colour name to the active language. */
export function colorLabel(
  product: Product,
  storedName: string,
  pick: <T>(ar: T, en: T) => T,
) {
  const c = product.colors.find((x) => x.nameEn === storedName);
  return c ? pick(c.nameAr, c.nameEn) : storedName;
}
