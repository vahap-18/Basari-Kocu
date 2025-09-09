import React from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { useTheme, type ThemeKey } from "@/components/ThemeProvider";
import { PersonalityTest } from "@/components/PersonalityTest";

const themes: { key: ThemeKey; label: string; preview: string[] }[] = [
  { key: "acik", label: "Açık", preview: ["#111827", "#3b82f6", "#e5e7eb"] },
  { key: "koyu", label: "Koyu", preview: ["#f9fafb", "#60a5fa", "#111827"] },
  { key: "cesur", label: "Cesur", preview: ["#0a0a0a", "#ef4444", "#f59e0b"] },
  { key: "sabir", label: "Sabır", preview: ["#0f172a", "#22c55e", "#d1fae5"] },
  { key: "girisimci", label: "Girişimci", preview: ["#0f172a", "#06b6d4", "#e0f2fe"] },
  { key: "samimi", label: "Samimi", preview: ["#1f2937", "#f97316", "#fde68a"] },
  { key: "lider", label: "Lider", preview: ["#0f172a", "#8b5cf6", "#dbeafe"] },
  { key: "korkusuz", label: "Korkusuz", preview: ["#0f172a", "#f43f5e", "#fee2e2"] },
  { key: "bilge", label: "Bilge", preview: ["#0f172a", "#10b981", "#a7f3d0"] },
];

export default function AyarlarPage() {
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = React.useState<any>(() => {
    try {
      const v = localStorage.getItem("personality-profile");
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  });
  const [showTest, setShowTest] = React.useState(false);

  return (
    <MobileLayout>
      {showTest && (
        <PersonalityTest
          onComplete={(p) => {
            setProfile(p);
            setShowTest(false);
          }}
          onClose={() => setShowTest(false)}
        />
      )}

      <section className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Kişilik Profili</h2>
          <div>
            <button onClick={() => setShowTest(true)} className="px-3 py-1 rounded-md border text-sm">
              Testi Yeniden Doldur
            </button>
          </div>
        </div>

        {profile ? (
          <div className="p-3 rounded-2xl border bg-gradient-to-br from-accent/10 to-card">
            <div className="mb-2">
              <div className="text-sm text-muted-foreground">Tamamlanma</div>
              <div className="font-semibold">{new Date(profile.createdAt).toLocaleString("tr-TR")}</div>
            </div>
            <div className="mb-2">
              <div className="text-sm text-muted-foreground">Öne çıkan özellik</div>
              <div className="font-semibold capitalize">{profile.dominant}</div>
            </div>
            <div className="mb-2 text-sm text-muted-foreground">{profile.summary}</div>
            <div className="mt-2">
              <div className="text-sm text-muted-foreground">Önerilen Pomodoro</div>
              <div className="font-medium">{profile.recommendedPomodoro.work} dk odak • {profile.recommendedPomodoro.short} dk kısa mola</div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl border text-sm text-muted-foreground">Kişilik testini tamamlamadınız. Ana sayfada testi başlatabilirsiniz.</div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Tema</h2>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={
                "p-3 rounded-2xl border text-left hover:border-primary transition-colors " +
                (theme === t.key ? "ring-2 ring-primary" : "")
              }
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{t.label}</span>
                <div className="flex -space-x-1">
                  {t.preview.map((c, i) => (
                    <span key={i} className="inline-block w-4 h-4 rounded-full border" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </MobileLayout>
  );
}
