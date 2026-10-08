import { z } from "zod";
import { OFFERING_KEYS } from "./constants";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid");

export const memberSchema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 huruf").max(120, "Nama terlalu panjang"),
  gender: z.enum(["L", "P"], { message: "Pilih jenis kelamin" }),
  birthDate: dateStr.or(z.literal("")).nullish(),
  phone: z.string().trim().max(30, "Nomor telepon terlalu panjang").nullish(),
  address: z.string().trim().max(300, "Alamat terlalu panjang").nullish(),
  active: z.boolean().default(true),
});

export const offeringSchema = z.object({
  type: z.enum(OFFERING_KEYS, { message: "Pilih jenis persembahan" }),
  amount: z.number({ message: "Isi jumlah" }).int("Jumlah harus bilangan bulat").positive("Jumlah harus lebih dari 0").max(1_000_000_000_000),
  date: dateStr,
  note: z.string().trim().max(200, "Catatan terlalu panjang").nullish(),
  memberId: z.number().int().positive().nullish(),
});

/** Ubah input form jemaat menjadi data siap simpan (termasuk bulan & tanggal lahir). */
export function memberData(d: z.infer<typeof memberSchema>) {
  const birth = d.birthDate ? new Date(`${d.birthDate}T00:00:00.000Z`) : null;
  return {
    fullName: d.fullName,
    gender: d.gender,
    birthDate: birth,
    birthMonth: birth ? birth.getUTCMonth() + 1 : null,
    birthDay: birth ? birth.getUTCDate() : null,
    phone: d.phone || null,
    address: d.address || null,
    active: d.active,
  };
}

export function offeringData(d: z.infer<typeof offeringSchema>) {
  return {
    type: d.type,
    amount: d.amount,
    date: new Date(`${d.date}T00:00:00.000Z`),
    note: d.note || null,
    memberId: d.memberId ?? null,
  };
}
