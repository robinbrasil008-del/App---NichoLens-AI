"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Olá! Sou a IA do NichoLens. Pergunte sobre crescimento, nicho, conteúdo ou monetização.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updated }),
    });

    const data = await res.json();

    setMessages([
      ...updated,
      { role: "assistant", content: data.reply },
    ]);
    setLoading(false);
  }

  return (
    <main style={styles.bg}>
      <div style={styles.box}>
        <h1 style={styles.title}>💬 Chat NichoLens AI</h1>

        <div style={styles.chat}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.msg,
                background:
                  m.role === "user" ? "#4f46e5" : "#e5e7eb",
                color: m.role === "user" ? "#fff" : "#000",
                alignSelf:
                  m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {m.content}
            </div>
          ))}
          {loading && <span>✍️ Digitando...</span>}
        </div>

        <div style={styles.inputBox}>
          <input
            style={styles.input}
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button style={styles.btn} onClick={sendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "#f5f7ff",
    padding: 20,
  },
  box: {
    maxWidth: 800,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 20px 40px rgba(0,0,0,.15)",
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },
  title: {
    fontWeight: 800,
    marginBottom: 10,
  },
  chat: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 10,
  },
  msg: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
    fontSize: 14,
  },
  inputBox: {
    display: "flex",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ccc",
  },
  btn: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 700,
  },
};
