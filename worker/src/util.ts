/** Small helpers shared by every route. */

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  // the API is same-origin with the SPA, so nothing here should be cached
  "cache-control": "no-store",
};

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers ?? {}) },
  });
}

export function fail(status: number, error: string, extra: Record<string, unknown> = {}) {
  return json({ error, ...extra }, { status });
}

export const badRequest = (error = "bad_request", extra: Record<string, unknown> = {}) =>
  fail(400, error, extra);
export const unauthorized = (error = "unauthorized") => fail(401, error);
export const notFound = (error = "not_found") => fail(404, error);

/** Reads a JSON body, returning `null` rather than throwing on bad input. */
export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as T) : null;
  } catch {
    return null;
  }
}

/* --------------------------------------------------------- validation */

export function str(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Whole pounds, never negative. Rejects NaN and Infinity. */
export function money(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : fallback;
}

export function bool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") return value === "1" || value === "true";
  return fallback;
}

export function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * URL-safe slug. Arabic letters are kept as they are — D1 stores UTF-8 and the
 * router encodes the path — so an Arabic-only name still produces a slug.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

/** Order references read as FKW-10248 — short enough to give over the phone. */
export function newOrderId(): string {
  const n = 10000 + Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] % 89999);
  return `FKW-${n}`;
}

export const nowIso = () => new Date().toISOString().replace("T", " ").slice(0, 19);
