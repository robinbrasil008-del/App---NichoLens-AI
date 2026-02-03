"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TicketProvider } from "../context/TicketContext";

export default function TabsLayout({ children }) {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "#7c7cff" : "#b5b5b5";

  return (
    <TicketProvider>
      <>
        <main style={{ flex: 1, paddingBottom: 70 }}>
          {children}
        </main>

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
            zIndex: 100,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: isActive("/"),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            🏠
            <div style={{ fontSize: 12 }}>Início</div>
          </Link>

          <Link
            href="/chat"
            style={{
              textDecoration: "none",
              color: isActive("/chat"),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            💬
            <div style={{ fontSize: 12 }}>Chat IA</div>
          </Link>
        </nav>
      </>
    </TicketProvider>
  );
}
