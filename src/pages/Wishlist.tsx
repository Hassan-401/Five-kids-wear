import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import Newsletter from "../components/Newsletter";
import { EmptyState } from "./Cart";
import { products } from "../data/catalog";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";

export default function Wishlist() {
  const { t } = useLang();
  const { wishlist } = useStore();

  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <PageHeader
        title={t("wishlist.title")}
        crumbs={[{ label: t("wishlist.title") }]}
      />

      <div className="container-x py-10">
        {items.length === 0 ? (
          <EmptyState
            title={t("wishlist.empty")}
            sub={t("wishlist.emptySub")}
            cta={t("cart.continueShopping")}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <Newsletter />
    </>
  );
}
