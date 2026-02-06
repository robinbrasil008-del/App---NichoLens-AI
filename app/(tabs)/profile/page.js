"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTickets } from "../../context/TicketContext";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { tickets } = useTickets();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored =
        JSON.parse(localStorage.getItem("nicholens-projects")) || [];
      setProjects(stored);
    }
  }, []);

  if (status === "loading") {
    return <div style={styles.page} />;
  }

  /* ===== NÃO LOGADO ===== */
  if (!session) {
    return (
      <div style={{ ...styles.page, ...styles.center }}>
        <div style={styles.authBlock}>
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

        <div style={styles.authBlock}>
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
        <div style={styles.avatar}>
          {session.user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <div style={styles.name}>{session.user?.name}</div>
          <div style={styles.email}>{session.user?.email}</div>
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
          <i style={{ opacity: 0.6 }}>(opcional)</i>
        </div>
      </div>

      {/* PROJETOS */}
      <div style={styles.sectionTitle}>📁 Projetos criados</div>

      {projects.length === 0 ? (
        <div style={styles.empty}>Nenhum projeto criado ainda</div>
      ) : (
        projects.map((p) => (
          <div key={p.id} style={styles.menuItem}>
            📌 {p.title}
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
    paddingBottom: 90,
    display: "flex",
    justifyContent: "center",
    background:
      "linear-gradient(180deg,#0f1225 0%,#151a3a 40%,#0b0f24 100%)",
    color: "#fff",
    fontFamily:
      '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto',
  },

  pageScroll: {
    height: "100%",
    padding: 20,
    paddingBottom: 90,
    overflowY: "auto",
    background:
      "linear-gradient(180deg,#0f1225 0%,#151a3a 40%,#0b0f24 100%)",
    color: "#fff",
    fontFamily:
      '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto',
  },

  center: {
    flexDirection: "column",
    alignItems: "center",
    gap: 26,
  },

  /* AUTH */
  authBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  authText: {
    fontSize: 12,
    opacity: 0.85,
  },
  provider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  loginBtn: {
    width: 220,
    padding: "12px",
    borderRadius: 14,
    border: "1px solid #4ade80",
    background: "linear-gradient(90deg,#4ade80,#22c55e)",
    color: "#0b1220",
    fontWeight: 700,
    fontSize: 14,
  },
  registerBtn: {
    width: 220,
    padding: "12px",
    borderRadius: 14,
    border: "1px solid #4ade80",
    background: "transparent",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
  },

  /* PERFIL */
  profileHeader: {
    display: "flex",
    alignItems: "center",
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
  name: {
    fontSize: 18,
    fontWeight: 800,
  },
  email: {
    fontSize: 13,
    opacity: 0.7,
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

  menuItem: {
    background: "#232a55",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    fontSize: 14,
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
