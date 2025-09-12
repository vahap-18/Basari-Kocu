import React from "react";

export default function SettingsInsights({ profile }: { profile: any }) {
  const scores: Record<string, number> = profile?.scores ?? {};

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

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">İlerlemeni Gösterge Panosu</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="p-3 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">Girişimcilik</h4>
              <div className="text-sm text-muted-foreground">Yaratıcılık, liderlik ve fırsatları görme yeteneği</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{toPercent(entrepreneurship)}%</div>
              <div className="text-xs text-muted-foreground">{entrepreneurship}/5</div>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${toPercent(entrepreneurship)}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">Çalışma Düzeni</h4>
              <div className="text-sm text-muted-foreground">Planlama, disiplini ve görev tamamlama</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{toPercent(work)}%</div>
              <div className="text-xs text-muted-foreground">{work}/5</div>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-blue-400" style={{ width: `${toPercent(work)}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">Cesaret & Dayanıklılık</h4>
              <div className="text-sm text-muted-foreground">Zorluklarla başa çıkma ve risk alma eğilimi</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{toPercent(courage)}%</div>
              <div className="text-xs text-muted-foreground">{courage}/5</div>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-rose-400" style={{ width: `${toPercent(courage)}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">Genel İlerleme</h4>
              <div className="text-sm text-muted-foreground">Tüm puanların ortalaması</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{progress}%</div>
              <div className="text-xs text-muted-foreground">Ortalama</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-400" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Örnek aksiyonlar: Günlük hedef belirle, haftalık retrospektif yap, riskleri küçük adımlara böl.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
