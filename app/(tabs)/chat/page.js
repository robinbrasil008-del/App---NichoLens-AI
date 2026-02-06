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
