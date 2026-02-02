"use client";
import { useState } from "react";

export default function ChatBox() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");

  async function sendMessage() {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    setReply(data.reply);
  }

  return (
    <div className="mt-6">
      <h2 className="font-bold">Chat com IA</h2>
      <input
        className="border p-2 w-full"
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="Tire sua dúvida..."
      />
      <button onClick={sendMessage} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
        Enviar
      </button>
      {reply && <p className="mt-3 bg-gray-100 p-3">{reply}</p>}
    </div>
  );
}
