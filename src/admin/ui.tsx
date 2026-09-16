/**
 * The dashboard's shared furniture.
 *
 * The storefront is a cartoon; this is a back office — flat surfaces, one
 * accent colour, dense tables. It still follows the site's language and
 * direction, so every label is written with `pick()` right where it is used
 * rather than going through the storefront's translation table.
 */
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { OrderStatus } from "../lib/api";

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          {typeof title === "string" ? (
            <h2 className="font-bold text-slate-800">{title}</h2>
          ) : (
            title
          )}
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
  className = "",
}: ButtonProps) {
  const styles = {
    primary: "bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-300",
    ghost: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "border border-red-200 text-red-600 hover:bg-red-50",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-bold text-slate-700">{label}</span>
      {children}
      {hint && <span className="text-xs font-medium text-slate-400">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-24 rounded-xl ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-sky-600"
      />
      {label}
    </label>
  );
}

/* --------------------------------------------------------------- status */

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-sky-100 text-sky-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export function StatusPill({ status, label }: { status: OrderStatus; label: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------- toast */

export type Toast = { message: string; tone: "ok" | "error" };

/** A single transient message, cleared after a few seconds. */
export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const show = useCallback(
    (message: string, tone: Toast["tone"] = "ok") => setToast({ message, tone }),
    [],
  );

  return { toast, show };
}

export function ToastBar({ toast }: { toast: Toast | null }) {
  if (!toast) return null;
  return (
    <div
      role="status"
      className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg ${
        toast.tone === "ok" ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      {toast.message}
    </div>
  );
}

/* ---------------------------------------------------------------- misc */

export function Loading({ label }: { label: string }) {
  return (
    <div className="grid place-items-center gap-3 py-16 text-slate-400">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

export function Empty({ label }: { label: string }) {
  return (
    <p className="py-14 text-center text-sm font-bold text-slate-400">{label}</p>
  );
}

/** Table shell — the dashboard's tables scroll sideways on a phone. */
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-start">
            {head.map((h) => (
              <th key={h} className="px-3 py-2.5 text-start font-bold text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
