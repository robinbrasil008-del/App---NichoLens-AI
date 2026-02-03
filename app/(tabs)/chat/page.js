"use client";

import { useState } from "react";
import Link from "next/link";

const SUGESTOES = [
  "Qual é o meu nicho?",
  "Ideias de conteúdo para Instagram",
  "Como crescer no TikTok?",
  "Como viralizar meus vídeos?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text) {
    const messageToSend = text ?? input;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: messageToSend },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
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
        <span>Assistente Pedro • Chat-IA</span>
      </div>

      <div style={styles.main}>
        {/* Aviso OpenAI + Sugestões */}
        {messages.length === 0 && (
          <div style={styles.intro}>
            <div style={styles.openaiInfo}>
              🔒 O NichoLens utiliza a tecnologia{" "}
              <strong>OpenAI – ChatGPT</strong> para esta conversa.
            </div>

            <div style={styles.suggestions}>
              {SUGESTOES.map((s, i) => (
                <button
                  key={i}
                  style={styles.suggestion}
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat */}
        <div style={styles.chat}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                alignSelf:
                  msg.role === "user" ? "flex-end" : "flex-start",
                background:
                  msg.role === "user" ? "#6d5dfc" : "#2a2f45",
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

        {/* Input */}
        <div style={styles.inputArea}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => sendMessage()} style={styles.button}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

const BANNER_HEIGHT = 70;

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg,#0f1225,#090b17)",
    color: "#fff",
  },
  header: {
    padding: 14,
    background: "#0d1020",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: 600,
  },
  back: {
    color: "#aaa",
    textDecoration: "none",
    fontSize: 18,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  intro: {
    padding: 20,
    textAlign: "center",
  },
  openaiInfo: {
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 16,
  },
  suggestions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  suggestion: {
    padding: "8px 14px",
    borderRadius: 20,
    border: "1px solid #2a2f45",
    background: "transparent",
    color: "#cfd3ff",
    fontSize: 14,
    cursor: "pointer",
  },
  chat: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
    paddingBottom: 110,
  },
  bubble: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 16,
    fontSize: 15,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
  inputArea: {
    position: "sticky",
    bottom: BANNER_HEIGHT,
    display: "flex",
    gap: 10,
    padding: 12,
    background: "#0d1020",
    borderTop: "1px solid #1a1f36",
  },
  input: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#1a1f36",
    color: "#fff",
  },
  button: {
    padding: "0 20px",
    borderRadius: 12,
    border: "none",
    background: "#6d5dfc",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
