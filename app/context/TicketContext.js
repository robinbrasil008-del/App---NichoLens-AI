"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(null);

const FREE_TICKETS = 7;

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(FREE_TICKETS);

  useEffect(() => {
    const saved = localStorage.getItem("nicholens-tickets");
    if (saved !== null) {
      setTickets(Number(saved));
    } else {
      localStorage.setItem("nicholens-tickets", String(FREE_TICKETS));
    }
  }, []);

  function consumeTicket(amount = 1) {
    if (tickets < amount) return false;

    const next = tickets - amount;
    setTickets(next);
    localStorage.setItem("nicholens-tickets", String(next));
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
    throw new Error("useTickets deve estar dentro de TicketProvider");
  }
  return ctx;
}
