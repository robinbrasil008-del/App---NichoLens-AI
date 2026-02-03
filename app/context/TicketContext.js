"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext(null);

const FREE_TICKETS = 7;
const LOGIN_BONUS = 2; // preparado para login futuro

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(FREE_TICKETS);
  const [logged, setLogged] = useState(false);

  // 🔹 Carregar tickets do localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("nicholens-tickets");

    if (saved !== null && !isNaN(Number(saved))) {
      setTickets(Number(saved));
    } else {
      setTickets(FREE_TICKETS);
      localStorage.setItem(
        "nicholens-tickets",
        String(FREE_TICKETS)
      );
    }
  }, []);

  // 🔹 Consumir ticket
  function consumeTicket() {
    if (tickets <= 0) return false;

    const next = tickets - 1;
    setTickets(next);
    localStorage.setItem("nicholens-tickets", String(next));
    return true;
  }

  // 🔹 Bônus futuro de login (+2)
  function addLoginBonus() {
    if (logged) return;

    const next = tickets + LOGIN_BONUS;
    setLogged(true);
    setTickets(next);
    localStorage.setItem("nicholens-tickets", String(next));
  }

  return (
    <TicketContext.Provider
      value={{
        tickets,
        consumeTicket,
        addLoginBonus,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

// 🔹 Hook seguro (NUNCA quebra tela)
export function useTickets() {
  const ctx = useContext(TicketContext);

  // fallback seguro (evita tela branca)
  if (!ctx) {
    return {
      tickets: 0,
      consumeTicket: () => false,
      addLoginBonus: () => {},
    };
  }

  return ctx;
}
