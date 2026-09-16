import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Newsletter from "../components/Newsletter";
import { useLang } from "../i18n/LanguageContext";
import { useCatalog } from "../context/CatalogContext";
import { ApiError, api } from "../lib/api";
import { socialLinks } from "../lib/socials";
import {
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from "../components/Icons";
import { Star } from "../components/Decor";

export default function Contact() {
  const { t } = useLang();
  const { settings } = useCatalog();
  const socials = socialLinks(settings);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    setSending(true);
    setError(null);
    try {
      await api.sendMessage({
        kind: "contact",
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: String(data.get("subject") ?? ""),
        body: String(data.get("message") ?? ""),
      });
      setSent(true);
      form.reset();
    } catch (err) {
      // the owner reads these in the dashboard, so a failure has to be shown —
      // a thank-you over a message that never arrived is worse than an error
      setError(
        err instanceof ApiError && err.code === "too_many_messages"
          ? t("contact.tooMany")
          : t("contact.failed"),
      );
    } finally {
      setSending(false);
    }
  };

  type InfoRow = {
    Icon: typeof PhoneIcon;
    label: string;
    value: string;
    ltr?: boolean;
  };

  // the phone and email come from the dashboard; a blank one is simply hidden
  const info: InfoRow[] = [
    ...(settings.phone
      ? [{ Icon: PhoneIcon, label: t("contact.phone"), value: settings.phone, ltr: true }]
      : []),
    ...(settings.email
      ? [{ Icon: MailIcon, label: t("contact.email"), value: settings.email, ltr: true }]
      : []),
    { Icon: PinIcon, label: t("contact.address"), value: t("contact.addressValue") },
    { Icon: ClockIcon, label: t("contact.hours"), value: t("contact.hoursValue") },
  ];

  return (
    <>
      <PageHeader
        title={t("contact.title")}
        subtitle={t("contact.sub")}
        crumbs={[{ label: t("contact.title") }]}
      />

      <div className="container-x py-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <form onSubmit={submit} className="card-soft p-6 sm:p-8 relative overflow-hidden">
            <Star className="absolute top-5 end-6 w-5 h-5 anim-float" color="#ffb3d2" />

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-bold text-navy-600 text-sm">
                  {t("contact.name")}
                </span>
                <input
                  name="name"
                  required
                  className="field"
                  onChange={() => setSent(false)}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-bold text-navy-600 text-sm">
                  {t("checkout.email")}
                </span>
                <input name="email" type="email" required className="field" />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-bold text-navy-600 text-sm">
                  {t("contact.subject")}
                </span>
                <input name="subject" required className="field" />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-bold text-navy-600 text-sm">
                  {t("contact.message")}
                </span>
                <textarea name="message" rows={6} required className="field" />
              </label>
            </div>

            <button type="submit" className="btn-primary mt-6" disabled={sending}>
              {sending ? t("common.loading") : t("common.send")}
            </button>

            {sent && (
              <p className="mt-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold px-4 py-3 anim-pop">
                {t("contact.sent")}
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-2xl bg-red-50 text-red-700 font-bold px-4 py-3"
              >
                {error}
              </p>
            )}
          </form>

          <aside className="flex flex-col gap-4">
            {info.map(({ Icon, label, value, ltr }) => (
              <div key={label} className="card-soft flex items-center gap-4 p-5">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-pink-100 text-pink-500 shrink-0">
                  <Icon className="w-6 h-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy-600/60">{label}</p>
                  <p className="font-extrabold text-navy-600 break-words">
                    <bdi dir={ltr ? "ltr" : undefined}>{value}</bdi>
                  </p>
                </div>
              </div>
            ))}

            <div className="card-soft p-5">
              <p className="font-bold text-navy-600 mb-3">{t("footer.follow")}</p>
              <div className="flex gap-2.5">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="grid place-items-center w-10 h-10 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white transition"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Newsletter />
    </>
  );
}
