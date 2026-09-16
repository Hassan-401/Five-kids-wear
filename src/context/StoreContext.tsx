import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Purchasable } from "../data/catalog";
import { deptProducts } from "../data/departments";
import { useCatalog } from "./CatalogContext";

/**
 * The shopper's own state: cart and wishlist, kept in `localStorage`.
 *
 * There are no customer accounts on this site — an order is placed with a name,
 * a phone number and an address, and is followed afterwards from `/track`.
 */

export type CartLine = {
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
};

type StoreValue = {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Purchasable, size: string, color: string, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  lineProduct: (line: CartLine) => Purchasable | undefined;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const StoreContext = createContext<StoreValue | null>(null);

function usePersisted<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage unavailable — the cart still works for this visit */
    }
  }, [key, state]);

  return [state, setState] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog();
  const [cart, setCart] = usePersisted<CartLine[]>("fkw.cart", []);
  const [wishlist, setWishlist] = usePersisted<string[]>("fkw.wishlist", []);

  /** Kids + men's + women's in one list, so a cart line can point at any of them. */
  const everything = useMemo<Purchasable[]>(
    () => [...products, ...deptProducts],
    [products],
  );

  const lineProduct = useCallback(
    (line: CartLine) => everything.find((p) => p.id === line.productId),
    [everything],
  );

  const addToCart = useCallback(
    (product: Purchasable, size: string, color: string, qty = 1) => {
      const key = `${product.id}|${size}|${color}`;
      setCart((prev) => {
        const found = prev.find((l) => l.key === key);
        if (found) {
          return prev.map((l) =>
            l.key === key ? { ...l, qty: Math.min(l.qty + qty, 20) } : l,
          );
        }
        return [...prev, { key, productId: product.id, size, color, qty }];
      });
    },
    [setCart],
  );

  const updateQty = useCallback(
    (key: string, qty: number) =>
      setCart((prev) =>
        prev
          .map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(qty, 20)) } : l))
          .filter((l) => l.qty > 0),
      ),
    [setCart],
  );

  const removeLine = useCallback(
    (key: string) => setCart((prev) => prev.filter((l) => l.key !== key)),
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleWishlist = useCallback(
    (productId: string) =>
      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      ),
    [setWishlist],
  );

  const value = useMemo<StoreValue>(() => {
    // a line whose product has since been deleted contributes nothing and is
    // skipped in the UI as well
    const subtotal = cart.reduce((sum, line) => {
      const p = everything.find((x) => x.id === line.productId);
      return sum + (p ? p.price * line.qty : 0);
    }, 0);

    return {
      cart,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      subtotal,
      addToCart,
      updateQty,
      removeLine,
      clearCart,
      lineProduct,
      wishlist,
      toggleWishlist,
      isWishlisted: (id: string) => wishlist.includes(id),
    };
  }, [
    cart,
    everything,
    wishlist,
    addToCart,
    updateQty,
    removeLine,
    clearCart,
    lineProduct,
    toggleWishlist,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
