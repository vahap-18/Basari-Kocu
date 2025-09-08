import React, { useEffect, useState } from "react";

type Item = { id: string; text: string; done: boolean };

export const ToDo: React.FC<{ storageKey?: string }> = ({ storageKey = "global-todos" }) => {
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const v = localStorage.getItem(storageKey);
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
  }, [items, storageKey]);

  function add() {
    const t = text.trim();
    if (!t) return;
    setItems((s) => [{ id: String(Date.now()), text: t, done: false }, ...s]);
    setText("");
  }

  function toggle(id: string) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  }

  function remove(id: string) {
    setItems((s) => s.filter((it) => it.id !== id));
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Yeni görev ekle"
          className="flex-1 px-3 py-2 rounded-xl border bg-background"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button onClick={add} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground">
          Ekle
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-2 p-2 rounded-lg border">
            <input type="checkbox" checked={it.done} onChange={() => toggle(it.id)} />
            <span className={it.done ? "line-through text-muted-foreground text-sm" : "text-sm"}>{it.text}</span>
            <button className="ml-auto text-sm text-destructive" onClick={() => remove(it.id)}>
              Sil
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-muted-foreground">Henüz görev yok.</li>}
      </ul>
    </div>
  );
};
