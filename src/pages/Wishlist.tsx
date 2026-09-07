import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import DeptProductCard from "../components/dept/DeptProductCard";
import Newsletter from "../components/Newsletter";
import { EmptyState } from "./Cart";
import { products } from "../data/catalog";
import { deptProducts } from "../data/departments";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";

export default function Wishlist() {
  const { t, pick } = useLang();
  const { wishlist } = useStore();

  const items = products.filter((p) => wishlist.includes(p.id));
  // men's / women's picks keep their own card design even in here
  const deptItems = deptProducts.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <PageHeader
        title={t("wishlist.title")}
        crumbs={[{ label: t("wishlist.title") }]}
      />

      <div className="container-x py-10">
        {items.length === 0 && deptItems.length === 0 ? (
          <EmptyState
            title={t("wishlist.empty")}
            sub={t("wishlist.emptySub")}
            cta={t("cart.continueShopping")}
          />
        ) : (
          <div className="flex flex-col gap-12">
            {items.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {deptItems.length > 0 && (
              <section>
                <h2 className="text-xl font-extrabold text-pink-600 mb-5">
                  {pick("رجالي ونسائي", "Men & Women")}
                </h2>
                <div className="dept dept-men grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 !bg-transparent">
                  {deptItems.map((p) => (
                    <DeptProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <Newsletter />
    </>
  );
}
