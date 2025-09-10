import React, { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  due?: string | null;
  done: boolean;
  recurring?: "daily" | "weekly" | null;
  fromTemplate?: string | null;
};

type Template = { id: string; title: string; defaultDue?: string | null };

export default function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("coach-tasks") || "[]");
    } catch {
      return [];
    }
  });
  const [templates, setTemplates] = useState<Template[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("coach-templates") || "[]");
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [due, setDue] = useState<string>(new Date().toISOString().slice(0, 10));
  const [rec, setRec] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("coach-tasks", JSON.stringify(tasks));
    try {
      window.dispatchEvent(
        new CustomEvent("coach-data-updated", {
          detail: { type: "tasks", data: tasks },
        }),
      );
    } catch {}
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("coach-templates", JSON.stringify(templates));
    try {
      window.dispatchEvent(
        new CustomEvent("coach-data-updated", {
          detail: { type: "templates", data: templates },
        }),
      );
    } catch {}
  }, [templates]);

  function addTemplate() {
    const t = prompt("Şablon ismi");
    if (!t) return;
    const nt = { id: String(Date.now()), title: t };
    setTemplates((s) => [nt, ...s]);
  }

  function createFromTemplate(temp: Template) {
    const nt: Task = {
      id: String(Date.now()),
      title: temp.title,
      due: temp.defaultDue ?? null,
      done: false,
      recurring: null,
      fromTemplate: temp.id,
    };
    setTasks((s) => [nt, ...s]);
  }

  function addTask() {
    const t = text.trim();
    if (!t) return;
    const task: Task = {
      id: String(Date.now()),
      title: t,
      due: due || null,
      done: false,
      recurring: (rec || null) as any,
    };
    setTasks((s) => [task, ...s]);
    setText("");
  }

  function toggle(id: string) {
    setTasks((s) => {
      const next = s.map((it) =>
        it.id === id ? { ...it, done: !it.done } : it,
      );
      const t = next.find((x) => x.id === id);
      // if task became done and recurring, schedule next occurrence
      if (t && t.done && t.recurring) {
        const d = t.due ? new Date(t.due) : new Date();
        if (t.recurring === "daily") d.setDate(d.getDate() + 1);
        else if (t.recurring === "weekly") d.setDate(d.getDate() + 7);
        const newTask: Task = {
          id: String(Date.now() + 1),
          title: t.title,
          due: d.toISOString().slice(0, 10),
          done: false,
          recurring: t.recurring,
        };
        return [newTask, ...next];
      }
      return next;
    });
  }

  function remove(id: string) {
    setTasks((s) => s.filter((t) => t.id !== id));
  }

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Görevler & Şablonlar</h4>
        <div className="text-xs text-muted-foreground">
          Yerel görev yöneticisi
        </div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        Tekrar eden görevler ve şablonlar oluşturun.
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Görev başlığı"
          className="flex-1 px-3 py-2 rounded-xl border bg-background"
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="px-3 py-2 rounded-xl border bg-background"
        />
        <select
          value={rec}
          onChange={(e) => setRec(e.target.value)}
          className="px-3 py-2 rounded-xl border bg-background"
        >
          <option value="">Tek seferlik</option>
          <option value="daily">Günlük</option>
          <option value="weekly">Haftalık</option>
        </select>
        <button
          onClick={addTask}
          className="px-3 py-2 rounded-xl bg-primary text-primary-foreground"
        >
          Ekle
        </button>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={addTemplate}
          className="px-3 py-2 rounded-md border text-sm"
        >
          Şablon Ekle
        </button>
        <div className="text-sm text-muted-foreground">
          Şablonlardan görev oluşturabilirsiniz.
        </div>
      </div>

      {templates.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Şablonlar</div>
          <div className="flex gap-2 flex-wrap">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => createFromTemplate(t)}
                className="px-3 py-1 rounded-md border text-sm"
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.length === 0 && (
          <div className="text-sm text-muted-foreground">Görev yok.</div>
        )}
        {tasks.map((t) => (
          <div
            key={t.id}
            className="p-2 rounded-lg border flex items-center justify-between"
          >
            <div>
              <div
                className={
                  t.done
                    ? "line-through text-muted-foreground font-medium"
                    : "font-medium"
                }
              >
                {t.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.due ?? "Tarihsiz"} {t.recurring ? `• ${t.recurring}` : ""}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
              />
              <button
                onClick={() => remove(t.id)}
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
