import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryGrid, { SectionTitle } from "../components/CategoryGrid";
import PromoSlider from "../components/PromoSlider";
import ProductsMarquee from "../components/ProductsMarquee";
import ProductCard from "../components/ProductCard";
import FeatureStrip from "../components/FeatureStrip";
import Newsletter from "../components/Newsletter";
import { products } from "../data/catalog";
import { useLang } from "../i18n/LanguageContext";
import { ArrowRight } from "../components/Icons";

export default function Home() {
  const { t } = useLang();

  const latest = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const bestSellers = [...products]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProductsMarquee />
      <PromoSlider />

      <section className="container-x py-10 sm:py-14">
        <SectionTitle action={<ViewAll to="/shop" label={t("common.viewAll")} />}>
          {t("products.latest")}
        </SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <FeatureStrip />

      <section className="container-x py-12 sm:py-16">
        <SectionTitle action={<ViewAll to="/shop" label={t("common.viewAll")} />}>
          {t("products.bestSellers")}
        </SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

function ViewAll({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 font-bold text-pink-600 hover:text-pink-700 hover:gap-2.5 transition-all"
    >
      {label}
      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
    </Link>
  );
}
