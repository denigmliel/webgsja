import { cookies } from "next/headers";

export type Locale = "id" | "en";

export async function getLocale(): Promise<Locale> {
  const language = (await cookies()).get("gsja_language")?.value;
  return language === "en" ? "en" : "id";
}

export const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
