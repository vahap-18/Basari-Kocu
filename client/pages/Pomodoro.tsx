import React, { useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { ToDo } from "@/components/ToDo";

export default function PomodoroPage() {
  const [focusMusic, setFocusMusic] = useState(true);
  const [goal, setGoal] = useState("");

  return (
    <MobileLayout>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
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

        <div className="p-3 rounded-xl border">
          <label className="text-sm text-muted-foreground">Hedef (opsiyonel)</label>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Bu oturum için kısa hedefinizi yazın"
            className="mt-2 w-full px-3 py-2 border rounded-md"
          />
        </div>

        <PomodoroTimer focusMusic={focusMusic} goal={goal} />

        <div className="p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Yapılacaklar (To‑Do)</h3>
          <ToDo storageKey="pomodoro-todos" />
        </div>
      </section>
    </MobileLayout>
  );
}
