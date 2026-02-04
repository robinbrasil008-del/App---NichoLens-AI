"use client";

import { TicketProvider } from "./context/TicketContext";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>
        <TicketProvider>
          {children}
        </TicketProvider>
      </body>
    </html>
  );
}
