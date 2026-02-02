"use client";

import { useState } from "react";
import ChatBox from "../components/ChatBox";
import CopyButton from "../components/CopyButton";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!url) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro desconhecido");
      }

      setResult(data.result);
    } catch (err) {
      setResult("❌ Erro ao analisar o perfil. Verifique a URL.");
    }

    setLoading(false);
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NichoLens AI</h1>

      <input
        className="border p-3 w-full"
        placeholder="Cole a URL do perfil (Instagram, TikTok, YouTube...)"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />

      <button
        onClick={analyze}
        className="mt-3 bg-black text-white px-6 py-3 rounded"
      >
        {loading ? "Analisando..." : "Analisar Perfil"}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
          <CopyButton text={result} />
        </div>
      )}

      <ChatBox />
    </main>
  );
}
