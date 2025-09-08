import React from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { PomodoroTimer } from "@/components/PomodoroTimer";

export default function PomodoroPage() {
  return (
    <MobileLayout>
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Pomodoro Zamanlayıcı</h2>
        <p className="text-sm text-muted-foreground">Odaklan, kısa molalar ver ve ilerlemeni koru.</p>
        <PomodoroTimer />
      </section>
    </MobileLayout>
  );
}
