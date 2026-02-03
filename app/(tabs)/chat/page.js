"use client";

import { useEffect, useState } from "react";

const SUGESTOES = [
  "Qual é o meu nicho?",
  "Ideias de conteúdo para Instagram",
  "Como crescer no TikTok?",
  "Como viralizar meus vídeos?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  // 🔹 Carrega projetos salvos
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nicholens-projects")) || [];
    setProjects(saved);
  }, []);

  // 🔹 Salva automaticamente quando mensagens mudam
  useEffect(() => {
    if (messages.length === 0) return;

    const newProject = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      messages,
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem("nicholens-projects", JSON.stringify(updated));
    // eslint-disable-next-line
  }, [messages]);

  async function sendMessage(text) {
    const msg = text ?? input;
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao responder." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([]);
    setMenuOpen(false);
  }

  function loadProject(p) {
    setMessages(p.messages);
    setMenuOpen(false);
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuBtn}>
          ☰
        </button>
        <span>Assistente Pedro • Chat-IA</span>
      </div>

      {/* MENU */}
      {menuOpen && (
        <div style={styles.menu}>
          <button style={styles.menuItem} onClick={newChat}>
            ➕ Novo chat
          </button>

          <div style={styles.menuTitle}>📁 Projetos salvos</div>

          {projects.length === 0 && (
            <div style={styles.menuEmpty}>Nenhum projeto ainda</div>
          )}

          {projects.map((p) => (
            <button
              key={p.id}
              style={styles.menuItem}
              onClick={() => loadProject(p)}
            >
              {p.date}
            </button>
          ))}
        </div>
      )}

      {/* INTRO */}
      {messages.length === 0 && (
        <div style={styles.intro}>
          <div style={styles.openai}>
            🔒 O NichoLens usa <b>OpenAI – ChatGPT</b> nesta conversa
          </div>

          <div style={styles.suggestions}>
            {SUGESTOES.map((s, i) => (
              <button
                key={i}
                style={styles.suggestion}
                onClick={() => sendMessage(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT */}
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#6d5dfc" : "#2a2f45",
            }}
          >
            {m.content.split("\n").map((l, j) => (
              <div key={j}>{l}</div>
            ))}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.bubble, background: "#2a2f45" }}>
            Digitando...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={() => sendMessage()} style={styles.send}>
          Enviar
        </button>
      </div>
    </div>
  );
}

/* ====== STYLES ====== */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg,#0f1225,#090b17)",
    color: "#fff",
  },
  header: {
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#0d1020",
    fontWeight: 600,
  },
  menuBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
  },
  menu: {
    position: "absolute",
    top: 55,
    left: 10,
    background: "#141836",
    borderRadius: 12,
    padding: 10,
    width: 260,
    zIndex: 10,
  },
  menuTitle: {
    fontSize: 13,
    opacity: 0.7,
    margin: "8px 0",
  },
  menuItem: {
    width: "100%",
    background: "none",
    border: "none",
    color: "#fff",
    textAlign: "left",
    padding: 8,
    cursor: "pointer",
    borderRadius: 8,
  },
  menuEmpty: {
    fontSize: 13,
    opacity: 0.5,
    padding: 6,
  },
  intro: {
    padding: 20,
    textAlign: "center",
  },
  openai: {
    opacity: 0.7,
    fontSize: 14,
    marginBottom: 16,
  },
  suggestions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  suggestion: {
    padding: "8px 16px",
    borderRadius: 20,
    border: "1px solid #2a2f45",
    background: "transparent",
    color: "#cfd3ff",
    cursor: "pointer",
  },
  chat: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
  },
  bubble: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 16,
    fontSize: 15,
    lineHeight: 1.6,
  },
  inputArea: {
    display: "flex",
    gap: 10,
    padding: 12,
    background: "#0d1020",
  },
  input: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#1a1f36",
    color: "#fff",
  },
  send: {
    background: "#6d5dfc",
    border: "none",
    borderRadius: 12,
    padding: "0 20px",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
