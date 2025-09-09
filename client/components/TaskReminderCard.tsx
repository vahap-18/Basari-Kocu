import React from "react";

export default function TaskReminderCard() {
  const tasks = (() => {
    try {
      return JSON.parse(localStorage.getItem("coach-tasks") || "[]");
    } catch {
      return [];
    }
  })();
  const pending = tasks.filter((t: any) => !t.done).slice(0, 3);

  return (
    <div className="p-4 rounded-2xl border bg-gradient-to-br from-card to-background">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-muted-foreground">Hatırlatıcı</div>
          <div className="font-semibold">Yakın Görevler</div>
        </div>
      </div>

      <div className="text-sm">
        {pending.length === 0 && <div className="text-muted-foreground">Bekleyen görev yok.</div>}
        {pending.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between py-1">
            <div className="text-sm">{t.title}</div>
            <div className="text-xs text-muted-foreground">{t.due ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
