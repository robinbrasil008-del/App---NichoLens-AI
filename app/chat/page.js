"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Olá! Pode me perguntar qualquer coisa sobre crescimento em redes sociais, nicho, conteúdo ou monetização.",
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

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.reply },
    ]);
    setLoading(false);
  }

  return (
    <main style={styles.bg}>
      <div style={styles.chatBox}>
        <header style={styles.header}>
          💬 Chat NichoLens AI
          <span style={styles.sub}>Tire dúvidas com a IA</span>
        </header>

        <div style={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(m.role === "user"
                  ? styles.user
                  : styles.assistant),
              }}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div style={styles.loading}>✍️ Digitando...</div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button style={styles.button} onClick={sendMessage}>
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
    background:
      "radial-gradient(1200px 600px at 20% 0%, #e9edff 0%, #f7f8ff 40%, #eef2ff 100%)",
    padding: 16,
    fontFamily:
      '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI',
  },
  chatBox: {
    maxWidth: 800,
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: 18,
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    boxShadow: "0 18px 40px rgba(15,23,42,0.15)",
  },
  header: {
    padding: 16,
    fontSize: 18,
    fontWeight: 800,
    borderBottom: "1px solid #e5e7eb",
  },
  sub: {
    display: "block",
    fontSize: 12,
    color: "#64748b",
    fontWeight: 500,
  },
  messages: {
    flex: 1,
    padding: 16,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.6,
  },
  user: {
    alignSelf: "flex-end",
    background: "linear-gradient(90deg,#4f46e5,#7c3aed)",
    color: "#fff",
  },
  assistant: {
    alignSelf: "flex-start",
    background: "#f1f5f9",
    color: "#0f172a",
  },
  loading: {
    fontSize: 12,
    color: "#64748b",
  },
  inputArea: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderTop: "1px solid #e5e7eb",
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #cbd5f5",
    outline: "none",
  },
  button: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
};
