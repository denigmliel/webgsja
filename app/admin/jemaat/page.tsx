import { prisma } from "@/lib/prisma";
import { isoDate } from "@/lib/format";
import MemberManager, { type MemberRow } from "@/components/MemberManager";

export const dynamic = "force-dynamic";

export default async function AdminMembers() {
  const rows = await prisma.member.findMany({ orderBy: { fullName: "asc" } });
  const members: MemberRow[] = rows.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    gender: m.gender,
    birthDate: isoDate(m.birthDate),
    phone: m.phone ?? "",
    address: m.address ?? "",
    active: m.active,
  }));
  return (
    <>
      <h1>Data jemaat</h1>
      <MemberManager members={members} />
    </>
  );
}
