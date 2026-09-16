import { useCallback, useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { ApiError, api } from "../lib/api";
import {
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Loading,
  ToastBar,
  useToast,
} from "./ui";

/** Store contact details, the two switches, and the dashboard password. */
export default function Settings() {
  const { pick } = useLang();
  const { toast, show } = useToast();

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [changing, setChanging] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.admin
      .settings()
      .then((res) => setSettings(res.settings))
      .catch(() => show(pick("تعذّر تحميل الإعدادات", "Could not load settings"), "error"))
      .finally(() => setLoading(false));
  }, [pick, show]);

  useEffect(load, [load]);

  const set = (key: string, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.admin.saveSettings({
        store_phone: settings.store_phone ?? "",
        store_email: settings.store_email ?? "",
        store_whatsapp: settings.store_whatsapp ?? "",
        cod_enabled: settings.cod_enabled ?? "1",
        orders_open: settings.orders_open ?? "1",
      });
      setSettings(res.settings);
      show(pick("تم حفظ الإعدادات", "Settings saved"));
    } catch {
      show(pick("فشل الحفظ", "Save failed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwords.next.length < 8) {
      show(pick("كلمة المرور لازم تكون ٨ حروف على الأقل", "Use at least 8 characters"), "error");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      show(pick("كلمتا المرور غير متطابقتين", "The two passwords do not match"), "error");
      return;
    }

    setChanging(true);
    try {
      await api.admin.changePassword(passwords.current, passwords.next);
      // the server drops every session when the password changes
      show(pick("تم تغيير كلمة المرور، سجّل الدخول من جديد", "Password changed, sign in again"));
      window.setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      show(
        err instanceof ApiError && err.code === "invalid_credentials"
          ? pick("كلمة المرور الحالية غير صحيحة", "Current password is wrong")
          : pick("فشل تغيير كلمة المرور", "Could not change the password"),
        "error",
      );
    } finally {
      setChanging(false);
    }
  };

  if (loading) return <Loading label={pick("جاري التحميل...", "Loading...")} />;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-extrabold text-slate-800">{pick("الإعدادات", "Settings")}</h1>

      <Card
        title={pick("بيانات المتجر", "Store details")}
        action={
          <Button onClick={save} disabled={saving}>
            {saving ? pick("جاري الحفظ...", "Saving...") : pick("حفظ", "Save")}
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={pick("رقم التليفون", "Phone")}>
            <Input
              dir="ltr"
              value={settings.store_phone ?? ""}
              onChange={(e) => set("store_phone", e.target.value)}
            />
          </Field>
          <Field label={pick("البريد الإلكتروني", "Email")}>
            <Input
              dir="ltr"
              type="email"
              value={settings.store_email ?? ""}
              onChange={(e) => set("store_email", e.target.value)}
            />
          </Field>
          <Field label={pick("واتساب", "WhatsApp")}>
            <Input
              dir="ltr"
              value={settings.store_whatsapp ?? ""}
              onChange={(e) => set("store_whatsapp", e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5">
          <Checkbox
            label={pick("استقبال الطلبات", "Accept orders")}
            checked={settings.orders_open !== "0"}
            onChange={(v) => set("orders_open", v ? "1" : "0")}
          />
          <p className="-mt-1 text-xs font-semibold text-slate-400">
            {pick(
              "لو قفلتها، العميل هيشوف رسالة إن الطلبات متوقفة مؤقتاً.",
              "When off, shoppers see a short 'orders are paused' notice at checkout.",
            )}
          </p>

          <Checkbox
            label={pick("الدفع عند الاستلام", "Cash on delivery")}
            checked={settings.cod_enabled !== "0"}
            onChange={(v) => set("cod_enabled", v ? "1" : "0")}
          />
        </div>
      </Card>

      <Card title={pick("كلمة المرور", "Password")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={pick("كلمة المرور الحالية", "Current password")}>
            <Input
              type="password"
              autoComplete="current-password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </Field>
          <Field label={pick("كلمة المرور الجديدة", "New password")}>
            <Input
              type="password"
              autoComplete="new-password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            />
          </Field>
          <Field label={pick("تأكيد كلمة المرور", "Confirm password")}>
            <Input
              type="password"
              autoComplete="new-password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </Field>
        </div>
        <Button onClick={changePassword} disabled={changing} className="mt-4">
          {changing ? pick("جاري التغيير...", "Changing...") : pick("تغيير كلمة المرور", "Change password")}
        </Button>
        <p className="mt-3 text-xs font-semibold text-slate-400">
          {pick(
            "تغيير كلمة المرور بيسجّل خروج من كل الأجهزة.",
            "Changing the password signs you out everywhere.",
          )}
        </p>
      </Card>

      <ToastBar toast={toast} />
    </div>
  );
}
