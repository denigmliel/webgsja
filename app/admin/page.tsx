import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MONTHS, monthRange, rupiah, todayJakarta } from "@/lib/format";
import { OFFERING_KEYS, OFFERING_LABELS } from "@/lib/constants";
import BirthdayList from "@/components/BirthdayList";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const t = todayJakarta();
  const r = monthRange();
  const where = { date: { gte: r.gte, lt: r.lt } };
  const [memberCount, grouped, birthdays] = await Promise.all([
    prisma.member.count({ where: { active: true } }),
    prisma.offering.groupBy({ by: ["type"], where, _sum: { amount: true } }),
    prisma.member.findMany({
      where: { active: true, birthMonth: t.month },
      select: { id: true, fullName: true, birthDay: true, birthDate: true },
      orderBy: [{ birthDay: "asc" }, { fullName: "asc" }],
    }),
  ]);
  const sumOf = (k: string) => grouped.find((g) => g.type === k)?._sum.amount ?? 0;
  const total = grouped.reduce((s, g) => s + (g._sum.amount ?? 0), 0);

  return (
    <>
      <h1>Ringkasan admin</h1>
      <p className="muted">{memberCount} jemaat aktif tercatat.</p>

      <h2>Persembahan {MONTHS[r.month - 1]} {r.year}</h2>
      <div className="totals">
        {OFFERING_KEYS.map((k) => (
          <div key={k}><small>{OFFERING_LABELS[k]}</small><strong>{rupiah(sumOf(k))}</strong></div>
        ))}
        <div><small>Total</small><strong>{rupiah(total)}</strong></div>
      </div>
      <p>
        <Link className="btn gold" href="/admin/keuangan">Input persembahan</Link>{" "}
        <Link className="btn secondary" href="/admin/jemaat">Kelola data jemaat</Link>
      </p>

      <h2 style={{ marginTop: "2rem" }}>Ulang tahun bulan {MONTHS[t.month - 1]}</h2>
      <div className="on-light">
        <BirthdayList items={birthdays} month={t.month} year={t.year} today={t.day} />
      </div>
    </>
  );
}
