"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(undefined);

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(7);

  useEffect(() => {
    const saved = localStorage.getItem("nicholens-tickets");
    if (saved !== null) {
      const n = Number(saved);
      if (!Number.isNaN(n)) setTickets(n);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nicholens-tickets", String(tickets));
  }, [tickets]);

  function useTicket() {
    if (tickets <= 0) return false;
    setTickets(t => t - 1);
    return true;
  }

  const value = {
    tickets,
    useTicket,
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketContext);

  // 🔒 BLINDAGEM TOTAL (EVITA TELA BRANCA)
  if (!ctx) {
    return {
      tickets: 0,
      useTicket: () => false,
    };
  }

  return ctx;
}
