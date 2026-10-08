"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { send } from "./api";
import { MONTHS } from "@/lib/format";

export type MemberRow = {
  id: number; fullName: string; gender: string; birthDate: string;
  phone: string; address: string; active: boolean;
};

function birthLabel(iso: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export default function MemberManager({ members }: { members: MemberRow[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [form, setForm] = useState<MemberRow | "new" | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const list = members.filter((m) => m.fullName.toLowerCase().includes(q.toLowerCase()));
  const editing = form && form !== "new" ? form : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const body = {
      fullName: f.get("fullName"),
      gender: f.get("gender"),
      birthDate: f.get("birthDate") || "",
      phone: f.get("phone") || "",
      address: f.get("address") || "",
      active: f.get("active") === "on",
    };
    const r = editing
      ? await send(`/api/admin/members/${editing.id}`, "PUT", body)
      : await send("/api/admin/members", "POST", body);
    setBusy(false);
    if (!r.ok) return setError(r.error);
    setForm(null);
    router.refresh();
  }

  async function remove(m: MemberRow) {
    if (!confirm(`Hapus data ${m.fullName}? Catatan persembahannya tetap tersimpan tanpa nama.`)) return;
    const r = await send(`/api/admin/members/${m.id}`, "DELETE");
    if (!r.ok) alert(r.error);
    else router.refresh();
  }

  return (
    <>
      <div className="toolbar">
        <div className="grow">
          <label htmlFor="cari">Cari nama</label>
          <input id="cari" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ketik nama jemaat" />
        </div>
        <button className="btn gold" onClick={() => { setError(""); setForm("new"); }}>Tambah jemaat</button>
      </div>

      {form && (
        <form className="panel" onSubmit={onSubmit} key={editing ? editing.id : "new"} style={{ marginBottom: "1.25rem" }}>
          <h2>{editing ? "Ubah data jemaat" : "Tambah jemaat"}</h2>
          <div className="form-grid">
            <div className="full">
              <label htmlFor="fullName">Nama lengkap</label>
              <input id="fullName" name="fullName" className="input" defaultValue={editing?.fullName} required />
            </div>
            <div>
              <label htmlFor="gender">Jenis kelamin</label>
              <select id="gender" name="gender" className="input" defaultValue={editing?.gender ?? "L"}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label htmlFor="birthDate">Tanggal lahir</label>
              <input id="birthDate" name="birthDate" type="date" className="input" defaultValue={editing?.birthDate} />
            </div>
            <div>
              <label htmlFor="phone">Nomor telepon</label>
              <input id="phone" name="phone" className="input" defaultValue={editing?.phone} inputMode="tel" />
            </div>
            <div className="full">
              <label htmlFor="address">Alamat</label>
              <textarea id="address" name="address" className="input" rows={2} defaultValue={editing?.address} />
            </div>
            <div>
              <label><input type="checkbox" name="active" defaultChecked={editing ? editing.active : true} /> Jemaat aktif</label>
            </div>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" type="submit" disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</button>{" "}
          <button className="btn secondary" type="button" onClick={() => setForm(null)}>Batal</button>
        </form>
      )}

      <div className="table-wrap">
        {list.length === 0 ? (
          <div className="empty">{members.length === 0 ? "Belum ada data jemaat. Klik Tambah jemaat untuk mulai." : "Tidak ada nama yang cocok."}</div>
        ) : (
          <table>
            <thead>
              <tr><th>Nama</th><th>Tanggal lahir</th><th>Telepon</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id}>
                  <td>{m.fullName}<br /><small className="muted">{m.gender === "L" ? "Laki-laki" : "Perempuan"}</small></td>
                  <td>{birthLabel(m.birthDate)}</td>
                  <td>{m.phone || "-"}</td>
                  <td><span className={m.active ? "badge" : "badge off"}>{m.active ? "Aktif" : "Tidak aktif"}</span></td>
                  <td className="actions">
                    <button className="btn secondary small" onClick={() => { setError(""); setForm(m); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Ubah</button>{" "}
                    <button className="btn danger small" onClick={() => remove(m)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
