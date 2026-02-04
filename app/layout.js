export const metadata = {
  title: "NichoLens AI",
  description: "Diagnóstico de perfis com IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          background: "#f5f7ff",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
        }}
      >
        {children}
      </body>
    </html>
  );
}
