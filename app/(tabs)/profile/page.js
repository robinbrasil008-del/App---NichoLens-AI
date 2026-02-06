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
        {/* LOGIN */}
        <div style={styles.authBlock}>
          <span style={styles.authText}>
            Faça o login autenticado com:
          </span>

          <div style={styles.provider}>
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={styles.googleIcon}
            />
            <button
              style={styles.loginBtn}
              onClick={() => signIn("google")}
            >
              Login
            </button>
          </div>
        </div>

        {/* REGISTRO */}
        <div style={styles.authBlock}>
          <span style={styles.authText}>
            Faça o registro autenticado com:
          </span>

          <div style={styles.provider}>
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={styles.googleIcon}
            />
            <button
              style={styles.registerBtn}
              onClick={() => signIn("google")}
            >
              Registrar-se
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===== LOGADO ===== */
  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Minha Conta</h2>

      <div style={styles.card}>
        <p><b>Nome:</b> {session.user?.name}</p>
        <p><b>E-mail:</b> {session.user?.email}</p>
        <p><b>Tickets:</b> 🎟️ {tickets}</p>
        <p><b>Nicho:</b> <i>(opcional)</i></p>
      </div>

      <h3 style={styles.subtitle}>📁 Projetos criados</h3>

      {projects.length === 0 ? (
        <p style={styles.text}>Nenhum projeto criado ainda.</p>
      ) : (
        projects.map((p) => (
          <div key={p.id} style={styles.project}>
            📌 {p.title}
          </div>
        ))
      )}

      <button style={styles.logout} onClick={() => signOut()}>
        Sair da conta
      </button>
    </div>
  );
}

/* ===== STYLES ===== */

const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    paddingBottom: 90,
    background:
      "linear-gradient(180deg,#0f1225 0%,#151a3a 40%,#0b0f24 100%)",
    color: "#fff",
    fontFamily:
      '"Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto',
  },

  center: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 26,
  },

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
    cursor: "pointer",
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
    cursor: "pointer",
  },

  title: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 20,
  },

  subtitle: {
    marginTop: 30,
    marginBottom: 10,
  },

  card: {
    background: "#1c2142",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  project: {
    background: "#232a55",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  text: {
    opacity: 0.9,
  },

  logout: {
    marginTop: 30,
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "#2a2f55",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
