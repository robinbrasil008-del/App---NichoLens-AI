"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function hashMessages(messages) {
  return btoa(messages.map(m => m.role + m.content).join("|"));
}

function generateProjectTitle(text = "") {
  const t = text.toLowerCase();
  if (t.includes("nicho")) return "Qual é o meu nicho?";
  if (t.includes("instagram")) return "Instagram – Estratégia";
  if (t.includes("tiktok")) return "Crescer no TikTok";
  if (t.includes("viral")) return "Como viralizar vídeos";
  return "Novo projeto";
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nicholens-projects")) || [];
    setProjects(saved);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length < 2) return;

    const hash = hashMessages(messages);
    if (projects.some(p => p.hash === hash)) return;

    const title = generateProjectTitle(
      messages.find(m => m.role === "user")?.content
    );

    const newProject = {
      id: Date.now(),
      title,
      messages,
      hash,
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem("nicholens-projects", JSON.stringify(updated));
    // eslint-disable-next-line
  }, [messages]);

  async function sendMessage(text) {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
  }

  function loadProject(p) {
    setMessages(p.messages);
    setMenuOpen(false);
  }

  function renameProject(id) {
    const name = prompt("Renomear projeto:");
    if (!name) return;
    const updated = projects.map(p =>
      p.id === id ? { ...p, title: name } : p
    );
    setProjects(updated);
    localStorage.setItem("nicholens-projects", JSON.stringify(updated));
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuBtn}>
          ☰
        </button>
        <span>Assistente Pedro · Chat-IA</span>
      </div>

      {/* MENU */}
      {menuOpen && (
        <div style={styles.menu}>
          <button onClick={() => setMessages([])} style={styles.menuItem}>
            ➕ Novo chat
          </button>
          <div style={{ marginTop: 8, opacity: 0.7 }}>📁 Projetos salvos</div>
          {projects.map(p => (
            <div key={p.id} style={{ display: "flex", gap: 6 }}>
              <button
                style={{ ...styles.menuItem, flex: 1 }}
                onClick={() => loadProject(p)}
              >
                📌 {p.title}
              </button>
              <button onClick={() => renameProject(p.id)} style={styles.rename}>
                ✏️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AVISO OPENAI */}
      {messages.length === 0 && (
        <div style={styles.info}>
          🔒 O NichoLens utiliza a tecnologia <b>OpenAI – ChatGPT</b> para esta
          conversa.
          <div style={styles.suggestions}>
            {[
              "Qual é o meu nicho?",
              "Ideias de conteúdo para Instagram",
              "Como crescer no TikTok?",
              "Como viralizar meus vídeos?",
            ].map(q => (
              <button key={q} onClick={() => sendMessage(q)} style={styles.sug}>
                {q}
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
            style={m.role === "user" ? styles.user : styles.ai}
          >
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT FIXO */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={styles.input}
        />
        <button onClick={() => sendMessage(input)} style={styles.send}>
          Enviar
        </button>
      </div>

      {/* BANNER */}
      <div style={styles.footer}>
        <Link href="/">🏠 Início</Link>
        <span>💬 Chat IA</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(180deg,#070b1a,#050814)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
  },
  header: {
    height: 52,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 12px",
    background: "#0b1025",
    borderBottom: "1px solid #1f2440",
  },
  menuBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 22,
  },
  menu: {
    position: "absolute",
    top: 52,
    left: 8,
    background: "#0e1430",
    padding: 12,
    borderRadius: 12,
    zIndex: 20,
    width: 260,
  },
  menuItem: {
    background: "none",
    border: "none",
    color: "#fff",
    padding: 6,
    textAlign: "left",
    width: "100%",
  },
  rename: {
    background: "none",
    border: "none",
    color: "#cfd3ff",
  },
  info: {
    textAlign: "center",
    opacity: 0.8,
    marginTop: 30,
  },
  suggestions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 20,
  },
  sug: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: "8px 14px",
    color: "#fff",
  },
  chat: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
  },
  user: {
    alignSelf: "flex-end",
    background: "#6c63ff",
    padding: 10,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "80%",
  },
  ai: {
    background: "#1c223f",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "85%",
  },
  inputBox: {
    position: "sticky",
    bottom: 52,
    display: "flex",
    gap: 8,
    padding: 10,
    background: "#0b1025",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "none",
  },
  send: {
    background: "#6c63ff",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    padding: "0 16px",
  },
  footer: {
    height: 52,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "#0b1025",
    borderTop: "1px solid #1f2440",
  },
};
