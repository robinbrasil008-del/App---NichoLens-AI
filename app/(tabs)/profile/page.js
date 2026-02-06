"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTickets } from "../../context/TicketContext";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { tickets } = useTickets();

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("nicholens-projects")) || [];
    setProjects(stored);
  }, []);

  if (status === "loading") {
    return <div style={styles.page} />;
  }

  /* ===== NÃO LOGADO ===== */
  if (!session) {
    return (
      <div style={{ ...styles.page, ...styles.center }}>
        <button
          style={styles.mainBtn}
          onClick={() => signIn("google")}
        >
          Entrar
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => signIn("google")}
        >
          Registrar-se
        </button>
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
    gap: 16,
  },

  mainBtn: {
    width: 220,
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(90deg,#6d5dfc,#8b5cf6)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },

  secondaryBtn: {
    width: 220,
    padding: "12px 16px",
    borderRadius: 14,
    border: "1px solid #6d5dfc",
    background: "transparent",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
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
    marginBottom: 14,
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
