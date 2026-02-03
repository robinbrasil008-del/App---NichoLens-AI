"use client";

import { useTickets } from "../context/TicketContext";

export default function HomePage() {
  const { tickets } = useTickets();

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        background:
          "radial-gradient(1200px 600px at 20% 0%, #e9edff 0%, #f7f8ff 40%, #eef2ff 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>
        🔍 NichoLens AI
      </h1>

      <p style={{ marginTop: 8, color: "#475569" }}>
        Cole a URL do perfil e receba um diagnóstico completo
      </p>

      <div style={{ marginTop: 10, fontWeight: 800 }}>
        🎟️ Tickets: {tickets}
      </div>

      <div
        style={{
          marginTop: 20,
          background: "#fff",
          padding: 16,
          borderRadius: 16,
          maxWidth: 420,
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <input
          placeholder="Instagram, TikTok, YouTube..."
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #ccc",
            marginBottom: 12,
          }}
        />

        <button
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "none",
            background: "#6d5dfc",
            color: "#fff",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          🚀 Analisar Perfil
        </button>
      </div>
    </div>
  );
}
