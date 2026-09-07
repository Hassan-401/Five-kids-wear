import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Purchasable } from "../data/catalog";
import { deptProducts } from "../data/departments";

/** Kids + men's + women's catalogues in one list, so a cart line can point at
 *  any of them. Each section still filters its own catalogue for browsing. */
const everything: Purchasable[] = [...products, ...deptProducts];

export type CartLine = {
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: "processing" | "shipped" | "delivered";
  items: { name: string; qty: number; price: number; image: string }[];
};

export type DemoUser = { name: string; email: string };

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

  orders: Order[];
  placeOrder: (total: number) => Order;

  user: DemoUser | null;
  signIn: (user: DemoUser) => void;
  signOut: () => void;
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
      /* storage unavailable — demo keeps working in memory */
    }
  }, [key, state]);

  return [state, setState] as const;
}

const demoOrders: Order[] = [
  {
    id: "FKW-10248",
    date: "2026-08-24",
    total: 1290,
    status: "delivered",
    items: [
      {
        name: "Lovely Bear",
        qty: 2,
        price: 390,
        image: "/images/products/lovely-bear.png",
      },
      {
        name: "Little Boss",
        qty: 1,
        price: 460,
        image: "/images/products/little-boss.png",
      },
    ],
  },
  {
    id: "FKW-10312",
    date: "2026-09-01",
    total: 850,
    status: "shipped",
    items: [
      {
        name: "Dino Dream",
        qty: 1,
        price: 380,
        image: "/images/products/dino-dream.png",
      },
      {
        name: "Sweet Bloom",
        qty: 1,
        price: 430,
        image: "/images/products/sweet-bloom.png",
      },
    ],
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersisted<CartLine[]>("fkw.cart", []);
  const [wishlist, setWishlist] = usePersisted<string[]>("fkw.wishlist", []);
  const [orders, setOrders] = usePersisted<Order[]>("fkw.orders", demoOrders);
  const [user, setUser] = usePersisted<DemoUser | null>("fkw.user", null);

  const lineProduct = useCallback(
    (line: CartLine) => everything.find((p) => p.id === line.productId),
    [],
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

  const placeOrder = useCallback(
    (total: number) => {
      const order: Order = {
        id: `FKW-${Math.floor(10000 + Math.random() * 89999)}`,
        date: new Date().toISOString().slice(0, 10),
        total,
        status: "processing",
        items: cart.map((line) => {
          const p = lineProduct(line);
          return {
            name: p?.nameEn ?? "Product",
            qty: line.qty,
            price: p?.price ?? 0,
            image: p?.image ?? "",
          };
        }),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart, lineProduct, setOrders, setCart],
  );

  const value = useMemo<StoreValue>(() => {
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
      orders,
      placeOrder,
      user,
      signIn: (u: DemoUser) => setUser(u),
      signOut: () => setUser(null),
    };
  }, [
    cart,
    wishlist,
    orders,
    user,
    addToCart,
    updateQty,
    removeLine,
    clearCart,
    lineProduct,
    toggleWishlist,
    placeOrder,
    setUser,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
