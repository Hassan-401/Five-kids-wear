/**
 * Five Kids Wear — the whole server.
 *
 * One Worker answers three kinds of request:
 *   /api/*    the storefront and dashboard API
 *   /media/*  product photos uploaded from the dashboard, out of R2
 *   anything else → the built SPA in `dist/` (ASSETS), falling back to
 *                   index.html so client-side routes work on a hard refresh.
 */
import { readSession, type AdminSession } from "./auth";
import * as admin from "./routes-admin";
import * as pub from "./routes-public";
import { bostaWebhook } from "./ship";
import type { Env } from "./types";
import { fail, json, notFound, str, unauthorized } from "./util";

type Ctx = {
  request: Request;
  env: Env;
  url: URL;
  params: Record<string, string>;
  session: AdminSession;
};

type Handler = (ctx: Ctx) => Promise<Response> | Response;

type Route = { method: string; pattern: string[]; handler: Handler; auth: boolean };

const route = (method: string, path: string, handler: Handler, auth = false): Route => ({
  method,
  pattern: path.split("/").filter(Boolean),
  handler,
  auth,
});

/** `:name` segments capture; everything else has to match exactly. */
function matchPath(pattern: string[], segments: string[]): Record<string, string> | null {
  if (pattern.length !== segments.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pattern.length; i++) {
    const part = pattern[i];
    if (part.startsWith(":")) params[part.slice(1)] = decodeURIComponent(segments[i]);
    else if (part !== segments[i]) return null;
  }
  return params;
}

const routes: Route[] = [
  /* ---------------------------------------------------------- public */
  route("GET", "/api/catalog", ({ env }) => pub.getCatalog(env)),
  route("GET", "/api/shipping", ({ env }) => pub.getShipping(env)),
  route("GET", "/api/products/:slug", ({ env, params }) => pub.getProduct(env, params.slug)),
  route("POST", "/api/orders", ({ request, env }) => pub.createOrder(request, env)),
  route("GET", "/api/orders/:id", ({ env, params, url }) =>
    pub.trackOrder(env, params.id, str(url.searchParams.get("phone"), 30)),
  ),

  // Bosta's callback. Not a dashboard route — Bosta has no session — so the
  // secret in the path is what stands in for authentication.
  route("POST", "/api/bosta/webhook/:secret", ({ request, env, params }) =>
    bostaWebhook(request, env, params.secret),
  ),

  /* ------------------------------------------------- dashboard: auth */
  route("POST", "/api/admin/login", ({ request, env }) => admin.login(request, env)),
  route("POST", "/api/admin/logout", ({ request, env }) => admin.logout(request, env)),
  route("GET", "/api/admin/me", ({ session }) => json({ username: session.username }), true),
  route(
    "POST",
    "/api/admin/password",
    ({ request, env, session }) => admin.changePassword(request, env, session),
    true,
  ),

  route("GET", "/api/admin/admins", ({ env, session }) => admin.listAdmins(env, session), true),
  route("POST", "/api/admin/admins", ({ request, env }) => admin.createAdmin(request, env), true),
  route(
    "DELETE",
    "/api/admin/admins/:id",
    ({ env, params, session }) => admin.deleteAdmin(env, params.id, session),
    true,
  ),

  /* ------------------------------------------------ dashboard: data */
  route("GET", "/api/admin/stats", ({ env }) => admin.getStats(env), true),

  route("GET", "/api/admin/products", ({ env }) => admin.listProducts(env), true),
  route("POST", "/api/admin/products", ({ request, env }) => admin.createProduct(request, env), true),
  route(
    "PATCH",
    "/api/admin/products/:id",
    ({ request, env, params }) => admin.updateProduct(request, env, params.id),
    true,
  ),
  route(
    "DELETE",
    "/api/admin/products/:id",
    ({ env, params }) => admin.deleteProduct(env, params.id),
    true,
  ),

  route("GET", "/api/admin/categories", ({ env }) => admin.listCategories(env), true),
  route(
    "POST",
    "/api/admin/categories",
    ({ request, env }) => admin.createCategory(request, env),
    true,
  ),
  route(
    "PATCH",
    "/api/admin/categories/:id",
    ({ request, env, params }) => admin.updateCategory(request, env, params.id),
    true,
  ),
  route(
    "DELETE",
    "/api/admin/categories/:id",
    ({ env, params }) => admin.deleteCategory(env, params.id),
    true,
  ),

  route("GET", "/api/admin/orders", ({ env, url }) => admin.listOrders(env, url), true),
  route("GET", "/api/admin/orders/:id", ({ env, params }) => admin.getOrder(env, params.id), true),
  route(
    "PATCH",
    "/api/admin/orders/:id",
    ({ request, env, params }) => admin.updateOrder(request, env, params.id),
    true,
  ),
  route(
    "DELETE",
    "/api/admin/orders/:id",
    ({ env, params }) => admin.deleteOrder(env, params.id),
    true,
  ),

  route("GET", "/api/admin/shipping", ({ env }) => admin.listShipping(env), true),
  route("PUT", "/api/admin/shipping", ({ request, env }) => admin.saveShipping(request, env), true),
  route(
    "DELETE",
    "/api/admin/shipping/:id",
    ({ env, params }) => admin.deleteShipping(env, params.id),
    true,
  ),

  route("GET", "/api/admin/settings", ({ env }) => admin.getSettings(env), true),
  route("PUT", "/api/admin/settings", ({ request, env }) => admin.saveSettings(request, env), true),

  route("GET", "/api/admin/bosta/cities", ({ env }) => admin.getBostaCities(env), true),
  route("GET", "/api/admin/bosta/pickups", ({ env }) => admin.getBostaPickups(env), true),
  route(
    "POST",
    "/api/admin/orders/:id/ship",
    ({ env, params }) => admin.shipWithBosta(env, params.id),
    true,
  ),

  route("POST", "/api/admin/upload", ({ request, env }) => admin.uploadMedia(request, env), true),
  route("POST", "/api/admin/seed", ({ env }) => admin.runSeed(env), true),
];

/** Serves an uploaded photo straight out of R2. Keys are unique, so it caches. */
async function serveMedia(request: Request, env: Env, key: string): Promise<Response> {
  if (!key) return notFound();
  const object = await env.MEDIA.get(key);
  if (!object) return notFound("media_not_found");

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  if (request.headers.get("if-none-match") === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(object.body, { headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith("/media/")) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return fail(405, "method_not_allowed");
      }
      return serveMedia(request, env, decodeURIComponent(path.slice("/media/".length)));
    }

    if (path.startsWith("/api/")) {
      const segments = path.split("/").filter(Boolean);
      let pathMatched = false;

      for (const r of routes) {
        const params = matchPath(r.pattern, segments);
        if (!params) continue;
        pathMatched = true;
        if (r.method !== request.method) continue;

        // one gate for every dashboard route, so a new route cannot forget it
        let session: AdminSession = { adminId: 0, username: "" };
        if (r.auth) {
          const found = await readSession(request, env);
          if (!found) return unauthorized();
          session = found;
        }

        try {
          return await r.handler({ request, env, url, params, session });
        } catch (err) {
          console.error("route failed", path, err);
          return fail(500, "server_error");
        }
      }

      return pathMatched ? fail(405, "method_not_allowed") : notFound("unknown_endpoint");
    }

    // everything else is the SPA: real files, else index.html
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
