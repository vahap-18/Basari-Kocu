import React, { useMemo, useState } from "react";

import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [selected, setSelected] = useState<Date | undefined>(undefined);

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
    return () =>
      window.removeEventListener(
        "coach-data-updated",
        onUpdate as EventListener,
      );
  }, []);

  function persist(next: EventItem[]) {
    setEvents(next);
    localStorage.setItem("coach-events", JSON.stringify(next));
    try {
      window.dispatchEvent(
        new CustomEvent("coach-data-updated", {
          detail: { type: "events", data: next },
        }),
      );
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

  const markers = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.date] = (acc[e.date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Takvim</h4>
        <div className="text-xs text-muted-foreground">Yerel</div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        Etkinlik ekleyin; senkronizasyon yok, cihaz üzerinde saklanır.
      </div>

      <div className="mb-3">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => {
            setSelected(d || undefined);
            if (d) setDate(d.toISOString().slice(0, 10));
          }}
          modifiers={{
            hasEvent: (date) => !!markers[date.toISOString().slice(0, 10)],
          }}
          modifiersClassNames={{ hasEvent: "bg-primary/10 rounded-full" }}
        />
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
        <button
          onClick={add}
          className="px-3 py-2 rounded-xl bg-primary text-primary-foreground"
        >
          Ekle
        </button>
      </div>

      <div className="space-y-2">
        {events.length === 0 && (
          <div className="text-sm text-muted-foreground">Etkinlik yok.</div>
        )}
        {events.map((e) => (
          <div
            key={e.id}
            className={
              "p-2 rounded-lg border flex items-center justify-between"
            }
          >
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-muted-foreground">
                {e.date === todayStr ? "Bugün" : e.date}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => remove(e.id)}
                className="px-2 py-1 rounded-md border text-xs"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
