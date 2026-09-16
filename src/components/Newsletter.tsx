import { useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { MailIcon } from "./Icons";
import { api } from "../lib/api";
import { Bolt, CloudDivider, Sparkle } from "./Decor";

export default function Newsletter() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || busy) return;

    setBusy(true);
    setFailed(false);
    try {
      await api.sendMessage({ kind: "newsletter", email: email.trim() });
      setDone(true);
      setEmail("");
    } catch {
      // signing up twice already counts as success on the server, so reaching
      // here means the address never got stored
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-l from-sky-100 via-sky-50 to-pink-100 mt-16">
      <CloudDivider className="absolute -top-px inset-x-0 w-full h-10 sm:h-14" fill="#f6fbff" />

      <div className="container-x relative pt-20 pb-16">
        <Sparkle className="absolute top-14 start-[20%] w-6 h-6 anim-twinkle" />
        <Bolt className="absolute top-24 end-[24%] w-5 h-5 anim-float" color="#ff8ac0" />

        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-start">
          <div className="flex items-center gap-4">
            <span className="grid place-items-center shrink-0 w-16 h-16 rounded-3xl bg-sky-500 text-white shadow-[0_5px_0_var(--color-sky-700)]">
              <MailIcon className="w-8 h-8" />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-600">
                {t("news.title")}
              </h2>
              <p className="text-navy-600/80 font-semibold">{t("news.sub")}</p>
            </div>
          </div>

          <form onSubmit={submit} className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-full sm:rounded-full p-2 shadow-card">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setDone(false);
                  setFailed(false);
                }}
                placeholder={t("news.placeholder")}
                aria-label={t("news.placeholder")}
                className="flex-1 rounded-full px-5 py-2.5 outline-none bg-transparent"
              />
              <button type="submit" className="btn-primary px-8 py-2.5" disabled={busy}>
                {busy ? t("common.loading") : t("news.cta")}
              </button>
            </div>
            {done && (
              <p className="mt-3 font-bold text-pink-600 anim-pop">{t("news.done")}</p>
            )}
            {failed && (
              <p role="alert" className="mt-3 font-bold text-red-600">
                {t("news.failed")}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
