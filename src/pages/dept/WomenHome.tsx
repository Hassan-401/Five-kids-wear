import { Link } from "react-router-dom";
import DeptShell, { DeptMarquee } from "../../components/dept/DeptShell";
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

export default function WomenHome() {
  const { pick } = useLang();
  const rootRef = useReveal<HTMLDivElement>();

  const all = deptProductsOf("women");
  const newIn = sortDeptProducts(all, "newest").slice(0, 8);
  const popular = sortDeptProducts(all, "popular").slice(0, 4);

  return (
    <DeptShell dept="women">
      <div ref={rootRef}>
        {/* ---------------------------------------------------------- hero */}
        <section className="relative overflow-hidden">
          {/* soft wash behind the arch */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[62%]"
            style={{ background: "var(--d-panel)" }}
          />

          <div className="dept-wrap relative pt-14 pb-16 lg:pt-20 lg:pb-24">
            <div className="grid lg:grid-cols-[1fr_auto_1fr] items-center gap-10 lg:gap-8">
              {/* copy — start side */}
              <div className="order-2 lg:order-1 text-center lg:text-start">
                <span className="dept-eyebrow">
                  {pick("قسم النساء", "Womenswear")}
                </span>
                <h1 className="dept-h1 mt-5 text-4xl sm:text-5xl lg:text-[3.6rem]">
                  {pick(meta.heroTitle.ar, meta.heroTitle.en)}
                </h1>
                <p
                  className="mt-6 text-[0.95rem] leading-8 mx-auto lg:mx-0 max-w-md"
                  style={{ color: "var(--d-muted)" }}
                >
                  {pick(meta.heroLead.ar, meta.heroLead.en)}
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-5">
                  <Link to="/women/dresses" className="dept-btn">
                    {pick("تسوّقي الفساتين", "Shop dresses")}
                  </Link>
                  <Link to="/women/shoes" className="dept-link">
                    {pick("أحذية وشنط", "Shoes & bags")}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              {/* the arch */}
              <div className="order-1 lg:order-2 mx-auto">
                <div className="dept-arch dept-reveal w-64 sm:w-80 lg:w-[24rem] aspect-[3/4.4] shadow-[0_40px_70px_-40px_rgba(74,59,54,.55)]">
                  <img
                    src={meta.heroImage}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover dept-kenburns"
                  />
                </div>
              </div>

              {/* small stacked frame + note — end side */}
              <div className="order-3 hidden lg:flex flex-col items-start gap-7">
                <div className="dept-arch dept-reveal w-44 aspect-[3/4] shadow-[0_28px_50px_-32px_rgba(74,59,54,.5)]">
                  <img
                    src={meta.heroAside}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-sm leading-7 max-w-[15rem]"
                  style={{
                    color: "var(--d-muted)",
                    fontFamily: "var(--d-font-head)",
                  }}
                >
                  {pick(meta.tagline.ar, meta.tagline.en)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <DeptMarquee text={pick(meta.marquee.ar, meta.marquee.en)} tone="deep" />

        {/* -------------------------------------------------- subcategories */}
        <section className="dept-wrap py-16 lg:py-24">
          <header className="text-center max-w-2xl mx-auto mb-12">
            <span className="dept-eyebrow">{pick("الأقسام", "Categories")}</span>
            <h2 className="dept-h2 mt-4 text-3xl sm:text-[2.6rem]">
              {pick("تصفّحي التشكيلة", "Browse the collection")}
            </h2>
            <hr className="dept-rule w-20 mx-auto mt-7" />
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
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "var(--d-muted)" }}
                >
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
          className="py-16 lg:py-20"
          style={{ background: "var(--d-panel)" }}
        >
          <div className="dept-wrap">
            <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <span className="dept-eyebrow">{pick("وصل حديثاً", "New in")}</span>
                <h2 className="dept-h2 mt-4 text-3xl sm:text-4xl">
                  {pick("جديد هذا الأسبوع", "New this week")}
                </h2>
              </div>
              <Link to="/women/dresses" className="dept-link">
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
          </div>
        </section>

        {/* ----------------------------------------------------- editorial */}
        <section className="dept-wrap py-16 lg:py-28">
          <div className="grid lg:grid-cols-2 items-center gap-10 lg:gap-20">
            <div className="dept-reveal order-2 lg:order-1 text-center lg:text-start">
              <span className="dept-eyebrow">{pick("حكاية", "Editorial")}</span>
              <h2 className="dept-h2 mt-5 text-3xl sm:text-[2.6rem] leading-tight">
                {pick(meta.editorial.title.ar, meta.editorial.title.en)}
              </h2>
              <p
                className="mt-6 text-[0.95rem] leading-8 mx-auto lg:mx-0 max-w-md"
                style={{ color: "var(--d-muted)" }}
              >
                {pick(meta.editorial.body.ar, meta.editorial.body.en)}
              </p>
              <Link
                to="/women/dresses"
                className="dept-link mt-8 inline-flex"
              >
                {pick("شوفي التشكيلة", "See the edit")}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>

            <div className="dept-reveal order-1 lg:order-2 relative">
              <div className="dept-arch aspect-[4/5] shadow-[0_40px_70px_-45px_rgba(74,59,54,.5)]">
                <img
                  src={meta.editorial.image}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                aria-hidden="true"
                className="hidden sm:block absolute -bottom-6 -start-6 w-28 h-28 rounded-full border"
                style={{ borderColor: "var(--d-line)" }}
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- best sellers */}
        <section
          className="py-16 lg:py-20 border-t"
          style={{ borderColor: "var(--d-line)" }}
        >
          <div className="dept-wrap">
            <header className="text-center mb-11">
              <span className="dept-eyebrow">
                {pick("الأكثر طلباً", "Best sellers")}
              </span>
              <h2 className="dept-h2 mt-4 text-3xl sm:text-4xl">
                {pick("المفضّلة عند البنات", "Loved most")}
              </h2>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {popular.map((p) => (
                <div key={p.id} className="dept-reveal">
                  <DeptProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DeptShell>
  );
}
