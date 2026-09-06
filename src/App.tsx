import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import { categories, type CategoryId } from "./data/catalog";
import { useLang } from "./i18n/LanguageContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/** /category/:slug — resolves the slug to a known category, else 404. */
function CategoryPage() {
  const { slug = "" } = useParams();
  const cat = categories.find((c) => c.slug === slug);

  if (!cat) return <NotFound />;
  if (cat.id === "offers") return <Navigate to="/offers" replace />;

  return <Shop key={cat.id} fixedCategory={cat.id as CategoryId} />;
}

function OffersPage() {
  const { t } = useLang();
  return <Shop onlyOffers title={t("offers.title")} subtitle={t("offers.sub")} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="offers" element={<OffersPage />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Auth mode="login" />} />
        <Route path="register" element={<Auth mode="register" />} />
        <Route path="account" element={<Account />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Legal kind="privacy" />} />
        <Route path="terms" element={<Legal kind="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
