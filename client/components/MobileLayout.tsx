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
      className="min-h-screen max-w-md mx-auto bg-background text-foreground h-screen flex flex-col"
    >
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
