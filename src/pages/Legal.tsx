import PageHeader from "../components/PageHeader";
import Newsletter from "../components/Newsletter";
import { useLang } from "../i18n/LanguageContext";

type Section = { ar: [string, string]; en: [string, string] };

const privacySections: Section[] = [
  {
    ar: [
      "البيانات التي نجمعها",
      "نجمع الاسم ورقم الهاتف والبريد الإلكتروني وعنوان الشحن فقط لتنفيذ طلبك والتواصل معك بشأنه.",
    ],
    en: [
      "Data we collect",
      "We collect your name, phone number, email and shipping address only to fulfil your order and contact you about it.",
    ],
  },
  {
    ar: [
      "كيف نستخدم بياناتك",
      "نستخدم بياناتك لتجهيز الطلبات، وتحسين تجربة التسوق، وإرسال العروض إذا اخترت الاشتراك في النشرة البريدية.",
    ],
    en: [
      "How we use your data",
      "We use your data to prepare orders, improve the shopping experience, and send offers if you opted into the newsletter.",
    ],
  },
  {
    ar: [
      "مشاركة البيانات",
      "لا نبيع بياناتك لأي جهة. نشاركها فقط مع شركة الشحن وبوابة الدفع بالقدر اللازم لإتمام الطلب.",
    ],
    en: [
      "Sharing your data",
      "We never sell your data. We share it only with the shipping company and payment gateway, and only as needed to complete an order.",
    ],
  },
  {
    ar: [
      "ملفات تعريف الارتباط",
      "نستخدم الكوكيز لحفظ سلة التسوق واللغة المفضلة لديك، ويمكنك حذفها من إعدادات المتصفح في أي وقت.",
    ],
    en: [
      "Cookies",
      "We use cookies to remember your cart and preferred language. You can clear them from your browser settings at any time.",
    ],
  },
  {
    ar: [
      "حقوقك",
      "يمكنك طلب الاطلاع على بياناتك أو تعديلها أو حذفها بالتواصل معنا عبر صفحة تواصل معنا.",
    ],
    en: [
      "Your rights",
      "You can request access to, correction of, or deletion of your data by reaching us through the contact page.",
    ],
  },
];

const termsSections: Section[] = [
  {
    ar: [
      "قبول الشروط",
      "باستخدامك للموقع فإنك توافق على هذه الشروط. إذا كنت لا توافق عليها يرجى عدم استخدام الموقع.",
    ],
    en: [
      "Acceptance of terms",
      "By using this site you agree to these terms. If you do not agree, please do not use the site.",
    ],
  },
  {
    ar: [
      "الأسعار والمنتجات",
      "جميع الأسعار بالجنيه المصري وشاملة الضريبة. نحتفظ بحق تعديل الأسعار أو إيقاف أي منتج دون إشعار مسبق.",
    ],
    en: [
      "Prices and products",
      "All prices are in Egyptian pounds and include tax. We reserve the right to change prices or discontinue any product without prior notice.",
    ],
  },
  {
    ar: [
      "الطلبات والدفع",
      "يتم تأكيد الطلب بعد التواصل معك هاتفياً. تتوفر خيارات الدفع عند الاستلام والبطاقات والمحافظ الإلكترونية.",
    ],
    en: [
      "Orders and payment",
      "Orders are confirmed after a phone call with you. Cash on delivery, cards, and e-wallets are available.",
    ],
  },
  {
    ar: [
      "الشحن والتسليم",
      "مدة التوصيل من ٢ إلى ٥ أيام عمل داخل مصر. الشحن مجاني للطلبات فوق ١٠٠٠ جنيه.",
    ],
    en: [
      "Shipping and delivery",
      "Delivery takes 2 to 5 working days inside Egypt. Shipping is free on orders above 1000 EGP.",
    ],
  },
  {
    ar: [
      "الاستبدال والاسترجاع",
      "يمكنك الاستبدال أو الاسترجاع خلال ١٤ يوماً من الاستلام بشرط بقاء المنتج بحالته الأصلية مع الفاتورة.",
    ],
    en: [
      "Returns and exchanges",
      "You may return or exchange within 14 days of delivery, provided the product is in its original condition with the receipt.",
    ],
  },
  {
    ar: [
      "الملكية الفكرية",
      "جميع الصور والتصميمات والشعارات على الموقع مملوكة لـ The Five Kids Wear ولا يجوز استخدامها دون إذن.",
    ],
    en: [
      "Intellectual property",
      "All images, designs and logos on this site belong to The Five Kids Wear and may not be used without permission.",
    ],
  },
];

export default function Legal({ kind }: { kind: "privacy" | "terms" }) {
  const { t, pick } = useLang();
  const sections = kind === "privacy" ? privacySections : termsSections;
  const title = kind === "privacy" ? t("privacy.title") : t("terms.title");

  return (
    <>
      <PageHeader title={title} crumbs={[{ label: title }]} />

      <div className="container-x py-12">
        <article className="card-soft max-w-3xl mx-auto p-7 sm:p-10">
          <p className="text-sm font-bold text-navy-600/55 mb-8">
            {t("legal.updated")}: 2026-09-01
          </p>

          <ol className="flex flex-col gap-8">
            {sections.map((s, i) => {
              const [heading, body] = pick(s.ar, s.en);
              return (
                <li key={heading} className="flex gap-4">
                  <span className="grid place-items-center shrink-0 w-9 h-9 rounded-full bg-pink-100 text-pink-600 font-extrabold">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="text-lg font-extrabold text-navy-600 mb-1.5">
                      {heading}
                    </h2>
                    <p className="font-semibold leading-relaxed text-navy-600/80">
                      {body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </article>
      </div>

      <Newsletter />
    </>
  );
}
