import Providers from "./providers";
import BottomNav from "./components/BottomNav";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          background: "#0b1020",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, Arial, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Providers>
          {/* Conteúdo */}
          <main style={{ flex: 1, paddingBottom: 70 }}>{children}</main>

          {/* Barra inferior (abas) */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
