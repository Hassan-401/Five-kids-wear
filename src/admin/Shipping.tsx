import { useCallback, useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { api, type AdminShippingRate, type BostaCity } from "../lib/api";
import { bostaMessage } from "./bosta";
import {
  Button,
  Card,
  Field,
  Input,
  Loading,
  Select,
  Table,
  ToastBar,
  useToast,
} from "./ui";

/**
 * Shipping rates, one row per governorate, saved in a single request.
 *
 * `freeOver` at 0 switches free shipping off; `default` is what an unlisted
 * destination costs.
 */
export default function Shipping() {
  const { pick, price } = useLang();
  const { toast, show } = useToast();

  const [rates, setRates] = useState<AdminShippingRate[]>([]);
  const [freeOver, setFreeOver] = useState(0);
  const [fallback, setFallback] = useState(60);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newRate, setNewRate] = useState({ nameAr: "", nameEn: "", price: "" });
  const [cities, setCities] = useState<BostaCity[]>([]);
  const [citiesError, setCitiesError] = useState("");

  // The Bosta city list is a nice-to-have: without it the page still edits
  // prices, it just cannot offer the mapping dropdown.
  useEffect(() => {
    api.admin
      .bostaCities()
      .then((res) => setCities(res.cities))
      .catch((err) => setCitiesError(bostaMessage(err, pick)));
  }, [pick]);

  const load = useCallback(() => {
    setLoading(true);
    api.admin
      .shipping()
      .then((res) => {
        setRates(res.rates);
        setFreeOver(res.freeOver);
        setFallback(res.default);
      })
      .catch(() => show(pick("تعذّر تحميل الشحن", "Could not load shipping"), "error"))
      .finally(() => setLoading(false));
  }, [pick, show]);

  useEffect(load, [load]);

  const patch = (id: number, changes: Partial<AdminShippingRate>) =>
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.admin.saveShipping({
        rates: rates.map((r) => ({
          id: r.id,
          price: r.price,
          active: r.active,
          bostaCity: r.bostaCity,
        })),
        freeOver,
        default: fallback,
      });
      setRates(res.rates);
      setFreeOver(res.freeOver);
      setFallback(res.default);
      show(pick("تم حفظ أسعار الشحن", "Shipping rates saved"));
    } catch {
      show(pick("فشل الحفظ", "Save failed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const addRate = async () => {
    const nameEn = newRate.nameEn.trim();
    if (!nameEn) return;
    setSaving(true);
    try {
      const res = await api.admin.saveShipping({
        rates: [
          {
            nameAr: newRate.nameAr.trim() || nameEn,
            nameEn,
            price: Number(newRate.price) || 0,
            active: true,
          },
        ],
      });
      setRates(res.rates);
      setNewRate({ nameAr: "", nameEn: "", price: "" });
      show(pick("تمت الإضافة", "Added"));
    } catch {
      show(pick("فشلت الإضافة", "Could not add"), "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (rate: AdminShippingRate) => {
    if (!window.confirm(pick(`حذف ${rate.nameAr}؟`, `Delete ${rate.nameEn}?`))) return;
    try {
      await api.admin.deleteShippingRate(rate.id);
      setRates((prev) => prev.filter((r) => r.id !== rate.id));
      show(pick("تم الحذف", "Deleted"));
    } catch {
      show(pick("فشل الحذف", "Delete failed"), "error");
    }
  };

  if (loading) return <Loading label={pick("جاري التحميل...", "Loading...")} />;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-extrabold text-slate-800">{pick("الشحن", "Shipping")}</h1>

      <Card title={pick("قواعد عامة", "General rules")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={pick("شحن مجاني فوق", "Free shipping over")}
            hint={pick(
              "اكتب 0 لإيقاف الشحن المجاني تماماً",
              "Set 0 to turn free shipping off",
            )}
          >
            <Input
              type="number"
              min={0}
              value={freeOver}
              onChange={(e) => setFreeOver(Number(e.target.value))}
            />
          </Field>
          <Field
            label={pick("سعر افتراضي", "Default rate")}
            hint={pick(
              "يُستخدم لو المحافظة مش في الجدول",
              "Used when a destination is not in the table",
            )}
          >
            <Input
              type="number"
              min={0}
              value={fallback}
              onChange={(e) => setFallback(Number(e.target.value))}
            />
          </Field>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-500">
          {freeOver > 0
            ? pick(
                `الطلبات من ${price(freeOver)} وأكتر شحنها مجاني.`,
                `Orders of ${price(freeOver)} and above ship free.`,
              )
            : pick("الشحن المجاني متوقف حالياً.", "Free shipping is currently off.")}
        </p>
      </Card>

      <Card
        title={pick("أسعار المحافظات", "Rates by governorate")}
        action={
          <Button onClick={save} disabled={saving}>
            {saving ? pick("جاري الحفظ...", "Saving...") : pick("حفظ", "Save")}
          </Button>
        }
      >
        <Table
          head={[
            pick("المحافظة", "Governorate"),
            pick("السعر", "Price"),
            pick("مدينة بوسطة", "Bosta city"),
            pick("مفعّلة", "Active"),
            "",
          ]}
        >
          {rates.map((rate) => (
            <tr key={rate.id} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-2.5">
                <p className="font-bold text-slate-700">{pick(rate.nameAr, rate.nameEn)}</p>
                <p className="text-xs text-slate-400">{pick(rate.nameEn, rate.nameAr)}</p>
              </td>
              <td className="px-3 py-2.5">
                <Input
                  type="number"
                  min={0}
                  value={rate.price}
                  onChange={(e) => patch(rate.id, { price: Number(e.target.value) })}
                  className="w-28"
                />
              </td>
              <td className="px-3 py-2.5">
                <Select
                  value={rate.bostaCity}
                  disabled={cities.length === 0}
                  onChange={(e) => patch(rate.id, { bostaCity: e.target.value })}
                  className="w-44"
                  aria-label={pick("مدينة بوسطة", "Bosta city")}
                >
                  <option value="">{pick("— بدون —", "— none —")}</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {pick(c.nameAr, c.name)}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={rate.active}
                  onChange={(e) => patch(rate.id, { active: e.target.checked })}
                  className="h-4 w-4 accent-sky-600"
                  aria-label={pick(rate.nameAr, rate.nameEn)}
                />
              </td>
              <td className="px-3 py-2.5 text-end">
                <Button variant="danger" onClick={() => remove(rate)}>
                  {pick("حذف", "Delete")}
                </Button>
              </td>
            </tr>
          ))}
        </Table>

        <p className="mt-4 text-xs font-semibold text-slate-400">
          {pick(
            "المحافظات غير المفعّلة مش هتظهر للعميل في صفحة إتمام الطلب. والمحافظة اللي مالهاش مدينة في بوسطة مينفعش تتشحن من صفحة الطلبات.",
            "Inactive destinations are hidden from the checkout form, and a governorate with no Bosta city cannot be shipped from the Orders page.",
          )}
        </p>
        {citiesError && (
          <p className="mt-2 text-xs font-bold text-amber-600">
            {pick("قائمة مدن بوسطة مش متاحة: ", "Bosta's city list is unavailable: ")}
            {citiesError}
          </p>
        )}
      </Card>

      <Card title={pick("إضافة منطقة", "Add a destination")}>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_140px_auto] sm:items-end">
          <Field label={pick("الاسم بالعربي", "Arabic name")}>
            <Input
              value={newRate.nameAr}
              onChange={(e) => setNewRate({ ...newRate, nameAr: e.target.value })}
            />
          </Field>
          <Field label={pick("الاسم بالإنجليزي", "English name")}>
            <Input
              value={newRate.nameEn}
              onChange={(e) => setNewRate({ ...newRate, nameEn: e.target.value })}
            />
          </Field>
          <Field label={pick("السعر", "Price")}>
            <Input
              type="number"
              min={0}
              value={newRate.price}
              onChange={(e) => setNewRate({ ...newRate, price: e.target.value })}
            />
          </Field>
          <Button onClick={addRate} disabled={saving || !newRate.nameEn.trim()}>
            {pick("إضافة", "Add")}
          </Button>
        </div>
      </Card>

      <ToastBar toast={toast} />
    </div>
  );
}
