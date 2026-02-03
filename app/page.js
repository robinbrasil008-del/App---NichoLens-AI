"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  // ✅ Fonte bonita sem mexer no layout.js
  useEffect(() => {
    const id = "nicholens-font";
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

  function copyText(label, text) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1200);
  }

  return (
    <main style={styles.bg}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.brandRow}>
            <span style={styles.icon}>🔍</span>
            <h1 style={styles.brand}>NichoLens AI</h1>
          </div>
          <p style={styles.subtitle}>
            Diagnóstico estratégico para crescer nas redes sociais
          </p>
        </header>

        <section style={styles.topCard}>
          <label style={styles.label}>URL do perfil</label>
          <input
            style={styles.input}
            placeholder="Cole a URL do perfil (Instagram, TikTok, YouTube)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button style={styles.button} onClick={analisar} disabled={loading}>
            {loading ? "Analisando..." : "🚀 Analisar Perfil"}
          </button>

          <div style={styles.hintRow}>
            <span style={styles.hintPill}>✅ Nicho automático</span>
            <span style={styles.hintPill}>✅ Sugestões por seção</span>
            <span style={styles.hintPill}>✅ Copiar rápido</span>
          </div>
        </section>

        {analysis && (
          <section style={styles.results}>
            <Block
              title="🎯 Nicho Identificado"
              text={get(analysis, 1)}
              onCopy={() => copyText("Nicho", get(analysis, 1))}
              copied={copied === "Nicho"}
            />
            <Block
              title="👥 Público-Alvo"
              text={get(analysis, 2)}
              onCopy={() => copyText("Publico", get(analysis, 2))}
              copied={copied === "Publico"}
            />
            <Block
              title="✅ Pontos Fortes"
              text={get(analysis, 3)}
              onCopy={() => copyText("Fortes", get(analysis, 3))}
              copied={copied === "Fortes"}
            />
            <Block
              title="⚠️ Pontos Fracos"
              text={get(analysis, 4)}
              onCopy={() => copyText("Fracos", get(analysis, 4))}
              copied={copied === "Fracos"}
            />
            <Block
              title="🚀 Sugestões Práticas"
              text={get(analysis, 5)}
              onCopy={() => copyText("Sugestoes", get(analysis, 5))}
              copied={copied === "Sugestoes"}
            />
            <Block
              title="🧬 Bio Otimizada"
              text={get(analysis, 6)}
              onCopy={() => copyText("Bio", get(analysis, 6))}
              copied={copied === "Bio"}
            />
            <Block
              title="💡 Ideias de Conteúdo"
              text={get(analysis, 7)}
              onCopy={() => copyText("Ideias", get(analysis, 7))}
              copied={copied === "Ideias"}
            />

            <button
              style={styles.copyAll}
              onClick={() => copyText("Completa", analysis)}
            >
              {copied === "Completa" ? "✅ Copiado!" : "📋 Copiar Análise Completa"}
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

      <div style={styles.blockBody}>{formatText(text)}</div>
    </div>
  );
}

// Tenta melhorar leitura em bullets (sem precisar mudar a API)
function formatText(text) {
  const lines = text
    .replace(/\*\*/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Se tiver várias linhas começando com "-" vira lista
  const dashCount = lines.filter((l) => l.startsWith("-")).length;

  if (dashCount >= 2) {
    return (
      <ul style={styles.ul}>
        {lines.map((l, i) => (
          <li key={i} style={styles.li}>
            {l.replace(/^-+\s*/, "")}
          </li>
        ))}
      </ul>
    );
  }

  return <p style={styles.p}>{text.replace(/\*\*/g, "").trim()}</p>;
}

// Extrai seção 1..7 do texto vindo do modelo
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
      '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
    color: "#0f172a",
  },
  shell: {
    maxWidth: 920,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 14,
  },
  brandRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { fontSize: 28 },
  brand: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    letterSpacing: -0.6,
    color: "#0b1220",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#475569",
    fontSize: 14,
  },
  topCard: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    width: "100%",
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid rgba(2,6,23,0.12)",
    outline: "none",
    fontSize: 15,
    background: "#ffffff",
    color: "#0f172a",
  },
  button: {
    width: "100%",
    marginTop: 12,
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 14px 26px rgba(79,70,229,0.25)",
  },
  hintRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  hintPill: {
    fontSize: 12,
    color: "#334155",
    background: "#eef2ff",
    border: "1px solid rgba(79,70,229,0.18)",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 700,
  },
  results: {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  block: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 10px 22px rgba(15,23,42,0.08)",
  },
  blockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  blockTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: "#0b1220",
  },
  copyBtn: {
    border: "1px solid rgba(2,6,23,0.10)",
    background: "#ffffff",
    padding: "8px 12px",
    borderRadius: 999,
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
    color: "#0f172a",
  },
  blockBody: {
    color: "#0f172a",
    fontSize: 14,
    lineHeight: 1.65,
  },
  ul: {
    margin: 0,
    paddingLeft: 18,
  },
  li: {
    marginBottom: 6,
    color: "#0f172a",
  },
  p: {
    margin: 0,
    whiteSpace: "pre-line",
  },
  copyAll: {
    marginTop: 6,
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 14px 26px rgba(2,6,23,0.18)",
  },
};
