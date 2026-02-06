"use client";

import Link from "next/link";

export default function TabsLayout({ children }) {
  return (
    <div
      style={{
        height: "100dvh", // viewport real mobile
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0f1225",
      }}
    >
      {/* CONTEÚDO COM SCROLL CONTROLADO */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",

          // ✅ CORREÇÃO FINAL DO BUG
          overscrollBehavior: "contain",
          touchAction: "pan-y",
        }}
      >
        {children}
      </div>

      {/* MENU FIXO */}
      <nav
        style={{
          height: 60,
          background: "#0f1630",
          borderTop: "1px solid #1f2a4a",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <TabLink href="/" label="Início" icon="🏠" />
        <TabLink href="/chat" label="Chat IA" icon="💬" />
        <TabLink href="/profile" label="Perfil" icon="👤" />
      </nav>
    </div>
  );
}

function TabLink({ href, label, icon }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "#b5b5b5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: 12,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </Link>
  );
}
