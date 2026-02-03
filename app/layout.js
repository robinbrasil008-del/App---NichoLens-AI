export const metadata = {
  title: "NichoLens AI",
  description: "Diagnóstico de perfis e Chat IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
