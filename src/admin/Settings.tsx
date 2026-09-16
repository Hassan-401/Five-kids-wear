import { useCallback, useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { ApiError, api, type AdminUser, type BostaPickup } from "../lib/api";
import { bostaMessage } from "./bosta";
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
  ToastBar,
  useToast,
} from "./ui";

/**
 * Store details, the social accounts, the Bosta link, who can sign in, and the
 * dashboard password.
 */
export default function Settings() {
  const { pick } = useLang();
  const { toast, show } = useToast();

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [changing, setChanging] = useState(false);

  const [pickups, setPickups] = useState<BostaPickup[]>([]);
  const [bostaError, setBostaError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api.admin
      .settings()
      .then((res) => setSettings(res.settings))
      .catch(() => show(pick("تعذّر تحميل الإعدادات", "Could not load settings"), "error"))
      .finally(() => setLoading(false));
  }, [pick, show]);

  useEffect(load, [load]);

  // Bosta's pickup locations, so the owner picks where parcels are collected
  // from rather than typing an id. Failing is fine — the section says why.
  useEffect(() => {
    api.admin
      .bostaPickups()
      .then((res) => setPickups(res.pickups))
      .catch((err) => setBostaError(bostaMessage(err, pick)));
  }, [pick]);

  const set = (key: string, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.admin.saveSettings({
        store_phone: settings.store_phone ?? "",
        store_email: settings.store_email ?? "",
        store_whatsapp: settings.store_whatsapp ?? "",
        social_facebook: settings.social_facebook ?? "",
        social_instagram: settings.social_instagram ?? "",
        social_tiktok: settings.social_tiktok ?? "",
        cod_enabled: settings.cod_enabled ?? "1",
        orders_open: settings.orders_open ?? "1",
        bosta_enabled: settings.bosta_enabled ?? "0",
        bosta_pickup: settings.bosta_pickup ?? "",
        bosta_auto: settings.bosta_auto ?? "0",
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
          <Field
            label={pick("واتساب", "WhatsApp")}
            hint={pick("بمقدمة الدولة، مثال 201096544301", "With country code, e.g. 201096544301")}
          >
            <Input
              dir="ltr"
              value={settings.store_whatsapp ?? ""}
              onChange={(e) => set("store_whatsapp", e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <Field label="Facebook">
            <Input
              dir="ltr"
              placeholder="https://facebook.com/..."
              value={settings.social_facebook ?? ""}
              onChange={(e) => set("social_facebook", e.target.value)}
            />
          </Field>
          <Field label="Instagram">
            <Input
              dir="ltr"
              placeholder="https://instagram.com/..."
              value={settings.social_instagram ?? ""}
              onChange={(e) => set("social_instagram", e.target.value)}
            />
          </Field>
          <Field label="TikTok">
            <Input
              dir="ltr"
              placeholder="https://tiktok.com/@..."
              value={settings.social_tiktok ?? ""}
              onChange={(e) => set("social_tiktok", e.target.value)}
            />
          </Field>
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-400">
          {pick(
            "الحساب اللي تسيبه فاضي مش هيظهر في الفوتر ولا في صفحة تواصل معنا.",
            "An account you leave empty is hidden from the footer and the contact page.",
          )}
        </p>

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

      <Card
        title={pick("بوسطة (شركة الشحن)", "Bosta (the courier)")}
        action={
          <Button onClick={save} disabled={saving}>
            {saving ? pick("جاري الحفظ...", "Saving...") : pick("حفظ", "Save")}
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          <Checkbox
            label={pick("تفعيل الشحن مع بوسطة", "Enable shipping with Bosta")}
            checked={settings.bosta_enabled === "1"}
            onChange={(v) => set("bosta_enabled", v ? "1" : "0")}
          />
          <Checkbox
            label={pick("اشحن كل طلب جديد أوتوماتيك", "Ship every new order automatically")}
            checked={settings.bosta_auto === "1"}
            onChange={(v) => set("bosta_auto", v ? "1" : "0")}
          />
          <p className="-mt-1 text-xs font-semibold text-slate-400">
            {pick(
              "سيبها مقفولة لو بتتأكد من الأوردر بتليفون الأول — وقتها تشحن بزرار من صفحة الطلبات.",
              "Leave this off if you confirm orders by phone first — then you ship each one from the Orders page.",
            )}
          </p>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <Field
            label={pick("مكان استلام الشحنات", "Pickup location")}
            hint={pick(
              "العنوان اللي مندوب بوسطة هيستلم منه.",
              "The address Bosta's courier collects parcels from.",
            )}
          >
            <Select
              value={settings.bosta_pickup ?? ""}
              disabled={pickups.length === 0}
              onChange={(e) => set("bosta_pickup", e.target.value)}
            >
              <option value="">
                {pick("— المكان الافتراضي —", "— the default location —")}
              </option>
              {pickups.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.address ? `— ${p.address}` : ""}
                </option>
              ))}
            </Select>
          </Field>

          {bostaError ? (
            <p className="mt-3 text-xs font-bold text-amber-600">{bostaError}</p>
          ) : (
            <p className="mt-3 text-xs font-semibold text-emerald-600">
              {pick(
                `متصل ببوسطة — ${pickups.length} مكان استلام`,
                `Connected to Bosta — ${pickups.length} pickup location(s)`,
              )}
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="text-sm font-bold text-slate-700">
            {pick("رابط التحديثات التلقائية", "Status callback URL")}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {pick(
              "ابعت الرابط ده لدعم بوسطة عشان حالة الطلب تتحدّث لوحدها. بدّل الجزء الأخير بالكلمة السرية اللي متسجّلة على السيرفر.",
              "Give this to Bosta support so order statuses update themselves. Replace the last part with the secret set on the server.",
            )}
          </p>
          <code className="mt-2 block overflow-x-auto rounded-lg bg-slate-100 px-3 py-2 text-xs" dir="ltr">
            {window.location.origin}/api/bosta/webhook/&lt;BOSTA_WEBHOOK_SECRET&gt;
          </code>
        </div>
      </Card>

      <AdminUsers />

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

/**
 * Who can sign in to the dashboard.
 *
 * There are no roles: anyone listed here can do everything, including adding
 * and removing other people. The account you are signed in as is never
 * deletable, and neither is the last one left, so the shop cannot be locked.
 */
function AdminUsers() {
  const { pick } = useLang();
  const { toast, show } = useToast();

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({ username: "", password: "" });

  const load = useCallback(() => {
    setLoading(true);
    api.admin
      .admins()
      .then((res) => setAdmins(res.admins))
      .catch(() => show(pick("تعذّر تحميل الحسابات", "Could not load the accounts"), "error"))
      .finally(() => setLoading(false));
  }, [pick, show]);

  useEffect(load, [load]);

  const add = async () => {
    const username = draft.username.trim();
    if (!username) return;
    if (draft.password.length < 8) {
      show(pick("كلمة المرور لازم تكون ٨ حروف على الأقل", "Use at least 8 characters"), "error");
      return;
    }

    setBusy(true);
    try {
      await api.admin.createAdmin(username, draft.password);
      setDraft({ username: "", password: "" });
      show(pick("تمت إضافة الحساب", "Account added"));
      load();
    } catch (err) {
      show(
        err instanceof ApiError && err.code === "username_taken"
          ? pick("الاسم ده مستخدم قبل كده", "That username is already taken")
          : pick("فشلت الإضافة", "Could not add the account"),
        "error",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async (admin: AdminUser) => {
    if (!window.confirm(pick(`حذف حساب ${admin.username}؟`, `Remove ${admin.username}?`))) return;
    try {
      await api.admin.deleteAdmin(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      show(pick("تم حذف الحساب", "Account removed"));
    } catch {
      show(pick("فشل الحذف", "Could not remove the account"), "error");
    }
  };

  return (
    <Card title={pick("حسابات الدخول", "Dashboard accounts")}>
      {loading ? (
        <Loading label={pick("جاري التحميل...", "Loading...")} />
      ) : admins.length === 0 ? (
        <Empty label={pick("لا توجد حسابات", "No accounts")} />
      ) : (
        <Table head={[pick("الحساب", "Account"), pick("اتضاف في", "Added"), ""]}>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-2.5">
                <span className="font-bold text-slate-700" dir="ltr">
                  {admin.username}
                </span>
                {admin.you && (
                  <span className="ms-2 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700">
                    {pick("انت", "you")}
                  </span>
                )}
              </td>
              <td className="px-3 py-2.5 text-slate-500">
                <bdi>{admin.createdAt.slice(0, 10)}</bdi>
              </td>
              <td className="px-3 py-2.5 text-end">
                {!admin.you && (
                  <Button variant="danger" onClick={() => remove(admin)}>
                    {pick("حذف", "Remove")}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}

      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label={pick("اسم الدخول أو الإيميل", "Username or email")}>
          <Input
            dir="ltr"
            autoComplete="off"
            value={draft.username}
            onChange={(e) => setDraft({ ...draft, username: e.target.value })}
          />
        </Field>
        <Field
          label={pick("كلمة مرور مؤقتة", "Temporary password")}
          hint={pick("٨ حروف على الأقل", "At least 8 characters")}
        >
          <Input
            type="password"
            autoComplete="new-password"
            value={draft.password}
            onChange={(e) => setDraft({ ...draft, password: e.target.value })}
          />
        </Field>
        <Button onClick={add} disabled={busy || !draft.username.trim()}>
          {busy ? pick("جاري الإضافة...", "Adding...") : pick("إضافة حساب", "Add account")}
        </Button>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-400">
        {pick(
          "كل حساب هنا بيقدر يعمل كل حاجة — بما فيها إضافة وحذف حسابات تانية. قول للشخص يغيّر كلمة المرور المؤقتة من الصفحة دي أول ما يدخل.",
          "Every account here can do everything, including adding and removing other accounts. Ask the person to change their temporary password from this page as soon as they sign in.",
        )}
      </p>

      <ToastBar toast={toast} />
    </Card>
  );
}
