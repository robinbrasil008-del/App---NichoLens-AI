import "./globals.css";

export const metadata = {
  title: "NichoLens AI",
  description: "Análise inteligente de perfis de redes sociais por nicho"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
