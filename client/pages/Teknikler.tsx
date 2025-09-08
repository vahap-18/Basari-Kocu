import React, { useEffect, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";

const METHODS = [
  { key: "pomodoro", title: "Pomodoro", desc: "25 dk odak + 5 dk mola, 4 döngüde uzun mola." },
  { key: "feynman", title: "Feynman", desc: "Konuyu basitçe anlat, eksiklerini gör ve tekrar et." },
  { key: "active_recall", title: "Active Recall", desc: "Ezber yerine hafızadan çağırma soruları çöz." },
  { key: "spaced", title: "Aralıklı Tekrar", desc: "Bilgiyi günlere yayarak kalıcı öğren." },
];

export default function TekniklerPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    try {
      const v = localStorage.getItem("methods-enabled");
      return v ? JSON.parse(v) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("methods-enabled", JSON.stringify(enabled));
  }, [enabled]);

  return (
    <MobileLayout>
      <div className="space-y-3">
        {METHODS.map((m) => (
          <article key={m.key} className="p-4 rounded-2xl border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <span>Aktif</span>
                <input
                  type="checkbox"
                  checked={!!enabled[m.key]}
                  onChange={(e) =>
                    setEnabled((obj) => ({ ...obj, [m.key]: e.target.checked }))
                  }
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </MobileLayout>
  );
}
