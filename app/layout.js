import { Providers } from "./providers";

export const metadata = {
  title: "NichoLens AI",
  description: "Análise inteligente de perfis com IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#0f1225",
        }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
