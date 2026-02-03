"use client";

import { useState } from "react";
import { useTickets } from "../context/TicketContext";

export default function Page() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const { tickets, consumeTicket } = useTickets();

  async function analisar() {
    if (!url || loading) return;

    // 🎟️ TICKET GLOBAL
    if (!consumeTicket()) {
      alert("❌ Seus tickets acabaram!");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setAnalysis(data.result || "Sem resposta");
    } catch {
      setAnalysis("Erro ao analisar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>NichoLens AI</h1>

      <div style={{ marginBottom: 10 }}>🎟️ Tickets: {tickets}</div>

      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="URL do perfil"
        style={{ width: "100%", padding: 12, marginBottom: 10 }}
      />

      <button
        onClick={analisar}
        disabled={tickets <= 0}
        style={{ padding: 12, width: "100%" }}
      >
        {loading ? "Analisando..." : "🚀 Analisar Perfil"}
      </button>

      {analysis && (
        <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          {analysis}
        </pre>
      )}
    </main>
  );
}
