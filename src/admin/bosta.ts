import { ApiError } from "../lib/api";

/**
 * Turns a failed Bosta call into a sentence the shop owner can act on.
 *
 * The Worker answers `{ error: "bosta_error", message }`, where `message` is
 * either one of our own codes or whatever Bosta itself said. Anything we do not
 * recognise is shown as-is, prefixed, rather than swallowed — Bosta's own
 * wording ("Invalid phone number") is usually the most useful thing available.
 */
export function bostaMessage(
  err: unknown,
  pick: (ar: string, en: string) => string,
): string {
  if (!(err instanceof ApiError)) {
    return pick("حصلت مشكلة غير متوقعة", "Something unexpected went wrong");
  }

  const code = String(err.details.message ?? err.code);

  const known: Record<string, string> = {
    bosta_key_missing: pick(
      "مفتاح بوسطة مش متسجّل على السيرفر",
      "The Bosta API key is not set on the server",
    ),
    bosta_disabled: pick(
      "فعّل بوسطة من صفحة الإعدادات الأول",
      "Turn Bosta on from the Settings page first",
    ),
    bosta_unreachable: pick(
      "مفيش اتصال بـ بوسطة دلوقتي، جرّب كمان شوية",
      "Could not reach Bosta right now, try again shortly",
    ),
    bosta_no_tracking_number: pick(
      "بوسطة قبلت الشحنة بس مردّتش برقم تتبع",
      "Bosta accepted the shipment but returned no tracking number",
    ),
    order_not_found: pick("الطلب ده مش موجود", "That order no longer exists"),
    order_already_shipped: pick(
      "الطلب ده اتشحن قبل كده",
      "This order has already been sent to Bosta",
    ),
    order_cancelled: pick("مينفعش تشحن طلب ملغي", "A cancelled order cannot be shipped"),
    governorate_not_mapped: pick(
      "المحافظة دي لسه مش مربوطة بمدينة في بوسطة — اظبطها من صفحة الشحن",
      "This governorate is not mapped to a Bosta city yet — set it on the Shipping page",
    ),
  };

  if (known[code]) return known[code];
  if (err.status === 401) {
    return pick(
      "بوسطة رفضت المفتاح — اتأكد إنه صح ولسه شغال",
      "Bosta rejected the API key — check that it is correct and still active",
    );
  }
  return pick(`بوسطة: ${code}`, `Bosta: ${code}`);
}
