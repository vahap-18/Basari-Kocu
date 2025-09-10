import React from "react";

import React, { useEffect, useMemo, useState } from "react";

export default function SmallCalendarCard() {
  const [events, setEvents] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("coach-events") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onUpdate = () => {
      try {
        setEvents(JSON.parse(localStorage.getItem("coach-events") || "[]"));
      } catch {
        setEvents([]);
      }
    };
    window.addEventListener("coach-data-updated", onUpdate as EventListener);
    return () => window.removeEventListener("coach-data-updated", onUpdate as EventListener);
  }, []);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
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
