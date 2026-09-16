/**
 * The dashboard API. Everything except `login` runs behind `readSession`,
 * enforced centrally in `index.ts`.
 */
import {
  createSession,
  clearCookie,
  destroySession,
  ensureFirstAdmin,
  hashPassword,
  purgeExpiredSessions,
  sessionCookie,
  verifyPassword,
  type AdminSession,
} from "./auth";
import { seedCatalog } from "./seed";
import {
  ORDER_STATUSES,
  toCategoryDTO,
  toProductDTO,
  type CategoryRow,
  type Env,
  type OrderItemRow,
  type OrderRow,
  type OrderStatus,
  type ProductRow,
  type ShippingRow,
  type Swatch,
} from "./types";
import {
  badRequest,
  bool,
  json,
  list,
  money,
  newId,
  notFound,
  readJson,
  slugify,
  str,
  unauthorized,
} from "./util";

/* --------------------------------------------------------------- auth */

export async function login(request: Request, env: Env) {
  const body = await readJson<{ username?: string; password?: string }>(request);
  const username = str(body?.username, 60);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password) return badRequest("missing_credentials");

  // lets the very first sign-in create the account from the deploy secrets
  await ensureFirstAdmin(env);

  const admin = await env.DB.prepare("SELECT * FROM admins WHERE username = ?")
    .bind(username)
    .first<{ id: number; username: string; password_hash: string }>();

  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    return unauthorized("invalid_credentials");
  }

  await purgeExpiredSessions(env);
  const token = await createSession(env, admin.id);

  return json(
    { username: admin.username },
    { headers: { "set-cookie": sessionCookie(request, token) } },
  );
}

export async function logout(request: Request, env: Env) {
  await destroySession(request, env);
  return json({ ok: true }, { headers: { "set-cookie": clearCookie(request) } });
}

export async function changePassword(request: Request, env: Env, session: AdminSession) {
  const body = await readJson<{ current?: string; next?: string }>(request);
  const current = typeof body?.current === "string" ? body.current : "";
  const next = typeof body?.next === "string" ? body.next : "";
  if (next.length < 8) return badRequest("password_too_short");

  const admin = await env.DB.prepare("SELECT password_hash FROM admins WHERE id = ?")
    .bind(session.adminId)
    .first<{ password_hash: string }>();
  if (!admin || !(await verifyPassword(current, admin.password_hash))) {
    return unauthorized("invalid_credentials");
  }

  await env.DB.prepare("UPDATE admins SET password_hash = ? WHERE id = ?")
    .bind(await hashPassword(next), session.adminId)
    .run();

  // every other device is signed out when the password changes
  await env.DB.prepare("DELETE FROM sessions WHERE admin_id = ?").bind(session.adminId).run();
  return json({ ok: true }, { headers: { "set-cookie": clearCookie(request) } });
}

/* ------------------------------------------------------------- summary */

export async function getStats(env: Env) {
  const [orders, revenue, byStatus, products, lowStock] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS n FROM orders").first<{ n: number }>(),
    env.DB.prepare(
      "SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status <> 'cancelled'",
    ).first<{ n: number }>(),
    env.DB.prepare("SELECT status, COUNT(*) AS n FROM orders GROUP BY status").all<{
      status: string;
      n: number;
    }>(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM products WHERE active = 1").first<{ n: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS n FROM products WHERE in_stock = 0").first<{ n: number }>(),
  ]);

  const { results: recent } = await env.DB.prepare(
    "SELECT id, name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 8",
  ).all<Pick<OrderRow, "id" | "name" | "total" | "status" | "created_at">>();

  return json({
    orders: orders?.n ?? 0,
    revenue: revenue?.n ?? 0,
    products: products?.n ?? 0,
    outOfStock: lowStock?.n ?? 0,
    byStatus: Object.fromEntries(byStatus.results.map((r) => [r.status, r.n])),
    recent: recent.map((o) => ({
      id: o.id,
      name: o.name,
      total: o.total,
      status: o.status,
      createdAt: o.created_at,
    })),
  });
}

/* ------------------------------------------------------------ products */

/** Admin listings include hidden rows, which the storefront never sees. */
export async function listProducts(env: Env) {
  const [{ results: prods }, { results: cats }] = await Promise.all([
    env.DB.prepare("SELECT * FROM products ORDER BY created_at DESC").all<ProductRow>(),
    env.DB.prepare("SELECT * FROM categories ORDER BY sort, id").all<CategoryRow>(),
  ]);
  const slugById = new Map(cats.map((c) => [c.id, c.slug]));

  return json({
    products: prods.map((p) => ({
      ...toProductDTO(p, slugById.get(p.category_id) ?? ""),
      categoryId: p.category_id,
      active: !!p.active,
    })),
  });
}

type ProductInput = {
  nameAr?: string;
  nameEn?: string;
  descAr?: string;
  descEn?: string;
  price?: number;
  oldPrice?: number | null;
  categoryId?: string;
  gender?: string;
  sizes?: unknown;
  colors?: unknown;
  images?: unknown;
  isNew?: boolean;
  inStock?: boolean;
  popularity?: number;
  active?: boolean;
  slug?: string;
};

function cleanSizes(input: unknown): string[] {
  return list(input)
    .map((s) => str(s, 24))
    .filter(Boolean)
    .slice(0, 40);
}

function cleanColors(input: unknown): Swatch[] {
  return list(input)
    .map((c) => {
      const swatch = c as Partial<Swatch>;
      const hex = str(swatch?.hex, 9);
      if (!/^#[0-9a-fA-F]{3,8}$/.test(hex)) return null;
      return {
        nameAr: str(swatch?.nameAr, 40) || hex,
        nameEn: str(swatch?.nameEn, 40) || hex,
        hex,
      };
    })
    .filter((x): x is Swatch => x !== null)
    .slice(0, 20);
}

/** Only same-origin paths are stored, so a product cannot hotlink elsewhere. */
function cleanImages(input: unknown): string[] {
  return list(input)
    .map((s) => str(s, 300))
    .filter((s) => s.startsWith("/images/") || s.startsWith("/media/"))
    .slice(0, 12);
}

/** Makes `base` unique in `products.slug`, ignoring the row being edited. */
async function uniqueSlug(env: Env, base: string, ignoreId?: string): Promise<string> {
  const root = base || newId("p");
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const clash = await env.DB.prepare("SELECT id FROM products WHERE slug = ?")
      .bind(candidate)
      .first<{ id: string }>();
    if (!clash || clash.id === ignoreId) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export async function createProduct(request: Request, env: Env) {
  const body = await readJson<ProductInput>(request);
  if (!body) return badRequest("invalid_body");

  const nameAr = str(body.nameAr, 160);
  const nameEn = str(body.nameEn, 160);
  const categoryId = str(body.categoryId, 64);
  if (!nameAr && !nameEn) return badRequest("name_required");
  if (!categoryId) return badRequest("category_required");

  const category = await env.DB.prepare("SELECT id FROM categories WHERE id = ?")
    .bind(categoryId)
    .first<{ id: string }>();
  if (!category) return badRequest("unknown_category");

  const id = newId("p");
  const slug = await uniqueSlug(env, slugify(str(body.slug, 120) || nameEn || nameAr));

  await env.DB.prepare(
    `INSERT INTO products
       (id, slug, name_ar, name_en, desc_ar, desc_en, price, old_price, category_id,
        gender, sizes, colors, images, is_new, in_stock, popularity, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      slug,
      nameAr || nameEn,
      nameEn || nameAr,
      str(body.descAr, 4000),
      str(body.descEn, 4000),
      money(body.price),
      body.oldPrice ? money(body.oldPrice) : null,
      categoryId,
      str(body.gender, 10) || "unisex",
      JSON.stringify(cleanSizes(body.sizes)),
      JSON.stringify(cleanColors(body.colors)),
      JSON.stringify(cleanImages(body.images)),
      bool(body.isNew) ? 1 : 0,
      bool(body.inStock, true) ? 1 : 0,
      Math.min(100, money(body.popularity, 50)),
      bool(body.active, true) ? 1 : 0,
    )
    .run();

  return json({ id, slug }, { status: 201 });
}

export async function updateProduct(request: Request, env: Env, id: string) {
  const body = await readJson<ProductInput>(request);
  if (!body) return badRequest("invalid_body");

  const existing = await env.DB.prepare("SELECT * FROM products WHERE id = ?")
    .bind(id)
    .first<ProductRow>();
  if (!existing) return notFound("product_not_found");

  if (body.categoryId !== undefined) {
    const category = await env.DB.prepare("SELECT id FROM categories WHERE id = ?")
      .bind(str(body.categoryId, 64))
      .first<{ id: string }>();
    if (!category) return badRequest("unknown_category");
  }

  const slug =
    body.slug === undefined
      ? existing.slug
      : await uniqueSlug(env, slugify(str(body.slug, 120)) || existing.slug, id);

  // every field is optional — anything the form leaves out keeps its value
  const next = {
    slug,
    name_ar: body.nameAr === undefined ? existing.name_ar : str(body.nameAr, 160),
    name_en: body.nameEn === undefined ? existing.name_en : str(body.nameEn, 160),
    desc_ar: body.descAr === undefined ? existing.desc_ar : str(body.descAr, 4000),
    desc_en: body.descEn === undefined ? existing.desc_en : str(body.descEn, 4000),
    price: body.price === undefined ? existing.price : money(body.price),
    old_price:
      body.oldPrice === undefined
        ? existing.old_price
        : body.oldPrice
          ? money(body.oldPrice)
          : null,
    category_id: body.categoryId === undefined ? existing.category_id : str(body.categoryId, 64),
    gender: body.gender === undefined ? existing.gender : str(body.gender, 10) || "unisex",
    sizes: body.sizes === undefined ? existing.sizes : JSON.stringify(cleanSizes(body.sizes)),
    colors: body.colors === undefined ? existing.colors : JSON.stringify(cleanColors(body.colors)),
    images: body.images === undefined ? existing.images : JSON.stringify(cleanImages(body.images)),
    is_new: body.isNew === undefined ? existing.is_new : bool(body.isNew) ? 1 : 0,
    in_stock: body.inStock === undefined ? existing.in_stock : bool(body.inStock) ? 1 : 0,
    popularity:
      body.popularity === undefined
        ? existing.popularity
        : Math.min(100, money(body.popularity, 50)),
    active: body.active === undefined ? existing.active : bool(body.active) ? 1 : 0,
  };

  await env.DB.prepare(
    `UPDATE products SET
       slug = ?, name_ar = ?, name_en = ?, desc_ar = ?, desc_en = ?, price = ?, old_price = ?,
       category_id = ?, gender = ?, sizes = ?, colors = ?, images = ?, is_new = ?, in_stock = ?,
       popularity = ?, active = ?, updated_at = datetime('now')
     WHERE id = ?`,
  )
    .bind(
      next.slug,
      next.name_ar,
      next.name_en,
      next.desc_ar,
      next.desc_en,
      next.price,
      next.old_price,
      next.category_id,
      next.gender,
      next.sizes,
      next.colors,
      next.images,
      next.is_new,
      next.in_stock,
      next.popularity,
      next.active,
      id,
    )
    .run();

  return json({ id, slug: next.slug });
}

export async function deleteProduct(env: Env, id: string) {
  const res = await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  if (!res.meta.changes) return notFound("product_not_found");
  return json({ ok: true });
}

/* ---------------------------------------------------------- categories */

export async function listCategories(env: Env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM categories ORDER BY sort, id",
  ).all<CategoryRow>();

  // the product count decides whether a category can be deleted
  const { results: counts } = await env.DB.prepare(
    "SELECT category_id AS id, COUNT(*) AS n FROM products GROUP BY category_id",
  ).all<{ id: string; n: number }>();
  const byId = new Map(counts.map((c) => [c.id, c.n]));

  return json({
    categories: results.map((c) => ({
      ...toCategoryDTO(c),
      sort: c.sort,
      active: !!c.active,
      products: byId.get(c.id) ?? 0,
    })),
  });
}

type CategoryInput = {
  slug?: string;
  nameAr?: string;
  nameEn?: string;
  image?: string;
  tint?: string;
  photo?: boolean;
  sort?: number;
  active?: boolean;
};

export async function createCategory(request: Request, env: Env) {
  const body = await readJson<CategoryInput>(request);
  if (!body) return badRequest("invalid_body");

  const nameAr = str(body.nameAr, 80);
  const nameEn = str(body.nameEn, 80);
  if (!nameAr && !nameEn) return badRequest("name_required");

  const slug = slugify(str(body.slug, 80) || nameEn || nameAr) || newId("c");
  const clash = await env.DB.prepare("SELECT id FROM categories WHERE slug = ?")
    .bind(slug)
    .first<{ id: string }>();
  if (clash) return badRequest("slug_taken");

  const id = newId("c");
  await env.DB.prepare(
    `INSERT INTO categories (id, slug, name_ar, name_en, image, tint, photo, sort, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      slug,
      nameAr || nameEn,
      nameEn || nameAr,
      cleanImages([body.image])[0] ?? "",
      str(body.tint, 80) || "from-sky-100 to-pink-100",
      bool(body.photo) ? 1 : 0,
      money(body.sort, 99),
      bool(body.active, true) ? 1 : 0,
    )
    .run();

  return json({ id, slug }, { status: 201 });
}

export async function updateCategory(request: Request, env: Env, id: string) {
  const body = await readJson<CategoryInput>(request);
  if (!body) return badRequest("invalid_body");

  const existing = await env.DB.prepare("SELECT * FROM categories WHERE id = ?")
    .bind(id)
    .first<CategoryRow>();
  if (!existing) return notFound("category_not_found");

  let slug = existing.slug;
  if (body.slug !== undefined) {
    const wanted = slugify(str(body.slug, 80)) || existing.slug;
    const clash = await env.DB.prepare("SELECT id FROM categories WHERE slug = ?")
      .bind(wanted)
      .first<{ id: string }>();
    if (clash && clash.id !== id) return badRequest("slug_taken");
    slug = wanted;
  }

  await env.DB.prepare(
    `UPDATE categories SET slug = ?, name_ar = ?, name_en = ?, image = ?, tint = ?,
       photo = ?, sort = ?, active = ? WHERE id = ?`,
  )
    .bind(
      slug,
      body.nameAr === undefined ? existing.name_ar : str(body.nameAr, 80),
      body.nameEn === undefined ? existing.name_en : str(body.nameEn, 80),
      body.image === undefined ? existing.image : (cleanImages([body.image])[0] ?? ""),
      body.tint === undefined ? existing.tint : str(body.tint, 80),
      body.photo === undefined ? existing.photo : bool(body.photo) ? 1 : 0,
      body.sort === undefined ? existing.sort : money(body.sort),
      body.active === undefined ? existing.active : bool(body.active) ? 1 : 0,
      id,
    )
    .run();

  return json({ id, slug });
}

export async function deleteCategory(env: Env, id: string) {
  const used = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM products WHERE category_id = ?",
  )
    .bind(id)
    .first<{ n: number }>();
  // deleting a category with products would orphan them, so it is refused
  if (used && used.n > 0) return badRequest("category_in_use", { products: used.n });

  const res = await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
  if (!res.meta.changes) return notFound("category_not_found");
  return json({ ok: true });
}

/* -------------------------------------------------------------- orders */

export async function listOrders(env: Env, url: URL) {
  const status = str(url.searchParams.get("status"), 20);
  const q = str(url.searchParams.get("q"), 60);

  const where: string[] = [];
  const binds: unknown[] = [];
  if (status && ORDER_STATUSES.includes(status as OrderStatus)) {
    where.push("status = ?");
    binds.push(status);
  }
  if (q) {
    where.push("(id LIKE ? OR name LIKE ? OR phone LIKE ?)");
    binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const { results } = await env.DB.prepare(
    `SELECT * FROM orders ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY created_at DESC LIMIT 200`,
  )
    .bind(...binds)
    .all<OrderRow>();

  return json({
    orders: results.map((o) => ({
      id: o.id,
      name: o.name,
      phone: o.phone,
      governorate: o.governorate,
      total: o.total,
      status: o.status,
      payment: o.payment,
      createdAt: o.created_at,
    })),
  });
}

export async function getOrder(env: Env, id: string) {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(id)
    .first<OrderRow>();
  if (!order) return notFound("order_not_found");

  const { results: items } = await env.DB.prepare(
    "SELECT * FROM order_items WHERE order_id = ?",
  )
    .bind(id)
    .all<OrderItemRow>();

  return json({
    id: order.id,
    name: order.name,
    phone: order.phone,
    email: order.email,
    governorate: order.governorate,
    address: order.address,
    notes: order.notes,
    payment: order.payment,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((i) => ({
      nameAr: i.name_ar,
      nameEn: i.name_en,
      slug: i.slug,
      image: i.image,
      size: i.size,
      color: i.color,
      qty: i.qty,
      price: i.price,
    })),
  });
}

export async function updateOrder(request: Request, env: Env, id: string) {
  const body = await readJson<{ status?: string; notes?: string }>(request);
  if (!body) return badRequest("invalid_body");

  const status = str(body.status, 20);
  if (status && !ORDER_STATUSES.includes(status as OrderStatus)) {
    return badRequest("invalid_status");
  }

  const res = await env.DB.prepare(
    `UPDATE orders SET
       status = COALESCE(NULLIF(?, ''), status),
       notes  = COALESCE(?, notes),
       updated_at = datetime('now')
     WHERE id = ?`,
  )
    .bind(status, body.notes === undefined ? null : str(body.notes, 600), id)
    .run();

  if (!res.meta.changes) return notFound("order_not_found");
  return json({ ok: true });
}

export async function deleteOrder(env: Env, id: string) {
  const res = await env.DB.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
  if (!res.meta.changes) return notFound("order_not_found");
  return json({ ok: true });
}

/* ------------------------------------------------------------ shipping */

export async function listShipping(env: Env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM shipping_rates ORDER BY sort, id",
  ).all<ShippingRow>();

  const settings = await env.DB.prepare(
    "SELECT key, value FROM settings WHERE key IN ('free_shipping_over','default_shipping')",
  ).all<{ key: string; value: string }>();
  const map = Object.fromEntries(settings.results.map((r) => [r.key, r.value]));

  return json({
    rates: results.map((r) => ({
      id: r.id,
      nameAr: r.name_ar,
      nameEn: r.name_en,
      price: r.price,
      active: !!r.active,
      sort: r.sort,
    })),
    freeOver: Number(map.free_shipping_over ?? 0),
    default: Number(map.default_shipping ?? 60),
  });
}

type ShippingInput = {
  rates?: { id?: number; nameAr?: string; nameEn?: string; price?: number; active?: boolean }[];
  freeOver?: number;
  default?: number;
};

/** Saves the whole shipping table in one go — that is how the form submits. */
export async function saveShipping(request: Request, env: Env) {
  const body = await readJson<ShippingInput>(request);
  if (!body) return badRequest("invalid_body");

  const statements: D1PreparedStatement[] = [];

  for (const rate of list(body.rates).slice(0, 60) as NonNullable<ShippingInput["rates"]>) {
    const price = money(rate.price);
    const active = bool(rate.active, true) ? 1 : 0;

    if (rate.id) {
      statements.push(
        env.DB.prepare("UPDATE shipping_rates SET price = ?, active = ? WHERE id = ?").bind(
          price,
          active,
          rate.id,
        ),
      );
    } else {
      const nameEn = str(rate.nameEn, 60);
      const nameAr = str(rate.nameAr, 60) || nameEn;
      if (!nameEn) continue;
      statements.push(
        env.DB.prepare(
          `INSERT INTO shipping_rates (name_ar, name_en, price, active, sort)
           VALUES (?, ?, ?, ?, 99)
           ON CONFLICT(name_en) DO UPDATE SET
             name_ar = excluded.name_ar, price = excluded.price, active = excluded.active`,
        ).bind(nameAr, nameEn, price, active),
      );
    }
  }

  if (body.freeOver !== undefined) {
    statements.push(
      env.DB.prepare("UPDATE settings SET value = ? WHERE key = 'free_shipping_over'").bind(
        String(money(body.freeOver)),
      ),
    );
  }
  if (body.default !== undefined) {
    statements.push(
      env.DB.prepare("UPDATE settings SET value = ? WHERE key = 'default_shipping'").bind(
        String(money(body.default)),
      ),
    );
  }

  if (statements.length) await env.DB.batch(statements);
  return listShipping(env);
}

export async function deleteShipping(env: Env, id: string) {
  const res = await env.DB.prepare("DELETE FROM shipping_rates WHERE id = ?").bind(id).run();
  if (!res.meta.changes) return notFound("rate_not_found");
  return json({ ok: true });
}

/* ------------------------------------------------------------ settings */

const EDITABLE_SETTINGS = [
  "store_phone",
  "store_email",
  "store_whatsapp",
  "cod_enabled",
  "orders_open",
  "free_shipping_over",
  "default_shipping",
];

export async function getSettings(env: Env) {
  const { results } = await env.DB.prepare("SELECT key, value FROM settings").all<{
    key: string;
    value: string;
  }>();
  return json({ settings: Object.fromEntries(results.map((r) => [r.key, r.value])) });
}

export async function saveSettings(request: Request, env: Env) {
  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return badRequest("invalid_body");

  const statements = Object.entries(body)
    .filter(([key]) => EDITABLE_SETTINGS.includes(key))
    .map(([key, value]) =>
      env.DB.prepare(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      ).bind(key, typeof value === "boolean" ? (value ? "1" : "0") : str(value, 200)),
    );

  if (statements.length) await env.DB.batch(statements);
  return getSettings(env);
}

/* -------------------------------------------------------------- upload */

const ALLOWED_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
};

const MAX_UPLOAD = 5 * 1024 * 1024;

/** Stores a product photo in R2 and returns the path the dashboard should save. */
export async function uploadMedia(request: Request, env: Env) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return badRequest("file_required");

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return badRequest("unsupported_type");
  if (file.size > MAX_UPLOAD) return badRequest("file_too_large", { max: MAX_UPLOAD });

  const key = `products/${crypto.randomUUID()}.${ext}`;
  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
  });

  return json({ url: `${env.MEDIA_PREFIX}/${key}`, key }, { status: 201 });
}

/* ---------------------------------------------------------------- seed */

export async function runSeed(env: Env) {
  const existing = await env.DB.prepare("SELECT COUNT(*) AS n FROM products").first<{ n: number }>();
  const counts = await seedCatalog(env);
  return json({ ...counts, replaced: existing?.n ?? 0 });
}
