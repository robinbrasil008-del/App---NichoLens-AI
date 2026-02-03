"use client";

import { useEffect, useState } from "react";
import { useTickets } from "../context/TicketContext";

export default function Page() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const { tickets, useTicket } = useTickets();

  useEffect(() => {
    const id = "font-plus-jakarta";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  async function analisar() {
    if (!url || loading) return;

    // 🎟️ CHECK GLOBAL TICKET
    if (!useTicket()) {
      alert("❌ Seus tickets acabaram! Faça login ou assine o plano PRO.");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setAnalysis(data.result || "");
    } finally {
      setLoading(false);
    }
  }

  function copy(label, text) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1200);
  }

  return (
    <main style={styles.bg}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <h1 style={styles.title}>🔍 NichoLens AI</h1>
          <p style={styles.subtitle}>
            Cole a URL do perfil e receba um diagnóstico + sugestões práticas
          </p>

          {/* 🎟️ TICKETS GLOBAL */}
          <div style={styles.tickets}>🎟️ {tickets}</div>
        </header>

        <section style={styles.card}>
          <label style={styles.label}>URL do perfil</label>
          <input
            style={styles.input}
            placeholder="Instagram, TikTok, YouTube..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={tickets <= 0}
          />

          <button
            style={{
              ...styles.mainButton,
              opacity: tickets <= 0 ? 0.6 : 1,
              cursor: tickets <= 0 ? "not-allowed" : "pointer",
            }}
            onClick={analisar}
            disabled={tickets <= 0}
          >
            {tickets <= 0
              ? "❌ Tickets esgotados"
              : loading
              ? "Analisando..."
              : "🚀 Analisar Perfil"}
          </button>
        </section>

        {analysis && (
          <section style={styles.results}>
            <Block title="🎯 Nicho Identificado" text={get(analysis, 1)} />
            <Block title="👥 Público-Alvo" text={get(analysis, 2)} />
            <Block title="✅ Pontos Fortes" text={get(analysis, 3)} />
            <Block title="⚠️ Pontos Fracos" text={get(analysis, 4)} />
            <Block title="🚀 Sugestões Práticas" text={get(analysis, 5)} />
            <Block title="🧬 Bio Otimizada" text={get(analysis, 6)} />
            <Block title="💡 Ideias de Conteúdo" text={get(analysis, 7)} />

            <button
              style={styles.copyAll}
              onClick={() => copy("all", analysis)}
            >
              {copied === "all" ? "✅ Análise Copiada" : "📋 Copiar Tudo"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function Block({ title, text }) {
  if (!text) return null;

  return (
    <div style={styles.block}>
      <h3 style={styles.blockTitle}>{title}</h3>
      <p style={styles.blockText}>{text}</p>
    </div>
  );
}

function get(text, n) {
  const parts = text.split("###");
  const section = parts.find((p) => p.trim().startsWith(n + "."));
  return section
    ? section.replace(/\*\*/g, "").replace(/^\d+\.\s*/gm, "").trim()
    : "";
}

/* ===== STYLES ===== */

const styles = {
  bg: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 0%, #e9edff 0%, #f7f8ff 40%, #eef2ff 100%)",
    padding: 18,
    fontFamily:
      '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto',
    color: "#0f172a",
  },
  shell: { maxWidth: 960, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 14 },
  title: { margin: 0, fontSize: 34, fontWeight: 900 },
  subtitle: { marginTop: 6, color: "#475569", fontSize: 13 },
  tickets: { marginTop: 6, fontSize: 13, fontWeight: 800 },
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
    marginBottom: 16,
  },
  label: { fontSize: 12, fontWeight: 800, color: "#64748b" },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(2,6,23,0.12)",
    marginTop: 8,
    marginBottom: 12,
    fontSize: 15,
  },
  mainButton: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 15,
  },
  results: { display: "flex", flexDirection: "column", gap: 12 },
  block: {
    background: "#fff",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 10px 22px rgba(15,23,42,0.08)",
  },
  blockTitle: { margin: 0, fontSize: 16, fontWeight: 900 },
  blockText: { fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line" },
  copyAll: {
    marginTop: 6,
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
};
