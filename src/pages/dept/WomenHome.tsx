import { Link } from "react-router-dom";
import DeptShell from "../../components/dept/DeptShell";
import DeptProductCard from "../../components/dept/DeptProductCard";
import useReveal from "../../components/dept/useReveal";
import { useLang } from "../../i18n/LanguageContext";
import {
  departments,
  deptProductsOf,
  sortDeptProducts,
} from "../../data/departments";
import { ArrowRight } from "../../components/Icons";

const meta = departments.women;

/** Women's landing page — categories and new arrivals, nothing else. */
export default function WomenHome() {
  const { pick } = useLang();
  const rootRef = useReveal<HTMLDivElement>();

  const newIn = sortDeptProducts(deptProductsOf("women"), "newest").slice(0, 8);

  return (
    <DeptShell dept="women">
      <div ref={rootRef}>
        {/* -------------------------------------------------- subcategories */}
        <section className="dept-wrap pt-12 pb-14 lg:pt-16 lg:pb-20">
          <header className="text-center max-w-2xl mx-auto mb-11">
            <span className="dept-eyebrow">{pick("الأقسام", "Categories")}</span>
            <h2 className="dept-h2 mt-4 text-3xl sm:text-[2.4rem]">
              {pick("تصفّحي التشكيلة", "Browse the collection")}
            </h2>
            <hr className="dept-rule w-20 mx-auto mt-6" />
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {meta.subs.map((sub) => (
              <Link
                key={sub.slug}
                to={`/women/${sub.slug}`}
                className="dept-reveal group text-center"
              >
                <div className="dept-tile dept-arch aspect-[3/4]">
                  <img src={sub.image} alt="" aria-hidden="true" />
                </div>
                <h3
                  className="mt-5 text-lg sm:text-xl"
                  style={{ fontFamily: "var(--d-font-head)" }}
                >
                  {pick(sub.name.ar, sub.name.en)}
                </h3>
                <p className="text-xs mt-1.5" style={{ color: "var(--d-muted)" }}>
                  {pick(sub.blurb.ar, sub.blurb.en)}
                </p>
                <span className="mt-3 inline-block text-[0.68rem] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-70 transition">
                  {pick("تسوّقي", "Shop")}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- new in */}
        <section
          className="dept-wrap py-14 lg:py-16 border-t"
          style={{ borderColor: "var(--d-line)" }}
        >
          <header className="text-center mb-10">
            <span className="dept-eyebrow">{pick("وصل حديثاً", "New in")}</span>
            <h2 className="dept-h2 mt-4 text-3xl sm:text-4xl">
              {pick("أحدث القطع", "Latest arrivals")}
            </h2>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {newIn.map((p) => (
              <div key={p.id} className="dept-reveal">
                <DeptProductCard product={p} />
              </div>
            ))}
          </div>

          <div className="mt-11 text-center">
            <Link to="/women/dresses" className="dept-link">
              {pick("عرض الكل", "View all")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </section>
      </div>
    </DeptShell>
  );
}
