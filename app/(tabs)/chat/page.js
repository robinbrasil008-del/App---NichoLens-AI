"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Oi! Eu sou o Pedro 😊\nSou a IA do NichoLens.\nPode me perguntar sobre nicho, Instagram, TikTok ou crescimento nas redes sociais.",
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

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
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
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ops 😅 deu um erro aqui. Tenta de novo!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          borderBottom: "1px solid #1f2937",
          backgroundColor: "#111827",
          flexShrink: 0,
        }}
      >
        <Link href="/" style={{ color: "#e5e7eb", textDecoration: "none" }}>
          ←
        </Link>
        <strong>Pedro • IA NichoLens</strong>
      </div>

      {/* Mensagens */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              backgroundColor:
                msg.role === "user" ? "#2563eb" : "#1f2937",
              color: "#e5e7eb",
              padding: "12px 14px",
              borderRadius: 16,
              borderBottomRightRadius:
                msg.role === "user" ? 4 : 16,
              borderBottomLeftRadius:
                msg.role === "assistant" ? 4 : 16,
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
              fontSize: 15,
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#1f2937",
              padding: "10px 14px",
              borderRadius: 16,
              fontSize: 14,
              opacity: 0.7,
            }}
          >
            Pedro está digitando…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input fixo embaixo */}
      <div
        style={{
          padding: "10px",
          borderTop: "1px solid #1f2937",
          backgroundColor: "#111827",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            backgroundColor: "#1f2937",
            borderRadius: 999,
            padding: "8px 12px",
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
              color: "#e5e7eb",
              fontSize: 15,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              border: "none",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 14,
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
              }
