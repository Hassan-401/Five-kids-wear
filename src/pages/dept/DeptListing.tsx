import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DeptShell from "../../components/dept/DeptShell";
import DeptProductCard from "../../components/dept/DeptProductCard";
import useReveal from "../../components/dept/useReveal";
import NotFound from "../NotFound";
import { useLang } from "../../i18n/LanguageContext";
import {
  departments,
  deptProductsOf,
  sortDeptProducts,
  sizeLabel,
  subCategory,
  type Dept,
  type DeptSort,
} from "../../data/departments";
import { ArrowRight } from "../../components/Icons";

export default function DeptListing({ dept }: { dept: Dept }) {
  const { sub = "" } = useParams();
  const { t, pick, price } = useLang();
  const rootRef = useReveal<HTMLDivElement>();

  const [sort, setSort] = useState<DeptSort>("newest");
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const meta = departments[dept];
  const category = subCategory(dept, sub);

  const inSub = useMemo(
    () => deptProductsOf(dept).filter((p) => p.sub === sub),
    [dept, sub],
  );

  const allSizes = useMemo(
    () => Array.from(new Set(inSub.flatMap((p) => p.sizes))),
    [inSub],
  );

  const ceiling = useMemo(
    () => Math.max(500, ...inSub.map((p) => p.price)),
    [inSub],
  );

  const list = useMemo(() => {
    let out = inSub;
    if (sizes.length) out = out.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (maxPrice !== null) out = out.filter((p) => p.price <= maxPrice);
    return sortDeptProducts(out, sort);
  }, [inSub, sizes, maxPrice, sort]);

  if (!category) return <NotFound />;

  const isWomen = dept === "women";
  const toggleSize = (s: string) =>
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const clearAll = () => {
    setSizes([]);
    setMaxPrice(null);
    setSort("newest");
  };

  return (
    <DeptShell dept={dept}>
      <div ref={rootRef}>
        {/* -------------------------------------------------------- banner */}
        <section
          className="border-b"
          style={{ borderColor: "var(--d-line)", background: "var(--d-panel)" }}
        >
          <div className="dept-wrap grid md:grid-cols-[1.4fr_1fr] items-center gap-8 py-10 lg:py-14">
            <div className={isWomen ? "text-center md:text-start" : ""}>
              {/* breadcrumb */}
              <nav
                aria-label="breadcrumb"
                className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
                style={{ color: "var(--d-muted)" }}
              >
                <Link to="/" className="hover:opacity-70 transition">
                  {t("common.home")}
                </Link>
                <span className="opacity-50">/</span>
                <Link to={`/${dept}`} className="hover:opacity-70 transition">
                  {pick(meta.name.ar, meta.name.en)}
                </Link>
                <span className="opacity-50">/</span>
                <span style={{ color: "var(--d-ink)" }}>
                  {pick(category.name.ar, category.name.en)}
                </span>
              </nav>

              <h1 className="dept-h1 mt-5 text-3xl sm:text-5xl">
                {pick(category.name.ar, category.name.en)}
              </h1>
              <p
                className="mt-4 text-[0.92rem] leading-7 max-w-lg mx-auto md:mx-0"
                style={{ color: "var(--d-muted)" }}
              >
                {pick(category.blurb.ar, category.blurb.en)}
              </p>
            </div>

            <div
              className={[
                "hidden md:block overflow-hidden",
                isWomen ? "dept-arch w-52 ms-auto aspect-[3/4]" : "aspect-[16/9]",
              ].join(" ")}
            >
              <img
                src={category.image}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- tools */}
        <div className="dept-wrap pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--d-muted)" }}>
              <bdi>{list.length}</bdi> {t("common.results")}
            </p>

            <label className="flex items-center gap-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em]">
              {t("common.sortBy")}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as DeptSort)}
                className="bg-transparent border px-3.5 py-2 text-[0.78rem] font-semibold tracking-normal outline-none"
                style={{
                  borderColor: "var(--d-line)",
                  borderRadius: "var(--d-radius)",
                  color: "var(--d-ink)",
                }}
              >
                <option value="newest">{t("shop.sort.newest")}</option>
                <option value="popular">{t("shop.sort.popular")}</option>
                <option value="priceAsc">{t("shop.sort.priceAsc")}</option>
                <option value="priceDesc">{t("shop.sort.priceDesc")}</option>
              </select>
            </label>
          </div>

          {/* filter chips */}
          <div
            className="mt-5 flex flex-wrap items-center gap-2.5 border-t pt-5"
            style={{ borderColor: "var(--d-line)" }}
          >
            <span
              className="text-[0.7rem] font-bold uppercase tracking-[0.18em] me-1"
              style={{ color: "var(--d-muted)" }}
            >
              {t("common.size")}
            </span>
            {allSizes.map((s) => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                aria-pressed={sizes.includes(s)}
                className="border px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  borderRadius: "var(--d-radius)",
                  borderColor: sizes.includes(s) ? "var(--d-accent)" : "var(--d-line)",
                  background: sizes.includes(s) ? "var(--d-accent)" : "transparent",
                  color: sizes.includes(s) ? "var(--d-on-accent)" : "var(--d-ink)",
                }}
              >
                <bdi>{sizeLabel(s, pick)}</bdi>
              </button>
            ))}

            <span
              className="text-[0.7rem] font-bold uppercase tracking-[0.18em] ms-4 me-1"
              style={{ color: "var(--d-muted)" }}
            >
              {t("shop.priceRange")}
            </span>
            {[0.4, 0.7, 1].map((f) => {
              const cap = Math.round((ceiling * f) / 10) * 10;
              const on = maxPrice === cap;
              return (
                <button
                  key={f}
                  onClick={() => setMaxPrice(on ? null : cap)}
                  aria-pressed={on}
                  className="border px-3 py-1.5 text-xs font-semibold transition"
                  style={{
                    borderRadius: "var(--d-radius)",
                    borderColor: on ? "var(--d-accent)" : "var(--d-line)",
                    background: on ? "var(--d-accent)" : "transparent",
                    color: on ? "var(--d-on-accent)" : "var(--d-ink)",
                  }}
                >
                  <bdi>≤ {price(cap)}</bdi>
                </button>
              );
            })}

            {(sizes.length > 0 || maxPrice !== null) && (
              <button
                onClick={clearAll}
                className="ms-auto text-[0.72rem] font-bold uppercase tracking-[0.18em] underline underline-offset-4 hover:opacity-60 transition"
              >
                {t("common.clear")}
              </button>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------- grid */}
        <section className="dept-wrap py-10 lg:py-14">
          {list.length === 0 ? (
            <div
              className="border py-20 text-center"
              style={{ borderColor: "var(--d-line)" }}
            >
              <p className="dept-h2 text-xl">{t("shop.noResults")}</p>
              <button onClick={clearAll} className="dept-btn mt-7">
                {t("shop.resetFilters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {list.map((p) => (
                <div key={p.id} className="dept-reveal">
                  <DeptProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --------------------------------------------- other departments */}
        <section
          className="dept-wrap pb-16 lg:pb-24"
        >
          <hr className="dept-rule mb-9" />
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {meta.subs
              .filter((s) => s.slug !== sub)
              .map((s) => (
                <Link key={s.slug} to={`/${dept}/${s.slug}`} className="dept-link">
                  {pick(s.name.ar, s.name.en)}
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              ))}
          </div>
        </section>
      </div>
    </DeptShell>
  );
}
