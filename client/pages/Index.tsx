import React, { useMemo } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Link } from "react-router-dom";

export default function Index() {
  const today = useMemo(() => new Date().toLocaleDateString("tr-TR", { weekday: "long" }), []);

  return (
    <MobileLayout>
      <div className="space-y-4">
        <section className="p-4 rounded-2xl border bg-gradient-to-br from-accent to-card">
          <h2 className="text-lg font-bold">Merhaba! 📚</h2>
          <p className="text-sm text-muted-foreground">Bugün {today}. Hedeflerine küçük adımlarla yaklaş.</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Link to="/pomodoro" className="p-4 rounded-2xl border hover:border-primary transition-colors">
            <p className="text-xs text-muted-foreground">Zamanlayıcı</p>
            <h3 className="text-lg font-semibold">Pomodoro</h3>
          </Link>
          <Link to="/kocluk" className="p-4 rounded-2xl border hover:border-primary transition-colors">
            <p className="text-xs text-muted-foreground">Motivasyon</p>
            <h3 className="text-lg font-semibold">Koçluk</h3>
          </Link>
          <Link to="/teknikler" className="p-4 rounded-2xl border hover:border-primary transition-colors">
            <p className="text-xs text-muted-foreground">Yöntemler</p>
            <h3 className="text-lg font-semibold">Teknikler</h3>
          </Link>
          <Link to="/ayarlar" className="p-4 rounded-2xl border hover:border-primary transition-colors">
            <p className="text-xs text-muted-foreground">Kişiselleştir</p>
            <h3 className="text-lg font-semibold">Ayarlar</h3>
          </Link>
        </section>

        <section className="p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Bugünkü görevler</h3>
          <QuickTasks />
        </section>

        <section className="p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Son ilerleme</h3>
          <ProgressMini />
        </section>
      </div>
    </MobileLayout>
  );
}

function QuickTasks() {
  const [text, setText] = React.useState("");
  const [items, setItems] = React.useState<string[]>(() => {
    try {
      const v = localStorage.getItem("quick-tasks");
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem("quick-tasks", JSON.stringify(items));
  }, [items]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl border bg-background"
          placeholder="Örn. Matematik 2 test"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded-xl bg-primary text-primary-foreground"
          onClick={() => {
            if (!text.trim()) return;
            setItems((arr) => [text.trim(), ...arr]);
            setText("");
          }}
        >
          Ekle
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2 p-2 rounded-lg border">
            <input type="checkbox" onChange={(e) => e.target.checked && setItems((arr) => arr.filter((_, idx) => idx !== i))} />
            <span className="text-sm">{it}</span>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-muted-foreground">Bir görev ekleyin.</li>}
      </ul>
    </div>
  );
}

function ProgressMini() {
  const sessions = (() => {
    try {
      const v = localStorage.getItem("pomodoro-sessions") || "0";
      return Number(v) || 0;
    } catch {
      return 0;
    }
  })();
  const pct = Math.min(100, (sessions % 8) * 12.5);
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="44" className="stroke-muted" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-primary"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${Math.PI * 2 * 44}`}
            strokeDashoffset={`${((100 - pct) / 100) * Math.PI * 2 * 44}`}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Haftalık hedef</p>
        <p className="font-semibold">{pct}% tamamlandı</p>
      </div>
    </div>
  );
}
