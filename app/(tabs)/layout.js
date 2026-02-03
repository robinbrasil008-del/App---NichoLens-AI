"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "#7c7cff" : "#b5b5b5";

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          background: "#0b1020",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, Arial, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Conteúdo */}
        <main style={{ flex: 1, paddingBottom: 70 }}>
          {children}
        </main>

        {/* Barra inferior (abas) */}
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: "#0f1630",
            borderTop: "1px solid #1f2a4a",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: isActive("/") }}>
            🏠 <div style={{ fontSize: 12 }}>Início</div>
          </Link>

          <Link
            href="/chat"
            style={{ textDecoration: "none", color: isActive("/chat") }}
          >
            💬 <div style={{ fontSize: 12 }}>Chat IA</div>
          </Link>
        </nav>
      </body>
    </html>
  );
}
