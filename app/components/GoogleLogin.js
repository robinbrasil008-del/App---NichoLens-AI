"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function GoogleLogin() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        style={{
          padding: "8px 14px",
          borderRadius: 10,
          border: "none",
          background: "#ef4444",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Sair ({session.user.name})
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        border: "none",
        background: "#fff",
        color: "#000",
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      🔐 Entrar com Google
    </button>
  );
}
