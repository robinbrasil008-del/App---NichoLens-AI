"use client";
import { useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisar() {
    if (!url) return;
    setLoading(true);
    setAnalysis("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setAnalysis(data.result || "");
    setLoading(false);
  }

  return (
    <main style={styles.bg}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🔍 NichoLens AI</h1>
        <p style={styles.subtitle}>
          Diagnóstico estratégico para crescer nas redes sociais
        </p>

        <input
          style={styles.input}
          placeholder="Cole a URL do perfil (Instagram, TikTok, YouTube)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button style={styles.button} onClick={analisar}>
          {loading ? "Analisando perfil..." : "🚀 Analisar Perfil"}
        </button>

        {analysis && (
          <div style={styles.results}>
            <Section title="🎯 Nicho Identificado" text={get(analysis, 1)} />
            <Section title="👥 Público-Alvo" text={get(analysis, 2)} />
            <Section title="✅ Pontos Fortes" text={get(analysis, 3)} />
            <Section title="⚠️ Pontos Fracos" text={get(analysis, 4)} />
            <Section title="🚀 Sugestões Práticas" text={get(analysis, 5)} />
            <Section title="🧬 Bio Otimizada" text={get(analysis, 6)} />
            <Section title="💡 Ideias de Conteúdo" text={get(analysis, 7)} />
          </div>
        )}
      </div>
    </main>
  );
}

function Section({ title, text }) {
  if (!text) return null;

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <button
          style={styles.copy}
          onClick={() => navigator.clipboard.writeText(text)}
        >
          Copiar
        </button>
      </div>
      <p style={styles.sectionText}>{text}</p>
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

const styles = {
  bg: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1e1b4b 0%, #020617 60%)",
    display: "flex",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 880,
    background: "#020617",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
  },
  logo: {
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: 26,
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #1e293b",
    background: "#020617",
    color: "#fff",
    marginBottom: 12,
    outline: "none",
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 24,
  },
  results: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  section: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 15,
    color: "#e5e7eb",
  },
  sectionText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#cbd5f5",
    whiteSpace: "pre-line",
  },
  copy: {
    background: "#1e293b",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    cursor: "pointer",
  },
};
