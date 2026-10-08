import Link from "next/link";
import { getLocale, type Locale } from "@/lib/i18n";

const worshipSchedules = [
  { name: "Ibadah Raya", englishName: "Sunday Service", day: "Minggu", englishDay: "Sunday", time: "10.00 WIB – Selesai", englishTime: "10:00 AM WIB – Until finished" },
  { name: "Sekolah Minggu", englishName: "Sunday School", day: "Minggu", englishDay: "Sunday", time: "10.30 – Selesai", englishTime: "10:30 AM – Until finished" },
  { name: "Ibadah Youth", englishName: "Youth Service", day: "Sabtu", englishDay: "Saturday", time: "19.00 WIB – Selesai", englishTime: "7:00 PM WIB – Until finished" },
];

export default async function Home() {
  const locale: Locale = await getLocale();
  const english = locale === "en";
  return (
    <main>
      <section className="band">
        <div className="wrap home-hero">
          <div className="home-intro">
            <p className="home-eyebrow">{english ? "Welcome to" : "Selamat datang di"}</p>
            <h1>GSJA Ciputat Timur</h1>
          </div>
          <div className="vision-mission">
            <section className="vision-card" aria-labelledby="vision-heading">
              <p className="vision-label">{english ? "Vision" : "Visi"}</p>
              <h2 id="vision-heading">{english ? "Seeking the lost and those who have gone astray" : "Mencari yang terhilang dan tersesat"}</h2>
            </section>
            <section className="mission-card" aria-labelledby="mission-heading">
              <p className="vision-label">{english ? "Mission" : "Misi"}</p>
              <h2 id="mission-heading">All Glory for God</h2>
            </section>
          </div>
          <p className="verse">{english ? "Matthew 11:28" : "Matius 11:28"}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap worship-section" id="jadwal-ibadah">
          <div className="worship-heading">
            <p className="worship-eyebrow">{english ? "Worship together" : "Bersama dalam ibadah"}</p>
            <h2>{english ? "Worship Schedule" : "Jadwal Ibadah"}</h2>
            <p className="muted">{english ? "Join us in worship and grow together with the GSJA Ciputat Timur family." : "Mari beribadah dan bertumbuh bersama keluarga GSJA Ciputat Timur."}</p>
          </div>
          <div className="worship-grid">
            {worshipSchedules.map((schedule) => (
              <article className="worship-card" key={schedule.name}>
                <span className="worship-card-mark" aria-hidden="true">✦</span>
                <h3>{english ? schedule.englishName : schedule.name}</h3>
                <p className="worship-day">{english ? schedule.englishDay : schedule.day}</p>
                <p className="worship-time">{english ? schedule.englishTime : schedule.time}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
