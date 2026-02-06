"use client";

import { useEffect, useRef, useState } from "react";
import { useTickets } from "../../context/TicketContext";
import { useSession } from "next-auth/react";

const SUGESTOES = [
  "Qual é o meu nicho?",
  "Ideias de conteúdo para Instagram",
  "Como crescer no TikTok?",
  "Como viralizar meus vídeos?",
];

export default function ChatPage() {
  const { tickets, consumeTicket } = useTickets();
  const { data: session } = useSession();

  const USER_KEY = session?.user?.email || "guest";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const chatIdRef = useRef(null);
  const bottomRef = useRef(null);
  const chatRef = useRef(null);
  const menuRef = useRef(null);
  const touchStartX = useRef(0);

  if (!chatIdRef.current) chatIdRef.current = Date.now();

  /* ===== LOAD PROJECTS + ABRIR PROJETO DO PERFIL ===== */
  useEffect(() => {
    if (typeof window === "undefined" || !USER_KEY) return;

    const saved =
      JSON.parse(
        localStorage.getItem(`nicholens-projects:${USER_KEY}`)
      ) || [];
    setProjects(saved);

    const openId = localStorage.getItem(
      `nicholens-open-project:${USER_KEY}`
    );

    if (openId) {
      const project = saved.find(
        (p) => String(p.id) === String(openId)
      );
      if (project) {
        chatIdRef.current = project.id;
        setMessages(project.messages || []);
      }
      localStorage.removeItem(
        `nicholens-open-project:${USER_KEY}`
      );
    }
  }, [USER_KEY]);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    if (!chatRef.current) return;
    if (messages.length === 0) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  /* ===== CLICK OUTSIDE ===== */
  useEffect(() => {
    function handleClick(e) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  function generateProjectTitle(msg) {
    if (!msg) return "Novo projeto";
    return msg.length > 40 ? msg.slice(0, 40) + "…" : msg;
  }

  async function sendMessage(text) {
    const msg = text ?? input;
    if (!msg.trim() || loading) return;
    if (!consumeTicket()) return;

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

      const aiMsg = {
        role: "assistant",
        content: data.reply || "Erro ao responder.",
      };

      setMessages((prev) => {
        const updated = [...prev, aiMsg];

        const firstUser =
          updated.find((m) => m.role === "user")?.content;

        const project = {
          id: chatIdRef.current,
          title: generateProjectTitle(firstUser),
          messages: updated,
        };

        const newProjects = [
          project,
          ...projects.filter((p) => p.id !== project.id),
        ];

        setProjects(newProjects);
        localStorage.setItem(
          `nicholens-projects:${USER_KEY}`,
          JSON.stringify(newProjects)
        );

        return updated;
      });
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
    chatIdRef.current = Date.now();
    setMessages([]);
    setMenuOpen(false);
  }

  function loadProject(p) {
    chatIdRef.current = p.id;
    setMessages(p.messages || []);
    setMenuOpen(false);
  }

  function renameProject(id) {
    const name = prompt("Novo nome do projeto:");
    if (!name) return;

    const updated = projects.map((p) =>
      p.id === id ? { ...p, title: name } : p
    );
    setProjects(updated);
    localStorage.setItem(
      `nicholens-projects:${USER_KEY}`,
      JSON.stringify(updated)
    );
  }

  function deleteProject(id) {
    if (!confirm("Deseja excluir este projeto?")) return;

    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem(
      `nicholens-projects:${USER_KEY}`,
      JSON.stringify(updated)
    );

    if (chatIdRef.current === id) newChat();
  }

  return (
    <div
      style={styles.page}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (menuOpen && delta < -50) setMenuOpen(false);
      }}
    >
      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuBtn}>
          ☰
        </button>
        <span>Assistente Pedro • Chat-IA</span>
        <span style={styles.tickets}>🎟️ {tickets}</span>
      </div>

      {menuOpen && (
        <div style={styles.menu} ref={menuRef}>
          <button style={styles.menuItem} onClick={newChat}>
            ➕ Novo chat
          </button>

          <div style={styles.menuTitle}>📁 Projetos salvos</div>

          {projects.length === 0 && (
            <div style={styles.menuEmpty}>Nenhum projeto ainda</div>
          )}

          {projects.map((p) => (
            <div key={p.id} style={styles.projectItem}>
              <button
                style={styles.projectBtn}
                onClick={() => loadProject(p)}
              >
                📌 {p.title}
              </button>

              <div style={styles.projectActions}>
                <button onClick={() => renameProject(p.id)} style={styles.iconBtn}>
                  ✏️
                </button>
                <button onClick={() => deleteProject(p.id)} style={styles.iconBtn}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTEÚDO */}
      <div style={styles.content}>
        {messages.length === 0 && (
          <div style={styles.intro}>
            <div style={styles.openai}>
              🔒 O NichoLens utiliza <b>OpenAI – ChatGPT</b>
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

        <div style={styles.chat} ref={chatRef}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#6d5dfc" : "#2a2f45",
              }}
            >
              {String(m.content).split("\n").map((l, j) => (
                <div key={j}>{l}</div>
              ))}
            </div>
          ))}

          {loading && <div style={styles.bubble}>Digitando…</div>}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <div style={styles.inputFixed}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            tickets > 0 ? "Digite sua mensagem..." : "Tickets esgotados"
          }
          disabled={tickets <= 0}
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={() => sendMessage()}
          style={styles.send}
          disabled={tickets <= 0}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
/* 🔒 100% INTACTOS */

  page: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg,#0f1225,#090b17)",
    color: "#fff",
    position: "relative",
  },
  header: {
    padding: 14,
    display: "flex",
    gap: 12,
    alignItems: "center",
    background: "#0d1020",
    fontWeight: 600,
    flexShrink: 0,
  },
  tickets: {
    marginLeft: "auto",
    fontSize: 13,
    opacity: 0.85,
  },
  menuBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
  },
  content: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
  intro: {
    padding: 20,
    textAlign: "center",
  },
  openai: {
    opacity: 0.7,
    marginBottom: 16,
  },
  suggestions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  suggestion: {
    borderRadius: 20,
    border: "1px solid #2a2f45",
    background: "transparent",
    color: "#cfd3ff",
    padding: "8px 16px",
    cursor: "pointer",
  },
  chat: {
    flex: 1,
    minHeight: 0,
    padding: 16,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  bubble: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 16,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  inputFixed: {
    display: "flex",
    gap: 10,
    padding: 12,
    background: "#0d1020",
    borderTop: "1px solid #1f2440",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#1a1f36",
    color: "#fff",
    outline: "none",
  },
  send: {
    background: "#6d5dfc",
    border: "none",
    borderRadius: 12,
    padding: "0 20px",
    color: "#fff",
    cursor: "pointer",
  },

  menu: {
    position: "absolute",
    top: 56,
    left: 10,
    background: "#141836",
    borderRadius: 16,
    padding: 12,
    width: 270,
    zIndex: 50,
    boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
  },

  menuTitle: {
    fontSize: 12,
    opacity: 0.6,
    margin: "10px 0 6px",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  menuItem: {
    width: "100%",
    padding: "10px 12px",
    background: "#1c2142",
    border: "none",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: 10,
    fontWeight: 600,
    marginBottom: 8,
  },

  projectItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#1c2142",
    borderRadius: 12,
    padding: "8px 10px",
    marginBottom: 6,
  },

  projectBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    flex: 1,
    textAlign: "left",
    cursor: "pointer",
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  projectActions: {
    display: "flex",
    gap: 6,
  },

  iconBtn: {
    background: "#232a55",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    borderRadius: 8,
    padding: "4px 6px",
    fontSize: 12,
  },

  menuEmpty: {
    opacity: 0.5,
    fontSize: 13,
    padding: "6px 0",
    textAlign: "center",
  },
};
