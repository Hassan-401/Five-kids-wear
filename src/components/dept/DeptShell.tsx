import { Link, NavLink } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import { departments, type Dept } from "../../data/departments";
import { ArrowRight } from "../Icons";

/**
 * Wraps a department page in its own design system and prints the section's
 * sub-navigation. `.dept-men` / `.dept-women` carry the type + shape tokens;
 * the palette itself stays neutral (white page, near-black ink).
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
                  isActive
                    ? "opacity-100 underline underline-offset-8"
                    : "opacity-60 hover:opacity-100",
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
