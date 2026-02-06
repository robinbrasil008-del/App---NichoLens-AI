"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTickets } from "../context/TicketContext";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { tickets } = useTickets();

  const [projects, setProjects] = useState([]);

  /* ===== LOAD PROJECTS ===== */
  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("nicholens-projects")) || [];
    setProjects(saved);
  }, []);

  if (status === "loading") {
    return (
      <div style={styles.page}>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  /* ===== NÃO LOGADO ===== */
  if (!session) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>Perfil</h2>
          <p style={styles.text}>
            Faça login com Google para acessar seu perfil.
          </p>

          <button style={styles.button} onClick={() => signIn("google")}>
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  /* ===== LOGADO ===== */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <img
          src={session.user?.image}
          alt="Foto do perfil"
          style={styles.avatar}
        />

        <div>
          <h2 style={styles.name}>{session.user?.name}</h2>
          <p style={styles.email}>{session.user?.email}</p>
        </div>
      </div>

      {/* INFO */}
      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <span>🎟️ Tickets</span>
          <strong>{tickets}</strong>
        </div>

        <div style={styles.infoRow}>
          <span>🎯 Nicho</span>
          <em style={{ opacity: 0.7 }}>Não definido</em>
        </div>
      </div>

      {/* PROJETOS */}
      <div style={styles.projects}>
        <h3 style={styles.sectionTitle}>📁 Projetos Criados</h3>

        {projects.length === 0 && (
          <p style={styles.text}>Nenhum projeto criado ainda.</p>
        )}

        {projects.map((p) => (
          <div key={p.id} style={styles.projectItem}>
            <div>
              <strong>{p.title}</strong>
              <div style={styles.projectMeta}>
                {new Date(p.id).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LOGOUT */}
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

  card: {
    background: "#1c2142",
    borderRadius: 18,
    padding: 20,
    maxWidth: 420,
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: "50%",
  },

  name: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
  },

  email: {
    margin: 0,
    fontSize: 14,
    opacity: 0.8,
  },

  infoCard: {
    background: "#232a55",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  projects: {
    background: "#1c2142",
    borderRadius: 18,
    padding: 16,
    marginBottom: 30,
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 800,
  },

  projectItem: {
    background: "#232a55",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  projectMeta: {
    fontSize: 12,
    opacity: 0.6,
  },

  text: {
    fontSize: 14,
    opacity: 0.85,
  },

  title: {
    marginTop: 0,
    fontSize: 22,
    fontWeight: 900,
  },

  button: {
    marginTop: 14,
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#6d5dfc,#8b5cf6)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },

  logout: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "none",
    background: "#2a2f55",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
