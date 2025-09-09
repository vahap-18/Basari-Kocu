import React, { useMemo, useState } from "react";

type EventItem = { id: string; title: string; date: string; note?: string };

export default function CoachCalendar() {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("coach-events") || "[]");
    } catch {
      return [];
    }
  });
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

  function add() {
    if (!title.trim()) return;
    const ev: EventItem = { id: String(Date.now()), title: title.trim(), date };
    const next = [ev, ...events];
    setEvents(next);
    localStorage.setItem("coach-events", JSON.stringify(next));
    setTitle("");
  }

  function remove(id: string) {
    const next = events.filter((e) => e.id !== id);
    setEvents(next);
    localStorage.setItem("coach-events", JSON.stringify(next));
  }

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Takvim</h4>
        <div className="text-xs text-muted-foreground">Yerel</div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        Etkinlik ekleyin; senkronizasyon yok, cihaz üzerinde saklanır.
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Etkinlik başlığı"
          className="flex-1 px-3 py-2 rounded-xl border bg-background"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-xl border bg-background"
        />
        <button onClick={add} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground">
          Ekle
        </button>
      </div>

      <div className="space-y-2">
        {events.length === 0 && <div className="text-sm text-muted-foreground">Etkinlik yok.</div>}
        {events.map((e) => (
          <div key={e.id} className={"p-2 rounded-lg border flex items-center justify-between"}>
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-muted-foreground">{e.date === todayStr ? "Bugün" : e.date}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => remove(e.id)} className="px-2 py-1 rounded-md border text-xs">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
