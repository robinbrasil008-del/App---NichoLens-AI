"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();

      if (!data?.reply) {
        throw new Error("Resposta inválida");
      }

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Ops! Tivemos um problema ao responder. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <span>Assistente Pedro · Chat-IA</span>
      </div>

      {/* CHAT */}
      <div style={styles.chat}>
        {messages.length === 0 && (
          <div style={styles.info}>
            🔒 O NichoLens utiliza a tecnologia <b>OpenAI – ChatGPT</b>
            <div style={styles.suggestions}>
              {[
                "Qual é o meu nicho?",
                "Ideias de conteúdo para Instagram",
                "Como crescer no TikTok?",
                "Como viralizar meus vídeos?",
              ].map(q => (
                <button
                  key={q}
                  style={styles.sug}
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={m.role === "user" ? styles.user : styles.ai}
          >
            {m.content}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT FIXO ACIMA DO BANNER */}
      <div style={styles.inputWrapper}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={styles.input}
        />
        <button
          onClick={() => sendMessage(input)}
          style={styles.send}
          disabled={loading}
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>

      {/* BANNER */}
      <div style={styles.footer}>
        <Link href="/">🏠 Início</Link>
        <span>💬 Chat IA</span>
      </div>
    </div>
  );
}

const FOOTER_HEIGHT = 52;
const INPUT_HEIGHT = 64;

const styles = {
  page: {
    background: "linear-gradient(180deg,#070b1a,#050814)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
  },

  header: {
    height: 52,
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    background: "#0b1025",
    borderBottom: "1px solid #1f2440",
    fontWeight: 600,
  },

  chat: {
    flex: 1,
    padding: 14,
    overflowY: "auto",
    paddingBottom: INPUT_HEIGHT + 10,
  },

  user: {
    alignSelf: "flex-end",
    background: "#6c63ff",
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
    maxWidth: "80%",
  },

  ai: {
    background: "#1c223f",
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
    maxWidth: "85%",
  },

  info: {
    textAlign: "center",
    opacity: 0.85,
    marginTop: 30,
  },

  suggestions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 18,
  },

  sug: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: "8px 14px",
    color: "#fff",
  },

  inputWrapper: {
    position: "fixed",
    bottom: FOOTER_HEIGHT,
    left: 0,
    right: 0,
    display: "flex",
    gap: 8,
    padding: 10,
    background: "#0b1025",
    borderTop: "1px solid #1f2440",
    zIndex: 10,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "none",
  },

  send: {
    background: "#6c63ff",
    border: "none",
    color: "#fff",
    borderRadius: 12,
    padding: "0 18px",
  },

  footer: {
    height: FOOTER_HEIGHT,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "#0b1025",
    borderTop: "1px solid #1f2440",
  },
};
