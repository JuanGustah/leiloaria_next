"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  // Não renderiza o header em páginas de autenticação
  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <header className="bg-white border-b border-[#F2F2F2] shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#635EF2]">Leiloaria</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/auth/login" className="text-[#414059] hover:text-[#635EF2] transition">
            Sair
          </Link>
        </nav>
      </div>
    </header>
  );
}
