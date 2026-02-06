"use client";

import Link from "next/link";

export default function TabsLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 70 }}>
      {children}

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
