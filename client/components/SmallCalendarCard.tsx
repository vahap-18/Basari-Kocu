import React from "react";

export default function SmallCalendarCard() {
  const events = (() => {
    try {
      return JSON.parse(localStorage.getItem("coach-events") || "[]");
    } catch {
      return [];
    }
  })();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e: any) => e.date >= today).slice(0, 3);

  return (
    <div className="p-4 rounded-2xl border bg-gradient-to-br from-card to-background">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-muted-foreground">Takvim</div>
          <div className="font-semibold">Bugün & Yakın</div>
        </div>
      </div>

      <div className="text-sm">
        {upcoming.length === 0 && <div className="text-muted-foreground">Bugün etkinlik yok.</div>}
        {upcoming.map((e: any) => (
          <div key={e.id} className="flex items-center justify-between py-1">
            <div className="text-sm">{e.title}</div>
            <div className="text-xs text-muted-foreground">{e.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
