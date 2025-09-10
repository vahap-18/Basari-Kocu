import React, { useEffect, useMemo, useState } from "react";

type EventItem = { id: string; title: string; date: string; note?: string };

// lightweight embedded calendar grid (no external CSS)
function MonthGrid({ events, onSelect, selectedDate }: { events: EventItem[]; onSelect: (d: Date) => void; selectedDate?: string | null }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: Date[] = [];
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));

  const markers = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.date] = (acc[e.date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Pz', 'P', 'S', 'Ç', 'P', 'C', 'Ct'].map((h) => (
        <div key={h} className="text-xs text-muted-foreground text-center">{h}</div>
      ))}
      {Array(first.getDay()).fill(0).map((_, i) => <div key={'pad-'+i} />)}
      {days.map((d) => {
        const key = d.toISOString().slice(0,10);
        const isSelected = selectedDate === key;
        return (
          <button key={key} onClick={() => onSelect(d)} className={"p-2 rounded-md text-sm text-center " + (isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50')}>
            <div>{d.getDate()}</div>
            {markers[key] ? <div className="text-[10px] text-muted-foreground">{markers[key]} etkinlik</div> : null}
          </button>
        );
      })}
    </div>
  );
}

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

  useEffect(() => {
    // listen for external changes
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

  function persist(next: EventItem[]) {
    setEvents(next);
    localStorage.setItem("coach-events", JSON.stringify(next));
    try {
      window.dispatchEvent(new CustomEvent("coach-data-updated", { detail: { type: "events", data: next } }));
    } catch {}
  }

  function add() {
    if (!title.trim()) return;
    const ev: EventItem = { id: String(Date.now()), title: title.trim(), date };
    const next = [ev, ...events];
    persist(next);
    setTitle("");
  }

  function remove(id: string) {
    const next = events.filter((e) => e.id !== id);
    persist(next);
  }

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Takvim</h4>
        <div className="text-xs text-muted-foreground">Yerel</div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">Etkinlik ekleyin; senkronizasyon yok, cihaz üzerinde saklanır.</div>

      <div className="mb-3">
        <MonthGrid events={events} onSelect={(d) => setDate(d.toISOString().slice(0,10))} selectedDate={date} />
      </div>

      <div className="flex gap-2 mb-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Etkinlik başlığı" className="flex-1 px-3 py-2 rounded-xl border bg-background" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 rounded-xl border bg-background" />
        <button onClick={add} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground">Ekle</button>
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
              <button onClick={() => remove(e.id)} className="px-2 py-1 rounded-md border text-xs">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
