import React, { useEffect, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { AICoach } from "@/components/AICoach";
import { BarChart2, Sparkles, Star, Activity } from "lucide-react";

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
  const [size, setSize] = useState(72);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const id = setInterval(() => setInhale((v) => !v), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => setSize(inhale ? 96 : 56), [inhale]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("personality-profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
    const onUpdate = (e: Event) => {
      try {
        const d = (e as CustomEvent).detail;
        setProfile(d ?? JSON.parse(String(localStorage.getItem("personality-profile"))));
      } catch {
        try { setProfile(JSON.parse(String(localStorage.getItem("personality-profile")))); } catch {}
      }
    };
    window.addEventListener("personality-updated", onUpdate as EventListener);
    return () => window.removeEventListener("personality-updated", onUpdate as EventListener);
  }, []);

  const scores = profile?.scores ?? null;

  function triggerAdvice() {
    try {
      window.dispatchEvent(new CustomEvent("personality-updated", { detail: profile }));
    } catch {}
  }

  return (
    <MobileLayout>
      <div className="space-y-6">
        {/* Top hero */}
        <section className="p-4 rounded-2xl border bg-gradient-to-br from-primary/6 to-card shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Kişisel Koçun</h2>
                  <p className="text-sm text-muted-foreground">{quote}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={triggerAdvice} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground">Yeni Tavsiye</button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {profile?.dominant ? String(profile.dominant).slice(0,2).toUpperCase() : "?"}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Profil</div>
                  <div className="font-semibold capitalize">{profile?.dominant ?? "Henüz yok"}</div>
                  <div className="text-sm text-muted-foreground mt-1">{profile?.summary ?? "Kişilik testini tamamlayın, size özel öneriler oluşturulsun."}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Önerilen Pomodoro</div>
                  <div className="font-semibold mt-1">{profile?.recommendedPomodoro?.work ?? "25"} dk</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Breathing visual */}
        <section className="p-4 rounded-2xl border bg-gradient-to-br from-accent/10 to-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Nefes Egzersizi 4-4</h3>
              <p className="text-sm text-muted-foreground">Derin nefes al, ritmini bul. Zihnini sakinleştir.</p>
            </div>
            <div className="text-xs text-muted-foreground">Rahatla</div>
          </div>
          <div className="flex items-center justify-center py-6">
            <div
              style={{ width: size, height: size }}
              className="rounded-full bg-primary/20 border-2 border-primary transition-all duration-700 shadow-inner"
            />
          </div>
        </section>

        {/* Coaching insights with visuals */}
        <section className="p-4 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Koçluk İçgörüleri</h3>
            <div className="text-xs text-muted-foreground">Profil bazlı öneriler</div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Odak</div>
                  <div className="font-semibold">{scores ? scores.focus : "—"} / 5</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border flex items-center gap-3">
                <Activity className="w-6 h-6 text-accent" />
                <div>
                  <div className="text-xs text-muted-foreground">Dayanıklılık</div>
                  <div className="font-semibold">{scores ? scores.resilience : "—"} / 5</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border">
              <h4 className="font-semibold mb-2">Kısa İpuçları</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>En zor konuları sabah saatlerine koyun.</li>
                <li>Pomodoro sürelerini profilinize göre ayarlayın.</li>
                <li>Günlük hedeflerinizi 2–3 maddede sınırlayın.</li>
                <li>Nefes egzersizleriyle dikkat toplama süresini %20 artırabilirsiniz.</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl border flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Motivasyon</div>
                <div className="font-semibold">"{quote}"</div>
              </div>
              <div>
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
            </div>

            <div className="p-3 rounded-xl border">
              <h4 className="font-semibold mb-2">Günlük Hedef</h4>
              <DailyGoals />
            </div>
          </div>
        </section>

        {/* AI Coach */}
        <section className="p-4 rounded-2xl border">
          <AICoach />
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
        {goals.length === 0 && <li className="text-sm text-muted-foreground">Bugün bir hedef ekleyin.</li>}
      </ul>
    </div>
  );
}
