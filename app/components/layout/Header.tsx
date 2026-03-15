"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Não renderiza o header em páginas de autenticação
  if (pathname.startsWith("/auth")) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data: LogoutResponse = await response.json();

      if (data.success) {
        // Redireciona para login
        router.push("/auth/login");
      } else {
        console.error("Logout error:", data.message);
        alert("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Erro ao fazer logout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-white border-b border-[#F2F2F2] shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#635EF2]">Leiloaria</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="text-[#414059] hover:text-[#635EF2] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "Saindo..." : "Sair"}
          </button>
        </nav>
      </div>
    </header>
  );
}
