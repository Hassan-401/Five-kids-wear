import { Suspense, lazy, useEffect } from "react";
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
import Track from "./pages/Track";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import MenHome from "./pages/dept/MenHome";
import WomenHome from "./pages/dept/WomenHome";
import DeptListing from "./pages/dept/DeptListing";
import DeptProduct from "./pages/dept/DeptProduct";
import { useCatalog } from "./context/CatalogContext";
import { useLang } from "./i18n/LanguageContext";

// The dashboard is only ever opened by the shop owner, so it is split out of
// the storefront bundle and fetched on demand.
const AdminApp = lazy(() => import("./admin/AdminApp"));

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

/** /category/:slug — resolves the slug against the live categories, else 404. */
function CategoryPage() {
  const { slug = "" } = useParams();
  const { categories, ready } = useCatalog();
  const cat = categories.find((c) => c.slug === slug);

  // the catalogue may still be loading on a cold open of a deep link
  if (!cat) return ready ? <NotFound /> : null;
  if (cat.id === "offers" || cat.slug === "offers") return <Navigate to="/offers" replace />;

  return <Shop key={cat.id} fixedCategory={cat.id} />;
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

        {/* Men's + Women's departments — their own design system */}
        <Route path="men" element={<MenHome />} />
        <Route path="men/product/:slug" element={<DeptProduct dept="men" />} />
        <Route path="men/:sub" element={<DeptListing dept="men" />} />
        <Route path="women" element={<WomenHome />} />
        <Route path="women/product/:slug" element={<DeptProduct dept="women" />} />
        <Route path="women/:sub" element={<DeptListing dept="women" />} />

        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="track" element={<Track />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Legal kind="privacy" />} />
        <Route path="terms" element={<Legal kind="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* the dashboard renders outside the storefront chrome */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="grid min-h-dvh place-items-center">…</div>}>
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
