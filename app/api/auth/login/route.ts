import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const schema = z.object({ username: z.string().trim().min(1), password: z.string().min(1) });

// Pembatas percobaan login sederhana (per IP, tersimpan di memori server).
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX_FAILS = 5;
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && now - rec.first < WINDOW && rec.count >= MAX_FAILS) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Isi username dan password" }, { status: 400 });

  const admin = await prisma.admin.findUnique({ where: { username: parsed.data.username } });
  const ok = await bcrypt.compare(parsed.data.password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !ok) {
    const fresh = !rec || now - rec.first >= WINDOW;
    attempts.set(ip, { count: fresh ? 1 : rec.count + 1, first: fresh ? now : rec.first });
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  attempts.delete(ip);
  await createSession(admin.id, admin.username);
  return NextResponse.json({ ok: true });
}
