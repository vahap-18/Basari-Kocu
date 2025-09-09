import React from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { InfoFab } from "@/components/InfoFab";

export const MobileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-background text-foreground">
      <Header />
      <main className="pb-16 px-4 pt-4">{children}</main>
      <BottomNav />
      <InfoFab />
    </div>
  );
};
