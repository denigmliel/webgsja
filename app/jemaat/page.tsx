import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MONTHS } from "@/lib/format";
import { getLocale, MONTHS_EN } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Data Jemaat" };

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const english = (await getLocale()) === "en";
  const q = (params.q ?? "").trim().slice(0, 60);
  // Halaman publik hanya menampilkan nama, jenis kelamin, dan tanggal lahir.
  // Nomor telepon dan alamat hanya terlihat oleh admin.
  const members = await prisma.member.findMany({
    where: { active: true, ...(q ? { fullName: { contains: q } } : {}) },
    select: { id: true, fullName: true, gender: true, birthDay: true, birthMonth: true },
    orderBy: { fullName: "asc" },
    take: 1000,
  });

  return (
    <main className="section">
      <div className="wrap">
        <h1>{english ? "Congregation" : "Data jemaat"}</h1>
        <form className="toolbar" action="/jemaat">
          <div className="grow">
            <label htmlFor="q">{english ? "Search by name" : "Cari nama"}</label>
            <input id="q" name="q" className="input" defaultValue={q} placeholder={english ? "Enter a member name" : "Ketik nama jemaat"} />
          </div>
          <button className="btn" type="submit">{english ? "Search" : "Cari"}</button>
        </form>
        <div className="table-wrap">
          {members.length === 0 ? (
            <div className="empty">{q ? (english ? `No members found matching "${q}".` : `Tidak ada jemaat dengan nama "${q}".`) : (english ? "No congregation records yet." : "Belum ada data jemaat.")}</div>
          ) : (
            <table>
              <thead>
                <tr><th>{english ? "Name" : "Nama"}</th><th>{english ? "Gender" : "Jenis kelamin"}</th><th>{english ? "Birthday" : "Ulang tahun"}</th></tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.fullName}</td>
                    <td>{m.gender === "L" ? (english ? "Male" : "Laki-laki") : (english ? "Female" : "Perempuan")}</td>
                    <td>{m.birthDay && m.birthMonth ? `${m.birthDay} ${(english ? MONTHS_EN : MONTHS)[m.birthMonth - 1]}` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="muted" style={{ marginTop: ".75rem" }}>{members.length} {english ? "members shown" : "jemaat ditampilkan"}</p>
      </div>
    </main>
  );
}
