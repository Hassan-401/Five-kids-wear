import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import {
  api,
  type AdminOrder,
  type AdminOrderSummary,
  type OrderStatus,
} from "../lib/api";
import { bostaMessage } from "./bosta";
import {
  Button,
  Card,
  Empty,
  Input,
  Loading,
  Select,
  StatusPill,
  Table,
  ToastBar,
  useToast,
} from "./ui";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

/** Orders: filter the list, open one, move it along, or delete it. */
export default function Orders() {
  const { pick, price } = useLang();
  const { toast, show } = useToast();
  const [params, setParams] = useSearchParams();

  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<AdminOrder | null>(null);
  const [saving, setSaving] = useState(false);

  const status = params.get("status") ?? "";
  const q = params.get("q") ?? "";
  const [search, setSearch] = useState(q);

  const statusLabel = useCallback(
    (s: OrderStatus) =>
      ({
        pending: pick("قيد المراجعة", "Under review"),
        confirmed: pick("تم التأكيد", "Confirmed"),
        shipped: pick("تم الشحن", "Shipped"),
        delivered: pick("تم التسليم", "Delivered"),
        cancelled: pick("ملغي", "Cancelled"),
      })[s],
    [pick],
  );

  const load = useCallback(() => {
    setLoading(true);
    api.admin
      .orders({ status, q })
      .then((res) => setOrders(res.orders))
      .catch(() => show(pick("تعذّر تحميل الطلبات", "Could not load orders"), "error"))
      .finally(() => setLoading(false));
  }, [status, q, pick, show]);

  useEffect(load, [load]);

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (search.trim()) next.set("q", search.trim());
    else next.delete("q");
    setParams(next);
  };

  const setStatusFilter = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("status", value);
    else next.delete("status");
    setParams(next);
  };

  const openOrder = async (id: string) => {
    try {
      setOpen(await api.admin.order(id));
    } catch {
      show(pick("تعذّر فتح الطلب", "Could not open the order"), "error");
    }
  };

  const changeStatus = async (id: string, next: OrderStatus) => {
    setSaving(true);
    try {
      await api.admin.updateOrder(id, { status: next });
      show(pick("تم تحديث حالة الطلب", "Order status updated"));
      setOpen((prev) => (prev && prev.id === id ? { ...prev, status: next } : prev));
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
    } catch {
      show(pick("فشل التحديث", "Update failed"), "error");
    } finally {
      setSaving(false);
    }
  };

  /** Hands the order to Bosta and stores the tracking number it answers with. */
  const ship = async (id: string) => {
    setSaving(true);
    try {
      const shipment = await api.admin.shipOrder(id);
      show(
        pick(
          `تم إنشاء الشحنة — رقم التتبع ${shipment.trackingNumber}`,
          `Shipment created — tracking number ${shipment.trackingNumber}`,
        ),
      );
      // shipping also nudges a pending order to confirmed, so re-read it
      setOpen(await api.admin.order(id));
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, tracking: shipment.trackingNumber } : o)),
      );
    } catch (err) {
      show(bostaMessage(err, pick), "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(pick("متأكد من حذف الطلب؟", "Delete this order?"))) return;
    try {
      await api.admin.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setOpen(null);
      show(pick("تم حذف الطلب", "Order deleted"));
    } catch {
      show(pick("فشل الحذف", "Delete failed"), "error");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-extrabold text-slate-800">{pick("الطلبات", "Orders")}</h1>

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <form onSubmit={applySearch} className="flex flex-1 gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={pick("رقم الطلب أو الاسم أو التليفون", "Order, name or phone")}
            />
            <Button type="submit">{pick("بحث", "Search")}</Button>
          </form>

          <Select
            value={status}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-44"
          >
            <option value="">{pick("كل الحالات", "All statuses")}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <Loading label={pick("جاري التحميل...", "Loading...")} />
        ) : orders.length === 0 ? (
          <Empty label={pick("لا توجد طلبات", "No orders")} />
        ) : (
          <Table
            head={[
              pick("رقم الطلب", "Order"),
              pick("العميل", "Customer"),
              pick("المحافظة", "Governorate"),
              pick("الإجمالي", "Total"),
              pick("الحالة", "Status"),
              pick("التاريخ", "Date"),
              "",
            ]}
          >
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-3 font-bold text-slate-800" dir="ltr">
                  {o.id}
                  {o.tracking && (
                    <span className="block text-xs font-semibold text-sky-600">
                      {o.tracking}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <p className="font-semibold text-slate-700">{o.name}</p>
                  <p className="text-xs text-slate-400" dir="ltr">
                    {o.phone}
                  </p>
                </td>
                <td className="px-3 py-3 text-slate-600">{o.governorate}</td>
                <td className="px-3 py-3 font-bold text-slate-800">
                  <bdi>{price(o.total)}</bdi>
                </td>
                <td className="px-3 py-3">
                  <StatusPill status={o.status} label={statusLabel(o.status)} />
                </td>
                <td className="px-3 py-3 text-slate-500">
                  <bdi>{o.createdAt.slice(0, 16)}</bdi>
                </td>
                <td className="px-3 py-3 text-end">
                  <Button variant="ghost" onClick={() => openOrder(o.id)}>
                    {pick("تفاصيل", "Details")}
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {open && (
        <OrderDialog
          order={open}
          saving={saving}
          statusLabel={statusLabel}
          onClose={() => setOpen(null)}
          onStatus={(next) => changeStatus(open.id, next)}
          onShip={() => ship(open.id)}
          onDelete={() => remove(open.id)}
        />
      )}

      <ToastBar toast={toast} />
    </div>
  );
}

function OrderDialog({
  order,
  saving,
  statusLabel,
  onClose,
  onStatus,
  onShip,
  onDelete,
}: {
  order: AdminOrder;
  saving: boolean;
  statusLabel: (s: OrderStatus) => string;
  onClose: () => void;
  onStatus: (next: OrderStatus) => void;
  onShip: () => void;
  onDelete: () => void;
}) {
  const { pick, price } = useLang();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-extrabold text-slate-800" dir="ltr">
              {order.id}
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              <bdi>{order.createdAt.slice(0, 16)}</bdi>
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            {pick("إغلاق", "Close")}
          </Button>
        </header>

        <div className="flex flex-col gap-5 p-5">
          <section className="grid gap-3 sm:grid-cols-2">
            <Info label={pick("الاسم", "Name")} value={order.name} />
            <Info label={pick("التليفون", "Phone")} value={order.phone} ltr />
            <Info label={pick("البريد", "Email")} value={order.email || "—"} ltr />
            <Info label={pick("المحافظة", "Governorate")} value={order.governorate} />
            <Info
              label={pick("العنوان", "Address")}
              value={order.address}
              className="sm:col-span-2"
            />
            {order.notes && (
              <Info
                label={pick("ملاحظات", "Notes")}
                value={order.notes}
                className="sm:col-span-2"
              />
            )}
          </section>

          <section>
            <h3 className="mb-2 font-bold text-slate-700">{pick("المنتجات", "Items")}</h3>
            <ul className="flex flex-col gap-2">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-700">
                      {pick(item.nameAr, item.nameEn)}
                    </p>
                    <p className="text-xs text-slate-500">
                      <bdi>{item.size}</bdi> · {item.color} · ×{item.qty}
                    </p>
                  </div>
                  <b className="whitespace-nowrap text-slate-800">
                    <bdi>{price(item.price * item.qty)}</bdi>
                  </b>
                </li>
              ))}
            </ul>
          </section>

          <dl className="space-y-2 border-t border-slate-100 pt-4 text-sm font-bold text-slate-600">
            <div className="flex justify-between">
              <dt>{pick("المجموع الفرعي", "Subtotal")}</dt>
              <dd>
                <bdi>{price(order.subtotal)}</bdi>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>{pick("الشحن", "Shipping")}</dt>
              <dd>
                <bdi>{price(order.shipping)}</bdi>
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base text-slate-900">
              <dt>{pick("الإجمالي", "Total")}</dt>
              <dd>
                <bdi>{price(order.total)}</bdi>
              </dd>
            </div>
          </dl>

          <section className="border-t border-slate-100 pt-4">
            <h3 className="mb-2 font-bold text-slate-700">{pick("الشحن", "Shipping")}</h3>
            {order.tracking ? (
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-400">
                  {pick("رقم التتبع مع بوسطة", "Bosta tracking number")}
                </p>
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-extrabold text-sky-700 underline-offset-2 hover:underline"
                  dir="ltr"
                >
                  {order.tracking}
                </a>
                {order.bostaState && (
                  <p className="mt-1 text-xs font-semibold text-slate-500" dir="ltr">
                    {order.bostaState}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={onShip} disabled={saving || order.status === "cancelled"}>
                  {saving
                    ? pick("جاري الإنشاء...", "Creating...")
                    : pick("اشحن مع بوسطة", "Ship with Bosta")}
                </Button>
                <p className="text-xs font-semibold text-slate-400">
                  {pick(
                    "هيتعمل أوردر في بوسطة بنفس بيانات العميل، والتحصيل هيبقى إجمالي الطلب.",
                    "Creates the shipment in Bosta with this customer's details and collects the order total.",
                  )}
                </p>
              </div>
            )}
          </section>

          <section className="border-t border-slate-100 pt-4">
            <h3 className="mb-2 font-bold text-slate-700">{pick("تغيير الحالة", "Change status")}</h3>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatus(s)}
                  disabled={saving || order.status === s}
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed",
                    order.status === s
                      ? "bg-sky-600 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {statusLabel(s)}
                </button>
              ))}
            </div>
          </section>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <Button variant="danger" onClick={onDelete}>
              {pick("حذف الطلب", "Delete order")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  ltr,
  className = "",
}: {
  label: string;
  value: string;
  ltr?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className="font-semibold text-slate-700" dir={ltr ? "ltr" : undefined}>
        {value}
      </p>
    </div>
  );
}
