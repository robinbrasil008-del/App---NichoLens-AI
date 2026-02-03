"use client";

import { useState } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Olá! Eu sou o **Pedro**, seu especialista em crescimento nas redes sociais.\n\nPergunte sobre nicho, Instagram, TikTok, conteúdo ou estratégias.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

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
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Erro ao responder. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <Link href="/" style={styles.back}>←</Link>
        <span>Chat NichoLens AI</span>
      </div>

      {/* Mensagens */}
      <div style={styles.chat}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf:
                msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user"
                  ? "#6d5dfc"
                  : "#2a2f45",
            }}
          >
            {msg.content.split("\n").map((line, idx) => (
              <div key={idx} style={{ marginBottom: 6 }}>
                {line}
              </div>
            ))}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.bubble, background: "#2a2f45" }}>
            Digitando...
          </div>
        )}
      </div>

      {/* Input fixo embaixo */}
      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>
          Enviar
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background:
      "linear-gradient(180deg, #0f1225 0%, #090b17 100%)",
    color: "#fff",
  },
  header: {
    padding: "14px",
    background: "#0d1020",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: "600",
  },
  back: {
    color: "#aaa",
    textDecoration: "none",
    fontSize: 18,
  },
  chat: {
    flex: 1,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
  },
  bubble: {
    maxWidth: "85%",
    padding: "14px",
    borderRadius: 16,
    fontSize: 15,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
  inputArea: {
    display: "flex",
    padding: "12px",
    gap: 10,
    background: "#0d1020",
  },
  input: {
    flex: 1,
    padding: "14px",
    borderRadius: 12,
    border: "none",
    outline: "none",
    background: "#1a1f36",
    color: "#fff",
  },
  button: {
    padding: "0 20px",
    borderRadius: 12,
    border: "none",
    background: "#6d5dfc",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};
