"use client";
import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import CopyButton from "@/components/CopyButton";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  async function analyze() {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    setResult(data.result);
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NichoLens AI</h1>

      <input
        className="border p-3 w-full"
        placeholder="Cole a URL do perfil"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />

      <button onClick={analyze} className="mt-3 bg-black text-white px-6 py-3 rounded">
        Analisar Perfil
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
