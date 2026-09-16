import { useCallback, useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { api, type InboxMessage } from "../lib/api";
import {
  Button,
  Card,
  Empty,
  Loading,
  Select,
  Table,
  ToastBar,
  useToast,
} from "./ui";

/**
 * The contact inbox.
 *
 * Messages from the contact form and addresses from the newsletter box both
 * land here — before this page existed, the storefront thanked the customer and
 * dropped the message.
 */
export default function Messages() {
  const { pick } = useLang();
  const { toast, show } = useToast();

  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("");
  const [open, setOpen] = useState<InboxMessage | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api.admin
      .messages(kind)
      .then((res) => setMessages(res.messages))
      .catch(() => show(pick("تعذّر تحميل الرسائل", "Could not load messages"), "error"))
      .finally(() => setLoading(false));
  }, [kind, pick, show]);

  useEffect(load, [load]);

  const setHandled = async (message: InboxMessage, handled: boolean) => {
    try {
      await api.admin.updateMessage(message.id, handled);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, handled } : m)),
      );
      setOpen((prev) => (prev && prev.id === message.id ? { ...prev, handled } : prev));
    } catch {
      show(pick("فشل التحديث", "Update failed"), "error");
    }
  };

  const remove = async (message: InboxMessage) => {
    if (!window.confirm(pick("متأكد من حذف الرسالة؟", "Delete this message?"))) return;
    try {
      await api.admin.deleteMessage(message.id);
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
      setOpen(null);
      show(pick("تم الحذف", "Deleted"));
    } catch {
      show(pick("فشل الحذف", "Delete failed"), "error");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-extrabold text-slate-800">{pick("الرسائل", "Messages")}</h1>

      <Card>
        <Select value={kind} onChange={(e) => setKind(e.target.value)} className="w-56">
          <option value="">{pick("الكل", "Everything")}</option>
          <option value="contact">{pick("رسائل تواصل معنا", "Contact messages")}</option>
          <option value="newsletter">{pick("مشتركي النشرة", "Newsletter sign-ups")}</option>
        </Select>
      </Card>

      <Card>
        {loading ? (
          <Loading label={pick("جاري التحميل...", "Loading...")} />
        ) : messages.length === 0 ? (
          <Empty label={pick("مفيش رسائل", "No messages")} />
        ) : (
          <Table
            head={[
              pick("النوع", "Type"),
              pick("من", "From"),
              pick("الموضوع", "Subject"),
              pick("التاريخ", "Date"),
              "",
            ]}
          >
            {messages.map((m) => (
              <tr
                key={m.id}
                className={`border-b border-slate-100 last:border-0 ${m.handled ? "" : "bg-sky-50/40"}`}
              >
                <td className="px-3 py-3">
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${
                      m.kind === "newsletter"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {m.kind === "newsletter"
                      ? pick("نشرة", "Newsletter")
                      : pick("رسالة", "Message")}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {m.name && <p className="font-semibold text-slate-700">{m.name}</p>}
                  <p className="text-xs text-slate-400" dir="ltr">
                    {m.email}
                  </p>
                </td>
                <td className="max-w-[18rem] truncate px-3 py-3 text-slate-600">
                  {m.subject || (m.kind === "newsletter" ? "—" : m.body.slice(0, 60))}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-slate-500">
                  <bdi>{m.createdAt.slice(0, 16)}</bdi>
                </td>
                <td className="px-3 py-3 text-end">
                  {m.kind === "newsletter" ? (
                    <Button variant="danger" onClick={() => remove(m)}>
                      {pick("حذف", "Delete")}
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => setOpen(m)}>
                      {pick("فتح", "Open")}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {open && (
        <MessageDialog
          message={open}
          onClose={() => setOpen(null)}
          onHandled={(v) => setHandled(open, v)}
          onDelete={() => remove(open)}
        />
      )}

      <ToastBar toast={toast} />
    </div>
  );
}

function MessageDialog({
  message,
  onClose,
  onHandled,
  onDelete,
}: {
  message: InboxMessage;
  onClose: () => void;
  onHandled: (handled: boolean) => void;
  onDelete: () => void;
}) {
  const { pick } = useLang();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4">
      <div className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate font-extrabold text-slate-800">
              {message.subject || pick("بدون موضوع", "No subject")}
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              <bdi>{message.createdAt.slice(0, 16)}</bdi>
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            {pick("إغلاق", "Close")}
          </Button>
        </header>

        <div className="flex flex-col gap-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold text-slate-400">{pick("الاسم", "Name")}</p>
              <p className="font-semibold text-slate-700">{message.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">{pick("البريد", "Email")}</p>
              <a
                href={`mailto:${message.email}`}
                className="font-semibold text-sky-700 hover:underline"
                dir="ltr"
              >
                {message.email}
              </a>
            </div>
          </div>

          {/* whitespace-pre-wrap keeps the customer's own line breaks */}
          <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-slate-700">
            {message.body}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <Button
              variant={message.handled ? "ghost" : "primary"}
              onClick={() => onHandled(!message.handled)}
            >
              {message.handled
                ? pick("علّمها كغير مقروءة", "Mark as unread")
                : pick("تم الرد عليها", "Mark as handled")}
            </Button>
            <Button variant="danger" onClick={onDelete}>
              {pick("حذف", "Delete")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
