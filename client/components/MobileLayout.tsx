import React from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { InfoFab } from "@/components/InfoFab";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export const MobileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="relative min-h-screen max-w-md mx-auto bg-background text-foreground h-screen flex flex-col overflow-hidden"
    >
      {/* animated ambient background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.35, 0.2, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(800px 400px at 10% 20%, rgba(99,102,241,0.06), transparent 12%), radial-gradient(600px 300px at 90% 80%, rgba(14,165,233,0.04), transparent 12%)",
        }}
      />

      <Header />

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="flex-1 pb-20 px-4 pt-4 overflow-y-auto"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)" }}
      >
        {children}
      </motion.main>

      <BottomNav />
      <InfoFab />
    </motion.div>
  );
};
