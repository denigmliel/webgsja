export type ApiResult = { ok: true } | { ok: false; error: string };

export async function send(url: string, method: "POST" | "PUT" | "DELETE", body?: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const j = await res.json().catch(() => ({}));
    if (res.status === 401 && !url.startsWith("/api/auth/login")) {
      return { ok: false, error: "Sesi berakhir. Muat ulang halaman lalu masuk lagi." };
    }
    return { ok: false, error: j.error ?? "Terjadi kesalahan di server" };
  } catch {
    return { ok: false, error: "Tidak dapat terhubung ke server" };
  }
}
