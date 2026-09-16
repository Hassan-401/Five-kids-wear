/** Everything the storefront calls. No authentication anywhere in this file. */
import { egyptianPhone, trackingUrl } from "./bosta";
import { shipOrder } from "./ship";
import {
  toCategoryDTO,
  toProductDTO,
  type CategoryRow,
  type Env,
  type OrderItemRow,
  type OrderRow,
  type ProductRow,
  type ShippingRow,
} from "./types";
import { badRequest, json, money, newOrderId, notFound, readJson, str } from "./util";

/* ------------------------------------------------------------ settings */

export async function loadSettings(env: Env): Promise<Record<string, string>> {
  const { results } = await env.DB.prepare("SELECT key, value FROM settings").all<{
    key: string;
    value: string;
  }>();
  return Object.fromEntries(results.map((r) => [r.key, r.value]));
}

async function loadShipping(env: Env): Promise<ShippingRow[]> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM shipping_rates WHERE active = 1 ORDER BY sort, id",
  ).all<ShippingRow>();
  return results;
}

/**
 * One call that hydrates the whole storefront: categories, products, the
 * shipping table and the public settings. Cheap enough at this catalogue size
 * that splitting it would only cost round trips.
 */
export async function getCatalog(env: Env) {
  const [cats, prods, rates, settings] = await Promise.all([
    env.DB.prepare("SELECT * FROM categories WHERE active = 1 ORDER BY sort, id").all<CategoryRow>(),
    env.DB.prepare(
      "SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC",
    ).all<ProductRow>(),
    loadShipping(env),
    loadSettings(env),
  ]);

  const slugById = new Map(cats.results.map((c) => [c.id, c.slug]));

  return json({
    categories: cats.results.map(toCategoryDTO),
    products: prods.results.map((p) => toProductDTO(p, slugById.get(p.category_id) ?? "")),
    shipping: {
      rates: rates.map((r) => ({ ar: r.name_ar, en: r.name_en, price: r.price })),
      freeOver: Number(settings.free_shipping_over ?? 0),
      default: Number(settings.default_shipping ?? 60),
    },
    settings: {
      phone: settings.store_phone ?? "",
      email: settings.store_email ?? "",
      whatsapp: settings.store_whatsapp ?? "",
      facebook: settings.social_facebook ?? "",
      instagram: settings.social_instagram ?? "",
      tiktok: settings.social_tiktok ?? "",
      codEnabled: settings.cod_enabled !== "0",
      ordersOpen: settings.orders_open !== "0",
    },
  });
}

export async function getProduct(env: Env, slug: string) {
  const row = await env.DB.prepare(
    "SELECT * FROM products WHERE slug = ? AND active = 1",
  )
    .bind(slug)
    .first<ProductRow>();
  if (!row) return notFound("product_not_found");

  const cat = await env.DB.prepare("SELECT slug FROM categories WHERE id = ?")
    .bind(row.category_id)
    .first<{ slug: string }>();

  return json(toProductDTO(row, cat?.slug ?? ""));
}

export async function getShipping(env: Env) {
  const [rates, settings] = await Promise.all([loadShipping(env), loadSettings(env)]);
  return json({
    rates: rates.map((r) => ({ ar: r.name_ar, en: r.name_en, price: r.price })),
    freeOver: Number(settings.free_shipping_over ?? 0),
    default: Number(settings.default_shipping ?? 60),
  });
}

/* -------------------------------------------------------------- orders */

type OrderLineInput = { productId?: string; size?: string; color?: string; qty?: number };

type OrderInput = {
  name?: string;
  phone?: string;
  email?: string;
  governorate?: string;
  address?: string;
  notes?: string;
  payment?: string;
  items?: OrderLineInput[];
};

/**
 * Creates an order.
 *
 * Every price is read back out of the database — the browser sends product ids
 * and quantities only, so a tampered cart cannot change what the order costs.
 */
export async function createOrder(request: Request, env: Env) {
  const body = await readJson<OrderInput>(request);
  if (!body) return badRequest("invalid_body");

  const settings = await loadSettings(env);
  if (settings.orders_open === "0") return badRequest("orders_closed");

  const name = str(body.name, 120);
  const phone = str(body.phone, 30);
  const governorate = str(body.governorate, 60);
  const address = str(body.address, 400);
  if (!name || !phone || !governorate || !address) return badRequest("missing_fields");
  if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) return badRequest("invalid_phone");

  const lines = Array.isArray(body.items) ? body.items.slice(0, 60) : [];
  if (lines.length === 0) return badRequest("empty_cart");

  // one lookup for every distinct product in the cart
  const ids = [...new Set(lines.map((l) => str(l.productId, 64)).filter(Boolean))];
  if (ids.length === 0) return badRequest("empty_cart");

  const placeholders = ids.map(() => "?").join(",");
  const { results: found } = await env.DB.prepare(
    `SELECT * FROM products WHERE active = 1 AND id IN (${placeholders})`,
  )
    .bind(...ids)
    .all<ProductRow>();

  const byId = new Map(found.map((p) => [p.id, p]));

  const items = lines
    .map((line) => {
      const product = byId.get(str(line.productId, 64));
      if (!product) return null;
      const qty = Math.max(1, Math.min(money(line.qty, 1), 20));
      const images = JSON.parse(product.images || "[]") as string[];
      return {
        productId: product.id,
        slug: product.slug,
        nameAr: product.name_ar,
        nameEn: product.name_en,
        image: images[0] ?? "",
        size: str(line.size, 40),
        color: str(line.color, 60),
        qty,
        price: product.price,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (items.length === 0) return badRequest("no_valid_items");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const rate = await env.DB.prepare(
    "SELECT price FROM shipping_rates WHERE name_en = ? AND active = 1",
  )
    .bind(governorate)
    .first<{ price: number }>();

  const freeOver = Number(settings.free_shipping_over ?? 0);
  const baseShipping = rate?.price ?? Number(settings.default_shipping ?? 60);
  const shipping = freeOver > 0 && subtotal >= freeOver ? 0 : baseShipping;
  const total = subtotal + shipping;

  const id = newOrderId();

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO orders
         (id, name, phone, email, governorate, address, notes, payment, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      id,
      name,
      phone,
      str(body.email, 160),
      governorate,
      address,
      str(body.notes, 600),
      str(body.payment, 20) || "cod",
      subtotal,
      shipping,
      total,
    ),
    ...items.map((i) =>
      env.DB.prepare(
        `INSERT INTO order_items
           (order_id, product_id, slug, name_ar, name_en, image, size, color, qty, price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(id, i.productId, i.slug, i.nameAr, i.nameEn, i.image, i.size, i.color, i.qty, i.price),
    ),
  ]);

  // With auto-ship on, the parcel is booked with Bosta the moment the order
  // lands. It is deliberately best-effort: a courier outage must never lose a
  // sale, so a failure leaves the order for the owner to ship by hand.
  if (settings.bosta_auto === "1" && settings.bosta_enabled === "1") {
    try {
      await shipOrder(env, id);
    } catch (err) {
      console.error("auto-ship failed", id, err);
    }
  }

  return json({ id, subtotal, shipping, total, status: "pending" }, { status: 201 });
}

/**
 * Order tracking. With no customer accounts, the order reference alone is not
 * enough — the phone number on the order has to match as well.
 */
export async function trackOrder(env: Env, id: string, phone: string) {
  if (!phone) return badRequest("phone_required");

  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(id.toUpperCase())
    .first<OrderRow>();

  // Same answer for "no such order" and "wrong phone", so the endpoint cannot
  // be used to confirm that a reference exists. Both numbers go through the
  // same normalisation, so someone who checked out as `+20 109…` still finds
  // the order when they type `0109…` here.
  if (!order || egyptianPhone(order.phone) !== egyptianPhone(phone)) {
    return notFound("order_not_found");
  }

  const { results: items } = await env.DB.prepare(
    "SELECT * FROM order_items WHERE order_id = ?",
  )
    .bind(order.id)
    .all<OrderItemRow>();

  return json({
    id: order.id,
    status: order.status,
    createdAt: order.created_at,
    governorate: order.governorate,
    // present only once the parcel is with Bosta, so the page can link to it
    tracking: order.bosta_tracking,
    trackingUrl: order.bosta_tracking ? trackingUrl(order.bosta_tracking) : "",
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    items: items.map((i) => ({
      nameAr: i.name_ar,
      nameEn: i.name_en,
      image: i.image,
      size: i.size,
      color: i.color,
      qty: i.qty,
      price: i.price,
    })),
  });
}
