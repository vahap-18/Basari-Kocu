import React, { useEffect, useState } from "react";

export default function ProgressDetails() {
  const [tasks, setTasks] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("coach-tasks") || "[]");
    } catch {
      return [];
    }
  });
  const [sessions, setSessions] = useState<number>(() => {
    try {
      return Number(localStorage.getItem("pomodoro-sessions") || "0") || 0;
    } catch {
      return 0;
    }
  });
  const [goals, setGoals] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("goals") || "[]");
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("coach-progress-history") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onUpdate = () => {
      let curTasks = [] as any[];
      try {
        curTasks = JSON.parse(localStorage.getItem("coach-tasks") || "[]");
        setTasks(curTasks);
      } catch {
        setTasks([]);
      }
      try {
        const curSessions = Number(
          localStorage.getItem("pomodoro-sessions") || "0",
        );
        setSessions(curSessions || 0);
      } catch {
        setSessions(0);
      }
      try {
        const curGoals = JSON.parse(localStorage.getItem("goals") || "[]");
        setGoals(curGoals);
      } catch {
        setGoals([]);
      }

      // update daily history snapshot
      try {
        const today = new Date().toISOString().slice(0, 10);
        const completedCount = curTasks.filter((t: any) => t.done).length;
        const curSessions = Number(
          localStorage.getItem("pomodoro-sessions") || "0",
        );
        const curGoalsCount = JSON.parse(localStorage.getItem("goals") || "[]")
          .length;
        const rawHistory = JSON.parse(
          localStorage.getItem("coach-progress-history") || "[]",
        );
        const last = rawHistory.length ? rawHistory[rawHistory.length - 1] : null;
        if (!last || last.date !== today) {
          const next = [
            ...rawHistory,
            { date: today, completed: completedCount, sessions: curSessions, goals: curGoalsCount },
          ].slice(-14); // keep last 14 days
          localStorage.setItem("coach-progress-history", JSON.stringify(next));
          setHistory(next);
        } else {
          // replace last entry when counts changed
          if (
            last.completed !== completedCount ||
            last.sessions !== curSessions ||
            last.goals !== curGoalsCount
          ) {
            const next = [...rawHistory];
            next[next.length - 1] = { date: today, completed: completedCount, sessions: curSessions, goals: curGoalsCount };
            localStorage.setItem("coach-progress-history", JSON.stringify(next));
            setHistory(next);
          }
        }
      } catch {}
    };
    window.addEventListener("coach-data-updated", onUpdate as EventListener);
    // also run once
    onUpdate();
    return () =>
      window.removeEventListener("coach-data-updated", onUpdate as EventListener);
  }, []);

  const completed = tasks.filter((t: any) => t.done).length;
  const total = tasks.length;

  // prepare chart data (last 7 days)
  const last7 = history.slice(-7);
  const maxVal = Math.max(
    1,
    ...last7.map((h) => Math.max(h.completed || 0, h.sessions || 0, h.goals || 0)),
  );

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <h4 className="font-semibold mb-2">Ayrıntılı İlerleme</h4>
      <div className="text-sm text-muted-foreground mb-3">
        Görev tamamlama ve çalışma oturumlarına göre özet. (Günlük güncellenir)
      </div>

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

      <div className="mb-3">
        <div className="font-medium mb-2">Son 7 gün - Görev Tamamlama</div>
        <div className="flex items-end gap-2 h-24">
          {last7.map((h: any) => {
            const val = h.completed || 0;
            const height = Math.round((val / maxVal) * 100);
            return (
              <div key={h.date} className="flex-1 text-center">
                <div className="mx-auto w-6 bg-primary rounded-t" style={{height: `${height}%`}} />
                <div className="text-xs text-muted-foreground mt-1">{h.date.slice(5)}</div>
              </div>
            );
          })}
          {last7.length === 0 && <div className="text-xs text-muted-foreground">Veri yok</div>}
        </div>
      </div>

      <div className="text-sm">
        <div className="font-medium mb-1">Son etkinlik</div>
        <div className="text-xs text-muted-foreground">Yerel veriler üzerinden hesaplandı.</div>
      </div>
    </div>
  );
}
