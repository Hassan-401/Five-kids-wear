import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import {
  ApiError,
  api,
  type AdminCategory,
  type AdminProduct,
  type ApiSwatch,
} from "../lib/api";
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Field,
  Input,
  Loading,
  Select,
  Table,
  Textarea,
  ToastBar,
  useToast,
} from "./ui";

/** The editor's own shape: numbers stay as strings while they are being typed. */
type Draft = {
  id?: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: string;
  oldPrice: string;
  categoryId: string;
  gender: string;
  sizes: string;
  colors: ApiSwatch[];
  images: string[];
  isNew: boolean;
  inStock: boolean;
  active: boolean;
  popularity: string;
};

const emptyDraft = (categoryId: string): Draft => ({
  slug: "",
  nameAr: "",
  nameEn: "",
  descAr: "",
  descEn: "",
  price: "",
  oldPrice: "",
  categoryId,
  gender: "unisex",
  sizes: "",
  colors: [],
  images: [],
  isNew: true,
  inStock: true,
  active: true,
  popularity: "50",
});

const toDraft = (p: AdminProduct): Draft => ({
  id: p.id,
  slug: p.slug,
  nameAr: p.nameAr,
  nameEn: p.nameEn,
  descAr: p.descAr,
  descEn: p.descEn,
  price: String(p.price),
  oldPrice: p.oldPrice ? String(p.oldPrice) : "",
  categoryId: p.categoryId,
  gender: p.gender,
  sizes: p.sizes.join(", "),
  colors: p.colors,
  images: p.images,
  isNew: !!p.isNew,
  inStock: p.inStock,
  active: p.active,
  popularity: String(p.popularity),
});

/** Products: the list, and the form that creates and edits them. */
export default function Products() {
  const { pick, price } = useLang();
  const { toast, show } = useToast();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([api.admin.products(), api.admin.categories()])
      .then(([p, c]) => {
        setProducts(p.products);
        setCategories(c.categories);
      })
      .catch(() => show(pick("تعذّر تحميل المنتجات", "Could not load products"), "error"))
      .finally(() => setLoading(false));
  }, [pick, show]);

  useEffect(load, [load]);

  const categoryName = useCallback(
    (id: string) => {
      const cat = categories.find((c) => c.id === id);
      return cat ? pick(cat.nameAr, cat.nameEn) : "—";
    },
    [categories, pick],
  );

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filter && p.categoryId !== filter) return false;
      if (!q) return true;
      return [p.nameAr, p.nameEn, p.slug].some((s) => s.toLowerCase().includes(q));
    });
  }, [products, search, filter]);

  const remove = async (product: AdminProduct) => {
    const label = pick(product.nameAr, product.nameEn);
    if (!window.confirm(pick(`حذف "${label}"؟`, `Delete "${label}"?`))) return;
    try {
      await api.admin.deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      show(pick("تم حذف المنتج", "Product deleted"));
    } catch {
      show(pick("فشل الحذف", "Delete failed"), "error");
    }
  };

  /** Flips `active` straight from the table, without opening the editor. */
  const toggleActive = async (product: AdminProduct) => {
    try {
      await api.admin.updateProduct(product.id, { active: !product.active });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p)),
      );
    } catch {
      show(pick("فشل التحديث", "Update failed"), "error");
    }
  };

  if (loading) return <Loading label={pick("جاري التحميل...", "Loading...")} />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-slate-800">{pick("المنتجات", "Products")}</h1>
        <Button
          onClick={() => setDraft(emptyDraft(categories[0]?.id ?? ""))}
          disabled={categories.length === 0}
        >
          {pick("+ منتج جديد", "+ New product")}
        </Button>
      </div>

      {categories.length === 0 && (
        <Card>
          <p className="text-sm font-semibold text-slate-600">
            {pick(
              "لازم تضيف قسم واحد على الأقل قبل ما تضيف منتجات.",
              "Add at least one category before adding products.",
            )}
          </p>
        </Card>
      )}

      <Card>
        <div className="flex flex-wrap gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={pick("ابحث بالاسم", "Search by name")}
            className="flex-1"
          />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-52">
            <option value="">{pick("كل الأقسام", "All categories")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {pick(c.nameAr, c.nameEn)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        {shown.length === 0 ? (
          <Empty label={pick("لا توجد منتجات", "No products")} />
        ) : (
          <Table
            head={[
              "",
              pick("المنتج", "Product"),
              pick("القسم", "Category"),
              pick("السعر", "Price"),
              pick("الحالة", "Status"),
              "",
            ]}
          >
            {shown.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2.5">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                    {p.image && (
                      <img
                        src={p.image}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <p className="font-bold text-slate-700">{pick(p.nameAr, p.nameEn)}</p>
                  <p className="text-xs text-slate-400" dir="ltr">
                    {p.slug}
                  </p>
                </td>
                <td className="px-3 py-2.5 text-slate-600">{categoryName(p.categoryId)}</td>
                <td className="px-3 py-2.5">
                  <b className="text-slate-800">
                    <bdi>{price(p.price)}</bdi>
                  </b>
                  {p.oldPrice && (
                    <span className="ms-2 text-xs text-slate-400 line-through">
                      <bdi>{price(p.oldPrice)}</bdi>
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        p.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {p.active ? pick("ظاهر", "Visible") : pick("مخفي", "Hidden")}
                    </button>
                    {!p.inStock && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                        {pick("نفذ", "Sold out")}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setDraft(toDraft(p))}>
                      {pick("تعديل", "Edit")}
                    </Button>
                    <Button variant="danger" onClick={() => remove(p)}>
                      {pick("حذف", "Delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {draft && (
        <Editor
          draft={draft}
          categories={categories}
          onClose={() => setDraft(null)}
          onSaved={() => {
            setDraft(null);
            load();
          }}
          notify={show}
        />
      )}

      <ToastBar toast={toast} />
    </div>
  );
}

/* --------------------------------------------------------------- editor */

function Editor({
  draft: initial,
  categories,
  onClose,
  onSaved,
  notify,
}: {
  draft: Draft;
  categories: AdminCategory[];
  onClose: () => void;
  onSaved: () => void;
  notify: (message: string, tone?: "ok" | "error") => void;
}) {
  const { pick } = useLang();
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 8)) {
        const { url } = await api.admin.upload(file);
        setDraft((prev) => ({ ...prev, images: [...prev.images, url] }));
      }
    } catch (err) {
      notify(
        err instanceof ApiError && err.code === "file_too_large"
          ? pick("الصورة أكبر من ٥ ميجا", "That image is larger than 5 MB")
          : pick("فشل رفع الصورة", "Upload failed"),
        "error",
      );
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!draft.nameAr.trim() && !draft.nameEn.trim()) {
      notify(pick("اكتب اسم المنتج", "Give the product a name"), "error");
      return;
    }

    setSaving(true);
    const payload = {
      slug: draft.slug || undefined,
      nameAr: draft.nameAr,
      nameEn: draft.nameEn,
      descAr: draft.descAr,
      descEn: draft.descEn,
      price: Number(draft.price) || 0,
      oldPrice: draft.oldPrice ? Number(draft.oldPrice) : null,
      categoryId: draft.categoryId,
      gender: draft.gender,
      sizes: draft.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: draft.colors,
      images: draft.images,
      isNew: draft.isNew,
      inStock: draft.inStock,
      active: draft.active,
      popularity: Number(draft.popularity) || 50,
    };

    try {
      if (draft.id) await api.admin.updateProduct(draft.id, payload);
      else await api.admin.createProduct(payload);
      notify(pick("تم الحفظ", "Saved"));
      onSaved();
    } catch {
      notify(pick("فشل الحفظ", "Save failed"), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4">
      <div className="mx-auto my-8 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <header className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="font-extrabold text-slate-800">
            {draft.id ? pick("تعديل منتج", "Edit product") : pick("منتج جديد", "New product")}
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              {pick("إلغاء", "Cancel")}
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? pick("جاري الحفظ...", "Saving...") : pick("حفظ", "Save")}
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={pick("الاسم بالعربي", "Arabic name")}>
              <Input value={draft.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
            </Field>
            <Field label={pick("الاسم بالإنجليزي", "English name")}>
              <Input value={draft.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={pick("الوصف بالعربي", "Arabic description")}>
              <Textarea value={draft.descAr} onChange={(e) => set("descAr", e.target.value)} />
            </Field>
            <Field label={pick("الوصف بالإنجليزي", "English description")}>
              <Textarea value={draft.descEn} onChange={(e) => set("descEn", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <Field label={pick("السعر", "Price")}>
              <Input
                type="number"
                min={0}
                value={draft.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </Field>
            <Field
              label={pick("السعر قبل الخصم", "Was")}
              hint={pick("اتركه فاضي لو مفيش خصم", "Leave empty for no discount")}
            >
              <Input
                type="number"
                min={0}
                value={draft.oldPrice}
                onChange={(e) => set("oldPrice", e.target.value)}
              />
            </Field>
            <Field label={pick("القسم", "Category")}>
              <Select
                value={draft.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {pick(c.nameAr, c.nameEn)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={pick("النوع", "Gender")}>
              <Select value={draft.gender} onChange={(e) => set("gender", e.target.value)}>
                <option value="unisex">{pick("للجنسين", "Unisex")}</option>
                <option value="boys">{pick("أولاد", "Boys")}</option>
                <option value="girls">{pick("بنات", "Girls")}</option>
              </Select>
            </Field>
          </div>

          <Field
            label={pick("المقاسات", "Sizes")}
            hint={pick("افصل بينها بفاصلة، مثال: 2, 4, 6", "Comma separated, e.g. 2, 4, 6")}
          >
            <Input value={draft.sizes} onChange={(e) => set("sizes", e.target.value)} />
          </Field>

          <ColorEditor colors={draft.colors} onChange={(colors) => set("colors", colors)} />

          {/* images — the first one is what the storefront shows on the card */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">{pick("الصور", "Images")}</span>
              <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                {uploading ? pick("جاري الرفع...", "Uploading...") : pick("رفع صور", "Upload")}
                <input
                  type="file"
                  accept="image/webp,image/jpeg,image/png,image/avif"
                  multiple
                  hidden
                  disabled={uploading}
                  onChange={(e) => {
                    upload(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {draft.images.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-xs font-bold text-slate-400">
                {pick("لا توجد صور بعد", "No images yet")}
              </p>
            ) : (
              <ul className="flex flex-wrap gap-3">
                {draft.images.map((src, i) => (
                  <li key={src} className="relative">
                    <div className="h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img src={src} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1 start-1 rounded bg-sky-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {pick("رئيسية", "Main")}
                      </span>
                    )}
                    <div className="mt-1 flex gap-1">
                      {i > 0 && (
                        <button
                          onClick={() =>
                            set("images", [src, ...draft.images.filter((s) => s !== src)])
                          }
                          className="rounded border border-slate-300 px-1.5 py-0.5 text-[10px] font-bold text-slate-600"
                        >
                          {pick("رئيسية", "Main")}
                        </button>
                      )}
                      <button
                        onClick={() => set("images", draft.images.filter((s) => s !== src))}
                        className="rounded border border-red-200 px-1.5 py-0.5 text-[10px] font-bold text-red-600"
                      >
                        {pick("حذف", "Remove")}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4">
            <Checkbox
              label={pick("ظاهر في المتجر", "Visible in the store")}
              checked={draft.active}
              onChange={(v) => set("active", v)}
            />
            <Checkbox
              label={pick("متوفر", "In stock")}
              checked={draft.inStock}
              onChange={(v) => set("inStock", v)}
            />
            <Checkbox
              label={pick("جديد", "New")}
              checked={draft.isNew}
              onChange={(v) => set("isNew", v)}
            />
            <Field label={pick("الأولوية", "Popularity")} className="w-32">
              <Input
                type="number"
                min={0}
                max={100}
                value={draft.popularity}
                onChange={(e) => set("popularity", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Colour swatches: a picker plus the two names the storefront shows. */
function ColorEditor({
  colors,
  onChange,
}: {
  colors: ApiSwatch[];
  onChange: (colors: ApiSwatch[]) => void;
}) {
  const { pick } = useLang();

  const patch = (index: number, changes: Partial<ApiSwatch>) =>
    onChange(colors.map((c, i) => (i === index ? { ...c, ...changes } : c)));

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{pick("الألوان", "Colours")}</span>
        <Button
          variant="ghost"
          onClick={() =>
            onChange([...colors, { hex: "#dddddd", nameAr: "", nameEn: "" }])
          }
        >
          {pick("+ لون", "+ Colour")}
        </Button>
      </div>

      {colors.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-4 text-center text-xs font-bold text-slate-400">
          {pick("لا توجد ألوان", "No colours")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {colors.map((color, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2">
              <input
                type="color"
                value={color.hex}
                onChange={(e) => patch(i, { hex: e.target.value })}
                className="h-10 w-12 cursor-pointer rounded border border-slate-300"
                aria-label={pick("اللون", "Colour")}
              />
              <Input
                value={color.nameAr}
                onChange={(e) => patch(i, { nameAr: e.target.value })}
                placeholder={pick("الاسم بالعربي", "Arabic name")}
                className="w-40"
              />
              <Input
                value={color.nameEn}
                onChange={(e) => patch(i, { nameEn: e.target.value })}
                placeholder={pick("الاسم بالإنجليزي", "English name")}
                className="w-40"
              />
              <Button variant="danger" onClick={() => onChange(colors.filter((_, j) => j !== i))}>
                {pick("حذف", "Remove")}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
