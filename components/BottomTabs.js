"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Início", icon: "🏠" },
    { href: "/chat", label: "Chat", icon: "💬" },
    // Se quiser depois: { href: "/live", label: "Live e Vídeo", icon: "🎥", badge: "Novo" },
    // Se quiser depois: { href: "/notificacoes", label: "Notificações", icon: "🔔", badge: "65" },
    // Se quiser depois: { href: "/perfil", label: "Eu", icon: "👤" },
  ];

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} style={styles.link}>
            <div
              style={{
                ...styles.item,
                ...(isActive(t.href) ? styles.active : {}),
              }}
            >
              <div style={styles.icon}>{t.icon}</div>
              <div style={styles.label}>{t.label}</div>
              {t.badge ? <span style={styles.badge}>{t.badge}</span> : null}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    borderTop: "1px solid rgba(2,6,23,0.10)",
    paddingBottom: "env(safe-area-inset-bottom)",
    zIndex: 50,
  },
  inner: {
    maxWidth: 980,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    padding: "8px 10px",
    gap: 6,
  },
  link: { textDecoration: "none" },
  item: {
    position: "relative",
    borderRadius: 14,
    padding: "10px 10px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    color: "#0f172a",
    fontWeight: 800,
  },
  active: {
    background: "rgba(79,70,229,0.10)",
    border: "1px solid rgba(79,70,229,0.25)",
  },
  icon: { fontSize: 18, lineHeight: 1 },
  label: { fontSize: 12, opacity: 0.85 },
  badge: {
    position: "absolute",
    top: 6,
    right: 18,
    background: "#ef4444",
    color: "#fff",
    fontSize: 10,
    fontWeight: 900,
    padding: "2px 7px",
    borderRadius: 999,
  },
};
