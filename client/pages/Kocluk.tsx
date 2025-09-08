import React, { useEffect, useMemo, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";

const QUOTES = [
  "Bugün küçük bir adım, yarın büyük bir fark.",
  "Disiplin, özgürlüğün en kısa yoludur.",
  "Zor olan başlamak, gerisi gelir.",
  "Tek rakibin dünkü halin.",
  "Odaklan, nefes al, devam et.",
  "Azim, yetenekten daha güçlüdür.",
];

function useDailyQuote() {
  const [quote, setQuote] = useState(QUOTES[0]);
  useEffect(() => {
    const d = new Date();
    const seed = d.getFullYear() * 1000 + d.getMonth() * 50 + d.getDate();
    const idx = seed % QUOTES.length;
    setQuote(QUOTES[idx]);
  }, []);
  return quote;
}

export default function KoclukPage() {
  const quote = useDailyQuote();
  const [inhale, setInhale] = useState(true);
  const [size, setSize] = useState(60);

  useEffect(() => {
    const id = setInterval(() => {
      setInhale((v) => !v);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setSize(inhale ? 84 : 48);
  }, [inhale]);

  return (
    <MobileLayout>
      <div className="space-y-6">
        <section className="p-4 rounded-2xl border bg-gradient-to-br from-accent to-card">
          <p className="text-sm text-muted-foreground">Günün sözü</p>
          <p className="text-lg font-semibold mt-1">{quote}</p>
        </section>

        <section className="p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Nefes Egzersizi 4-4</h3>
          <p className="text-sm text-muted-foreground mb-3">4 sn al, 4 sn ver. Zihnini sakinleştir.</p>
          <div className="flex items-center justify-center py-6">
            <div
              style={{ width: size, height: size }}
              className="rounded-full bg-primary/20 border-2 border-primary transition-all duration-700"
            />
          </div>
        </section>

        <section className="p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Günlük Hedef</h3>
          <DailyGoals />
        </section>
      </div>
    </MobileLayout>
  );
}

function DailyGoals() {
  const [goals, setGoals] = useState<string[]>(() => {
    try {
      const v = localStorage.getItem("goals");
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Örn. 3 test çöz"
          className="flex-1 px-3 py-2 rounded-xl border bg-background"
        />
        <button
          onClick={() => {
            if (!input.trim()) return;
            setGoals((g) => [input.trim(), ...g]);
            setInput("");
          }}
          className="px-3 py-2 rounded-xl bg-primary text-primary-foreground"
        >
          Ekle
        </button>
      </div>
      <ul className="space-y-2">
        {goals.map((g, i) => (
          <li key={i} className="flex items-center gap-2 p-2 rounded-lg border">
            <input
              type="checkbox"
              onChange={(e) => e.target.checked && setGoals((arr) => arr.filter((_, idx) => idx !== i))}
            />
            <span className="text-sm">{g}</span>
          </li>
        ))}
        {goals.length === 0 && (
          <li className="text-sm text-muted-foreground">Bugün bir hedef ekleyin.</li>
        )}
      </ul>
    </div>
  );
}
