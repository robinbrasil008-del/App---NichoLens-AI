"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Olá! Sou a IA do NichoLens. Pergunte sobre nicho, Instagram, TikTok ou crescimento nas redes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

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
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao responder. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#343541",
        color: "#ececf1",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #4b4c56",
          display: "flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: "#343541",
        }}
      >
        <Link href="/" style={{ color: "#ececf1", textDecoration: "none" }}>
          ←
        </Link>
        <strong>Chat NichoLens AI</strong>
      </div>

      {/* Mensagens */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              padding: "20px 16px",
              backgroundColor:
                msg.role === "assistant" ? "#444654" : "#343541",
              borderBottom: "1px solid #3e3f4b",
            }}
          >
            <div
              style={{
                maxWidth: 720,
                margin: "0 auto",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{
              padding: "20px 16px",
              backgroundColor: "#444654",
            }}
          >
            <div style={{ maxWidth: 720, margin: "0 auto", opacity: 0.7 }}>
              Digitando…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: "1px solid #4b4c56",
          padding: "12px",
          backgroundColor: "#343541",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            gap: 8,
            backgroundColor: "#40414f",
            borderRadius: 12,
            padding: 8,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Digite sua mensagem…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ececf1",
              fontSize: 15,
              padding: "8px",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              background: "transparent",
              border: "none",
              color: "#ececf1",
              fontSize: 14,
              cursor: "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
