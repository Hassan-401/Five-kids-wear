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

const meta = departments.men;

export default function MenHome() {
  const { pick } = useLang();
  const rootRef = useReveal<HTMLDivElement>();

  const all = deptProductsOf("men");
  const newIn = sortDeptProducts(all, "newest").slice(0, 8);
  const popular = sortDeptProducts(all, "popular").slice(0, 4);

  return (
    <DeptShell dept="men">
      <div ref={rootRef}>
        {/* ---------------------------------------------------------- hero */}
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--d-deep)", color: "#efeee9" }}
        >
          {/* full-bleed: the photograph runs to the page edge */}
          <div className="grid lg:grid-cols-[1.05fr_1fr] items-stretch">
            {/* copy */}
            <div className="order-2 lg:order-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-14 lg:py-24">
              <span className="dept-eyebrow" style={{ color: "#9c968a" }}>
                {pick("قسم الرجال", "Menswear")}
              </span>

              <h1 className="dept-h1 mt-6 text-4xl sm:text-5xl lg:text-[4.1rem]">
                {pick(meta.heroTitle.ar, meta.heroTitle.en)}
              </h1>

              <p
                className="mt-6 max-w-xl text-[0.95rem] leading-8"
                style={{ color: "#b6b1a7" }}
              >
                {pick(meta.heroLead.ar, meta.heroLead.en)}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link to="/men/tshirts" className="dept-btn dept-btn-light">
                  {pick("تسوّق التشكيلة", "Shop the collection")}
                </Link>
                <Link
                  to="/men/outerwear"
                  className="dept-link"
                  style={{ color: "#efeee9" }}
                >
                  {pick("الجاكيتات", "Outerwear")}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>

              {/* stats rail */}
              <dl className="mt-12 grid grid-cols-3 gap-6 max-w-lg border-t pt-7" style={{ borderColor: "#33353a" }}>
                {[
                  { n: "240", ar: "جرام قطن", en: "gsm cotton" },
                  { n: "15", ar: "قصّة أساسية", en: "core fits" },
                  { n: "48", ar: "ساعة شحن", en: "hour delivery" },
                ].map((s) => (
                  <div key={s.en}>
                    <dt className="text-2xl font-extrabold tracking-tight">
                      <bdi>{s.n}</bdi>
                    </dt>
                    <dd
                      className="text-[0.7rem] uppercase tracking-[0.18em] mt-1.5"
                      style={{ color: "#8d887e" }}
                    >
                      {pick(s.ar, s.en)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* imagery */}
            <div className="relative order-1 lg:order-2 min-h-[22rem] lg:min-h-[42rem]">
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={meta.heroImage}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover dept-kenburns"
                />
              </div>

              {/* inset second frame */}
              <div className="absolute bottom-6 start-6 w-32 sm:w-40 lg:w-48 aspect-[3/4] overflow-hidden shadow-2xl ring-1 ring-black/20 hidden sm:block">
                <img
                  src={meta.heroAside}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <DeptMarquee text={pick(meta.marquee.ar, meta.marquee.en)} tone="soft" />

        {/* -------------------------------------------------- subcategories */}
        <section className="dept-wrap py-16 lg:py-24">
          <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="dept-eyebrow">{pick("الأقسام", "Categories")}</span>
              <h2 className="dept-h2 mt-4 text-3xl sm:text-4xl">
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
          className="py-16 lg:py-20 border-t"
          style={{ borderColor: "var(--d-line)", background: "var(--d-panel)" }}
        >
          <div className="dept-wrap">
            <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <span className="dept-eyebrow">{pick("وصل حديثاً", "New in")}</span>
                <h2 className="dept-h2 mt-4 text-3xl sm:text-4xl">
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
          </div>
        </section>

        {/* ----------------------------------------------------- editorial */}
        <section className="dept-wrap py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 items-stretch">
            <div className="dept-reveal aspect-[4/3] lg:aspect-auto overflow-hidden">
              <img
                src={meta.editorial.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="dept-reveal flex flex-col justify-center p-9 sm:p-14"
              style={{ background: "var(--d-deep)", color: "#efeee9" }}
            >
              <span className="dept-eyebrow" style={{ color: "#9c968a" }}>
                {pick("لوك بوك", "Lookbook")}
              </span>
              <h2 className="dept-h2 mt-5 text-2xl sm:text-4xl">
                {pick(meta.editorial.title.ar, meta.editorial.title.en)}
              </h2>
              <p
                className="mt-5 text-[0.95rem] leading-8 max-w-md"
                style={{ color: "#b6b1a7" }}
              >
                {pick(meta.editorial.body.ar, meta.editorial.body.en)}
              </p>
              <Link
                to="/men/outerwear"
                className="dept-link mt-8 self-start"
                style={{ color: "#efeee9" }}
              >
                {pick("شوف التشكيلة", "See the edit")}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- best sellers */}
        <section
          className="py-16 lg:py-20 border-t"
          style={{ borderColor: "var(--d-line)" }}
        >
          <div className="dept-wrap">
            <header className="mb-10">
              <span className="dept-eyebrow">{pick("الأكثر مبيعاً", "Best sellers")}</span>
              <h2 className="dept-h2 mt-4 text-3xl sm:text-4xl">
                {pick("القطع اللي بتخلص بسرعة", "The pieces that sell out")}
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
