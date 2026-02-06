"use client";

import { SessionProvider } from "next-auth/react";
import { TicketProvider } from "./context/TicketContext";

export function Providers({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <TicketProvider>
        {children}
      </TicketProvider>
    </SessionProvider>
  );
}
