"use client";

import Link from "next/link";
import { TicketProvider } from "../context/TicketContext";
import { useState } from "react";

/* ================= ERROR BOUNDARY ================= */

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b1020",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          textAlign: "center",
        }}
      >
        <div>
          <h2>❌ Ocorreu um erro no app</h2>
          <p style={{ opacity: 0.8 }}>
            Algo quebrou durante o carregamento.
          </p>
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              background: "#111827",
              borderRadius: 8,
              fontSize: 12,
              overflow: "auto",
              maxWidth: 400,
            }}
          >
            {String(error)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <ErrorCatcher onError={setError}>
      {children}
    </ErrorCatcher>
  );
}

function ErrorCatcher({ children, onError }) {
  try {
    return children;
  } catch (err) {
    onError(err);
    return null;
  }
}

/* ================= LAYOUT ================= */

export default function TabsLayout({ children }) {
  return (
    <TicketProvider>
      <ErrorBoundary>
        <div style={{ minHeight: "100vh", paddingBottom: 70 }}>
          {children}

          <nav
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background: "#0f1630",
              borderTop: "1px solid #1f2a4a",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <TabLink href="/" label="Início" icon="🏠" />
            <TabLink href="/chat" label="Chat IA" icon="💬" />
          </nav>
        </div>
      </ErrorBoundary>
    </TicketProvider>
  );
}

/* ================= LINK ================= */

function TabLink({ href, label, icon }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "#b5b5b5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: 12,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </Link>
  );
}
