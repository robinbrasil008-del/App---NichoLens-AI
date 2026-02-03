"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(null);

const FREE_TICKETS = 7;
const LOGIN_BONUS = 2;

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(FREE_TICKETS);

  useEffect(() => {
    const stored = localStorage.getItem("nicholens-tickets");

    if (stored === null) {
      localStorage.setItem("nicholens-tickets", FREE_TICKETS);
      setTickets(FREE_TICKETS);
    } else {
      setTickets(Number(stored));
    }
  }, []);

  function consumeTicket() {
    if (tickets <= 0) return false;
    const next = tickets - 1;
    setTickets(next);
    localStorage.setItem("nicholens-tickets", next);
    return true;
  }

  // 🔮 FUTURO LOGIN
  function applyLoginBonus() {
    const used = localStorage.getItem("nicholens-login-bonus");
    if (used) return;

    const next = tickets + LOGIN_BONUS;
    setTickets(next);
    localStorage.setItem("nicholens-tickets", next);
    localStorage.setItem("nicholens-login-bonus", "1");
  }

  return (
    <TicketContext.Provider
      value={{ tickets, consumeTicket, applyLoginBonus }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketContext);
  if (!ctx) {
    throw new Error("useTickets must be used inside TicketProvider");
  }
  return ctx;
}
