"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/#jadwal-ibadah", label: "Jadwal Ibadah" },
  { href: "/#contact-us", label: "Contact Us" },
];

export default function Nav({ locale }: { locale: Locale }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const current = (href: string) => {
    if (href === "/") return path === "/" && !activeAnchor;
    if (href.startsWith("/#")) return path === "/" && activeAnchor === href.slice(1);
    return path === href || path.startsWith(`${href}/`);
  };
  const changeLanguage = (language: Locale) => {
    document.cookie = `gsja_language=${language}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  useEffect(() => {
    setOpen(false);
    setActiveAnchor(window.location.hash);
  }, [path]);

  useEffect(() => {
    const updateAnchor = () => setActiveAnchor(window.location.hash);
    window.addEventListener("hashchange", updateAnchor);
    return () => window.removeEventListener("hashchange", updateAnchor);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 52.001rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  return (
    <div
      className="nav-container"
      ref={containerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-label={open ? (locale === "en" ? "Close navigation menu" : "Tutup menu navigasi") : (locale === "en" ? "Open navigation menu" : "Buka menu navigasi")}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d={open ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label={locale === "en" ? "Close navigation menu" : "Tutup menu navigasi"}
          onClick={() => setOpen(false)}
        />
      )}
      <nav id="primary-navigation" className={`nav${open ? " is-open" : ""}`} aria-label="Menu utama">
        <div className="nav-drawer-heading">
          <span>{locale === "en" ? "Main menu" : "Menu utama"}</span>
          <span className="nav-drawer-brand">GSJA Ciputat Timur</span>
        </div>
        <div className="nav-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={current(l.href) ? "page" : undefined}
              onClick={() => {
                setActiveAnchor(l.href.startsWith("/#") ? l.href.slice(1) : "");
                setOpen(false);
              }}
            >
              {l.href === "/" ? (locale === "en" ? "Home" : "Beranda") : l.href.includes("jadwal") ? (locale === "en" ? "Worship Schedule" : "Jadwal Ibadah") : (locale === "en" ? "Contact Us" : "Hubungi Kami")}
            </Link>
          ))}
        </div>
        <div className="language-switch" role="group" aria-label={locale === "en" ? "Choose language" : "Pilih bahasa"}>
          <button type="button" aria-pressed={locale === "id"} onClick={() => changeLanguage("id")} title="Bahasa Indonesia">ID</button>
          <button type="button" aria-pressed={locale === "en"} onClick={() => changeLanguage("en")} title="English">EN</button>
        </div>
        <Link
          href="/admin"
          className="admin-link"
          aria-label={locale === "en" ? "Admin" : "Admin"}
          title="Admin"
          aria-current={current("/admin") ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20a7 7 0 0 1 14 0" />
          </svg>
        </Link>
      </nav>
    </div>
  );
}
