"use client";

export default function Error({ error, reset }) {
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
            maxWidth: 420,
            overflow: "auto",
          }}
        >
          {error?.message}
        </pre>

        <button
          onClick={reset}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#6d5dfc",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
