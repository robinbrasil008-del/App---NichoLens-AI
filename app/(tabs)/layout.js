"use client";

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
          background: "#ffffff",
          borderTop: "1px solid #e5e5e5",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 1000
        }}
      >
        <a href="/" style={{ textDecoration: "none", color: "#111" }}>
          🏠 <br /> Início
        </a>

        <a href="/chat" style={{ textDecoration: "none", color: "#111" }}>
          💬 <br /> Chat
        </a>
      </nav>
    </div>
  );
}
