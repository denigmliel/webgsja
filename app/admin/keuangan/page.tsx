import { prisma } from "@/lib/prisma";
import { isoDate, monthRange } from "@/lib/format";
import { OFFERING_KEYS } from "@/lib/constants";
import OfferingManager, { type OfferingRow } from "@/components/OfferingManager";

export const dynamic = "force-dynamic";

export default async function AdminFinance({ searchParams }: { searchParams: Promise<{ type?: string; bulan?: string }> }) {
  const params = await searchParams;
  const r = monthRange(params.bulan);
  const type = OFFERING_KEYS.find((k) => k === params.type);

  const [rows, members] = await Promise.all([
    prisma.offering.findMany({
      where: { date: { gte: r.gte, lt: r.lt }, ...(type ? { type } : {}) },
      include: { member: { select: { fullName: true } } },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    }),
    prisma.member.findMany({ where: { active: true }, select: { id: true, fullName: true }, orderBy: { fullName: "asc" } }),
  ]);

  const offerings: OfferingRow[] = rows.map((o) => ({
    id: o.id, type: o.type, amount: o.amount, date: isoDate(o.date),
    note: o.note ?? "", memberId: o.memberId, memberName: o.member?.fullName ?? "",
  }));

  return (
    <>
      <h1>Input keuangan</h1>
      <OfferingManager offerings={offerings} members={members} type={type ?? ""} bulan={r.key} />
    </>
  );
}
