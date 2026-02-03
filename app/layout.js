export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#0f1220",
          color: "#fff",
        }}
      >
        {children}
      </body>
    </html>
  );
}
