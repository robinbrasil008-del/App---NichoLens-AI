"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTickets } from "../../context/TicketContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { tickets } = useTickets();
  const router = useRouter();

  const USER_KEY = session?.user?.email || "guest";

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [nicho, setNicho] = useState("");
  const [editName, setEditName] = useState(false);
  const [editNicho, setEditNicho] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !USER_KEY) return;

    const storedProjects =
      JSON.parse(
        localStorage.getItem(`nicholens-projects:${USER_KEY}`)
      ) || [];
    setProjects(storedProjects);

    const savedName = localStorage.getItem(
      `nicholens-name:${USER_KEY}`
    );
    const savedNicho = localStorage.getItem(
      `nicholens-nicho:${USER_KEY}`
    );

    if (savedName) setName(savedName);
    else setName(session?.user?.name || "");

    if (savedNicho) setNicho(savedNicho);
    else setNicho("");
  }, [USER_KEY, session]);

  if (status === "loading") return <div style={styles.page} />;

  /* ===== NÃO LOGADO ===== */
  if (!session) {
    return (
      <div style={{ ...styles.page, ...styles.center }}>
        <div style={styles.authCard}>
          <span style={styles.authText}>Faça o login autenticado com:</span>
          <div style={styles.provider}>
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={styles.googleIcon}
            />
            <button style={styles.loginBtn} onClick={() => signIn("google")}>
              Login
            </button>
          </div>
        </div>

        <div style={styles.authCard}>
          <span style={styles.authText}>Faça o registro autenticado com:</span>
          <div style={styles.provider}>
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={styles.googleIcon}
            />
            <button style={styles.registerBtn} onClick={() => signIn("google")}>
              Registrar-se
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===== LOGADO ===== */
  return (
    <div style={styles.pageScroll}>
      {/* HEADER PERFIL */}
      <div style={styles.profileHeader}>
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt="Avatar"
            style={styles.avatarImg}
          />
        ) : (
          <div style={styles.avatar}>
            {(name || session.user?.name || "U").charAt(0)}
          </div>
        )}

        <div style={{ flex: 1 }}>
          {editName ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                localStorage.setItem(
                  `nicholens-name:${USER_KEY}`,
                  name
                );
                setEditName(false);
              }}
              autoFocus
              style={styles.editInput}
            />
          ) : (
            <div style={styles.name} onClick={() => setEditName(true)}>
              {name || session.user?.name} ✏️
            </div>
          )}

          <div style={styles.email}>{session.user?.email}</div>

          <button
            style={styles.linkBtn}
            onClick={() =>
              window.open("https://myaccount.google.com", "_blank")
            }
          >
            Alterar foto
          </button>
        </div>
      </div>

      {/* INFO CARD */}
      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span>🎟️ Tickets</span>
          <b>{tickets}</b>
        </div>

        <div style={styles.infoRow}>
          <span>🎯 Nicho</span>

          {editNicho ? (
            <input
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              onBlur={() => {
                localStorage.setItem(
                  `nicholens-nicho:${USER_KEY}`,
                  nicho
                );
                setEditNicho(false);
              }}
              autoFocus
              style={styles.editInputSmall}
            />
          ) : (
            <span
              style={styles.nichoView}
              onClick={() => setEditNicho(true)}
            >
              {nicho || "(opcional)"}{" "}
              <span style={styles.pencil}>✏️</span>
            </span>
          )}
        </div>
      </div>

      {/* PROJETOS */}
      <div style={styles.sectionTitle}>📁 Projetos criados</div>

      {projects.length === 0 ? (
        <div style={styles.empty}>Nenhum projeto criado ainda</div>
      ) : (
        projects.map((p) => (
          <div key={p.id} style={styles.projectRow}>
            <div
              style={styles.projectTitle}
              onClick={() => {
                localStorage.setItem(
                  `nicholens-open-project:${USER_KEY}`,
                  p.id
                );
                router.push("/chat");
              }}
            >
              📌 {p.title}
            </div>

            <div style={styles.projectMenu}>
              <button
                onClick={() => {
                  const newName = prompt(
                    "Novo nome do projeto:",
                    p.title
                  );
                  if (!newName) return;

                  const updated = projects.map((x) =>
                    x.id === p.id
                      ? { ...x, title: newName }
                      : x
                  );
                  setProjects(updated);
                  localStorage.setItem(
                    `nicholens-projects:${USER_KEY}`,
                    JSON.stringify(updated)
                  );
                }}
              >
                ✏️
              </button>

              <button
                onClick={() => {
                  if (!confirm("Excluir este projeto?")) return;

                  const updated = projects.filter(
                    (x) => x.id !== p.id
                  );
                  setProjects(updated);
                  localStorage.setItem(
                    `nicholens-projects:${USER_KEY}`,
                    JSON.stringify(updated)
                  );
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}

      {/* SAIR */}
      <button style={styles.logout} onClick={() => signOut()}>
        Sair da conta
      </button>
    </div>
  );
}

/* ===== STYLES ===== */
/* ⚠️ STYLES 100% INTACTOS — IGUAIS AO SEU */

const styles = {
  page: {
  minHeight: "100vh", // 🔥 garante altura real da tela
  padding: 20,
  background: "linear-gradient(180deg,#0f1225,#0b0f24)",
  color: "#fff",
  display: "flex", // 🔥 ativa flex
},
  pageScroll: {
    height: "100%",
    padding: 20,
    paddingBottom: 90,
    overflowY: "auto",
    background: "linear-gradient(180deg,#0f1225,#0b0f24)",
    color: "#fff",
  },
  center: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center", // 🔥 CENTRALIZA NO MEIO DA TELA
  gap: 26,
  width: "100%",
},

  profileHeader: {
    display: "flex",
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6d5dfc,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 900,
  },
  avatarImg: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    objectFit: "cover",
  },
  name: {
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
  },
  email: {
    fontSize: 13,
    opacity: 0.7,
  },
  linkBtn: {
    marginTop: 4,
    background: "none",
    border: "none",
    color: "#8b5cf6",
    fontSize: 12,
    cursor: "pointer",
    padding: 0,
  },

  infoCard: {
    background: "#1c2142",
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: 14,
    alignItems: "center",
  },

  nichoView: {
    opacity: 0.8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  pencil: {
    fontSize: 13,
    opacity: 0.7,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 10,
  },

  projectRow: {
    background: "#232a55",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectTitle: {
    cursor: "pointer",
  },
  projectMenu: {
    display: "flex",
    gap: 8,
  },

  editInput: {
    width: "100%",
    padding: 6,
    borderRadius: 8,
    border: "none",
    background: "#2a2f55",
    color: "#fff",
  },
  editInputSmall: {
    width: 140,
    padding: 4,
    borderRadius: 6,
    border: "none",
    background: "#2a2f55",
    color: "#fff",
    fontSize: 13,
  },

  empty: {
    opacity: 0.6,
    fontSize: 14,
    marginBottom: 20,
  },

  logout: {
    marginTop: 30,
    padding: "12px",
    borderRadius: 14,
    border: "none",
    background: "#2a2f55",
    color: "#fff",
    fontWeight: 700,
  },

  authCard: {
  background: "#1c2142",
  borderRadius: 18,
  padding: 20,
  width: "100%",
  maxWidth: 320,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  },
  loginBtn: {
  width: 220,
  padding: "12px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(90deg,#4ade80,#22c55e)",
  color: "#0b1220",
  fontWeight: 800,
  fontSize: 14,
  cursor: "pointer",
  },
  registerBtn: {
  width: 220,
  padding: "12px",
  borderRadius: 14,
  border: "1px solid #4ade80",
  background: "transparent",
  color: "#fff",
  fontWeight: 800,
  fontSize: 14,
  cursor: "pointer",
  },
  provider: {
  display: "flex",
  alignItems: "center",
  gap: 12,
  },
  googleIcon: {
  width: 22,
  height: 22,
  },
  loginBtn: {
  width: 220,
  height: 44,
  borderRadius: 14,
  fontWeight: 800,
  },
  registerBtn: {
  width: 220,
  height: 44,
  borderRadius: 14,
  },
  authText: {
  fontSize: 13,
  opacity: 0.7,
  marginBottom: 6,
  },
};
