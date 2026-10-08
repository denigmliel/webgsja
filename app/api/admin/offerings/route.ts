import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { offeringSchema, offeringData } from "@/lib/validators";

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const parsed = offeringSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  try {
    const created = await prisma.offering.create({ data: offeringData(parsed.data) });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan. Periksa data jemaat yang dipilih." }, { status: 400 });
  }
}
