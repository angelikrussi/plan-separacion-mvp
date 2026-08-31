"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({
  redirectTo = "/",
  className = "text-sm text-gray-400 mt-4",
}: {
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push(redirectTo);
      }}
      className={className}
    >
      Cerrar sesión
    </button>
  );
}
