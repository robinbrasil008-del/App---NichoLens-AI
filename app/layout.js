export const metadata = {
  title: "NichoLens AI",
  description: "Análise de perfis com IA"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
