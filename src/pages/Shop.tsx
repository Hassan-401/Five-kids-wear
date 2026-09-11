import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import Newsletter from "../components/Newsletter";
import { categories, products, type CategoryId } from "../data/catalog";
import { useLang } from "../i18n/LanguageContext";
import { SearchIcon } from "../components/Icons";

type Sort = "newest" | "priceAsc" | "priceDesc" | "popular";

const MAX_PRICE = 450;

export default function Shop({
  fixedCategory,
  onlyOffers = false,
  title,
  subtitle,
}: {
  fixedCategory?: CategoryId;
  onlyOffers?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const { t, pick } = useLang();
  const [params, setParams] = useSearchParams();

  const query = params.get("q") ?? "";
  const [category, setCategory] = useState<CategoryId | "all">(
    fixedCategory ?? "all",
  );
  const [sort, setSort] = useState<Sort>("newest");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sizes, setSizes] = useState<string[]>([]);

  const allSizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))),
    [],
  );

  const list = useMemo(() => {
    let out = products.slice();

    if (onlyOffers) out = out.filter((p) => p.oldPrice);
    if (fixedCategory) out = out.filter((p) => p.category === fixedCategory);
    else if (category !== "all") out = out.filter((p) => p.category === category);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((p) =>
        [p.nameAr, p.nameEn, p.descAr, p.descEn].some((s) =>
          s.toLowerCase().includes(q),
        ),
      );
    }

    out = out.filter((p) => p.price <= maxPrice);
    if (sizes.length) out = out.filter((p) => p.sizes.some((s) => sizes.includes(s)));

    switch (sort) {
      case "priceAsc":
        return out.sort((a, b) => a.price - b.price);
      case "priceDesc":
        return out.sort((a, b) => b.price - a.price);
      case "popular":
        return out.sort((a, b) => b.popularity - a.popularity);
      default:
        return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }, [category, fixedCategory, onlyOffers, query, sort, maxPrice, sizes]);

  const resetFilters = () => {
    setCategory(fixedCategory ?? "all");
    setSort("newest");
    setMaxPrice(MAX_PRICE);
    setSizes([]);
    setParams({});
  };

  const toggleSize = (size: string) =>
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  const activeCat = fixedCategory
    ? categories.find((c) => c.id === fixedCategory)
    : undefined;

  return (
    <>
      <PageHeader
        title={title ?? (activeCat ? pick(activeCat.nameAr, activeCat.nameEn) : t("shop.title"))}
        subtitle={subtitle}
        crumbs={[
          {
            label:
              title ?? (activeCat ? pick(activeCat.nameAr, activeCat.nameEn) : t("shop.title")),
          },
        ]}
      />

      <div className="container-x py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* filters */}
          <aside className="card-soft p-5 h-fit lg:sticky lg:top-40">
            <h2 className="text-lg font-extrabold text-pink-600 mb-4">
              {t("common.filters")}
            </h2>

            {!fixedCategory && (
              <FilterBlock label={t("shop.category")}>
                <div className="flex flex-col gap-1.5">
                  <FilterPill
                    active={category === "all"}
                    onClick={() => setCategory("all")}
                  >
                    {t("shop.allCategories")}
                  </FilterPill>
                  {categories
                    .filter((c) => c.id !== "offers")
                    .map((c) => (
                      <FilterPill
                        key={c.id}
                        active={category === c.id}
                        onClick={() => setCategory(c.id)}
                      >
                        {pick(c.nameAr, c.nameEn)}
                      </FilterPill>
                    ))}
                </div>
              </FilterBlock>
            )}

            <FilterBlock label={`${t("shop.priceRange")} — ${maxPrice}`}>
              <input
                type="range"
                min={100}
                max={MAX_PRICE}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-pink-500"
                aria-label={t("shop.priceRange")}
              />
            </FilterBlock>

            <FilterBlock label={t("common.size")}>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={[
                      "rounded-full px-3 py-1.5 text-sm font-bold border-2 transition",
                      sizes.includes(s)
                        ? "bg-pink-500 border-pink-500 text-white"
                        : "border-pink-200 text-navy-600 hover:border-pink-400",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterBlock>

            <button onClick={resetFilters} className="btn-ghost w-full mt-2">
              {t("shop.resetFilters")}
            </button>
          </aside>

          {/* results */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="font-bold text-navy-600">
                {list.length} {t("common.results")}
                {query && (
                  <span className="ms-2 inline-flex items-center gap-1.5 text-pink-600">
                    <SearchIcon className="w-4 h-4" />“{query}”
                  </span>
                )}
              </p>

              <label className="flex items-center gap-2 text-sm font-bold text-navy-600">
                {t("common.sortBy")}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-full border-2 border-pink-200 bg-white px-4 py-2 font-bold outline-none focus:border-pink-400"
                >
                  <option value="newest">{t("shop.sort.newest")}</option>
                  <option value="popular">{t("shop.sort.popular")}</option>
                  <option value="priceAsc">{t("shop.sort.priceAsc")}</option>
                  <option value="priceDesc">{t("shop.sort.priceDesc")}</option>
                </select>
              </label>
            </div>

            {list.length === 0 ? (
              <div className="card-soft p-14 text-center">
                <img
                  src="/images/characters/catboy.webp"
                  alt=""
                  aria-hidden="true"
                  className="w-32 mx-auto mb-4 opacity-90"
                />
                <p className="text-xl font-extrabold text-navy-600">
                  {t("shop.noResults")}
                </p>
                <button onClick={resetFilters} className="btn-primary mt-5">
                  {t("shop.resetFilters")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
    </>
  );
}

function FilterBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-5 mb-5 border-b border-pink-100 last-of-type:border-0">
      <h3 className="font-bold text-navy-600 mb-3">{label}</h3>
      {children}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-start rounded-full px-4 py-2 font-bold transition",
        active ? "bg-pink-100 text-pink-700" : "text-navy-600 hover:bg-pink-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
