/**
 * First-run data import.
 *
 * The kids catalogue that the storefront shipped with lives in
 * `src/data/catalog.ts`. The dashboard's "استيراد المنتجات" button calls this
 * once to copy it into D1; after that the database is the single source of
 * truth and the TypeScript file is only a fallback for `npm run dev` without a
 * worker running.
 */
import { categories, products } from "../../src/data/catalog";
import type { Env } from "./types";

export async function seedCatalog(env: Env): Promise<{ categories: number; products: number }> {
  const statements: D1PreparedStatement[] = [];

  categories.forEach((cat, i) => {
    statements.push(
      env.DB.prepare(
        `INSERT INTO categories (id, slug, name_ar, name_en, image, tint, photo, sort, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
         ON CONFLICT(id) DO UPDATE SET
           slug = excluded.slug, name_ar = excluded.name_ar, name_en = excluded.name_en,
           image = excluded.image, tint = excluded.tint, photo = excluded.photo,
           sort = excluded.sort`,
      ).bind(cat.id, cat.slug, cat.nameAr, cat.nameEn, cat.image, cat.tint, cat.photo ? 1 : 0, i),
    );
  });

  for (const p of products) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO products
           (id, slug, name_ar, name_en, desc_ar, desc_en, price, old_price, category_id,
            gender, sizes, colors, images, is_new, in_stock, popularity, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 1, ?)
         ON CONFLICT(id) DO UPDATE SET
           slug = excluded.slug, name_ar = excluded.name_ar, name_en = excluded.name_en,
           desc_ar = excluded.desc_ar, desc_en = excluded.desc_en, price = excluded.price,
           old_price = excluded.old_price, category_id = excluded.category_id,
           gender = excluded.gender, sizes = excluded.sizes, colors = excluded.colors,
           images = excluded.images, is_new = excluded.is_new,
           popularity = excluded.popularity, updated_at = datetime('now')`,
      ).bind(
        p.id,
        p.slug,
        p.nameAr,
        p.nameEn,
        p.descAr,
        p.descEn,
        p.price,
        p.oldPrice ?? null,
        p.category,
        p.gender,
        JSON.stringify(p.sizes),
        JSON.stringify(p.colors),
        JSON.stringify(p.images),
        p.isNew ? 1 : 0,
        p.popularity,
        p.createdAt,
      ),
    );
  }

  await env.DB.batch(statements);
  return { categories: categories.length, products: products.length };
}
