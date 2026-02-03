"use client";

import { useEffect, useRef, useState } from "react";

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

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
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
      <header style={styles.header}>
        <h1 style={styles.title}>💬 Chat NichoLens AI</h1>
        <p style={styles.sub}>
          Tire dúvidas rápidas e receba ideias de conteúdo
        </p>
      </header>

      <section style={styles.chat}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
            }}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </section>

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

const styles = {
  app: {
    height: "calc(100vh - 80px)", // deixa espaço para a tabbar
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg,#0b1220,#050814)",
    color: "#fff",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
    borderRadius: 16,
    overflow: "hidden",
    margin: 12,
  },
  header: {
    padding: 14,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  title: { margin: 0, fontSize: 16, fontWeight: 900 },
  sub: { margin: "6px 0 0", fontSize: 12, opacity: 0.7 },
  chat: {
    flex: 1,
    padding: 14,
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
    background: "rgba(255,255,255,0.08)",
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
    background: "rgba(0,0,0,0.25)",
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
    color: "#052e16",
    fontWeight: 900,
    cursor: "pointer",
  },
};
