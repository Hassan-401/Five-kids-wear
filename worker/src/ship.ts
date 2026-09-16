/**
 * Orders ↔ Bosta, in both directions.
 *
 * `shipOrder` is the only place that turns a row in `orders` into a real
 * shipment, so the dashboard button and the optional auto-ship behave
 * identically and an order can never be booked twice. `bostaWebhook` is the
 * way back: Bosta calls it as the parcel moves.
 */
import {
  BostaError,
  createShipment,
  statusForState,
  trackingUrl,
  type Shipment,
} from "./bosta";
import type { Env, OrderItemRow, OrderRow } from "./types";
import { json, str, unauthorized } from "./util";

export type ShipResult = Shipment & { url: string };

/**
 * Books one order with Bosta and records the tracking number.
 *
 * Throws `BostaError` with a code the dashboard turns into a readable message:
 * `bosta_disabled`, `order_not_found`, `order_already_shipped`,
 * `governorate_not_mapped`, plus anything Bosta itself reports.
 */
export async function shipOrder(env: Env, orderId: string): Promise<ShipResult> {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(orderId)
    .first<OrderRow>();
  if (!order) throw new BostaError("order_not_found", 404);

  // the tracking number is the lock: a booked order is never booked again
  if (order.bosta_tracking) throw new BostaError("order_already_shipped", 409);
  if (order.status === "cancelled") throw new BostaError("order_cancelled", 409);

  const rate = await env.DB.prepare(
    "SELECT bosta_city FROM shipping_rates WHERE name_en = ?",
  )
    .bind(order.governorate)
    .first<{ bosta_city: string }>();

  // Bosta addresses a shipment by city id, not by the name we store
  if (!rate?.bosta_city) throw new BostaError("governorate_not_mapped", 400);

  const { results: items } = await env.DB.prepare(
    "SELECT * FROM order_items WHERE order_id = ?",
  )
    .bind(order.id)
    .all<OrderItemRow>();

  const settings = await env.DB.prepare(
    "SELECT key, value FROM settings WHERE key IN ('bosta_pickup','bosta_enabled')",
  ).all<{ key: string; value: string }>();
  const map = Object.fromEntries(settings.results.map((r) => [r.key, r.value]));
  if (map.bosta_enabled !== "1") throw new BostaError("bosta_disabled", 400);

  const shipment = await createShipment(env, {
    reference: order.id,
    cityId: rate.bosta_city,
    address: order.address,
    name: order.name,
    phone: order.phone,
    email: order.email,
    // anything other than cash on delivery is already paid for, so collect nothing
    cod: order.payment === "cod" ? order.total : 0,
    itemsCount: items.reduce((n, i) => n + i.qty, 0) || 1,
    description: items.map((i) => `${i.name_ar} ×${i.qty}`).join(", ") || "ملابس أطفال",
    notes: order.notes,
    pickupLocationId: map.bosta_pickup ?? "",
  });

  await env.DB.prepare(
    `UPDATE orders SET bosta_id = ?, bosta_tracking = ?, bosta_state = '',
       status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END,
       updated_at = datetime('now')
     WHERE id = ?`,
  )
    .bind(shipment.id, shipment.trackingNumber, order.id)
    .run();

  return { ...shipment, url: trackingUrl(shipment.trackingNumber) };
}

/* ------------------------------------------------------------- webhook */

/** Bosta nests the shipment differently per event, so look in every place. */
function pick(body: Record<string, unknown>, keys: string[]): string {
  const nested = (body.data ?? body.delivery ?? body.shipment ?? {}) as Record<string, unknown>;
  for (const key of keys) {
    const value = body[key] ?? nested[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

/**
 * Bosta's callback as a parcel moves.
 *
 * Bosta does not sign its webhooks, so the shared secret sits in the URL and is
 * compared here; without that this endpoint would let anyone on the internet
 * mark orders delivered. Unknown tracking numbers and unmapped states answer
 * 200 on purpose — Bosta retries anything else, and neither is our problem.
 */
export async function bostaWebhook(request: Request, env: Env, secret: string) {
  const expected = env.BOSTA_WEBHOOK_SECRET?.trim();
  if (!expected || secret !== expected) return unauthorized();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json({ ok: true, ignored: "unreadable_body" });

  const tracking = pick(body, ["trackingNumber", "tracking_number", "trackingNo"]);
  const state = pick(body, ["state", "newState", "status", "currentStatus", "stateName"]);
  if (!tracking) return json({ ok: true, ignored: "no_tracking_number" });

  const order = await env.DB.prepare("SELECT id, status FROM orders WHERE bosta_tracking = ?")
    .bind(tracking)
    .first<{ id: string; status: string }>();
  // a shipment booked outside this site is not an error and never will be one,
  // so it gets a 200 rather than a 404 Bosta would retry forever
  if (!order) return json({ ok: true, ignored: "unknown_tracking_number" });

  const status = statusForState(state);

  // the reported state is always recorded; the order's own status only moves
  // when Bosta reports one of the states the storefront timeline knows about
  await env.DB.prepare(
    `UPDATE orders SET bosta_state = ?,
       status = COALESCE(NULLIF(?, ''), status),
       updated_at = datetime('now')
     WHERE id = ?`,
  )
    .bind(str(state, 60), status ?? "", order.id)
    .run();

  return json({ ok: true, order: order.id, status: status ?? order.status });
}
