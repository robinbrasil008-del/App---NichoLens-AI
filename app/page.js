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
      <div style={styles.card}>
        <h1 style={styles.title}>NichoLens AI</h1>
        <p style={styles.subtitle}>
          Cole a URL do perfil e receba uma análise estratégica com IA
        </p>

        <input
          style={styles.input}
          placeholder="https://www.instagram.com/usuario"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button style={styles.button} onClick={analisar} disabled={loading}>
          {loading ? "Analisando..." : "Analisar Perfil"}
        </button>

        {result && (
          <pre style={styles.result}>
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    maxWidth: 700,
    width: "100%",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: 28,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  result: {
    marginTop: 20,
    whiteSpace: "pre-wrap",
    background: "#f0f0f0",
    padding: 15,
    borderRadius: 6,
    fontSize: 14,
  },
};
