"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Olá! Sou a IA do NichoLens. Pergunte sobre nicho, conteúdo, Instagram ou TikTok.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Erro ao responder." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Erro ao conectar com a IA." },
      ]);
    }

    setLoading(false);
  }

  return (
    <main style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <Link href="/" style={styles.back}>
          ← Voltar
        </Link>
        <h1 style={styles.title}>💬 Chat NichoLens AI</h1>
      </header>

      {/* MENSAGENS */}
      <section style={styles.chat}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(msg.role === "user"
                ? styles.userBubble
                : styles.aiBubble),
            }}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </section>

      {/* INPUT FIXO */}
      <footer style={styles.inputBar}>
        <input
          style={styles.input}
          placeholder="Digite sua pergunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.send} onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Enviar"}
        </button>
      </footer>
    </main>
  );
}

/* ESTILO APP */
const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg,#0f172a,#020617)",
    color: "#fff",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
  },
  header: {
    padding: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  back: {
    color: "#a5b4fc",
    textDecoration: "none",
    fontWeight: 700,
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
  },
  chat: {
    flex: 1,
    padding: 16,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  bubble: {
    maxWidth: "78%",
    padding: "12px 14px",
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  aiBubble: {
    background: "#1e293b",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  inputBar: {
    display: "flex",
    padding: 12,
    gap: 10,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: "#020617",
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 999,
    border: "none",
    outline: "none",
    fontSize: 14,
  },
  send: {
    padding: "0 18px",
    borderRadius: 999,
    border: "none",
    background: "#22c55e",
    color: "#022c22",
    fontWeight: 900,
    cursor: "pointer",
  },
};
