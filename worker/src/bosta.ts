/**
 * Bosta — the courier that carries every order.
 *
 * Shapes were taken from Bosta's own Node SDK and checked against the live v0
 * API: the key goes in a bare `Authorization` header (no `Bearer` prefix),
 * `GET /cities` answers with a plain array, and the other endpoints wrap their
 * payload in `{ success, message, data }`.
 *
 * Nothing in here runs unless the owner turns Bosta on in the dashboard and
 * the BOSTA_API_KEY secret is set, so the store works perfectly well without it.
 */
import type { Env } from "./types";

const BASE = "https://app.bosta.co/api/v0";

/** `deliveryTypes.PACKAGE_DELIVERY` in Bosta's SDK — a normal forward shipment. */
const FORWARD = 10;

/** Where a customer can follow the shipment themselves. */
export const trackingUrl = (trackingNumber: string) =>
  `https://bosta.co/ar-eg/tracking-shipments?tracking_number=${encodeURIComponent(trackingNumber)}`;

/** Carries Bosta's own message through to the dashboard, which displays it. */
export class BostaError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "BostaError";
    this.status = status;
  }
}

async function call<T>(
  env: Env,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const key = env.BOSTA_API_KEY?.trim();
  if (!key) throw new BostaError("bosta_key_missing", 400);

  let res: Response;
  try {
    res = await fetch(`${BASE}/${path}`, {
      method,
      headers: {
        authorization: key,
        "content-type": "application/json",
        "x-requested-by": "five-kids-wear",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new BostaError("bosta_unreachable");
  }

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    /* Bosta answered with something that is not JSON — handled below */
  }

  if (!res.ok) {
    const message =
      (parsed as { message?: string } | null)?.message ?? `bosta_http_${res.status}`;
    // 401/403 mean the key is wrong; anything else is Bosta's problem, not ours
    throw new BostaError(message, res.status === 401 || res.status === 403 ? 401 : 502);
  }

  // `/cities` returns a bare array; the rest use the { success, data } envelope
  if (Array.isArray(parsed)) return parsed as T;
  const envelope = parsed as { success?: boolean; message?: string; data?: T } | null;
  if (envelope?.success === false) throw new BostaError(envelope.message ?? "bosta_failed");
  return (envelope?.data ?? envelope) as T;
}

/* --------------------------------------------------------------- cities */

export type BostaCity = { id: string; name: string; nameAr: string; sector: number };

type CityRow = {
  _id: string;
  name: string;
  nameAr?: string;
  alias?: string;
  sector?: number;
  dropOffAvailability?: boolean;
};

/** Every city Bosta will deliver to, for the mapping table on the Shipping page. */
export async function listCities(env: Env): Promise<BostaCity[]> {
  const rows = await call<CityRow[]>(env, "GET", "cities");
  return rows
    .filter((c) => c.dropOffAvailability !== false)
    .map((c) => ({
      id: c._id,
      name: c.name,
      nameAr: c.nameAr ?? c.alias ?? c.name,
      sector: c.sector ?? 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* ------------------------------------------------------ pickup locations */

export type BostaPickup = { id: string; name: string; address: string };

type PickupRow = {
  _id: string;
  locationName?: string;
  isDefault?: boolean;
  address?: { firstLine?: string; city?: { name?: string }; zone?: { name?: string } };
};

export async function listPickupLocations(env: Env): Promise<BostaPickup[]> {
  const rows = await call<PickupRow[]>(env, "GET", "pickup-locations");
  return (rows ?? []).map((p) => ({
    id: p._id,
    name: p.locationName || "—",
    address: [p.address?.city?.name, p.address?.zone?.name, p.address?.firstLine]
      .filter(Boolean)
      .join(" — "),
  }));
}

/* ------------------------------------------------------------ shipments */

/**
 * Egyptian mobile numbers, the way Bosta wants them: `01XXXXXXXXX`.
 * Shoppers type `+20 10…`, `0020…` and `10…` about as often as the plain form.
 */
export function egyptianPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("0020")) digits = digits.slice(4);
  else if (digits.startsWith("20") && digits.length > 11) digits = digits.slice(2);
  if (!digits.startsWith("0")) digits = `0${digits}`;
  return digits;
}

/** Bosta wants a first and a last name; most shoppers type one full name. */
function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() ?? "-";
  return { firstName, lastName: parts.join(" ") || firstName };
}

export type ShipmentInput = {
  reference: string;
  cityId: string;
  address: string;
  name: string;
  phone: string;
  email: string;
  /** Cash to collect on delivery — 0 for an order already paid for. */
  cod: number;
  itemsCount: number;
  description: string;
  notes: string;
  pickupLocationId: string;
};

export type Shipment = { id: string; trackingNumber: string };

export async function createShipment(env: Env, input: ShipmentInput): Promise<Shipment> {
  const { firstName, lastName } = splitName(input.name);

  const created = await call<{ _id: string; trackingNumber: string }>(
    env,
    "POST",
    "deliveries",
    {
      type: FORWARD,
      businessReference: input.reference,
      cod: Math.max(0, Math.round(input.cod)),
      specs: {
        packageType: "Parcel",
        packageDetails: {
          itemsCount: Math.max(1, Math.round(input.itemsCount)),
          description: input.description.slice(0, 200),
        },
      },
      dropOffAddress: {
        city: input.cityId,
        firstLine: input.address.slice(0, 250),
      },
      receiver: {
        firstName,
        lastName,
        phone: egyptianPhone(input.phone),
        ...(input.email ? { email: input.email } : {}),
      },
      ...(input.notes ? { notes: input.notes.slice(0, 200) } : {}),
      ...(input.pickupLocationId ? { pickupLocationId: input.pickupLocationId } : {}),
    },
  );

  if (!created?.trackingNumber) throw new BostaError("bosta_no_tracking_number");
  return { id: created._id ?? "", trackingNumber: created.trackingNumber };
}

/** Cancels a shipment Bosta has not collected yet. */
export async function terminateShipment(env: Env, deliveryId: string): Promise<void> {
  await call(env, "DELETE", `deliveries/${encodeURIComponent(deliveryId)}`);
}

/* --------------------------------------------------------------- states */

/**
 * Bosta reports twenty-odd states; the storefront timeline has four. Anything
 * unlisted (`Exception`, `Investigation`) deliberately maps to nothing, so a
 * hiccup mid-transit does not move the order backwards on the customer's page.
 */
const STATE_MAP: Record<string, "confirmed" | "shipped" | "delivered" | "cancelled"> = {
  "pickup requested": "confirmed",
  "waiting for route": "confirmed",
  "route assigned": "confirmed",
  "waiting for pickup": "confirmed",
  "picking up": "confirmed",
  "arrived at business": "confirmed",
  "picked up": "shipped",
  "picked up from business": "shipped",
  "picking up from warehouse": "shipped",
  "received at warehouse": "shipped",
  "in transit between hubs": "shipped",
  delivering: "shipped",
  "arrived at customer": "shipped",
  delivered: "delivered",
  "delivery confirmed": "delivered",
  canceled: "cancelled",
  cancelled: "cancelled",
  terminated: "cancelled",
  "returned to business": "cancelled",
  lost: "cancelled",
  damaged: "cancelled",
};

export function statusForState(state: string): string | null {
  return STATE_MAP[state.trim().toLowerCase()] ?? null;
}
