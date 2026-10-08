import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MONTHS, monthRange, rupiah } from "@/lib/format";
import { OFFERING_KEYS, OFFERING_LABELS, labelOf } from "@/lib/constants";
import { getLocale, MONTHS_EN } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Keuangan Gereja" };

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ bulan?: string }> }) {
  const params = await searchParams;
  const english = (await getLocale()) === "en";
  const r = monthRange(params.bulan);
  const where = { date: { gte: r.gte, lt: r.lt } };

  // Halaman publik tidak menampilkan nama pemberi, hanya jumlah dan keterangan.
  const [grouped, rows] = await Promise.all([
    prisma.offering.groupBy({ by: ["type"], where, _sum: { amount: true } }),
    prisma.offering.findMany({
      where,
      select: { id: true, type: true, amount: true, date: true, note: true },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    }),
  ]);

  const sumOf = (k: string) => grouped.find((g) => g.type === k)?._sum.amount ?? 0;
  const total = grouped.reduce((s, g) => s + (g._sum.amount ?? 0), 0);

  return (
    <main className="section">
      <div className="wrap">
        <h1>{english ? "Church finances" : "Keuangan gereja"}</h1>
        <form className="toolbar" action="/keuangan">
          <div>
            <label htmlFor="bulan">{english ? "Select month" : "Pilih bulan"}</label>
            <input id="bulan" name="bulan" type="month" className="input" defaultValue={r.key} />
          </div>
          <button className="btn" type="submit">{english ? "Show" : "Tampilkan"}</button>
        </form>

        <h2>{(english ? MONTHS_EN : MONTHS)[r.month - 1]} {r.year}</h2>
        <div className="totals">
          {OFFERING_KEYS.map((k) => (
            <div key={k}>
              <small>{english ? offeringLabelsEn[k] : OFFERING_LABELS[k]}</small>
              <strong>{rupiah(sumOf(k))}</strong>
            </div>
          ))}
          <div>
            <small>{english ? "Monthly total" : "Total bulan ini"}</small>
            <strong>{rupiah(total)}</strong>
          </div>
        </div>

        <div className="table-wrap">
          {rows.length === 0 ? (
            <div className="empty">{english ? "No offerings recorded this month." : "Belum ada persembahan tercatat di bulan ini."}</div>
          ) : (
            <table>
              <thead>
                <tr><th>{english ? "Date" : "Tanggal"}</th><th>{english ? "Type" : "Jenis"}</th><th>{english ? "Note" : "Keterangan"}</th><th className="num">{english ? "Amount" : "Jumlah"}</th></tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td>{new Intl.DateTimeFormat(english ? "en" : "id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(o.date)}</td>
                    <td>{labelOf(o.type)}</td>
                    <td>{o.note ?? "-"}</td>
                    <td className="num">{rupiah(o.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

const offeringLabelsEn = {
  UMUM: "General Offering",
  PEMBANGUNAN: "Building Fund",
  JANJI_IMAN: "Faith Promise",
  KASIH: "Love Offering",
} as const;
