import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { memberSchema, memberData } from "@/lib/validators";

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const parsed = memberSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" }, { status: 400 });
  }
  const created = await prisma.member.create({ data: memberData(parsed.data) });
  return NextResponse.json(created, { status: 201 });
}
