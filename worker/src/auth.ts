/**
 * Dashboard authentication.
 *
 * There are no customer accounts on this site — only the shop owner signs in.
 * Passwords are PBKDF2-SHA256, and the session cookie holds a random token
 * whose SHA-256 is what the database stores.
 */
import type { Env } from "./types";

const COOKIE = "fkw_admin";
// Workers' WebCrypto refuses PBKDF2 above 100,000 iterations, so this is the
// ceiling rather than a preference. `wrangler dev` does not enforce the cap,
// which is why it only shows up once deployed — do not raise it.
const ITERATIONS = 100_000;
const SESSION_DAYS = 14;

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/** Constant-time compare, so a wrong password leaks nothing through timing. */
function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    256,
  );
  return toHex(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toHex(salt.buffer)}$${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterations, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterations || !salt || !hash) return false;
  const check = await pbkdf2(password, fromHex(salt), Number(iterations));
  return sameSecret(check, hash);
}

async function sha256(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(value)));
}

/* ------------------------------------------------------------ sessions */

export async function createSession(env: Env, adminId: number): Promise<string> {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)).buffer);
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await env.DB.prepare(
    "INSERT INTO sessions (token_hash, admin_id, expires_at) VALUES (?, ?, ?)",
  )
    .bind(await sha256(token), adminId, expires.toISOString())
    .run();
  return token;
}

export type AdminSession = { adminId: number; username: string };

export async function readSession(request: Request, env: Env): Promise<AdminSession | null> {
  const token = readCookie(request, COOKIE);
  if (!token) return null;

  const row = await env.DB.prepare(
    `SELECT s.admin_id AS adminId, a.username AS username
       FROM sessions s
       JOIN admins a ON a.id = s.admin_id
      WHERE s.token_hash = ? AND s.expires_at > ?`,
  )
    .bind(await sha256(token), new Date().toISOString())
    .first<AdminSession>();

  return row ?? null;
}

export async function destroySession(request: Request, env: Env): Promise<void> {
  const token = readCookie(request, COOKIE);
  if (!token) return;
  await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?")
    .bind(await sha256(token))
    .run();
}

/** Housekeeping — expired rows are dropped whenever someone signs in. */
export async function purgeExpiredSessions(env: Env): Promise<void> {
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at <= ?")
    .bind(new Date().toISOString())
    .run();
}

/* ------------------------------------------------------------- cookies */

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=") || null;
  }
  return null;
}

/** `Secure` is dropped on http://localhost so `wrangler dev` can sign in too. */
export function sessionCookie(request: Request, token: string): string {
  const secure = new URL(request.url).protocol === "https:" ? " Secure;" : "";
  const maxAge = SESSION_DAYS * 86_400;
  return `${COOKIE}=${token}; Path=/; HttpOnly;${secure} SameSite=Strict; Max-Age=${maxAge}`;
}

export function clearCookie(request: Request): string {
  const secure = new URL(request.url).protocol === "https:" ? " Secure;" : "";
  return `${COOKIE}=; Path=/; HttpOnly;${secure} SameSite=Strict; Max-Age=0`;
}

/**
 * First-run bootstrap: with no accounts yet, the ADMIN_USERNAME /
 * ADMIN_PASSWORD secrets create one. After that the secrets are ignored and
 * the password can only be changed from the dashboard.
 */
export async function ensureFirstAdmin(env: Env): Promise<void> {
  const existing = await env.DB.prepare("SELECT COUNT(*) AS n FROM admins").first<{ n: number }>();
  if (existing && existing.n > 0) return;

  const username = env.ADMIN_USERNAME?.trim();
  const password = env.ADMIN_PASSWORD;
  if (!username || !password) return;

  await env.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)")
    .bind(username, await hashPassword(password))
    .run();
}
