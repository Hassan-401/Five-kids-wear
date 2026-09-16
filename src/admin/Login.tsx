import { useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { ApiError, api } from "../lib/api";
import { Button, Field, Input } from "./ui";

/** The dashboard sign-in. The only account on the site belongs to the owner. */
export default function Login({ onSignedIn }: { onSignedIn: (username: string) => void }) {
  const { pick } = useLang();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const me = await api.admin.login(username.trim(), password);
      onSignedIn(me.username);
    } catch (err) {
      setError(
        err instanceof ApiError && err.code === "invalid_credentials"
          ? pick("اسم المستخدم أو كلمة المرور غير صحيحة", "Wrong username or password")
          : pick("تعذّر تسجيل الدخول، حاول تاني", "Could not sign in, please try again"),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-slate-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
      >
        <img src="/images/logo.webp" alt="" aria-hidden="true" className="mx-auto h-20 w-auto" />
        <h1 className="mt-4 text-center text-xl font-extrabold text-slate-800">
          {pick("لوحة التحكم", "Dashboard")}
        </h1>
        <p className="mt-1 text-center text-sm font-semibold text-slate-500">
          {pick("سجّل الدخول لإدارة المتجر", "Sign in to manage the store")}
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <Field label={pick("اسم المستخدم", "Username")}>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>
          <Field label={pick("كلمة المرور", "Password")}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" disabled={busy} className="mt-6 w-full">
          {busy ? pick("جاري الدخول...", "Signing in...") : pick("دخول", "Sign in")}
        </Button>

        <a
          href="/"
          className="mt-4 block text-center text-sm font-bold text-slate-400 hover:text-sky-600"
        >
          {pick("العودة للمتجر", "Back to the store")}
        </a>
      </form>
    </div>
  );
}
