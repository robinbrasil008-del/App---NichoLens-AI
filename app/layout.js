"use client";

import { TicketProvider } from "./context/TicketContext";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>
        <SessionProvider refetchOnWindowFocus={false}>
          <TicketProvider>
            {children}
          </TicketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
