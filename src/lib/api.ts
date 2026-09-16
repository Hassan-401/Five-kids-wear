/**
 * The browser's half of the API.
 *
 * Every call is same-origin (`/api/...`) — in production the Worker serves both
 * the SPA and the API, and in `npm run dev` Vite proxies `/api` to
 * `wrangler dev`. Dashboard calls carry the session cookie automatically.
 */

export class ApiError extends Error {
  status: number;
  code: string;
  details: Record<string, unknown>;

  constructor(status: number, code: string, details: Record<string, unknown> = {}) {
    super(code);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "same-origin",
    ...init,
    headers: {
      ...(init.body && !(init.body instanceof FormData)
        ? { "content-type": "application/json" }
        : {}),
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  const body = text ? safeParse(text) : {};

  if (!res.ok) {
    const { error, ...details } = (body ?? {}) as { error?: string };
    throw new ApiError(res.status, error ?? `http_${res.status}`, details);
  }
  return body as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

const get = <T>(path: string) => request<T>(path);
const send = <T>(method: string, path: string, body?: unknown) =>
  request<T>(path, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

/* ------------------------------------------------------------- shapes */

export type ApiSwatch = { nameAr: string; nameEn: string; hex: string };

export type ApiProduct = {
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
  colors: ApiSwatch[];
  isNew?: boolean;
  inStock: boolean;
  popularity: number;
  createdAt: string;
};

export type AdminProduct = ApiProduct & { categoryId: string; active: boolean };

export type ApiCategory = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  tint: string;
  photo?: boolean;
};

export type AdminCategory = ApiCategory & { sort: number; active: boolean; products: number };

export type ShippingRate = { ar: string; en: string; price: number };

export type ShippingTable = { rates: ShippingRate[]; freeOver: number; default: number };

export type AdminShippingRate = {
  id: number;
  nameAr: string;
  nameEn: string;
  price: number;
  active: boolean;
  sort: number;
  /** Bosta's city id. Empty means this destination cannot be auto-shipped. */
  bostaCity: string;
};

export type StoreSettings = {
  phone: string;
  email: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  codEnabled: boolean;
  ordersOpen: boolean;
};

export type CatalogResponse = {
  categories: ApiCategory[];
  products: ApiProduct[];
  shipping: ShippingTable;
  settings: StoreSettings;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderLineInput = {
  productId: string;
  size: string;
  color: string;
  qty: number;
};

export type OrderInput = {
  name: string;
  phone: string;
  email?: string;
  governorate: string;
  address: string;
  notes?: string;
  payment: string;
  items: OrderLineInput[];
};

export type OrderItem = {
  nameAr: string;
  nameEn: string;
  slug?: string;
  image: string;
  size: string;
  color: string;
  qty: number;
  price: number;
};

export type TrackedOrder = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  governorate: string;
  /** Bosta's tracking number, once the parcel has been handed over. */
  tracking: string;
  trackingUrl: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: OrderItem[];
};

export type AdminOrderSummary = {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  total: number;
  status: OrderStatus;
  payment: string;
  tracking: string;
  createdAt: string;
};

export type AdminOrder = AdminOrderSummary & {
  email: string;
  address: string;
  notes: string;
  subtotal: number;
  shipping: number;
  trackingUrl: string;
  /** Bosta's own wording for where the parcel is, e.g. "Out for delivery". */
  bostaState: string;
  updatedAt: string;
  items: OrderItem[];
};

/* --------------------------------------------------------------- Bosta */

export type BostaCity = { id: string; name: string; nameAr: string; sector: number };
export type BostaPickup = { id: string; name: string; address: string };
export type Shipment = { id: string; trackingNumber: string; url: string };

/** A dashboard account. There are no roles — every admin can do everything. */
export type AdminUser = {
  id: number;
  username: string;
  createdAt: string;
  /** True for the account you are signed in as, which cannot delete itself. */
  you: boolean;
};

export type AdminStats = {
  orders: number;
  revenue: number;
  products: number;
  outOfStock: number;
  byStatus: Partial<Record<OrderStatus, number>>;
  recent: { id: string; name: string; total: number; status: OrderStatus; createdAt: string }[];
};

/** The editable half of a product — what the dashboard form submits. */
export type ProductDraft = {
  slug?: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  oldPrice: number | null;
  categoryId: string;
  gender: string;
  sizes: string[];
  colors: ApiSwatch[];
  images: string[];
  isNew: boolean;
  inStock: boolean;
  popularity: number;
  active: boolean;
};

export type CategoryDraft = {
  slug?: string;
  nameAr: string;
  nameEn: string;
  image: string;
  tint: string;
  photo: boolean;
  sort: number;
  active: boolean;
};

/* ------------------------------------------------------------ requests */

export const api = {
  catalog: () => get<CatalogResponse>("/catalog"),
  shipping: () => get<ShippingTable>("/shipping"),
  product: (slug: string) => get<ApiProduct>(`/products/${encodeURIComponent(slug)}`),

  createOrder: (order: OrderInput) =>
    send<{ id: string; subtotal: number; shipping: number; total: number }>(
      "POST",
      "/orders",
      order,
    ),

  trackOrder: (id: string, phone: string) =>
    get<TrackedOrder>(
      `/orders/${encodeURIComponent(id)}?phone=${encodeURIComponent(phone)}`,
    ),

  admin: {
    login: (username: string, password: string) =>
      send<{ username: string }>("POST", "/admin/login", { username, password }),
    logout: () => send<{ ok: true }>("POST", "/admin/logout"),
    me: () => get<{ username: string }>("/admin/me"),
    changePassword: (current: string, next: string) =>
      send<{ ok: true }>("POST", "/admin/password", { current, next }),

    admins: () => get<{ admins: AdminUser[] }>("/admin/admins"),
    createAdmin: (username: string, password: string) =>
      send<{ id: number; username: string }>("POST", "/admin/admins", { username, password }),
    deleteAdmin: (id: number) => send<{ ok: true }>("DELETE", `/admin/admins/${id}`),

    stats: () => get<AdminStats>("/admin/stats"),

    products: () => get<{ products: AdminProduct[] }>("/admin/products"),
    createProduct: (draft: ProductDraft) =>
      send<{ id: string; slug: string }>("POST", "/admin/products", draft),
    updateProduct: (id: string, draft: Partial<ProductDraft>) =>
      send<{ id: string; slug: string }>("PATCH", `/admin/products/${id}`, draft),
    deleteProduct: (id: string) => send<{ ok: true }>("DELETE", `/admin/products/${id}`),

    categories: () => get<{ categories: AdminCategory[] }>("/admin/categories"),
    createCategory: (draft: CategoryDraft) =>
      send<{ id: string; slug: string }>("POST", "/admin/categories", draft),
    updateCategory: (id: string, draft: Partial<CategoryDraft>) =>
      send<{ id: string; slug: string }>("PATCH", `/admin/categories/${id}`, draft),
    deleteCategory: (id: string) => send<{ ok: true }>("DELETE", `/admin/categories/${id}`),

    orders: (params: { status?: string; q?: string } = {}) => {
      const search = new URLSearchParams();
      if (params.status) search.set("status", params.status);
      if (params.q) search.set("q", params.q);
      const qs = search.toString();
      return get<{ orders: AdminOrderSummary[] }>(`/admin/orders${qs ? `?${qs}` : ""}`);
    },
    order: (id: string) => get<AdminOrder>(`/admin/orders/${encodeURIComponent(id)}`),
    updateOrder: (id: string, patch: { status?: OrderStatus; notes?: string }) =>
      send<{ ok: true }>("PATCH", `/admin/orders/${encodeURIComponent(id)}`, patch),
    deleteOrder: (id: string) =>
      send<{ ok: true }>("DELETE", `/admin/orders/${encodeURIComponent(id)}`),

    shipping: () =>
      get<{ rates: AdminShippingRate[]; freeOver: number; default: number }>("/admin/shipping"),
    saveShipping: (body: {
      rates: {
        id?: number;
        nameAr?: string;
        nameEn?: string;
        price: number;
        active: boolean;
        bostaCity?: string;
      }[];
      freeOver?: number;
      default?: number;
    }) =>
      send<{ rates: AdminShippingRate[]; freeOver: number; default: number }>(
        "PUT",
        "/admin/shipping",
        body,
      ),
    deleteShippingRate: (id: number) => send<{ ok: true }>("DELETE", `/admin/shipping/${id}`),

    settings: () => get<{ settings: Record<string, string> }>("/admin/settings"),
    saveSettings: (settings: Record<string, string | boolean>) =>
      send<{ settings: Record<string, string> }>("PUT", "/admin/settings", settings),

    /** Uploads one photo and returns the path to store on the product. */
    upload: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return request<{ url: string; key: string }>("/admin/upload", {
        method: "POST",
        body: form,
      });
    },

    seed: () => send<{ products: number; categories: number }>("POST", "/admin/seed"),

    /** Bosta. Each of these fails with `bosta_error` + a `message` from Bosta. */
    bostaCities: () => get<{ cities: BostaCity[] }>("/admin/bosta/cities"),
    bostaPickups: () => get<{ pickups: BostaPickup[] }>("/admin/bosta/pickups"),
    shipOrder: (id: string) =>
      send<Shipment>("POST", `/admin/orders/${encodeURIComponent(id)}/ship`),
  },
};
