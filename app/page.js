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

      if (!res.ok) throw new Error(data.error);

      setResult(data.result);
    } catch {
      setResult("❌ Erro ao analisar perfil.");
    }

    setLoading(false);
  }

  function copiar() {
    navigator.clipboard.writeText(result);
    alert("Análise copiada!");
  }

  return (
    <div className="container">
      <div className="card">
        <h1>NichoLens AI</h1>
        <p className="subtitle">
          Cole a URL do perfil e receba uma análise estratégica com IA
        </p>

        <input
          placeholder="https://www.instagram.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={analisar} disabled={loading}>
          {loading ? "Analisando..." : "Analisar Perfil"}
        </button>

        {result && (
          <>
            <div className="result">{result}</div>
            <button className="copy" onClick={copiar}>
              Copiar Análise
            </button>
          </>
        )}
      </div>
    </div>
  );
}
