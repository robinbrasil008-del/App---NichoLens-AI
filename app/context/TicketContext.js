"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(null);

const FREE_TICKETS = 7;
const STORAGE_KEY = "nicholens-tickets";

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(FREE_TICKETS);

  // 🔄 carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setTickets(Number(saved));
    } else {
      localStorage.setItem(STORAGE_KEY, String(FREE_TICKETS));
    }
  }, []);

  // 🎟️ consumir ticket
  function consumeTicket() {
    if (tickets <= 0) return false;

    const next = tickets - 1;
    setTickets(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    return true;
  }

  return (
    <TicketContext.Provider value={{ tickets, consumeTicket }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketContext);
  if (!ctx) {
    throw new Error(
      "useTickets deve ser usado dentro de <TicketProvider>"
    );
  }
  return ctx;
}
