"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(null);

const FREE_TICKETS = 7;
const LOGIN_BONUS = 2;

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(FREE_TICKETS);

  // 🔹 carregar tickets
  useEffect(() => {
    const saved = localStorage.getItem("nicholens-tickets");
    if (saved !== null) {
      setTickets(Number(saved));
    } else {
      localStorage.setItem("nicholens-tickets", String(FREE_TICKETS));
      setTickets(FREE_TICKETS);
    }
  }, []);

  // 🔹 sincronizar ENTRE páginas (chat ↔ home)
  useEffect(() => {
    function sync(e) {
      if (e.key === "nicholens-tickets") {
        setTickets(Number(e.newValue || 0));
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function consumeTicket() {
    const current = Number(localStorage.getItem("nicholens-tickets") || 0);
    if (current <= 0) return false;

    const next = current - 1;
    localStorage.setItem("nicholens-tickets", String(next));
    setTickets(next);
    return true;
  }

  function addLoginBonus() {
    const current = Number(localStorage.getItem("nicholens-tickets") || 0);
    const next = current + LOGIN_BONUS;
    localStorage.setItem("nicholens-tickets", String(next));
    setTickets(next);
  }

  return (
    <TicketContext.Provider value={{ tickets, consumeTicket, addLoginBonus }}>
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
