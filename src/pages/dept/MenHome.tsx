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

const meta = departments.men;

/** Men's landing page — categories and new arrivals, nothing else. */
export default function MenHome() {
  const { pick } = useLang();
  const rootRef = useReveal<HTMLDivElement>();

  const newIn = sortDeptProducts(deptProductsOf("men"), "newest").slice(0, 8);

  return (
    <DeptShell dept="men">
      <div ref={rootRef}>
        {/* -------------------------------------------------- subcategories */}
        <section className="dept-wrap pt-12 pb-14 lg:pt-16 lg:pb-20">
          <header className="flex flex-wrap items-end justify-between gap-4 mb-9">
            <div>
              <span className="dept-eyebrow">{pick("الأقسام", "Categories")}</span>
              <h2 className="dept-h2 mt-4 text-2xl sm:text-3xl">
                {pick("تصفّح حسب القسم", "Shop by category")}
              </h2>
            </div>
            <Link to="/men/tshirts" className="dept-link">
              {pick("كل القطع", "All pieces")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {meta.subs.map((sub) => (
              <Link
                key={sub.slug}
                to={`/men/${sub.slug}`}
                className="dept-tile dept-tile-shade dept-reveal aspect-[4/5] sm:aspect-[4/3]"
              >
                <img src={sub.image} alt="" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white">
                  <h3 className="text-lg font-extrabold uppercase tracking-[0.12em]">
                    {pick(sub.name.ar, sub.name.en)}
                  </h3>
                  <p className="text-xs mt-1.5 text-white/70">
                    {pick(sub.blurb.ar, sub.blurb.en)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em]">
                    {pick("تسوّق", "Shop")}
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- new in */}
        <section
          className="dept-wrap py-14 lg:py-16 border-t"
          style={{ borderColor: "var(--d-line)" }}
        >
          <header className="flex flex-wrap items-end justify-between gap-4 mb-9">
            <div>
              <span className="dept-eyebrow">{pick("وصل حديثاً", "New in")}</span>
              <h2 className="dept-h2 mt-4 text-2xl sm:text-3xl">
                {pick("أحدث القطع", "Latest arrivals")}
              </h2>
            </div>
            <Link to="/men/tshirts" className="dept-link">
              {pick("عرض الكل", "View all")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {newIn.map((p) => (
              <div key={p.id} className="dept-reveal">
                <DeptProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </DeptShell>
  );
}
