/** Bindings declared in `wrangler.toml` plus the two dashboard secrets. */
export type Env = {
  DB: D1Database;
  MEDIA: R2Bucket;
  ASSETS: Fetcher;
  MEDIA_PREFIX: string;
  /** Seeds the first dashboard account on its first successful login. */
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
};

/* ----------------------------------------------------------- db rows */

export type CategoryRow = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  image: string;
  tint: string;
  photo: number;
  sort: number;
  active: number;
};

export type ProductRow = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  price: number;
  old_price: number | null;
  category_id: string;
  gender: string;
  sizes: string;
  colors: string;
  images: string;
  is_new: number;
  in_stock: number;
  popularity: number;
  active: number;
  created_at: string;
  updated_at: string;
};

export type ShippingRow = {
  id: number;
  name_ar: string;
  name_en: string;
  price: number;
  active: number;
  sort: number;
};

export type OrderRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  governorate: string;
  address: string;
  notes: string;
  payment: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: number;
  order_id: string;
  product_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  image: string;
  size: string;
  color: string;
  qty: number;
  price: number;
};

/* -------------------------------------------------- wire (JSON) shapes */

export type Swatch = { nameAr: string; nameEn: string; hex: string };

/** What the storefront receives — camelCase, with the JSON columns parsed. */
export type ProductDTO = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  category: string;
  gender: "boys" | "girls" | "unisex";
  sizes: string[];
  colors: Swatch[];
  isNew?: boolean;
  inStock: boolean;
  popularity: number;
  createdAt: string;
};

export type CategoryDTO = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  tint: string;
  photo?: boolean;
};

export type ShippingDTO = { ar: string; en: string; price: number };

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function parseList<T>(raw: string, fallback: T[] = []): T[] {
  try {
    const out = JSON.parse(raw);
    return Array.isArray(out) ? (out as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function toProductDTO(row: ProductRow, categorySlug: string): ProductDTO {
  const images = parseList<string>(row.images);
  return {
    id: row.id,
    slug: row.slug,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    descAr: row.desc_ar,
    descEn: row.desc_en,
    price: row.price,
    ...(row.old_price ? { oldPrice: row.old_price } : {}),
    image: images[0] ?? "",
    images,
    category: categorySlug,
    gender: (row.gender as ProductDTO["gender"]) ?? "unisex",
    sizes: parseList<string>(row.sizes),
    colors: parseList<Swatch>(row.colors),
    ...(row.is_new ? { isNew: true } : {}),
    inStock: !!row.in_stock,
    popularity: row.popularity,
    createdAt: row.created_at,
  };
}

export function toCategoryDTO(row: CategoryRow): CategoryDTO {
  return {
    id: row.id,
    slug: row.slug,
    nameAr: row.name_ar,
    nameEn: row.name_en,
    image: row.image,
    tint: row.tint,
    ...(row.photo ? { photo: true } : {}),
  };
}
