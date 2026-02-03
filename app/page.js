"use client";

import { useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisar() {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setResult(data.result || data.error || "Erro ao analisar");
    setLoading(false);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.logo}>🔍 NichoLens AI</h1>
        <p style={styles.tagline}>
          Descubra o nicho, pontos fracos e como crescer seu perfil nas redes
        </p>

        <div style={styles.inputBox}>
          <input
            style={styles.input}
            placeholder="Cole a URL do Instagram, TikTok ou YouTube"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            onClick={analisar}
            disabled={loading}
          >
            {loading ? "🔎 Analisando..." : "🚀 Analisar Perfil"}
          </button>
        </div>

        {result && (
          <section style={styles.resultCard}>
            <h2 style={styles.resultTitle}>📊 Diagnóstico do Perfil</h2>
            <div style={styles.resultText}>{result}</div>

            <button
              style={styles.copyButton}
              onClick={() => navigator.clipboard.writeText(result)}
            >
              📋 Copiar Análise
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f0f, #1c1c1c)",
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px",
  },
  container: {
    width: "100%",
    maxWidth: 820,
    background: "#ffffff",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
  },
  logo: {
    margin: 0,
    textAlign: "center",
    fontSize: 34,
    fontWeight: 800,
  },
  tagline: {
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    fontSize: 16,
  },
  inputBox: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    padding: "14px",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  resultCard: {
    background: "#f8f9fc",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #e5e7eb",
  },
  resultTitle: {
    marginTop: 0,
    marginBottom: 16,
    fontSize: 22,
  },
  resultText: {
    whiteSpace: "pre-wrap",
    fontSize: 15,
    lineHeight: 1.6,
    color: "#222",
  },
  copyButton: {
    marginTop: 20,
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};
