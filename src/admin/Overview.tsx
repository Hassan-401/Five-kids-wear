import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { api, type AdminStats, type OrderStatus } from "../lib/api";
import { Button, Card, Empty, Loading, StatusPill, Table, ToastBar, useToast } from "./ui";

/** The landing screen: the numbers that matter plus the latest orders. */
export default function Overview() {
  const { pick, price } = useLang();
  const { toast, show } = useToast();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.admin
      .stats()
      .then(setStats)
      .catch(() => show(pick("تعذّر تحميل البيانات", "Could not load the data"), "error"))
      .finally(() => setLoading(false));
  }, [pick, show]);

  useEffect(load, [load]);

  const seed = async () => {
    setSeeding(true);
    try {
      const res = await api.admin.seed();
      show(
        pick(
          `تم استيراد ${res.products} منتج و ${res.categories} قسم`,
          `Imported ${res.products} products and ${res.categories} categories`,
        ),
      );
      load();
    } catch {
      show(pick("فشل الاستيراد", "Import failed"), "error");
    } finally {
      setSeeding(false);
    }
  };

  if (loading && !stats) return <Loading label={pick("جاري التحميل...", "Loading...")} />;

  const cards = [
    { label: pick("الطلبات", "Orders"), value: String(stats?.orders ?? 0) },
    { label: pick("الإيرادات", "Revenue"), value: price(stats?.revenue ?? 0) },
    { label: pick("المنتجات", "Products"), value: String(stats?.products ?? 0) },
    { label: pick("غير متوفر", "Out of stock"), value: String(stats?.outOfStock ?? 0) },
  ];

  const statuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const statusLabel = (s: OrderStatus) =>
    ({
      pending: pick("قيد المراجعة", "Under review"),
      confirmed: pick("تم التأكيد", "Confirmed"),
      shipped: pick("تم الشحن", "Shipped"),
      delivered: pick("تم التسليم", "Delivered"),
      cancelled: pick("ملغي", "Cancelled"),
    })[s];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-extrabold text-slate-800">
        {pick("نظرة عامة", "Overview")}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">{c.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">
              <bdi>{c.value}</bdi>
            </p>
          </div>
        ))}
      </div>

      {/* an empty catalogue means the seed has not been imported yet */}
      {stats?.products === 0 && (
        <Card title={pick("ابدأ من هنا", "Start here")}>
          <p className="text-sm font-semibold text-slate-600">
            {pick(
              "قاعدة البيانات فاضية. اضغط الزر عشان تستورد المنتجات والأقسام اللي الموقع اتبنى عليها، وبعدها عدّل عليها زي ما تحب.",
              "The database is empty. Import the products and categories the site was built with, then edit them however you like.",
            )}
          </p>
          <Button onClick={seed} disabled={seeding} className="mt-4">
            {seeding
              ? pick("جاري الاستيراد...", "Importing...")
              : pick("استيراد المنتجات", "Import the catalogue")}
          </Button>
        </Card>
      )}

      <Card title={pick("حالة الطلبات", "Orders by status")}>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <span key={s} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <StatusPill status={s} label={statusLabel(s)} />
              <b className="text-sm text-slate-700">{stats?.byStatus[s] ?? 0}</b>
            </span>
          ))}
        </div>
      </Card>

      <Card
        title={pick("أحدث الطلبات", "Latest orders")}
        action={
          <Link
            to="/admin/orders"
            className="text-sm font-bold text-sky-600 hover:text-sky-700"
          >
            {pick("عرض الكل", "View all")}
          </Link>
        }
      >
        {stats && stats.recent.length > 0 ? (
          <Table
            head={[
              pick("رقم الطلب", "Order"),
              pick("العميل", "Customer"),
              pick("الإجمالي", "Total"),
              pick("الحالة", "Status"),
              pick("التاريخ", "Date"),
            ]}
          >
            {stats.recent.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-3">
                  <Link
                    to={`/admin/orders?q=${encodeURIComponent(o.id)}`}
                    dir="ltr"
                    className="font-bold text-sky-600 hover:underline"
                  >
                    {o.id}
                  </Link>
                </td>
                <td className="px-3 py-3 font-semibold text-slate-700">{o.name}</td>
                <td className="px-3 py-3 font-bold text-slate-800">
                  <bdi>{price(o.total)}</bdi>
                </td>
                <td className="px-3 py-3">
                  <StatusPill status={o.status} label={statusLabel(o.status)} />
                </td>
                <td className="px-3 py-3 text-slate-500">
                  <bdi>{o.createdAt.slice(0, 16)}</bdi>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty label={pick("لا توجد طلبات بعد", "No orders yet")} />
        )}
      </Card>

      <ToastBar toast={toast} />
    </div>
  );
}
