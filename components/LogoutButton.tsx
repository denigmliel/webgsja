"use client";
import { useRouter } from "next/navigation";
import { send } from "./api";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await send("/api/auth/logout", "POST");
        router.push("/");
        router.refresh();
      }}
    >
      Keluar
    </button>
  );
}
