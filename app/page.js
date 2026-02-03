"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisar() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro");
      }

      setResult(data.result);
    } catch (e) {
      setResult("❌ ERRO AO ANALISAR");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 20, maxWidth: 600 }}>
      <h1>NichoLens AI (ZERO)</h1>

      <input
        placeholder="Cole a URL do perfil"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button onClick={analisar} style={{ padding: 10 }}>
        {loading ? "Analisando..." : "Analisar"}
      </button>

      {result && (
        <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          {result}
        </pre>
      )}
    </main>
  );
}
