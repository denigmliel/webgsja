export const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d));
}

export const isoDate = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");

/** Tanggal hari ini menurut waktu Jakarta (WIB). */
export function todayJakarta() {
  const s = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date()); // YYYY-MM-DD
  const [year, month, day] = s.split("-").map(Number);
  return { year, month, day };
}

/** Rentang satu bulan dari parameter "YYYY-MM"; default bulan ini. */
export function monthRange(bulan?: string) {
  const t = todayJakarta();
  let y = t.year;
  let m = t.month;
  if (bulan && /^\d{4}-\d{2}$/.test(bulan)) {
    const [yy, mm] = bulan.split("-").map(Number);
    if (mm >= 1 && mm <= 12) { y = yy; m = mm; }
  }
  return {
    year: y,
    month: m,
    key: `${y}-${String(m).padStart(2, "0")}`,
    gte: new Date(Date.UTC(y, m - 1, 1)),
    lt: new Date(Date.UTC(y, m, 1)),
  };
}
