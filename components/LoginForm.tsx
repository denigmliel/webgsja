"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { send } from "@/components/api";
import type { Locale } from "@/lib/i18n";

export default function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const english = locale === "en";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const r = await send("/api/auth/login", "POST", { username: f.get("username"), password: f.get("password") });
    setBusy(false);
    if (!r.ok) return setError(r.error);
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-welcome">
          <div className="login-brand">
            <Image src="/img/logo.jpg" alt="" width={60} height={54} />
            <span>GSJA Ciputat Timur</span>
          </div>
          <span className="login-scripture">{english ? "All Glory for God" : "All Glory for God"}</span>
        </section>
        <section className="login-form-panel" aria-labelledby="login-heading">
          <header className="login-form-heading">
            <h2 id="login-heading">{english ? "Admin sign in" : "Masuk admin"}</h2>
            <p className="muted">{english ? "Enter your account details to continue." : "Masukkan informasi akun untuk melanjutkan."}</p>
          </header>
          <form onSubmit={onSubmit}>
            <div className="login-fields">
              <div>
                <label htmlFor="username">{english ? "Username" : "Nama pengguna"}</label>
                <input id="username" name="username" className="input" autoComplete="username" required />
              </div>
              <div>
                <label htmlFor="password">{english ? "Password" : "Kata sandi"}</label>
                <div className="password-field">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} className="input" autoComplete="current-password" required />
                  <button
                    className="password-visibility"
                    type="button"
                    aria-label={showPassword ? (english ? "Hide password" : "Sembunyikan kata sandi") : (english ? "Show password" : "Tampilkan kata sandi")}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a15 15 0 0 1-2.3 3.2M6.2 6.2C4.1 7.6 3 12 3 12s3.5 7 9 7c1.3 0 2.5-.4 3.5-.9" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {error && <p className="error login-error" role="alert">{error}</p>}
            <button className="btn login-submit" type="submit" disabled={busy}>
              <span className="login-submit-label">{busy ? (english ? "Signing in..." : "Memproses...") : "Login"}</span>
              <span className="login-submit-arrow" aria-hidden="true">→</span>
            </button>
          </form>
          <p className="login-note">{english ? "Authorized administrators only." : "Khusus untuk admin yang berwenang."}</p>
        </section>
      </div>
    </main>
  );
}
