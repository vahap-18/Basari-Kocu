import React from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { User } from "lucide-react";

function formatDate(d: Date) {
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function generateSeries(points: number) {
  const now = Date.now();
  const arr = [] as any[];
  for (let i = points - 1; i >= 0; i--) {
    const ts = new Date(now - i * 3600 * 1000);
    arr.push({ time: formatDate(ts), value: Math.round(40 + Math.random() * 60) });
  }
  return arr;
}

export default function Profile() {
  const { theme } = useTheme();
  const [profile, setProfile] = React.useState<any>(() => {
    try {
      const v = localStorage.getItem("personality-profile");
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  });

  const [onboarding, setOnboarding] = React.useState<Record<string, string> | null>(() => {
    try {
      const v = localStorage.getItem("onboarding-data");
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  });

  const [mode, setMode] = React.useState<"daily" | "weekly" | "monthly">("weekly");
  const [series, setSeries] = React.useState(() => generateSeries(24));
  const [sessions, setSessions] = React.useState(() => {
    try {
      const v = localStorage.getItem("pomodoro-sessions") || "0";
      return Number(v) || 0;
    } catch {
      return 0;
    }
  });

  React.useEffect(() => {
    const iv = setInterval(() => {
      setSeries((s) => {
        const next = s.slice(1).concat({ time: formatDate(new Date()), value: Math.round(40 + Math.random() * 60) });
        return next;
      });
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  React.useEffect(() => {
    const iv = setInterval(() => {
      // simulate sessions increasing
      setSessions((n) => {
        const next = n + (Math.random() > 0.7 ? 1 : 0);
        try {
          localStorage.setItem("pomodoro-sessions", String(next));
        } catch {}
        return next;
      });
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  React.useEffect(() => {
    // regenerate series when mode changes
    if (mode === "daily") setSeries(generateSeries(24));
    if (mode === "weekly") setSeries(generateSeries(24));
    if (mode === "monthly") setSeries(generateSeries(30));
  }, [mode]);

  // listen for other tabs or components updating localStorage
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      try {
        if (e.key === "personality-profile") setProfile(e.newValue ? JSON.parse(e.newValue) : null);
        if (e.key === "onboarding-data") setOnboarding(e.newValue ? JSON.parse(e.newValue) : null);
        if (e.key === "user-goals") setGoals(e.newValue ? JSON.parse(e.newValue) : { daily: 3, weekly: 15, monthly: 60 });
        if (e.key === "pomodoro-sessions") setSessions(Number(e.newValue || "0"));
      } catch {}
    }
    const onCustom = (ev: any) => {
      const detail = ev?.detail;
      if (detail) {
        if (detail.type === "personality-updated") setProfile(detail);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("personality-updated", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("personality-updated", onCustom as EventListener);
    };
  }, []);

  const total = React.useMemo(() => series.reduce((a, b) => a + (b.value || 0), 0), [series]);

  const goalsKey = "user-goals";
  const [goals, setGoals] = React.useState(() => {
    try {
      const v = localStorage.getItem(goalsKey);
      return v ? JSON.parse(v) : { daily: 3, weekly: 15, monthly: 60 };
    } catch {
      return { daily: 3, weekly: 15, monthly: 60 };
    }
  });

  function updateGoal(k: string, val: number) {
    const next = { ...goals, [k]: val };
    setGoals(next);
    try {
      localStorage.setItem(goalsKey, JSON.stringify(next));
    } catch {}
  }

  const completion = React.useMemo(() => {
    // simplistic: sessions today modulo weekly target
    const pct = Math.min(100, Math.round((sessions / (goals[mode === "daily" ? "daily" : mode === "weekly" ? "weekly" : "monthly"])) * 100));
    return isNaN(pct) ? 0 : pct;
  }, [sessions, goals, mode]);

  return (
    <MobileLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <section className="p-4 rounded-2xl border bg-gradient-to-br from-primary/10 to-card">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl overflow-hidden">
                {onboarding?.displayName ? (
                  <div className="font-semibold">{onboarding.displayName.charAt(0).toUpperCase()}</div>
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Merhaba</div>
                <div className="text-lg font-bold">
                  {onboarding?.displayName || "Sen"}{" "}
                  <span className="text-sm text-muted-foreground">• {onboarding?.addressing || "Dostum"}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{profile?.summary || "Kişisel analiziniz kullanılabilir."}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Toplam Oturum</div>
              <div className="text-2xl font-bold tabular-nums">{sessions}</div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <motion.div layout className="p-4 rounded-2xl border bg-card">
            <h3 className="font-semibold mb-2">İlerlemenin Zaman İçindeki Görünümü</h3>
            <div style={{ height: 160 }}>
              <ResponsiveContainer>
                <LineChart data={series}>
                  <defs>
                    <linearGradient id="primaryGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(59,130,246,0.9)" />
                      <stop offset="100%" stopColor="rgba(99,102,241,0.9)" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(59,130,246,0.12)" />
                      <stop offset="100%" stopColor="rgba(99,102,241,0.02)" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#primaryGrad)"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Seçilen Periyot</div>
                <div className="font-semibold capitalize">{mode}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setMode("daily")} className={"px-3 py-1 rounded-md border text-sm " + (mode === "daily" ? "bg-primary text-primary-foreground" : "")}>Günlük</button>
                <button onClick={() => setMode("weekly")} className={"px-3 py-1 rounded-md border text-sm " + (mode === "weekly" ? "bg-primary text-primary-foreground" : "")}>Haftalık</button>
                <button onClick={() => setMode("monthly")} className={"px-3 py-1 rounded-md border text-sm " + (mode === "monthly" ? "bg-primary text-primary-foreground" : "")}>Aylık</button>
              </div>
            </div>
          </motion.div>

          <motion.div layout className="p-4 rounded-2xl border bg-card">
            <h3 className="font-semibold mb-2">Hedefler ve Tamamlama</h3>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 relative">
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r="44" className="stroke-muted" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="44" className="stroke-primary" strokeWidth="8" fill="none" strokeDasharray={`${Math.PI * 2 * 44}`} strokeDashoffset={`${((100 - completion) / 100) * Math.PI * 2 * 44}`} strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">{mode === "daily" ? "Günlük" : mode === "weekly" ? "Haftalık" : "Aylık"} hedef</div>
                <div className="font-semibold text-lg">{goals[mode === "daily" ? "daily" : mode === "weekly" ? "weekly" : "monthly"]} oturum</div>
                <div className="text-sm text-muted-foreground mt-2">Tamamlanma: {completion}%</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => updateGoal(mode === "daily" ? "daily" : mode === "weekly" ? "weekly" : "monthly", Math.max(1, goals[mode === "daily" ? "daily" : mode === "weekly" ? "weekly" : "monthly"] - 1))} className="px-3 py-1 rounded-md border">-</button>
                  <button onClick={() => updateGoal(mode === "daily" ? "daily" : mode === "weekly" ? "weekly" : "monthly", goals[mode === "daily" ? "daily" : mode === "weekly" ? "weekly" : "monthly"] + 1)} className="px-3 py-1 rounded-md border">+</button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm text-muted-foreground mb-2">Hızlı İstatistikler</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg border text-center">
                  <div className="text-xs text-muted-foreground">Ortalama</div>
                  <div className="font-semibold">{Math.round(total / series.length)}</div>
                </div>
                <div className="p-2 rounded-lg border text-center">
                  <div className="text-xs text-muted-foreground">Toplam</div>
                  <div className="font-semibold">{total}</div>
                </div>
                <div className="p-2 rounded-lg border text-center">
                  <div className="text-xs text-muted-foreground">Hedef</div>
                  <div className="font-semibold">{goals.weekly}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="p-4 rounded-2xl border bg-card">
          <h3 className="font-semibold mb-3">Detaylı Analiz</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={series}>
                <defs>
                  <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(250,215,75,0.9)" />
                    <stop offset="100%" stopColor="rgba(244,63,94,0.6)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="url(#accentGrad)" isAnimationActive={true} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="p-4 rounded-2xl border bg-card">
          <h3 className="font-semibold mb-2">Profil Bilgileri</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="p-3 rounded-xl border bg-background">
              <div className="text-sm text-muted-foreground">Hitap Şekli</div>
              <div className="font-medium">{onboarding?.addressing || "Dostum"}</div>
            </div>

            <div className="p-3 rounded-xl border bg-background">
              <div className="text-sm text-muted-foreground">Kendini Tanımlama</div>
              <div className="font-medium">{onboarding?.identity || "Bilge"}</div>
            </div>

            <div className="p-3 rounded-xl border bg-background">
              <div className="text-sm text-muted-foreground">Hazırlandığın Sınav</div>
              <div className="font-medium">{onboarding?.exam || "Belirtilmedi"}</div>
            </div>
          </div>
        </section>
      </motion.div>
    </MobileLayout>
  );
}
