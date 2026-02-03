import BottomTabs from "@/components/BottomTabs";

export const metadata = {
  title: "NichoLens AI",
  description: "Análise estratégica de perfis + Chat IA",
};

export default function TabsLayout({ children }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.content}>{children}</div>
      <BottomTabs />
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
  },
  content: {
    paddingBottom: 92, // espaço para a barra de baixo
  },
};
