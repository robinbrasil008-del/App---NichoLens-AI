"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

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
        </header>

        <section style={styles.card}>
          <label style={styles.label}>URL do perfil</label>
          <input
            style={styles.input}
            placeholder="Instagram, TikTok, YouTube..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button style={styles.mainButton} onClick={analisar}>
            {loading ? "Analisando..." : "🚀 Analisar Perfil"}
          </button>
        </section>

        {analysis && (
          <section style={styles.results}>
            <Block
              title="🎯 Nicho Identificado"
              text={get(analysis, 1)}
              copied={copied === "nicho"}
              onCopy={() => copy("nicho", get(analysis, 1))}
            />
            <Block
              title="👥 Público-Alvo"
              text={get(analysis, 2)}
              copied={copied === "publico"}
              onCopy={() => copy("publico", get(analysis, 2))}
            />
            <Block
              title="✅ Pontos Fortes"
              text={get(analysis, 3)}
              copied={copied === "fortes"}
              onCopy={() => copy("fortes", get(analysis, 3))}
            />
            <Block
              title="⚠️ Pontos Fracos"
              text={get(analysis, 4)}
              copied={copied === "fracos"}
              onCopy={() => copy("fracos", get(analysis, 4))}
            />
            <Block
              title="🚀 Sugestões Práticas"
              text={get(analysis, 5)}
              copied={copied === "sugestoes"}
              onCopy={() => copy("sugestoes", get(analysis, 5))}
            />
            <Block
              title="🧬 Bio Otimizada"
              text={get(analysis, 6)}
              copied={copied === "bio"}
              onCopy={() => copy("bio", get(analysis, 6))}
            />
            <Block
              title="💡 Ideias de Conteúdo"
              text={get(analysis, 7)}
              copied={copied === "ideias"}
              onCopy={() => copy("ideias", get(analysis, 7))}
            />

            <button style={styles.copyAll} onClick={() => copy("all", analysis)}>
              {copied === "all" ? "✅ Análise Copiada" : "📋 Copiar Tudo"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function Block({ title, text, onCopy, copied }) {
  if (!text) return null;

  return (
    <div style={styles.block}>
      <div style={styles.blockHeader}>
        <h3 style={styles.blockTitle}>{title}</h3>
        <button style={styles.copyBtn} onClick={onCopy}>
          {copied ? "✅ Copiado" : "Copiar"}
        </button>
      </div>
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
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 800,
    color: "#64748b",
    textTransform: "uppercase",
  },
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
    cursor: "pointer",
  },
  results: { display: "flex", flexDirection: "column", gap: 12 },
  block: {
    background: "#fff",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 10px 22px rgba(15,23,42,0.08)",
  },
  blockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  blockTitle: { margin: 0, fontSize: 16, fontWeight: 900 },
  copyBtn: {
    border: "1px solid rgba(2,6,23,0.12)",
    background: "#fff",
    padding: "6px 12px",
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
  },
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
