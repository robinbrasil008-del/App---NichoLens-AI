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
      localStorage.setItem("nicholens-tickets", FREE_TICKETS);
    }
  }, []);

  function consumeTicket() {
    if (tickets <= 0) return false;

    const next = tickets - 1;
    setTickets(next);
    localStorage.setItem("nicholens-tickets", next);
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
    throw new Error("useTickets deve estar dentro do TicketProvider");
  }
  return ctx;
}
