import PageHeader from "../components/PageHeader";
import Newsletter from "../components/Newsletter";
import FeatureStrip from "../components/FeatureStrip";
import { SectionTitle } from "../components/CategoryGrid";
import { useLang } from "../i18n/LanguageContext";
import { BadgeIcon, ShieldIcon, SupportIcon } from "../components/Icons";
import { Moon, Star } from "../components/Decor";

export default function About() {
  const { t } = useLang();

  const values = [
    { Icon: ShieldIcon, title: "about.values.1.title", body: "about.values.1.body" },
    { Icon: BadgeIcon, title: "about.values.2.title", body: "about.values.2.body" },
    { Icon: SupportIcon, title: "about.values.3.title", body: "about.values.3.body" },
  ];

  const stats = [
    { value: "12K+", key: "about.stats.customers" },
    { value: "350+", key: "about.stats.products" },
    { value: "27", key: "about.stats.cities" },
    { value: "6", key: "about.stats.years" },
  ];

  return (
    <>
      <PageHeader
        title={t("about.title")}
        subtitle={t("about.lead")}
        crumbs={[{ label: t("about.title") }]}
      />

      <section className="container-x py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <Moon className="absolute -top-2 start-6 w-14 h-14 anim-float-slow" />
            <img
              src="/images/logo.webp"
              alt=""
              aria-hidden="true"
              className="w-full max-w-sm mx-auto drop-shadow-[0_20px_25px_rgba(34,53,140,.22)]"
            />
          </div>

          <div className="relative">
            <Star className="absolute -top-4 end-2 w-6 h-6 anim-float" color="#ffb3d2" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-600 mb-4">
              {t("about.story.title")}
            </h2>
            <p className="text-lg font-semibold leading-relaxed text-navy-600/85">
              {t("about.story.body")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {stats.map((s) => (
                <div
                  key={s.key}
                  className="rounded-3xl bg-gradient-to-b from-pink-50 to-white border border-pink-100 px-3 py-5 text-center shadow-card"
                >
                  <p dir="ltr" className="text-2xl font-extrabold text-pink-600">
                    {s.value}
                  </p>
                  <p className="text-xs font-bold text-navy-600/70 mt-1 leading-snug">
                    {t(s.key)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-8">
        <SectionTitle>{t("about.values.title")}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-5">
          {values.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="card-soft p-7 text-center transition hover:-translate-y-1.5"
            >
              <span className="grid place-items-center w-16 h-16 mx-auto rounded-3xl bg-sky-100 text-sky-500">
                <Icon className="w-8 h-8" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-navy-600">{t(title)}</h3>
              <p className="mt-2 font-semibold text-navy-600/70">{t(body)}</p>
            </div>
          ))}
        </div>
      </section>

      <FeatureStrip />
      <Newsletter />
    </>
  );
}
