import { Link } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";

/** Shown in place of the product grid while a department has no products yet. */
export default function DeptEmpty() {
  const { pick } = useLang();

  return (
    <div
      className="border py-16 px-6 text-center"
      style={{ borderColor: "var(--d-line)", borderRadius: "var(--d-radius)" }}
    >
      <p className="dept-h2 text-xl sm:text-2xl">
        {pick("القطع الجديدة في الطريق", "New pieces are on the way")}
      </p>
      <p className="mt-3 text-sm leading-7" style={{ color: "var(--d-muted)" }}>
        {pick(
          "لا توجد منتجات في هذا القسم حالياً — ترقّبوا الإضافات الجديدة قريباً.",
          "There are no products in this section yet — check back soon.",
        )}
      </p>
      <Link to="/shop" className="dept-btn-outline mt-7">
        {pick("تسوّق ملابس الأطفال", "Shop kids wear")}
      </Link>
    </div>
  );
}
