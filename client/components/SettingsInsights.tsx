import React from "react";

export default function SettingsInsights({ profile }: { profile: any }) {
  const initial = profile ?? (typeof window !== "undefined" ? (() => {
    try { const v = localStorage.getItem("personality-profile"); return v ? JSON.parse(v) : null; } catch { return null; }
  })() : null);

  const [localProfile, setLocalProfile] = React.useState<any>(initial);

  // update when prop changes
  React.useEffect(() => {
    if (profile) setLocalProfile(profile);
  }, [profile]);

  // listen for global updates (other parts of app dispatch 'personality-updated') and storage events
  React.useEffect(() => {
    const onUpdate = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as any;
        if (detail) setLocalProfile(detail);
        else {
          const raw = localStorage.getItem("personality-profile");
          if (raw) setLocalProfile(JSON.parse(raw));
        }
      } catch { }
    };
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "personality-profile") {
        try { setLocalProfile(ev.newValue ? JSON.parse(ev.newValue) : null); } catch { }
      }
    };
    window.addEventListener("personality-updated", onUpdate as EventListener);
    window.addEventListener("storage", onStorage as EventListener);
    return () => {
      window.removeEventListener("personality-updated", onUpdate as EventListener);
      window.removeEventListener("storage", onStorage as EventListener);
    };
  }, []);

  const scores: Record<string, number> = localProfile?.scores ?? {};

  const getScore = (key: string, fallbackKeys: string[] = []) => {
    if (typeof scores[key] === "number") return Math.max(0, Math.min(5, scores[key]));
    for (const k of fallbackKeys) {
      if (typeof scores[k] === "number") return Math.max(0, Math.min(5, scores[k]));
    }
    return 0;
  };

  const entrepreneurship = getScore("entrepreneurship", ["leadership", "curiosity"]);
  const work = getScore("work", ["structure", "focus"]);
  const courage = getScore("courage", ["resilience", "stress"]);

  const allVals = Object.values(scores).map((v) => Number(v));
  const progress = allVals.length ? Math.round((allVals.reduce((s, v) => s + v, 0) / (allVals.length * 5)) * 100) : 0;

  const toPercent = (v: number) => Math.round((v / 5) * 100);

  // animated widths (updates smoothly when targets change)
  const [animE, setAnimE] = React.useState<number>(toPercent(entrepreneurship));
  const [animW, setAnimW] = React.useState<number>(toPercent(work));
  const [animC, setAnimC] = React.useState<number>(toPercent(courage));
  const [animP, setAnimP] = React.useState<number>(progress);

  React.useEffect(() => { setAnimE(toPercent(entrepreneurship)); }, [entrepreneurship]);
  React.useEffect(() => { setAnimW(toPercent(work)); }, [work]);
  React.useEffect(() => { setAnimC(toPercent(courage)); }, [courage]);
  React.useEffect(() => { setAnimP(progress); }, [progress]);

  return (
    <div>
      <style>{`
        @keyframes breathe {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <h2 className="text-lg font-bold mb-3">İlerlemeni Gösterge Panosu</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="p-3 rounded-2xl border bg-card" style={{ animation: "breathe 6s ease-in-out infinite" }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">Girişimcilik</h4>
              <div className="text-sm text-muted-foreground">Yaratıcılık, liderlik ve fırsatları görme yeteneği</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{animE}%</div>
              <div className="text-xs text-muted-foreground">{entrepreneurship}/5</div>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className="h-full absolute left-0 top-0"
              style={{ width: `${animE}%`, transition: "width 1000ms cubic-bezier(.2,.9,.2,1)", background: "hsl(var(--accent))" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2.5s linear infinite",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl border bg-card" style={{ animation: "breathe 6.5s ease-in-out infinite" }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">Çalışma Düzeni</h4>
              <div className="text-sm text-muted-foreground">Planlama, disiplini ve görev tamamlama</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{animW}%</div>
              <div className="text-xs text-muted-foreground">{work}/5</div>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className="h-full absolute left-0 top-0"
              style={{ width: `${animW}%`, transition: "width 1000ms cubic-bezier(.2,.9,.2,1)", background: "hsl(var(--primary))" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite", pointerEvents: "none" }} />
          </div>
        </div>

        <div className="p-3 rounded-2xl border bg-card" style={{ animation: "breathe 7s ease-in-out infinite" }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">Cesaret & Dayanıklılık</h4>
              <div className="text-sm text-muted-foreground">Zorluklarla başa çıkma ve risk alma eğilimi</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{animC}%</div>
              <div className="text-xs text-muted-foreground">{courage}/5</div>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className="h-full absolute left-0 top-0"
              style={{ width: `${animC}%`, transition: "width 1000ms cubic-bezier(.2,.9,.2,1)", background: "hsl(var(--secondary))" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)", backgroundSize: "200% 100%", animation: "shimmer 2.2s linear infinite", pointerEvents: "none" }} />
          </div>
        </div>

        <div className="p-3 rounded-2xl border bg-card" style={{ animation: "breathe 6.8s ease-in-out infinite" }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">Genel İlerleme</h4>
              <div className="text-sm text-muted-foreground">Tüm puanların ortalaması</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{animP}%</div>
              <div className="text-xs text-muted-foreground">Ortalama</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
              <div
                className="h-full absolute left-0 top-0"
                style={{ width: `${animP}%`, transition: "width 1200ms cubic-bezier(.2,.9,.2,1)", background: "hsl(var(--primary))" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)", backgroundSize: "200% 100%", animation: "shimmer 3.2s linear infinite", pointerEvents: "none" }} />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Örnek aksiyonlar: Günlük hedef belirle, haftalık retrospektif yap, riskleri küçük adımlara böl.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
