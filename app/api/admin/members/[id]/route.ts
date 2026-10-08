import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { memberSchema, memberData } from "@/lib/validators";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const id = Number((await params).id);
  const parsed = memberSchema.safeParse(await req.json().catch(() => null));
  if (!Number.isInteger(id) || !parsed.success) {
    return NextResponse.json({ error: parsed.success ? "ID tidak valid" : parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  try {
    const updated = await prisma.member.update({ where: { id }, data: memberData(parsed.data) });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Data jemaat tidak ditemukan" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const id = Number((await params).id);
  try {
    await prisma.member.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Data jemaat tidak ditemukan" }, { status: 404 });
  }
}
