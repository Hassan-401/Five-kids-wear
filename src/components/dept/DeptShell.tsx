import { Link, NavLink } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import { departments, type Dept } from "../../data/departments";
import { ArrowRight } from "../Icons";

/**
 * Wraps a department page in its own design system and prints the section's
 * sub-navigation. `.dept-men` / `.dept-women` carry the palette + type tokens.
 */
export default function DeptShell({
  dept,
  children,
}: {
  dept: Dept;
  children: React.ReactNode;
}) {
  return (
    <div className={`dept dept-${dept}`}>
      <DeptNav dept={dept} />
      {children}
      <DeptService dept={dept} />
    </div>
  );
}

export function DeptNav({ dept }: { dept: Dept }) {
  const { pick } = useLang();
  const meta = departments[dept];
  const other = dept === "men" ? "women" : "men";

  return (
    <nav
      className="border-b"
      style={{ borderColor: "var(--d-line)", background: "var(--d-page)" }}
    >
      {/* the header logo hangs past its bar on the end side — keep clear of it */}
      <div className="dept-wrap flex items-center gap-5 overflow-x-auto no-scrollbar py-3.5 lg:pe-32">
        <Link
          to={`/${dept}`}
          className="shrink-0 text-sm font-extrabold tracking-[0.2em] uppercase"
        >
          {pick(meta.name.ar, meta.name.en)}
        </Link>

        <span
          className="shrink-0 w-px h-4"
          style={{ background: "var(--d-line)" }}
        />

        <div className="flex items-center gap-4">
          {meta.subs.map((s) => (
            <NavLink
              key={s.slug}
              to={`/${dept}/${s.slug}`}
              className={({ isActive }) =>
                [
                  "shrink-0 whitespace-nowrap text-[0.78rem] font-semibold transition",
                  isActive ? "opacity-100 underline underline-offset-8" : "opacity-60 hover:opacity-100",
                ].join(" ")
              }
            >
              {pick(s.name.ar, s.name.en)}
            </NavLink>
          ))}
        </div>

        <Link
          to={`/${other}`}
          className="ms-auto shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap text-[0.72rem] font-bold uppercase tracking-[0.18em] opacity-70 hover:opacity-100 transition"
        >
          {pick(departments[other].name.ar, departments[other].name.en)}
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </nav>
  );
}

/** Small service promises strip, themed per department. */
function DeptService({ dept }: { dept: Dept }) {
  const { pick } = useLang();

  const items = [
    {
      ar: "شحن لكل محافظات مصر",
      en: "Delivery across Egypt",
      subAr: "٢–٤ أيام عمل",
      subEn: "2–4 working days",
    },
    {
      ar: "استبدال خلال ١٤ يوم",
      en: "14-day exchanges",
      subAr: "من غير أسئلة",
      subEn: "No questions asked",
    },
    {
      ar: "الدفع عند الاستلام",
      en: "Cash on delivery",
      subAr: "أو بالبطاقة",
      subEn: "Or pay by card",
    },
    {
      ar: "خامات مختارة",
      en: "Selected fabrics",
      subAr: "مفحوصة قطعة قطعة",
      subEn: "Checked piece by piece",
    },
  ];

  return (
    <section
      className="border-t"
      style={{ borderColor: "var(--d-line)" }}
    >
      <div className="dept-wrap grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.en}
            className={[
              "py-8 px-2 text-center",
              i % 2 === 1 ? "border-s" : "",
              i >= 2 ? "border-t lg:border-t-0" : "",
              dept === "men" && i === 2 ? "lg:border-s" : "",
              dept === "women" && i === 2 ? "lg:border-s" : "",
            ].join(" ")}
            style={{ borderColor: "var(--d-line)" }}
          >
            <p className="text-sm font-bold">{pick(it.ar, it.en)}</p>
            <p
              className="text-xs mt-1.5"
              style={{ color: "var(--d-muted)" }}
            >
              {pick(it.subAr, it.subEn)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Endless word strip used between sections. */
export function DeptMarquee({ text, tone = "deep" }: { text: string; tone?: "deep" | "soft" }) {
  const words = Array.from({ length: 2 }).flatMap(() => text.split(" · "));

  return (
    <div
      className="overflow-hidden py-3.5"
      style={
        tone === "deep"
          ? { background: "var(--d-deep)", color: "var(--d-page)" }
          : { background: "var(--d-panel)", color: "var(--d-ink)" }
      }
    >
      <div className="dept-marquee text-[0.72rem] font-bold uppercase tracking-[0.28em]">
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center gap-6">
            {w}
            <span className="opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
