"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { send } from "./api";
import { OFFERING_KEYS, OFFERING_LABELS, labelOf } from "@/lib/constants";
import { fmtDate, rupiah } from "@/lib/format";

export type OfferingRow = {
  id: number; type: string; amount: number; date: string;
  note: string; memberId: number | null; memberName: string;
};

type Props = {
  offerings: OfferingRow[];
  members: { id: number; fullName: string }[];
  type: string; // "" = semua jenis
  bulan: string; // YYYY-MM
};

export default function OfferingManager({ offerings, members, type, bulan }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<OfferingRow | "new" | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const editing = form && form !== "new" ? form : null;
  const total = offerings.reduce((s, o) => s + o.amount, 0);
  const today = new Date().toISOString().slice(0, 10);
  const tabHref = (t: string) => `/admin/keuangan?bulan=${bulan}${t ? `&type=${t}` : ""}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const memberId = Number(f.get("memberId"));
    const body = {
      type: f.get("type"),
      amount: Number(f.get("amount")),
      date: f.get("date"),
      note: f.get("note") || "",
      memberId: memberId > 0 ? memberId : null,
    };
    const r = editing
      ? await send(`/api/admin/offerings/${editing.id}`, "PUT", body)
      : await send("/api/admin/offerings", "POST", body);
    setBusy(false);
    if (!r.ok) return setError(r.error);
    setForm(null);
    router.refresh();
  }

  async function remove(o: OfferingRow) {
    if (!confirm(`Hapus catatan ${labelOf(o.type)} sebesar ${rupiah(o.amount)}?`)) return;
    const r = await send(`/api/admin/offerings/${o.id}`, "DELETE");
    if (!r.ok) alert(r.error);
    else router.refresh();
  }

  return (
    <>
      <nav className="tabs" aria-label="Jenis persembahan">
        <Link href={tabHref("")} aria-current={type === "" ? "true" : undefined}>Semua</Link>
        {OFFERING_KEYS.map((k) => (
          <Link key={k} href={tabHref(k)} aria-current={type === k ? "true" : undefined}>{OFFERING_LABELS[k]}</Link>
        ))}
      </nav>

      <div className="toolbar">
        <form action="/admin/keuangan" className="toolbar" style={{ margin: 0 }}>
          {type && <input type="hidden" name="type" value={type} />}
          <div>
            <label htmlFor="bulan">Bulan</label>
            <input id="bulan" name="bulan" type="month" className="input" defaultValue={bulan} />
          </div>
          <button className="btn secondary" type="submit">Tampilkan</button>
        </form>
        <span style={{ flex: 1 }} />
        <button className="btn gold" onClick={() => { setError(""); setForm("new"); }}>Tambah persembahan</button>
      </div>

      {form && (
        <form className="panel" onSubmit={onSubmit} key={editing ? editing.id : "new"} style={{ marginBottom: "1.25rem" }}>
          <h2>{editing ? "Ubah catatan" : "Tambah persembahan"}</h2>
          <div className="form-grid">
            <div>
              <label htmlFor="o-type">Jenis</label>
              <select id="o-type" name="type" className="input" defaultValue={editing?.type ?? (type || "UMUM")}>
                {OFFERING_KEYS.map((k) => <option key={k} value={k}>{OFFERING_LABELS[k]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="o-date">Tanggal</label>
              <input id="o-date" name="date" type="date" className="input" defaultValue={editing?.date ?? today} required />
            </div>
            <div>
              <label htmlFor="o-amount">Jumlah (Rp)</label>
              <input id="o-amount" name="amount" type="number" min={1} step={1} inputMode="numeric" className="input" defaultValue={editing?.amount} required />
            </div>
            <div>
              <label htmlFor="o-member">Dari jemaat (opsional)</label>
              <select id="o-member" name="memberId" className="input" defaultValue={editing?.memberId ?? 0}>
                <option value={0}>Tanpa nama</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
              </select>
            </div>
            <div className="full">
              <label htmlFor="o-note">Keterangan (opsional)</label>
              <input id="o-note" name="note" className="input" defaultValue={editing?.note} maxLength={200} />
            </div>
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" type="submit" disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</button>{" "}
          <button className="btn secondary" type="button" onClick={() => setForm(null)}>Batal</button>
        </form>
      )}

      <div className="totals" style={{ gridTemplateColumns: "1fr" }}>
        <div><small>Total {type ? labelOf(type) : "semua jenis"} di bulan ini</small><strong>{rupiah(total)}</strong></div>
      </div>

      <div className="table-wrap">
        {offerings.length === 0 ? (
          <div className="empty">Belum ada catatan di bulan ini. Klik Tambah persembahan untuk mulai.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Tanggal</th><th>Jenis</th><th>Dari</th><th>Keterangan</th><th className="num">Jumlah</th><th /></tr>
            </thead>
            <tbody>
              {offerings.map((o) => (
                <tr key={o.id}>
                  <td>{fmtDate(o.date)}</td>
                  <td>{labelOf(o.type)}</td>
                  <td>{o.memberName || "-"}</td>
                  <td>{o.note || "-"}</td>
                  <td className="num">{rupiah(o.amount)}</td>
                  <td className="actions">
                    <button className="btn secondary small" onClick={() => { setError(""); setForm(o); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Ubah</button>{" "}
                    <button className="btn danger small" onClick={() => remove(o)}>Hapus</button>
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
