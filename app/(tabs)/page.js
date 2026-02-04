"use client";

import { useState } from "react";
import { useTickets } from "../../context/TicketContext";

export default function HomePage() {
  const { tickets, consumeTicket } = useTickets(); // 🎟️ GLOBAL

  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisar() {
    if (!url.trim() || loading) return;

    // 🎟️ CONSUME TICKET GLOBAL
    if (!consumeTicket()) return;

    setLoading(true);
    setAnalysis("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setAnalysis(data.result || "❌ Nenhum resultado retornado.");
    } catch {
      setAnalysis("❌ Erro ao analisar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>NichoLens AI</h1>
        <div style={styles.tickets}>🎟️ {tickets}</div>
      </header>

      {/* CARD */}
      <div style={styles.card}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Instagram, TikTok, YouTube..."
          style={styles.input}
          disabled={tickets <= 0}
        />

        <button
          onClick={analisar}
          style={{
            ...styles.button,
            opacity: tickets <= 0 ? 0.6 : 1,
            cursor: tickets <= 0 ? "not-allowed" : "pointer",
          }}
          disabled={tickets <= 0}
        >
          {loading ? "Analisando..." : "🚀 Analisar Perfil"}
        </button>
      </div>

      {/* RESULTADO */}
      {analysis && (
        <div style={styles.result}>
          {analysis.split("\n").map((line, i) => (
            <p key={i} style={styles.resultText}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== STYLES ===== */

const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    paddingBottom: 90,
    background:
      "radial-gradient(1200px 600px at 20% 0%, #e9edff 0%, #f7f8ff 40%, #eef2ff 100%)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 900,
    margin: 0,
  },

  tickets: {
    marginLeft: "auto",
    fontWeight: 800,
    fontSize: 14,
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
    maxWidth: 480,
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(2,6,23,0.12)",
    marginBottom: 12,
    fontSize: 15,
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 15,
  },

  result: {
    marginTop: 20,
    background: "#fff",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 10px 22px rgba(15,23,42,0.08)",
    maxWidth: 720,
  },

  resultText: {
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 8,
    whiteSpace: "pre-line",
  },
};
