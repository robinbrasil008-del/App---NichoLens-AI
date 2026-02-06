"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const TicketContext = createContext(null);

const FREE_TICKETS = 7;
const BONUS_LOGIN = 2;

export function TicketProvider({ children }) {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState(FREE_TICKETS);
  const [storageKey, setStorageKey] = useState(null);

  /* ===== DEFINE CHAVE POR USUÁRIO ===== */
  useEffect(() => {
    if (status === "loading") return;

    const email = session?.user?.email || "guest";
    const key = `nicholens-tickets:${email}`;
    setStorageKey(key);
  }, [session, status]);

  /* ===== CARREGA TICKETS DO USUÁRIO ===== */
  useEffect(() => {
    if (!storageKey) return;

    const saved = localStorage.getItem(storageKey);

    if (saved !== null) {
      setTickets(Number(saved));
    } else {
      // usuário novo
      localStorage.setItem(storageKey, String(FREE_TICKETS));
      setTickets(FREE_TICKETS);
    }
  }, [storageKey]);

  /* ===== BÔNUS DE LOGIN (1x POR CONTA) ===== */
  useEffect(() => {
    if (!session?.user?.email || !storageKey) return;

    const bonusKey = `nicholens-bonus:${session.user.email}`;
    const alreadyGiven = localStorage.getItem(bonusKey);

    if (!alreadyGiven) {
      const newTotal = tickets + BONUS_LOGIN;
      setTickets(newTotal);
      localStorage.setItem(storageKey, String(newTotal));
      localStorage.setItem(bonusKey, "true");
    }
    // ⚠️ intencionalmente sem tickets na deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, storageKey]);

  /* ===== CONSUMIR TICKET ===== */
  function consumeTicket() {
    if (tickets <= 0 || !storageKey) return false;

    const next = tickets - 1;
    setTickets(next);
    localStorage.setItem(storageKey, String(next));
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
    throw new Error("useTickets deve ser usado dentro de <TicketProvider>");
  }
  return ctx;
}
