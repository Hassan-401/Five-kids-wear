import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  categories as seedCategories,
  governorates,
  products as seedProducts,
  type Category,
  type Product,
} from "../data/catalog";
import { api, type ShippingTable, type StoreSettings } from "../lib/api";

/**
 * The live catalogue.
 *
 * Products, categories and shipping rates all come from the database through
 * `/api/catalog`, so whatever the owner changes in the dashboard shows up here.
 * If that call fails — no worker running during `npm run dev`, or a blip — the
 * bundled seed in `src/data/catalog.ts` is used instead, and `live` is false.
 */
type CatalogValue = {
  products: Product[];
  categories: Category[];
  shipping: ShippingTable;
  settings: StoreSettings;
  /** False until the first fetch settles, so pages can hold off rendering. */
  ready: boolean;
  /** True when the data came from the API rather than the bundled seed. */
  live: boolean;
  getProduct: (slug: string) => Product | undefined;
  getRelated: (product: Product, limit?: number) => Product[];
  onSale: Product[];
  /** Shipping for one governorate, with the free-shipping rule applied. */
  shippingFor: (governorateEn: string, subtotal: number) => number;
  refresh: () => void;
};

const fallbackShipping: ShippingTable = {
  rates: governorates.map((g) => ({ ar: g.ar, en: g.en, price: 60 })),
  freeOver: 1000,
  default: 60,
};

const fallbackSettings: StoreSettings = {
  phone: "",
  email: "",
  whatsapp: "",
  codEnabled: true,
  ordersOpen: true,
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [shipping, setShipping] = useState<ShippingTable>(fallbackShipping);
  const [settings, setSettings] = useState<StoreSettings>(fallbackSettings);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    let cancelled = false;

    api
      .catalog()
      .then((data) => {
        if (cancelled) return;
        // an empty database means the catalogue has not been imported yet —
        // the seed stays on screen rather than showing an empty shop
        if (data.products.length) {
          setProducts(data.products);
          setCategories(data.categories);
          setLive(true);
        }
        setShipping(data.shipping);
        setSettings(data.settings);
      })
      .catch(() => {
        /* no API reachable — the seed above is already in state */
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [reloads]);

  const getProduct = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  );

  const getRelated = useCallback(
    (product: Product, limit = 4) =>
      products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
        .slice(0, limit),
    [products],
  );

  const shippingFor = useCallback(
    (governorateEn: string, subtotal: number) => {
      if (subtotal <= 0) return 0;
      if (shipping.freeOver > 0 && subtotal >= shipping.freeOver) return 0;
      const rate = shipping.rates.find((r) => r.en === governorateEn);
      return rate ? rate.price : shipping.default;
    },
    [shipping],
  );

  const value = useMemo<CatalogValue>(
    () => ({
      products,
      categories,
      shipping,
      settings,
      ready,
      live,
      getProduct,
      getRelated,
      onSale: products.filter((p) => p.oldPrice),
      shippingFor,
      refresh: () => setReloads((n) => n + 1),
    }),
    [products, categories, shipping, settings, ready, live, getProduct, getRelated, shippingFor],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return ctx;
}
