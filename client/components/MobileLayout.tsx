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

      {/* svg blob overlays for organic feel */}
      <svg
        className="absolute -z-20 pointer-events-none left-[-10%] top-[-10%] w-[60%] h-[60%] svg-blob"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.12)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0.08)" />
          </linearGradient>
        </defs>
        <g transform="translate(300,300)">
          <path
            d="M120,-160C160,-120,188,-80,198,-36C208,8,201,56,176,92C151,128,109,152,64,170C19,188,-29,200,-72,184C-115,168,-153,124,-178,74C-203,24,-214,-30,-196,-74C-178,-118,-130,-152,-81,-179C-33,-206,15,-226,60,-210C105,-194,78,-200,120,-160Z"
            fill="url(#g1)"
          />
        </g>
      </svg>

      <svg
        className="absolute -z-20 pointer-events-none right-[-8%] bottom-[-8%] w-[50%] h-[50%] svg-blob"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.12)" />
            <stop offset="100%" stopColor="rgba(236,72,153,0.08)" />
          </linearGradient>
        </defs>
        <g transform="translate(300,300)">
          <path
            d="M130,-150C170,-120,200,-80,202,-40C204,0,178,40,154,76C130,112,108,144,72,166C36,188,-6,200,-48,192C-90,184,-131,156,-162,118C-193,80,-214,32,-204,-10C-194,-52,-153,-84,-116,-110C-79,-136,-45,-156,-8,-150C29,-144,58,-112,90,-90C122,-68,90,-180,130,-150Z"
            fill="url(#g2)"
          />
        </g>
      </svg>

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
