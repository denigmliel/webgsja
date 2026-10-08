"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <footer className="site-footer" id="contact-us" aria-labelledby="contact-heading">
      <div className="wrap">
        <h2 id="contact-heading" className="contact-heading">{locale === "en" ? "Contact Us" : "Hubungi Kami"}</h2>
        <div className="footer-content">
          <section aria-labelledby="footer-church-name">
            <h2 id="footer-church-name" className="footer-brand">GSJA Ciputat Timur</h2>
            <address className="footer-address">
              <a
                href="https://www.google.com/maps?sca_esv=fe9e84a888596578&rlz=1C1GCEA_enID1171ID1171&biw=2304&bih=1042&sxsrf=APpeQnuJzhikBtrgO-PfCmARYA0GgbQKXA:1791478718515&kgmid=/g/11rxj24hsh&shem=dlvs1,epsd1,esd2e,ltae,rimspwouoe&shndl=30&kgs=3fe992e967ba9543&um=1&ie=UTF-8&fb=1&gl=id&sa=X&geocode=KVV_qMOy72kuMd85ywEHOIZ0&daddr=MQW5%2BWRQ,+Cemp.+Putih,+Kec.+Ciputat+Tim.,+Kota+Tangerang+Selatan,+Banten+15412"
                target="_blank"
                rel="noopener noreferrer"
                title={locale === "en" ? "Open directions in Google Maps in a new tab" : "Buka petunjuk arah di Google Maps di tab baru"}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>
                  Jl. Ir. H. Juanda No. 5, Ciputat Timur,<br />
                  Tangerang Selatan
                  <span className="footer-directions">{locale === "en" ? "Google Maps" : "Google Maps"} <span aria-hidden="true">↗</span></span>
                </span>
              </a>
            </address>
          </section>
          <nav className="footer-social" aria-labelledby="footer-social-heading">
            <h2 id="footer-social-heading" className="footer-heading">{locale === "en" ? "Follow us" : "Ikuti kami"}</h2>
            <ul className="footer-social-list">
              <li>
                <a href="https://www.instagram.com/gsjaciputattimur/?hl=id" target="_blank" rel="noopener noreferrer" title="Open Instagram profile in a new tab">
                  <span className="footer-social-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                  <span className="footer-social-copy"><span className="footer-platform">Instagram</span><span>@gsjaciputattimur</span></span>
                  <span className="footer-link-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@gsjaskebaci-ti380" target="_blank" rel="noopener noreferrer" title="Open YouTube channel in a new tab">
                  <span className="footer-social-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="4" />
                      <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                  <span className="footer-social-copy"><span className="footer-platform">YouTube</span><span>@GSJA SKEBA CI-TI</span></span>
                  <span className="footer-link-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/people/Gsja-CI-TI/100009159766175/#" target="_blank" rel="noopener noreferrer" title="Open Facebook profile in a new tab">
                  <span className="footer-social-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 22v-9h3l.5-4H14V7c0-1.2.3-2 2-2h2V1.5A26 26 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9Z" />
                    </svg>
                  </span>
                  <span className="footer-social-copy"><span className="footer-platform">Facebook</span><span>@Gsja CI TI</span></span>
                  <span className="footer-link-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>{locale === "en" ? `© ${new Date().getFullYear()} GSJA Ciputat Timur. All rights reserved.` : `© ${new Date().getFullYear()} GSJA Ciputat Timur. Hak cipta dilindungi.`}</p>
        </div>
      </div>
    </footer>
  );
}
