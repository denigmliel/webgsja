import Link from "next/link";
import Image from "next/image";
import Nav from "./Nav";
import type { Locale } from "@/lib/i18n";

export default function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label={locale === "en" ? "GSJA Ciputat Timur, home" : "GSJA Ciputat Timur, ke beranda"}>
          <Image src="/img/logo.jpg" alt="" width={50} height={44} priority />
          <span>GSJA Ciputat Timur</span>
        </Link>
        <Nav locale={locale} />
      </div>
    </header>
  );
}
