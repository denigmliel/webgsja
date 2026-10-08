import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || password.length < 8) {
    throw new Error("Isi ADMIN_USERNAME dan ADMIN_PASSWORD (minimal 8 karakter) di file .env");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
  console.log(`Akun admin "${username}" siap dipakai.`);
}

main().finally(() => prisma.$disconnect());
