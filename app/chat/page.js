"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Pergunte algo sobre redes sociais!" },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "Erro ao responder." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Erro de conexão." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>💬 Chat NichoLens AI</h1>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{m.role === "user" ? "Você:" : "IA:"}</b> {m.content}
          </div>
        ))}
        {loading && <div>Digitando...</div>}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Digite sua pergunta..."
        style={{ width: "100%", padding: 10 }}
      />
      <button onClick={sendMessage} style={{ marginTop: 8 }}>
        Enviar
      </button>
    </main>
  );
}
