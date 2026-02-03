"use client";
import { useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisar() {
    setLoading(true);
    setAnalysis("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setAnalysis(data.result || data.error || "Erro ao analisar");
    setLoading(false);
  }

  return (
    <main style={styles.bg}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔍 NichoLens AI</h1>
        <p style={styles.subtitle}>
          Análise estratégica de perfis para crescer nas redes sociais
        </p>

        <input
          style={styles.input}
          placeholder="Cole a URL do perfil (Instagram, TikTok, YouTube)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button style={styles.button} onClick={analisar} disabled={loading}>
          {loading ? "Analisando..." : "Analisar Perfil"}
        </button>

        {analysis && (
          <div style={styles.analysisBox}>
            <Section title="🎯 Nicho Identificado" text={extract(analysis, 1)} />
            <Section title="👥 Público-Alvo" text={extract(analysis, 2)} />
            <Section title="✅ Pontos Fortes" text={extract(analysis, 3)} />
            <Section title="⚠️ Pontos Fracos" text={extract(analysis, 4)} />
            <Section title="🚀 Sugestões Práticas" text={extract(analysis, 5)} />
            <Section title="🧬 Bio Otimizada" text={extract(analysis, 6)} />
            <Section title="💡 Ideias de Conteúdo" text={extract(analysis, 7)} />

            <button
              style={styles.copy}
              onClick={() => navigator.clipboard.writeText(analysis)}
            >
              📋 Copiar Análise Completa
            </button>
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
      <h3 style={styles.sectionTitle}>{title}</h3>
      <p style={styles.sectionText}>{text}</p>
    </div>
  );
}

// Extrai blocos pelo número da seção (1 a 7)
function extract(text, n) {
  const parts = text.split("###");
  const section = parts.find((p) => p.trim().startsWith(n + "."));
  return section
    ? section.replace(/\*\*/g, "").replace(/\n+/g, "\n").trim()
    : "";
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    maxWidth: 820,
    width: "100%",
    borderRadius: 20,
    padding: 30,
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  },
  title: {
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #ccc",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#111827",
    color: "#fff",
    fontWeight: 600,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    marginBottom: 20,
  },
  analysisBox: {
    background: "#f8fafc",
    borderRadius: 16,
    padding: 20,
  },
  section: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    border: "1px solid #e5e7eb",
  },
  sectionTitle: {
    margin: 0,
    marginBottom: 8,
    fontSize: 16,
  },
  sectionText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    whiteSpace: "pre-line",
  },
  copy: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    background: "#4f46e5",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
};
