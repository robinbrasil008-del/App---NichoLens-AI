export const metadata = {
  title: "NichoLens AI",
  description: "Análise de perfis com IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0b1020",
          fontFamily: "Inter, system-ui, Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
