"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(null);

const FREE_TICKETS = 7;
const LOGIN_BONUS = 2; // preparado para login futuro

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(FREE_TICKETS);
  const [logged, setLogged] = useState(false); // futuro login

  useEffect(() => {
    const saved = localStorage.getItem("nicholens-tickets");
    if (saved !== null) {
      setTickets(Number(saved));
    } else {
      setTickets(FREE_TICKETS);
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

  function addLoginBonus() {
    if (logged) return;
    const next = tickets + LOGIN_BONUS;
    setLogged(true);
    setTickets(next);
    localStorage.setItem("nicholens-tickets", next);
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
