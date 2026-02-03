"use client";

import { useState } from "react";
import { useTickets } from "../context/TicketContext";

export default function HomePage() {
  const { tickets, consumeTicket } = useTickets();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisar() {
    if (!url || loading) return;

    if (!consumeTicket(1)) {
      alert("❌ Seus tickets acabaram");
      return;
    }

    setLoading(true);

    await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>NichoLens AI</h1>

      <div style={{ marginBottom: 10 }}>
        🎟️ Tickets: {tickets}
      </div>

      <input
        placeholder="Instagram, TikTok, YouTube..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          border: "1px solid #ccc",
          marginBottom: 12,
        }}
      />

      <button
        onClick={analisar}
        disabled={tickets <= 0}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          border: "none",
          background: "#6d5dfc",
          color: "#fff",
          fontWeight: 900,
          cursor: tickets <= 0 ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Analisando..." : "🚀 Analisar Perfil"}
      </button>
    </div>
  );
}
