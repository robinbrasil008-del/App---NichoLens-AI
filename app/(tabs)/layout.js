export default function TabsLayout({ children }) {
  return (
    <div style={{ paddingBottom: 70 }}>
      {children}

      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: "#fff",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center"
      }}>
        <a href="/">🏠 Início</a>
        <a href="/chat">💬 Chat</a>
      </nav>
    </div>
  );
}
