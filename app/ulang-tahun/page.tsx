import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONTHS, todayJakarta } from "@/lib/format";
import BirthdayList from "@/components/BirthdayList";
import { getLocale, MONTHS_EN } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ulang Tahun Jemaat" };

export default async function BirthdayPage({ searchParams }: { searchParams: Promise<{ bulan?: string }> }) {
  const params = await searchParams;
  const locale = await getLocale();
  const english = locale === "en";
  const t = todayJakarta();
  const asked = Number(params.bulan);
  const month = Number.isInteger(asked) && asked >= 1 && asked <= 12 ? asked : t.month;

  const items = await prisma.member.findMany({
    where: { active: true, birthMonth: month },
    select: { id: true, fullName: true, birthDay: true, birthDate: true },
    orderBy: [{ birthDay: "asc" }, { fullName: "asc" }],
  });

  return (
    <main className="section on-light">
      <div className="wrap">
        <h1>{english ? "Congregation Birthdays" : "Ulang tahun jemaat"}</h1>
        <nav className="tabs" aria-label={english ? "Select month" : "Pilih bulan"}>
          {(english ? MONTHS_EN : MONTHS).map((name, i) => (
            <Link key={name} href={`/ulang-tahun?bulan=${i + 1}`} aria-current={i + 1 === month ? "true" : undefined}>
              {name}
            </Link>
          ))}
        </nav>
        <h2>{(english ? MONTHS_EN : MONTHS)[month - 1]} ({items.length} {english ? "people" : "orang"})</h2>
        <BirthdayList items={items} month={month} year={t.year} today={month === t.month ? t.day : undefined} locale={locale} />
      </div>
    </main>
  );
}
