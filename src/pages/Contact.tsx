import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Newsletter from "../components/Newsletter";
import { useLang } from "../i18n/LanguageContext";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "../components/Icons";
import { Star } from "../components/Decor";

const socials = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: TiktokIcon, href: "#", label: "TikTok" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube" },
  { Icon: WhatsappIcon, href: "#", label: "WhatsApp" },
];

export default function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    (e.target as HTMLFormElement).reset();
  };

  const info = [
    { Icon: PhoneIcon, label: t("contact.phone"), value: "+20 100 000 0000", ltr: true },
    { Icon: MailIcon, label: t("contact.email"), value: "hello@fivekidswear.com", ltr: true },
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
                <input required className="field" onChange={() => setSent(false)} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-bold text-navy-600 text-sm">
                  {t("checkout.email")}
                </span>
                <input type="email" required className="field" />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-bold text-navy-600 text-sm">
                  {t("contact.subject")}
                </span>
                <input required className="field" />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-bold text-navy-600 text-sm">
                  {t("contact.message")}
                </span>
                <textarea rows={6} required className="field" />
              </label>
            </div>

            <button type="submit" className="btn-primary mt-6">
              {t("common.send")}
            </button>

            {sent && (
              <p className="mt-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold px-4 py-3 anim-pop">
                {t("contact.sent")}
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
