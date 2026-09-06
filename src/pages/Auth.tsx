import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useLang } from "../i18n/LanguageContext";
import { useStore } from "../context/StoreContext";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  UserIcon,
} from "../components/Icons";
import { Heart } from "../components/Decor";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const { t } = useLang();
  const { signIn } = useStore();
  const navigate = useNavigate();

  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({
      name: name.trim() || email.split("@")[0] || "Guest",
      email: email.trim(),
    });
    navigate("/account");
  };

  return (
    <>
      <PageHeader
        title={isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
        subtitle={isLogin ? t("auth.loginSub") : t("auth.registerSub")}
        crumbs={[{ label: isLogin ? t("common.login") : t("common.register") }]}
      />

      <div className="container-x py-12">
        <div className="card-soft max-w-md mx-auto p-8 relative overflow-hidden">
          <Heart className="absolute top-5 end-6 w-5 h-5 anim-float" color="#ffb3d2" />

          <img
            src="/images/logo.png"
            alt=""
            aria-hidden="true"
            className="w-28 mx-auto -mt-2 mb-2"
          />

          <form onSubmit={submit} className="flex flex-col gap-4">
            {!isLogin && (
              <LabeledInput
                label={t("checkout.fullName")}
                value={name}
                onChange={setName}
                icon={<UserIcon className="w-5 h-5" />}
                required
              />
            )}

            <LabeledInput
              label={t("checkout.email")}
              type="email"
              value={email}
              onChange={setEmail}
              icon={<MailIcon className="w-5 h-5" />}
              required
            />

            <label className="flex flex-col gap-1.5">
              <span className="font-bold text-navy-600 text-sm">
                {t("auth.password")}
              </span>
              <input type="password" required minLength={6} className="field" />
            </label>

            {!isLogin && (
              <label className="flex flex-col gap-1.5">
                <span className="font-bold text-navy-600 text-sm">
                  {t("auth.confirmPassword")}
                </span>
                <input type="password" required minLength={6} className="field" />
              </label>
            )}

            {isLogin && (
              <button
                type="button"
                className="self-end text-sm font-bold text-pink-600 hover:underline"
              >
                {t("auth.forgot")}
              </button>
            )}

            <button type="submit" className="btn-primary w-full mt-1">
              {isLogin ? t("common.login") : t("common.register")}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 text-navy-600/40 text-sm font-bold">
            <span className="flex-1 h-px bg-pink-100" />
            or
            <span className="flex-1 h-px bg-pink-100" />
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1 !py-2.5">
              <FacebookIcon className="w-5 h-5" />
              Facebook
            </button>
            <button className="btn-ghost flex-1 !py-2.5">
              <InstagramIcon className="w-5 h-5" />
              Instagram
            </button>
          </div>

          <p className="text-center font-semibold text-navy-600/70 mt-6">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="font-extrabold text-pink-600 hover:underline"
            >
              {isLogin ? t("common.register") : t("common.login")}
            </Link>
          </p>

          <p className="text-xs text-center text-navy-600/45 font-semibold mt-4">
            {t("common.demoNote")}
          </p>
        </div>
      </div>
    </>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  icon,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold text-navy-600 text-sm">{label}</span>
      <div className="relative">
        <span className="absolute inset-y-0 start-0 ps-4 flex items-center text-pink-400">
          {icon}
        </span>
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field ps-12"
        />
      </div>
    </label>
  );
}
