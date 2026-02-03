"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Olá! Pergunte algo sobre redes sociais." },
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
        { role: "assistant", content: data.reply ?? "Erro ao responder." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro de conexão." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h1>💬 Chat NichoLens AI</h1>

      <div style={{ margin: "20px 0" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{msg.role === "user" ? "Você:" : "IA:"}</strong>{" "}
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
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={sendMessage} style={{ marginTop: 10 }}>
        Enviar
      </button>
    </main>
  );
}
