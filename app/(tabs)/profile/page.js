"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTickets } from "../../context/TicketContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { tickets } = useTickets();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [nicho, setNicho] = useState("");
  const [editName, setEditName] = useState(false);
  const [editNicho, setEditNicho] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedProjects =
      JSON.parse(localStorage.getItem("nicholens-projects")) || [];
    setProjects(storedProjects);

    const savedName = localStorage.getItem("nicholens-name");
    const savedNicho = localStorage.getItem("nicholens-nicho");

    if (savedName) setName(savedName);
    if (savedNicho) setNicho(savedNicho);
  }, []);

  if (status === "loading") return <div style={styles.page} />;

  /* ===== NÃO LOGADO ===== */
  if (!session) {
    return (
      <div style={{ ...styles.page, ...styles.center }}>
        <div style={styles.authBlock}>
          <span style={styles.authText}>Faça o login autenticado com:</span>
          <div style={styles.provider}>
            <img src="https://www.google.com/favicon.ico" alt="Google" style={styles.googleIcon} />
            <button style={styles.loginBtn} onClick={() => signIn("google")}>
              Login
            </button>
          </div>
        </div>

        <div style={styles.authBlock}>
          <span style={styles.authText}>Faça o registro autenticado com:</span>
          <div style={styles.provider}>
            <img src="https://www.google.com/favicon.ico" alt="Google" style={styles.googleIcon} />
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
          <img src={session.user.image} alt="Avatar" style={styles.avatarImg} />
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
                localStorage.setItem("nicholens-name", name);
                setEditName(false);
              }}
              autoFocus
              style={styles.editInput}
            />
          ) : (
            <div style={styles.name} onClick={() => setEditName(true)}>
              {name || session.user?.name}
            </div>
          )}
          <div style={styles.email}>{session.user?.email}</div>
          <button
            style={styles.linkBtn}
            onClick={() => window.open("https://myaccount.google.com", "_blank")}
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
                localStorage.setItem("nicholens-nicho", nicho);
                setEditNicho(false);
              }}
              autoFocus
              style={styles.editInputSmall}
            />
          ) : (
            <span onClick={() => setEditNicho(true)} style={{ opacity: 0.7 }}>
              {nicho || "(opcional)"}
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
              onClick={() => router.push("/chat")}
            >
              📌 {p.title}
            </div>

            <div style={styles.projectMenu}>
              <button
                onClick={() => {
                  const name = prompt("Novo nome do projeto:", p.title);
                  if (!name) return;
                  const updated = projects.map((x) =>
                    x.id === p.id ? { ...x, title: name } : x
                  );
                  setProjects(updated);
                  localStorage.setItem(
                    "nicholens-projects",
                    JSON.stringify(updated)
                  );
                }}
              >
                ✏️
              </button>

              <button
                onClick={() => {
                  if (!confirm("Excluir este projeto?")) return;
                  const updated = projects.filter((x) => x.id !== p.id);
                  setProjects(updated);
                  localStorage.setItem(
                    "nicholens-projects",
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

const styles = {
  page: {
    height: "100%",
    padding: 20,
    background: "linear-gradient(180deg,#0f1225,#0b0f24)",
    color: "#fff",
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
    gap: 26,
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
};
