import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <>
      <div className="admin-bar">
        <div className="wrap">
          <Link href="/admin">Ringkasan</Link>
          <Link href="/admin/jemaat">Data Jemaat</Link>
          <Link href="/admin/keuangan">Input Keuangan</Link>
          <span className="spacer" />
          <span>Masuk sebagai {session.username}</span>
          <LogoutButton />
        </div>
      </div>
      <main className="section">
        <div className="wrap">{children}</div>
      </main>
    </>
  );
}
