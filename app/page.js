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
        throw new Error(data.error);
      }

      setResult(data.result);
    } catch (err) {
      setResult("❌ Erro ao analisar perfil");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 20, maxWidth: 700 }}>
      <h1>NichoLens AI</h1>

      <input
        placeholder="Cole a URL do perfil (Instagram, TikTok, etc)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10
        }}
      />

      <button
        onClick={analisar}
        style={{ padding: 10 }}
      >
        {loading ? "Analisando..." : "Analisar Perfil"}
      </button>

      {result && (
        <pre style={{
          marginTop: 20,
          whiteSpace: "pre-wrap",
          background: "#f4f4f4",
          padding: 15
        }}>
          {result}
        </pre>
      )}
    </main>
  );
}
