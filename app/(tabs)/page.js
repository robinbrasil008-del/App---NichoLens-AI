"use client";

import { useState } from "react";
import { useTickets } from "../context/TicketContext";

export default function HomePage() {
  const { tickets, consumeTicket } = useTickets();

  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisar() {
    if (!url.trim() || loading) return;

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
      setAnalysis(data.result || "Nenhum resultado retornado.");
    } catch {
      setAnalysis("Erro ao analisar o perfil.");
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

      {/* CARD INPUT */}
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
          }}
          disabled={tickets <= 0}
        >
          {loading ? "Analisando..." : "🚀 Analisar Perfil"}
        </button>
      </div>

      {/* RESULTADO */}
      {analysis && (
        <div style={styles.resultCard}>
          {analysis
            .replace(/\*\*/g, "")
            .split("###")
            .filter(Boolean)
            .map((block, i) => (
              <div key={i} style={styles.block}>
                {block.split("\n").map((line, j) => (
                  <p key={j} style={styles.text}>
                    {line}
                  </p>
                ))}
              </div>
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
      "linear-gradient(180deg, #0f1225 0%, #151a3a 40%, #0b0f24 100%)",
    fontFamily:
      '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto',
    color: "#fff",
  },

  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: 900,
    margin: 0,
    letterSpacing: -0.5,
  },

  tickets: {
    marginLeft: "auto",
    fontSize: 14,
    fontWeight: 800,
    opacity: 0.9,
  },

  card: {
    background: "#ffffff",
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    maxWidth: 520,
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #d1d5db",
    marginBottom: 14,
    fontSize: 15,
  },

  button: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(90deg,#6d5dfc,#8b5cf6)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 15,
    cursor: "pointer",
  },

  resultCard: {
    marginTop: 24,
    background: "#1c2142",
    borderRadius: 20,
    padding: 18,
    maxWidth: 820,
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  },

  block: {
    marginBottom: 16,
  },

  text: {
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 6,
    opacity: 0.95,
  },
};
