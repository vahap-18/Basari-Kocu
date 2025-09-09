import React from "react";

export default function ProgressDetails() {
  const tasks = (() => {
    try {
      return JSON.parse(localStorage.getItem("coach-tasks") || "[]");
    } catch {
      return [];
    }
  })();
  const completed = tasks.filter((t: any) => t.done).length;
  const total = tasks.length;

  const sessions = (() => {
    try {
      const v = localStorage.getItem("pomodoro-sessions") || "0";
      return Number(v) || 0;
    } catch {
      return 0;
    }
  })();

  const goals = (() => {
    try {
      return JSON.parse(localStorage.getItem("goals") || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <h4 className="font-semibold mb-2">Ayrıntılı İlerleme</h4>
      <div className="text-sm text-muted-foreground mb-3">Görev tamamlama ve çalışma oturumlarına göre özet.</div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="p-2 rounded-lg border text-center">
          <div className="text-xs text-muted-foreground">Görev</div>
          <div className="font-semibold">{completed}/{total}</div>
        </div>
        <div className="p-2 rounded-lg border text-center">
          <div className="text-xs text-muted-foreground">Oturumlar</div>
          <div className="font-semibold">{sessions}</div>
        </div>
        <div className="p-2 rounded-lg border text-center">
          <div className="text-xs text-muted-foreground">Hedefler</div>
          <div className="font-semibold">{goals.length}</div>
        </div>
      </div>

      <div className="text-sm">
        <div className="font-medium mb-1">Son etkinlik</div>
        <div className="text-xs text-muted-foreground">Yerel veriler üzerinden hesaplandı.</div>
      </div>
    </div>
  );
}
