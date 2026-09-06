import { useLang } from "../i18n/LanguageContext";
import { BadgeIcon, ShieldIcon, SupportIcon, TruckIcon } from "./Icons";
import { CloudDivider, Heart, Sparkle } from "./Decor";

const features = [
  { Icon: TruckIcon, title: "feat.shipping.title", sub: "feat.shipping.sub" },
  { Icon: ShieldIcon, title: "feat.payment.title", sub: "feat.payment.sub" },
  { Icon: BadgeIcon, title: "feat.quality.title", sub: "feat.quality.sub" },
  { Icon: SupportIcon, title: "feat.support.title", sub: "feat.support.sub" },
];

export default function FeatureStrip() {
  const { t } = useLang();

  return (
    <section className="relative mt-12 bg-gradient-to-l from-sky-100 via-pink-50 to-pink-100">
      <CloudDivider className="absolute -top-px inset-x-0 w-full h-8 sm:h-12" fill="#fffaf5" />
      <CloudDivider
        className="absolute -bottom-px inset-x-0 w-full h-8 sm:h-12"
        fill="#fffaf5"
        flip
      />

      <div className="container-x relative py-20 sm:py-24">
        <img
          src="/images/avatars/boy.png"
          alt=""
          aria-hidden="true"
          className="hidden xl:block absolute bottom-0 start-0 w-40 select-none pointer-events-none"
        />
        <img
          src="/images/avatars/girl.png"
          alt=""
          aria-hidden="true"
          className="hidden xl:block absolute bottom-0 end-0 w-40 select-none pointer-events-none"
        />
        <Sparkle className="absolute top-14 start-[26%] w-5 h-5 anim-float-slow" />
        <Heart className="absolute top-16 end-[28%] w-5 h-5 anim-float" color="#ff8ac0" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 xl:px-40">
          {features.map(({ Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-2 rounded-[2rem] bg-white/85 backdrop-blur px-4 py-6 shadow-card border border-white transition hover:-translate-y-1.5 hover:bg-white"
            >
              <span className="grid place-items-center w-14 h-14 rounded-2xl bg-sky-100 text-sky-500">
                <Icon className="w-7 h-7" />
              </span>
              <h3 className="font-extrabold text-navy-600 leading-snug">{t(title)}</h3>
              <p className="text-sm font-semibold text-navy-600/65">{t(sub)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
