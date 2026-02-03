"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(null);

const FREE_TICKETS = 7;
const LOGIN_BONUS = 2; // preparado para login futuro

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(FREE_TICKETS);

  // 🔹 carregar do localStorage (fonte única)
  useEffect(() => {
    const saved = localStorage.getItem("nicholens-tickets");
    if (saved !== null) {
      setTickets(Number(saved));
    } else {
      localStorage.setItem("nicholens-tickets", String(FREE_TICKETS));
    }
  }, []);

  // 🔹 consumir ticket (GLOBAL)
  function consumeTicket() {
    if (tickets <= 0) return false;

    const next = tickets - 1;
    setTickets(next);
    localStorage.setItem("nicholens-tickets", String(next));
    return true;
  }

  // 🔹 bônus futuro (login)
  function addLoginBonus() {
    const next = tickets + LOGIN_BONUS;
    setTickets(next);
    localStorage.setItem("nicholens-tickets", String(next));
  }

  return (
    <TicketContext.Provider
      value={{ tickets, consumeTicket, addLoginBonus }}
    >
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
