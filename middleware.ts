import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Melindungi halaman admin, halaman data jemaat/keuangan/ulang tahun, dan API admin.
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("gsja_session")?.value;
  const secret = process.env.AUTH_SECRET;
  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return NextResponse.next();
    } catch {
      /* token tidak valid atau kedaluwarsa */
    }
  }
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Sesi berakhir. Silakan masuk lagi." }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/jemaat/:path*", "/keuangan/:path*", "/ulang-tahun/:path*"],
};
