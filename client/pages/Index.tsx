import React, { useMemo } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Link } from "react-router-dom";
import { PersonalityTest } from "@/components/PersonalityTest";
import {
  StudyTechniquesCard,
  HistoryTodayCard,
  UpliftingCard,
  MotivationCard,
} from "@/components/Cards";
import SmallCalendarCard from "@/components/SmallCalendarCard";
import TaskReminderCard from "@/components/TaskReminderCard";
import CoachCalendar from "@/components/CoachCalendar";

export default function Index() {
  const today = useMemo(
    () => new Date().toLocaleDateString("tr-TR", { weekday: "long" }),
    [],
  );
  const [examName, setExamName] = React.useState<string>(
    () => localStorage.getItem("exam-name") || "",
  );
  const [examDateRaw, setExamDateRaw] = React.useState<string>(
    () => localStorage.getItem("exam-date") || "",
  );
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("exam-name", examName);
  }, [examName]);
  React.useEffect(() => {
    localStorage.setItem("exam-date", examDateRaw);
  }, [examDateRaw]);

  const targetTs = React.useMemo(() => {
    if (!examDateRaw) return null;
    const d = new Date(examDateRaw);
    return isNaN(d.getTime()) ? null : d.getTime();
  }, [examDateRaw]);

  const remaining = React.useMemo(() => {
    if (!targetTs) return null;
    const diff = Math.max(0, Math.floor((targetTs - now) / 1000));
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return { days, hours, minutes, seconds, total: diff };
  }, [now, targetTs]);

  const [showTest, setShowTest] = React.useState(
    () => localStorage.getItem("personality-completed") !== "1",
  );

  return (
    <MobileLayout>
      {showTest && (
        <PersonalityTest
          onComplete={() => setShowTest(false)}
          onClose={() => setShowTest(false)}
        />
      )}
      <div className="space-y-4">
        <section className="p-4 rounded-2xl border bg-gradient-to-br from-primary/10 to-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">⏳ Sınav Geri Sayımı</h2>
              <p className="text-sm text-muted-foreground">
                Sınavını ekle ve kalan zamanı takip et.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">{today}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <input
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Sınav adı (örn. YKS, Matematik Final)"
              className="w-full px-3 py-2 rounded-xl border bg-background"
            />
            <input
              type="datetime-local"
              value={examDateRaw}
              onChange={(e) => setExamDateRaw(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border bg-background"
            />

            {remaining ? (
              <div className="p-3 rounded-xl bg-gradient-to-r from-primary/20 to-accent/10 border flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">
                    {examName || "Planlanan sınav"}
                  </div>
                  <div className="text-2xl font-bold tabular-nums">
                    {remaining.days}g {String(remaining.hours).padStart(2, "0")}
                    :{String(remaining.minutes).padStart(2, "0")}:
                    {String(remaining.seconds).padStart(2, "0")}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {remaining.total === 0 ? "Süre doldu" : "Kalan süre"}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Sınav tarihi girilmedi.
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setExamName("");
                  setExamDateRaw("");
                }}
                className="flex-1 py-2 rounded-xl border"
              >
                Temizle
              </button>
              <a
                href="/pomodoro"
                className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-center"
              >
                Hemen Çalış
              </a>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <SmallCalendarCard />
          <TaskReminderCard />
        </section>

        <section className="mt-3 p-4 rounded-2xl border bg-card">
          <h3 className="font-semibold mb-2">Takvim (Gömülü)</h3>
          <CoachCalendar />
        </section>

        <section>
          {/* Motivation card from shared data */}
          <div>
            {/* Render MotivationCard component */}
            <div className="grid grid-cols-1 gap-3">
              <MotivationCard />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Link
            to="/pomodoro"
            className="p-4 rounded-2xl border hover:border-primary transition-colors"
          >
            <p className="text-xs text-muted-foreground">Zamanlayıcı</p>
            <h3 className="text-lg font-semibold">⏳ Pomodoro</h3>
          </Link>
          <Link
            to="/kocluk"
            className="p-4 rounded-2xl border hover:border-primary transition-colors"
          >
            <p className="text-xs text-muted-foreground">Motivasyon</p>
            <h3 className="text-lg font-semibold">💬 Koçluk</h3>
          </Link>
          <Link
            to="/teknikler"
            className="p-4 rounded-2xl border hover:border-primary transition-colors"
          >
            <p className="text-xs text-muted-foreground">Yöntemler</p>
            <h3 className="text-lg font-semibold">📚 Teknikler</h3>
          </Link>
          <Link
            to="/ayarlar"
            className="p-4 rounded-2xl border hover:border-primary transition-colors"
          >
            <p className="text-xs text-muted-foreground">Kişiselleştir</p>
            <h3 className="text-lg font-semibold">⚙️ Ayarlar</h3>
          </Link>
        </section>

        <section>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl border bg-gradient-to-br from-card to-muted">
              <h3 className="font-semibold mb-2">
                🎯 Bilimsel Çalışma Teknikleri
              </h3>
              <p className="text-sm text-muted-foreground">
                Etkili yöntemleri keşfedin ve çalışma rutininize uygulayın.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <StudyTechniquesCard />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="md:col-span-1">
                  <HistoryTodayCard />
                </div>
                <div className="md:col-span-1">
                  <UpliftingCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">📝 Bugünkü görevler</h3>
          <QuickTasks />
        </section>

        <section className="p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">📈 Son ilerleme</h3>
          <ProgressMini />
        </section>
      </div>
    </MobileLayout>
  );
}

function QuickTasks() {
  const [text, setText] = React.useState("");
  const [items, setItems] = React.useState<
    { text: string; done: boolean; id: string }[]
  >(() => {
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

  function add() {
    const t = text.trim();
    if (!t) return;
    const item = { text: t, done: false, id: String(Date.now()) };
    setItems((arr) => [item, ...arr]);
    setText("");
  }

  function toggleDone(id: string) {
    setItems((arr) =>
      arr.map((it) => (it.id === id ? { ...it, done: !it.done } : it)),
    );
  }

  function clearCompleted() {
    setItems((arr) => arr.filter((it) => !it.done));
  }

  const completed = items.filter((i) => i.done).length;

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl border bg-background"
          placeholder="Örn. Matematik 2 test"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button
          className="px-3 py-2 rounded-xl bg-primary text-primary-foreground"
          onClick={add}
        >
          Ekle
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          Toplam: {items.length} • Tamamlandı: {completed}
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearCompleted}
            className="text-sm px-2 py-1 rounded-md border"
          >
            Tamamlananları Temizle
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex items-center gap-2 p-2 rounded-lg border"
          >
            <input
              type="checkbox"
              checked={it.done}
              onChange={() => toggleDone(it.id)}
            />
            <span
              className={
                it.done
                  ? "line-through text-muted-foreground text-sm"
                  : "text-sm"
              }
            >
              {it.text}
            </span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-muted-foreground">Bir görev ekleyin.</li>
        )}
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
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-muted"
            strokeWidth="8"
            fill="none"
          />
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
