"use client";

import { useState } from "react";
import { useTickets } from "../context/TicketContext";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { tickets, consumeTicket } = useTickets();
  const { data: session, status } = useSession();

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

      let clean = data.result || "Nenhum resultado retornado.";

      // remove aviso fraco da IA
      clean = clean.replace(
        /não consigo acessar diretamente links.*?mencionou\./gi,
        ""
      );

      setAnalysis(clean.trim());
    } catch {
      setAnalysis("Erro ao analisar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  function copiar(texto) {
    navigator.clipboard.writeText(texto);
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>NichoLens AI</h1>

        {/* AÇÕES DIREITA */}
        <div style={styles.headerRight}>
          <div style={styles.tickets}>🎟️ {tickets}</div>

          {status === "authenticated" ? (
            <button onClick={() => signOut()} style={styles.authBtn}>
              Sair
            </button>
          ) : (
            <button
  onClick={() =>
    signIn("google", {
      redirect: false,
      callbackUrl: "/",
    })
  }
  style={styles.authBtn}
>
  Entrar
</button>
          )}
        </div>
      </header>

      {/* CTA REGISTRO */}
      {!session && (
        <div style={styles.cta}>
          🎁 Registre-se com Google e ganhe <b>+2 tickets grátis</b>
        </div>
      )}

      {/* INPUT */}
      <div style={styles.card}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole a URL do perfil"
          style={styles.input}
          disabled={tickets <= 0}
        />

        <button
          onClick={analisar}
          style={styles.button}
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
            .map((block, i) => {
              const lines = block
                .split("\n")
                .map(l => l.trim())
                .filter(Boolean);

              const title = lines[0];
              const content = lines.slice(1).join("\n");

              return (
                <div key={i} style={styles.block}>
                  <div style={styles.blockHeader}>
                    <h3 style={styles.blockTitle}>{title}</h3>
                    <button
                      style={styles.copyBtn}
                      onClick={() => copiar(content)}
                    >
                      Copiar
                    </button>
                  </div>

                  {content.split("\n").map((line, j) => (
                    <p key={j} style={styles.text}>
                      {line}
                    </p>
                  ))}
                </div>
              );
            })}
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
      "linear-gradient(180deg,#0f1225 0%,#151a3a 40%,#0b0f24 100%)",
    fontFamily:
      '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto',
    color: "#fff",
  },

  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: 900,
    margin: 0,
  },

  headerRight: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  tickets: {
    fontSize: 14,
    fontWeight: 800,
    opacity: 0.9,
  },

  authBtn: {
    padding: "6px 12px",
    borderRadius: 10,
    border: "none",
    background: "#2a2f55",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },

  cta: {
    marginBottom: 20,
    fontSize: 14,
    opacity: 0.9,
  },

  card: {
    background: "#fff",
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
    marginTop: 28,
    background: "#1c2142",
    borderRadius: 22,
    padding: 20,
    maxWidth: 860,
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  },

  block: {
    background: "#232a55",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },

  blockHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },

  blockTitle: {
    fontSize: 18,
    fontWeight: 800,
    margin: 0,
  },

  copyBtn: {
    marginLeft: "auto",
    padding: "6px 12px",
    borderRadius: 10,
    border: "none",
    background: "#6d5dfc",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },

  text: {
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 6,
    opacity: 0.95,
  },
};
