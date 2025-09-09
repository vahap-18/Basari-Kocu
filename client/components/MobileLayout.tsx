import React from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { InfoFab } from "@/components/InfoFab";

export const MobileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-background text-foreground h-screen flex flex-col">
      <Header />
      <main
        className="flex-1 pb-20 px-4 pt-4 overflow-y-auto"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)" }}
      >
        {children}
      </main>
      <BottomNav />
      <InfoFab />
    </div>
  );
};
