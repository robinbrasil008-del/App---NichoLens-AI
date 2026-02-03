"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(null);

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(7); // FREE = 7

  useEffect(() => {
    const saved = localStorage.getItem("nicholens-tickets");
    if (saved) setTickets(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("nicholens-tickets", tickets);
  }, [tickets]);

  function useTicket() {
    if (tickets <= 0) return false;
    setTickets(t => t - 1);
    return true;
  }

  function addTickets(qtd) {
    setTickets(t => t + qtd);
  }

  return (
    <TicketContext.Provider
      value={{ tickets, useTicket, addTickets }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  return useContext(TicketContext);
}
