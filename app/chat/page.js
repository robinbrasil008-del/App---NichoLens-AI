"use client";

import { useState } from "react";
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
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar com a IA." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
        background: "#12162a",
        borderRadius: 20,
      }}
    >
      <Link href="/" style={{ color: "#a5b4fc", textDecoration: "none" }}>
        ← Voltar para Home
      </Link>

      <h1 style={{ margin: "20px 0" }}>💬 Chat NichoLens AI</h1>

      <div style={{ marginBottom: 20 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              padding: 14,
              borderRadius: 14,
              background:
                msg.role === "user" ? "#1f2937" : "#1e1b4b",
            }}
          >
            <strong>{msg.role === "user" ? "Você" : "IA"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
        {loading && <p>Digitando...</p>}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua pergunta..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          border: "none",
          marginBottom: 10,
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
        }}
      >
        Enviar
      </button>
    </main>
  );
        }
