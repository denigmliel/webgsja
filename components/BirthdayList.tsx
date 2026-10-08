import { MONTHS } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

export type Birthday = { id: number; fullName: string; birthDay: number | null; birthDate: Date | null };

export default function BirthdayList({
  items, month, year, today, locale = "id",
}: { items: Birthday[]; month: number; year: number; today?: number; locale?: Locale }) {
  const english = locale === "en";
  if (items.length === 0) {
    return (
      <div className="bday-empty">
        <span className="bday-empty-icon" aria-hidden="true">✦</span>
        <div>
          <p className="bday-empty-title">{english ? "No birthdays this month" : "Belum ada ulang tahun bulan ini"}</p>
          <p className="bday-empty-copy">
            {english
              ? `Members celebrating birthdays in ${new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2020, month - 1, 1))} will appear here.`
              : `Data ulang tahun jemaat untuk bulan ${MONTHS[month - 1]} akan ditampilkan di sini.`}
          </p>
        </div>
      </div>
    );
  }
  return (
    <ol className="bday">
      {items.map((b) => {
        const age = b.birthDate ? year - b.birthDate.getUTCFullYear() : 0;
        const isToday = today !== undefined && today === b.birthDay;
        return (
          <li key={b.id} className={isToday ? "is-today" : undefined}>
            <span className="bday-day">{b.birthDay}</span>
            <span className="bday-name">
              {b.fullName}
              {isToday && <span className="bday-today">{english ? "Today" : "Hari ini"}</span>}
            </span>
            <span className="bday-meta">{age > 0 && age < 120 ? (english ? `turns ${age}` : `genap ${age} tahun`) : "\u00a0"}</span>
          </li>
        );
      })}
    </ol>
  );
}
