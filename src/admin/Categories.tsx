import { useCallback, useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { ApiError, api, type AdminCategory } from "../lib/api";
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Field,
  Input,
  Loading,
  Table,
  ToastBar,
  useToast,
} from "./ui";

type Draft = {
  id?: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  tint: string;
  photo: boolean;
  sort: string;
  active: boolean;
};

/** The gradients the storefront tiles are painted with. */
const TINTS = [
  "from-sky-100 to-pink-100",
  "from-sky-100 to-sky-200",
  "from-pink-100 to-pink-200",
  "from-pink-100 to-sky-100",
  "from-pink-200 to-sky-100",
];

const emptyDraft = (): Draft => ({
  slug: "",
  nameAr: "",
  nameEn: "",
  image: "",
  tint: TINTS[0],
  photo: false,
  sort: "99",
  active: true,
});

const toDraft = (c: AdminCategory): Draft => ({
  id: c.id,
  slug: c.slug,
  nameAr: c.nameAr,
  nameEn: c.nameEn,
  image: c.image,
  tint: c.tint,
  photo: !!c.photo,
  sort: String(c.sort),
  active: c.active,
});

/** Categories drive the storefront's nav, its tiles and the shop filters. */
export default function Categories() {
  const { pick } = useLang();
  const { toast, show } = useToast();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api.admin
      .categories()
      .then((res) => setCategories(res.categories))
      .catch(() => show(pick("تعذّر تحميل الأقسام", "Could not load categories"), "error"))
      .finally(() => setLoading(false));
  }, [pick, show]);

  useEffect(load, [load]);

  const remove = async (cat: AdminCategory) => {
    const label = pick(cat.nameAr, cat.nameEn);
    if (!window.confirm(pick(`حذف "${label}"؟`, `Delete "${label}"?`))) return;
    try {
      await api.admin.deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      show(pick("تم حذف القسم", "Category deleted"));
    } catch (err) {
      show(
        err instanceof ApiError && err.code === "category_in_use"
          ? pick(
              "مش هينفع تحذف قسم فيه منتجات — انقل المنتجات الأول",
              "This category still has products — move them first",
            )
          : pick("فشل الحذف", "Delete failed"),
        "error",
      );
    }
  };

  if (loading) return <Loading label={pick("جاري التحميل...", "Loading...")} />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold text-slate-800">{pick("الأقسام", "Categories")}</h1>
        <Button onClick={() => setDraft(emptyDraft())}>
          {pick("+ قسم جديد", "+ New category")}
        </Button>
      </div>

      <Card>
        {categories.length === 0 ? (
          <Empty label={pick("لا توجد أقسام", "No categories")} />
        ) : (
          <Table
            head={[
              "",
              pick("القسم", "Category"),
              pick("المنتجات", "Products"),
              pick("الترتيب", "Order"),
              pick("الحالة", "Status"),
              "",
            ]}
          >
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2.5">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                    {c.image && (
                      <img
                        src={c.image}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <p className="font-bold text-slate-700">{pick(c.nameAr, c.nameEn)}</p>
                  <p className="text-xs text-slate-400" dir="ltr">
                    /category/{c.slug}
                  </p>
                </td>
                <td className="px-3 py-2.5 font-bold text-slate-700">{c.products}</td>
                <td className="px-3 py-2.5 text-slate-500">{c.sort}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      c.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {c.active ? pick("ظاهر", "Visible") : pick("مخفي", "Hidden")}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setDraft(toDraft(c))}>
                      {pick("تعديل", "Edit")}
                    </Button>
                    <Button variant="danger" onClick={() => remove(c)}>
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

function Editor({
  draft: initial,
  onClose,
  onSaved,
  notify,
}: {
  draft: Draft;
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

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.admin.upload(file);
      set("image", url);
    } catch {
      notify(pick("فشل رفع الصورة", "Upload failed"), "error");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!draft.nameAr.trim() && !draft.nameEn.trim()) {
      notify(pick("اكتب اسم القسم", "Give the category a name"), "error");
      return;
    }

    setSaving(true);
    const payload = {
      slug: draft.slug || undefined,
      nameAr: draft.nameAr,
      nameEn: draft.nameEn,
      image: draft.image,
      tint: draft.tint,
      photo: draft.photo,
      sort: Number(draft.sort) || 0,
      active: draft.active,
    };

    try {
      if (draft.id) await api.admin.updateCategory(draft.id, payload);
      else await api.admin.createCategory(payload);
      notify(pick("تم الحفظ", "Saved"));
      onSaved();
    } catch (err) {
      notify(
        err instanceof ApiError && err.code === "slug_taken"
          ? pick("الرابط مستخدم بالفعل", "That link is already taken")
          : pick("فشل الحفظ", "Save failed"),
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4">
      <div className="mx-auto my-8 w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-extrabold text-slate-800">
            {draft.id ? pick("تعديل قسم", "Edit category") : pick("قسم جديد", "New category")}
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

        <div className="flex flex-col gap-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={pick("الاسم بالعربي", "Arabic name")}>
              <Input value={draft.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
            </Field>
            <Field label={pick("الاسم بالإنجليزي", "English name")}>
              <Input value={draft.nameEn} onChange={(e) => set("nameEn", e.target.value)} />
            </Field>
          </div>

          <Field
            label={pick("الرابط", "Link")}
            hint={pick(
              "اتركه فاضي ويتولد من الاسم الإنجليزي",
              "Leave empty to build it from the English name",
            )}
          >
            <Input
              dir="ltr"
              value={draft.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="boys"
            />
          </Field>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">{pick("الصورة", "Image")}</span>
              <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                {uploading ? pick("جاري الرفع...", "Uploading...") : pick("رفع صورة", "Upload")}
                <input
                  type="file"
                  accept="image/webp,image/jpeg,image/png,image/avif"
                  hidden
                  disabled={uploading}
                  onChange={(e) => {
                    upload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {draft.image && (
                  <img
                    src={draft.image}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <Input
                dir="ltr"
                value={draft.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="/images/categories/boys.png"
              />
            </div>
          </section>

          <Field
            label={pick("خلفية البلاطة", "Tile background")}
            hint={pick("تدرّج لوني من ألوان الموقع", "A gradient from the site palette")}
          >
            <div className="flex flex-wrap gap-2">
              {TINTS.map((tint) => (
                <button
                  key={tint}
                  onClick={() => set("tint", tint)}
                  className={`h-10 w-16 rounded-lg bg-gradient-to-b ${tint} ${
                    draft.tint === tint ? "ring-2 ring-sky-500 ring-offset-2" : ""
                  }`}
                  aria-label={tint}
                />
              ))}
            </div>
          </Field>

          <div className="flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4">
            <Checkbox
              label={pick("ظاهر في المتجر", "Visible in the store")}
              checked={draft.active}
              onChange={(v) => set("active", v)}
            />
            <Checkbox
              label={pick("الصورة فوتوغرافية", "Image is a photo")}
              checked={draft.photo}
              onChange={(v) => set("photo", v)}
            />
            <Field label={pick("الترتيب", "Order")} className="w-28">
              <Input
                type="number"
                min={0}
                value={draft.sort}
                onChange={(e) => set("sort", e.target.value)}
              />
            </Field>
          </div>

          <p className="text-xs font-semibold text-slate-400">
            {pick(
              "«الصورة فوتوغرافية» بتخلي الصورة تملا البلاطة كلها؛ لو رسمة شفافة سيبها فاضية عشان تظهر على قمر منوّر.",
              "“Image is a photo” crops the art to fill the tile; leave it off for transparent artwork, which sits on a glowing circle.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
