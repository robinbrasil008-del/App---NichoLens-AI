import "./globals.css";

export const metadata = {
  title: "NichoLens AI",
  description: "Análise inteligente de perfis com IA"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
