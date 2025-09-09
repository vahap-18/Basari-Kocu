import React from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { useTheme, type ThemeKey } from "@/components/ThemeProvider";
import { PersonalityTest } from "@/components/PersonalityTest";

function getEmojiForDominant(d: string) {
  const map: Record<string,string> = {
    focus: '🧠', procrastinate: '⏳', resilience: '💪', social: '🤝', structure: '📋', curiosity: '🔎', stress: '🌬️', leadership: '🌟'
  };
  return map[d] ?? '✨';
}

function getInterpretation(profile: any) {
  if (!profile) return '';
  const dominant = profile.dominant;
  const lines: Record<string,string> = {
    focus: 'Odak becerilerin güçlü; uzun çalışma bloklarını dene, ama aralarda kısa molalar eklemeyi unutma.',
    procrastinate: 'Erteleme eğilimin var; küçük günlük hedefler ve zaman sınırlamaları oluştur. Pomodoro gibi teknikler yardımcı olur.',
    resilience: 'Zorluklara karşı dayanıklısın; zor konularda ısrarla çalış ve hataları öğrenme fırsatı olarak gör.',
    social: 'Tartışma ve çalışma grupları sana iyi gelir; konuları başkalarına anlatmak öğrenmeni hızlandırır.',
    structure: 'Planlı ve disiplinlisin; haftalık plan ve kontrol listeleri ile verimini daha da arttırabilirsin.',
    curiosity: 'Merakın güçlü; derinlemesine kaynak taramaları ve projeler seni motive eder.',
    stress: 'Sınav kaygısı seni etkileyebilir; deneme sınavları ve gevşeme teknikleriyle kaygıyı yönet.',
    leadership: 'Sorumluluk almayı seviyorsun; grup çalışmaları ve öğreten rollerde öne çıkabilirsin.'
  };
  const text = lines[dominant] ?? `Öne çıkan: ${dominant}.`;
  return text + ' ' + (profile.summary ?? '');
}

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
  { key: "kiz", label: "Aurora", preview: ["#fff1f2", "#f43f5e", "#fbcfe8"] },
    { key: "erkek", label: "Sapphire", preview: ["#f0f9ff", "#2563eb", "#bfdbfe"] },
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

  const [tests, setTests] = React.useState<Record<string, any>>(() => {
    try {
      const v = localStorage.getItem("scientific-tests");
      return v ? JSON.parse(v) : {};
    } catch { return {}; }
  });

  React.useEffect(() => {
    const onUpdate = (e: Event) => {
      try {
        const payload = (e as CustomEvent).detail;
        if (payload && payload.type === 'scientific-tests') {
          setTests(payload.data || {});
        } else {
          const v = localStorage.getItem('scientific-tests');
          setTests(v ? JSON.parse(v) : {});
        }
      } catch {
        try { const v = localStorage.getItem('scientific-tests'); setTests(v ? JSON.parse(v) : {}); } catch {}
      }
    };
    window.addEventListener('tests-updated', onUpdate as EventListener);
    return () => window.removeEventListener('tests-updated', onUpdate as EventListener);
  }, []);

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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                {(() => {
                  try{ const p = localStorage.getItem('profile-photo'); if(p) return <img src={p} alt="avatar" className="w-full h-full object-cover" /> } catch{}
                  return <div className="text-2xl">{getEmojiForDominant(profile.dominant)}</div>
                })()}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Tamamlanma</div>
                <div className="font-semibold">{new Date(profile.createdAt).toLocaleString("tr-TR")}</div>
              </div>
            </div>

            <div className="mb-2">
              <div className="text-sm text-muted-foreground">Öne çıkan özellik</div>
              <div className="font-semibold capitalize">{profile.dominant} {getEmojiForDominant(profile.dominant)}</div>
            </div>
            <div className="mb-2 text-sm text-muted-foreground">{profile.summary}</div>
            <div className="mt-2">
              <div className="text-sm text-muted-foreground">Önerilen Pomodoro</div>
              <div className="font-medium">{profile.recommendedPomodoro.work} dk odak • {profile.recommendedPomodoro.short} dk kısa mola</div>
            </div>
            <div className="mt-3 text-sm">
              <h4 className="font-semibold mb-2">Yorum</h4>
              <p className="text-muted-foreground">{getInterpretation(profile)}</p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl border text-sm text-muted-foreground">Kişilik testini tamamlamadınız. Ana sayfada testi başlatabilirsiniz.</div>
        )}
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-bold mb-3">Bilimsel Testler Sonuçları</h2>
        {Object.keys(tests).length === 0 ? (
          <div className="p-3 rounded-2xl border text-sm text-muted-foreground">Henüz bir test yapmadınız. Koçluk sayfasından bilimsel testleri deneyebilirsiniz.</div>
        ) : (
          <div className="space-y-3">
            {Object.entries(tests).map(([key, val]) => (
              <div key={key} className="p-3 rounded-2xl border bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{val.name}</div>
                    <div className="text-xs text-muted-foreground">Tamamlanma: {new Date(val.updatedAt || val.createdAt).toLocaleString('tr-TR')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{val.scoreText ?? val.score ?? '-'}</div>
                    <div className="text-xs text-muted-foreground">Puan</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{val.interpretation ?? ''}</div>
              </div>
            ))}
          </div>
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
