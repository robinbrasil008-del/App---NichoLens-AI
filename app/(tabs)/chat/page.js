"use client";

import { useState } from "react";

export default function ChatPage() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  async function send() {
    if (!msg) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { role: "Você", text: msg },
      { role: "IA", text: data.reply }
    ]);

    setMsg("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat NichoLens AI</h2>

      <div style={{ marginBottom: 20 }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.text}
          </p>
        ))}
      </div>

      <input
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="Digite sua pergunta"
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button
        onClick={send}
        style={{ width: "100%", padding: 12 }}
      >
        Enviar
      </button>
    </div>
  );
          }
