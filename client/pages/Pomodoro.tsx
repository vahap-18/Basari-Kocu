import React, { useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { ToDo } from "@/components/ToDo";

export default function PomodoroPage() {
  const [focusMusic, setFocusMusic] = useState(true);

  return (
    <MobileLayout>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Pomodoro Zamanlayıcı</h2>
            <p className="text-sm text-muted-foreground">Odaklan, kısa molalar ver ve ilerlemeni koru.</p>
          </div>
          <div className="text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={focusMusic} onChange={(e) => setFocusMusic(e.target.checked)} />
              Odak Sesi
            </label>
          </div>
        </div>

        <PomodoroTimer focusMusic={focusMusic} />

        <div className="p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Yapılacaklar (To‑Do)</h3>
          <ToDo storageKey="pomodoro-todos" />
        </div>
      </section>
    </MobileLayout>
  );
}
