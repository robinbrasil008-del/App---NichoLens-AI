"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useTickets } from "../../context/TicketContext";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { tickets } = useTickets();

  const projects =
    JSON.parse(localStorage.getItem("nicholens-projects")) || [];

  if (status === "loading") {
    return <div style={styles.page}>Carregando...</div>;
  }

  if (!session) {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>Perfil</h2>

        <p style={styles.text}>
          Você precisa estar logado para acessar seu perfil.
        </p>

        <button style={styles.button} onClick={() => signIn("google")}>
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Meu Perfil</h2>

      <div style={styles.card}>
        <p><b>Nome:</b> {session.user?.name}</p>
        <p><b>E-mail:</b> {session.user?.email}</p>
        <p><b>Tickets disponíveis:</b> 🎟️ {tickets}</p>
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

  button: {
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    background: "#6d5dfc",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
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
