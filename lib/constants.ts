export const OFFERING_KEYS = ["UMUM", "PEMBANGUNAN", "JANJI_IMAN", "KASIH"] as const;
export type OfferingKey = (typeof OFFERING_KEYS)[number];

export const OFFERING_LABELS: Record<OfferingKey, string> = {
  UMUM: "Persembahan Umum",
  PEMBANGUNAN: "Uang Pembangunan",
  JANJI_IMAN: "Janji Iman",
  KASIH: "Persembahan Kasih",
};

export const labelOf = (t: string) => OFFERING_LABELS[t as OfferingKey] ?? t;
