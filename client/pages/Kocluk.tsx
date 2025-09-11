import React, { useEffect, useMemo, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { AICoach } from "@/components/AICoach";
import { CoachOnboarding } from "@/components/CoachOnboarding";
import { BarChart2, Sparkles, Star, Activity } from "lucide-react";

// new coach features
import AdaptivePlan from "@/components/AdaptivePlan";
import CoachCalendar from "@/components/CoachCalendar";
import TasksManager from "@/components/TasksManager";
import ProgressDetails from "@/components/ProgressDetails";
import ProfileCharts from "@/components/ProfileCharts";

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

  // debug mount indicator and remote log
  React.useEffect(() => {
    try {
      fetch("/api/client-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "kocluk-mounted",
          ts: Date.now(),
          ua: navigator.userAgent,
        }),
      }).catch(() => {});
    } catch {}
  }, []);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() =>
    localStorage.getItem("profile-photo"),
  );
  const [avatarEmoji, setAvatarEmoji] = useState<string>(() => "🙂");
  const [showOnboard, setShowOnboard] = useState(
    () => !localStorage.getItem("coach-onboard"),
  );

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
        setProfile(
          d ?? JSON.parse(String(localStorage.getItem("personality-profile"))),
        );
      } catch {
        try {
          setProfile(
            JSON.parse(String(localStorage.getItem("personality-profile"))),
          );
        } catch {}
      }
    };
    window.addEventListener("personality-updated", onUpdate as EventListener);

    const onTests = (e: Event) => {
      // compute avatar based on tests
      try {
        const tests = JSON.parse(
          localStorage.getItem("scientific-tests") || "{}",
        );
        updateAvatarFromTests(tests);
      } catch {}
    };
    window.addEventListener("tests-updated", onTests as EventListener);

    // run once on mount to sync avatar with existing tests
    try {
      const existing = JSON.parse(
        localStorage.getItem("scientific-tests") || "{}",
      );
      updateAvatarFromTests(existing);
    } catch {}

    return () => {
      window.removeEventListener(
        "personality-updated",
        onUpdate as EventListener,
      );
      window.removeEventListener("tests-updated", onTests as EventListener);
    };
  }, []);

  const scores = profile?.scores ?? null;

  function updateAvatarFromTests(tests: any) {
    try {
      // simple heuristic: if procrastination high -> sleepy, if grit high -> strong, if eq high -> smile
      const p = tests["procrast"];
      const g = tests["grit"];
      const e = tests["eqi"];
      if (p && p.score >= 4) setAvatarEmoji("😴");
      else if (g && g.score >= 4) setAvatarEmoji("💪");
      else if (e && e.score >= 4) setAvatarEmoji("😊");
      else setAvatarEmoji("🙂");
    } catch {
      setAvatarEmoji("🙂");
    }
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // limit to 1MB to avoid localStorage bloat
    if (file.size > 1_000_000) {
      alert(
        "Profil resmi 1MB dan küçük olmalı. Lütfen daha küçük bir resim seçin.",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result);
      try {
        localStorage.setItem("profile-photo", data);
        setProfilePhoto(data);
      } catch {}
    };
    reader.readAsDataURL(file);
  }

  function triggerAdvice() {
    try {
      window.dispatchEvent(
        new CustomEvent("personality-updated", { detail: profile }),
      );
    } catch {}
  }

  return (
    <MobileLayout>
      <div className="space-y-6">
        {/* DEBUG BANNER: should be visible when Koçluk mounts */}
        <div className="fixed top-2 right-2 z-50 bg-red-500 text-white text-xs px-2 py-1 rounded">
          DEBUG: Koçluk mount
        </div>
        {showOnboard && (
          <CoachOnboarding
            onComplete={(p) => {
              setProfile(p);
              setShowOnboard(false);
              try {
                localStorage.setItem("coach-onboard", "1");
              } catch {}
            }}
            onClose={() => {
              setShowOnboard(false);
              try {
                localStorage.setItem("coach-onboard", "1");
              } catch {}
            }}
          />
        )}

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
                  <button
                    onClick={triggerAdvice}
                    className="px-3 py-2 rounded-xl bg-primary text-primary-foreground"
                  >
                    Yeni Tavsiye
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg overflow-hidden">
                      {/** avatar image or emoji */}
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-3xl">{avatarEmoji}</div>
                      )}
                    </div>
                    <input
                      id="profile-photo-input"
                      type="file"
                      accept="image/*"
                      onChange={onPhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-photo-input"
                      className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border cursor-pointer text-xs"
                    >
                      📷
                    </label>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Profil</div>
                  <div className="font-semibold capitalize">
                    {profile?.dominant ?? "Henüz yok"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {profile?.summary ??
                      "Kişilik testini tamamlayın, size özel öneriler oluşturulsun."}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">
                    Önerilen Pomodoro
                  </div>
                  <div className="font-semibold mt-1">
                    {profile?.recommendedPomodoro?.work ?? "25"} dk
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {profile && <ProfileCharts profile={profile} />}

        <section className="p-4 rounded-2xl border bg-card">
          <h3 className="font-semibold mb-2">Kişisel Tavsiye</h3>
          <div className="text-sm text-muted-foreground">
            {profile ? (
              <div>
                <div className="font-medium">Kısa Özet</div>
                <p className="mt-1">{profile.summary}</p>
                <div className="mt-2 font-medium">Hızlı Tavsiye</div>
                <p className="mt-1">
                  {profile.onboarding
                    ? `Önerilen çalışma zamanı: ${profile.onboarding.when}, oturum: ${profile.onboarding.session}dk. Öne çıkan ihtiyaç: ${profile.onboarding.struggle}.`
                    : profile.recommendation}
                </p>
              </div>
            ) : (
              <div>
                Kısa bir tanışma yapın, size özel tavsiyeler burada görünür.
              </div>
            )}
          </div>
        </section>

        {/* Breathing visual */}
        <section className="p-4 rounded-2xl border bg-gradient-to-br from-accent/10 to-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Nefes Egzersizi 4-4</h3>
              <p className="text-sm text-muted-foreground">
                Derin nefes al, ritmini bul. Zihnini sakinleştir.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">Rahatla</div>
          </div>

          <div className="flex items-center justify-center py-6">
            <div className="w-40 h-40 rounded-xl bg-background/50 border border-muted flex items-center justify-center">
              <div
                className="rounded-full border-2 border-primary shadow-inner"
                style={{
                  width: 96,
                  height: 96,
                  transform: inhale ? "scale(1)" : "scale(0.6)",
                  transition: "transform 4000ms ease-in-out, background 2000ms ease",
                  background: inhale
                    ? "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.9), rgba(96,165,250,0.6))"
                    : "radial-gradient(circle at 70% 70%, rgba(236,72,153,0.9), rgba(249,115,22,0.6))",
                }}
                aria-hidden
              />
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">{inhale ? "Nefes al" : "Nefes ver"}</div>
        </section>

        {/* Coaching insights with visuals */}
        <section className="p-4 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Koçluk İçgörüleri</h3>
            <div className="text-xs text-muted-foreground">
              Profil bazlı öneriler
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Odak</div>
                  <div className="font-semibold">
                    {scores ? scores.focus : "—"} / 5
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border flex items-center gap-3">
                <Activity className="w-6 h-6 text-accent" />
                <div>
                  <div className="text-xs text-muted-foreground">
                    Dayanıklılık
                  </div>
                  <div className="font-semibold">
                    {scores ? scores.resilience : "—"} / 5
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border">
              <h4 className="font-semibold mb-2">Kısa İpuçları</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>En zor konuları sabah saatlerine koyun.</li>
                <li>Pomodoro sürelerini profilinize göre ayarlayın.</li>
                <li>Günlük hedeflerinizi 2-3 maddede sın��rlayın.</li>
                <li>
                  Nefes egzersizleriyle dikkat toplama süresini %20
                  artırabilirsiniz.
                </li>
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

            <div className="p-3 rounded-2xl border bg-card">
              <h4 className="font-semibold mb-2">Bilimsel Testler</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Kısa, güvenilir psikometrik ve bilişsel testlerle profilinizi
                derinleştirin. Her testi açıp tamamlayabilirsiniz.
              </p>

              <TestCatalog />

              <div className="mt-3" />

            </div>
          </div>
        </section>

        {/* AI Coach + new coach features */}
        <div className="grid grid-cols-1 gap-3">
          <section className="p-4 rounded-2xl border">
            <AICoach />
          </section>

          <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <AdaptivePlan profile={profile} />
            </div>
            <div>
              <TasksManager />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <CoachCalendar />
            </div>
            <div>
              <ProgressDetails />
            </div>
          </section>
        </div>
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
    try {
      window.dispatchEvent(
        new CustomEvent("coach-data-updated", {
          detail: { type: "goals", data: goals },
        }),
      );
    } catch {}
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
              onChange={(e) =>
                e.target.checked &&
                setGoals((arr) => arr.filter((_, idx) => idx !== i))
              }
            />
            <span className="text-sm">{g}</span>
          </li>
        ))}
        {goals.length === 0 && (
          <li className="text-sm text-muted-foreground">
            Bugün bir hedef ekleyin.
          </li>
        )}
      </ul>
    </div>
  );
}


function TestCatalog() {
  const tests = [
    {
      id: "mbti",
      title: "MBTI",
      emoji: "🧭",
      desc: "Myers-Briggs Type Indicator: 16 kişilik tipi sağlar.",
      long: "MBTI (Myers-Briggs), bireylerin bilgi alma, karar verme, enerji kaynakları ve dünya ile ilişki kurma biçimlerini ölçen dört ikili ölçekten oluşur. Bu ölçekler birleşerek 16 farklı kişilik tipine işaret eder. Sonuçlar iletişim, öğrenme tercihi ve takım rolleri hakkında uygulanabilir içgörüler verir.",
      how: [
        "Kısa uygulama: 10-30 dakika arası sürer.",
        "Sonuçlar tercihleri gösterir; profesyonel değerlendirme yerine rehberlik amaçlı kullanılmalıdır.",
        "Öneriler: Dışadönükler grup çalışmasına, içedönükler bireysel çalışmaya daha iyi yanıt verebilir."
      ]
    },
    {
      id: "bigfive",
      title: "Big Five (OCEAN)",
      emoji: "🌐",
      desc: "Beş faktör model: kişilik profillerini ölçer.",
      long: "Big Five modeli (Açıklık, Sorumluluk, Dışadönüklük, Uyumluluk, Duygusal Denge) bireysel eğilimlerinizi detaylandırır. Bu çerçeve öğrenme stratejileri ve stres yönetimi için pratik öneriler sunar.",
      how: [
        "Değerlendirme: 10–15 dakika.",
        "Her boyuta göre günlük davranış örnekleriyle yorum yapılır.",
        "Eğitim önerileri: düşük duygusal denge için stres azaltma teknikleri önerilir."
      ]
    },
    { id: "enneagram", title: "Enneagram", emoji: "🔷", desc: "Motivasyon temelli 9 tip modeli.", long: "Enneagram, temel motivasyonları ve savunma mekanizmalarını ortaya koyar; kişisel farkındalık ve takım rolleri için içgörüler verir.", how: ["Kendi içgörünüzü yazılı örneklerle değerlendirin."] },
    { id: "disc", title: "DISC Analizi", emoji: "🔶", desc: "Davranış profilleri ve iletişim eğilimleri.", long: "DISC, iş ve takım içi rollerin belirlenmesinde yardımcı olur; güçlü ve zayıf iletişim stillerini gösterir.", how: ["Kısa anket; sonuçlar pratik önerilerle birlikte gelir."] },
    { id: "eqi", title: "EQ-i", emoji: "💖", desc: "Duygusal zekâ envanteri.", long: "EQ-i, duygusal farkındalık, empati ve duyguları düzenleme becerilerini değerlendirir. Sonuçlar, iletişim ve stres yönetimi için pratik öneriler sağlar.", how: ["Refleksiyon soruları içerir; 10–20 dk sürebilir."] },
  ];

  function deriveLabel(key: string, payload: any) {
    const score = payload?.score ?? 0;
    switch (key) {
      case "mbti":
        return score >= 4
          ? { name: "Analitik", comment: "Dışa dönük ve karar odaklı görünüyorsunuz." }
          : score === 3
            ? { name: "Dengeli", comment: "Dengeli özellikler sergiliyorsunuz." }
            : { name: "İçe Dönük", comment: "İçe dönük tercihleriniz baskın." };
      case "bigfive":
        return score >= 4
          ? { name: "Yüksek Profil", comment: "Genel kişilik puanınız yüksek." }
          : score === 3
            ? { name: "Orta Profil", comment: "Orta düzey profil." }
            : { name: "Düşük Profil", comment: "Bazı boyutlarda geliştirme fırsatları var." };
      default:
        return score >= 4
          ? { name: "Güçlü", comment: "Bu alanda güçlü y��nleriniz var." }
          : score === 3
            ? { name: "Orta", comment: "Orta düzeyde performans." }
            : { name: "Geliştirilebilir", comment: "Bu alanda geliştirme yapılabilir." };
    }
  }

  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("scientific-tests") || "{}");
    } catch {
      return {};
    }
  })();
  const keys = Object.keys(saved || {});

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const heightsRef = React.useRef<Record<string, number>>({});
  const setDetailRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) heightsRef.current[id] = el.scrollHeight;
  };

  return (
    <div className="space-y-2 mt-2">
      <h5 className="font-semibold">Test Kataloğu</h5>

      {keys.length > 0 && (
        <div className="mb-3">
          <h6 className="font-medium mb-2">Sonuçlarınız</h6>
          <div className="grid gap-2">
            {keys.map((k) => {
              const p = saved[k];
              const label = deriveLabel(k, p);
              return (
                <div key={k} className="p-3 rounded-xl border bg-card flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.scoreText} • {label.name}</div>
                    <div className="text-sm mt-1">{p.interpretation}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{label.comment}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tests.map((t) => {
        const isOpen = !!openMap[t.id];
        const maxH = isOpen ? `${heightsRef.current[t.id] || 400}px` : "0px";
        return (
          <div key={t.id} className="p-3 rounded-xl border bg-background transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-medium">{t.emoji} {t.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenMap((o) => ({ ...o, [t.id]: !o[t.id] }))}
                  className="px-3 py-1 rounded-md border text-sm"
                >
                  Detay
                </button>
              </div>
            </div>

            <div ref={setDetailRef(t.id)} style={{ maxHeight: maxH, overflow: 'hidden', transition: 'max-height 320ms ease, opacity 240ms ease', opacity: isOpen ? 1 : 0 }} className="mt-3 w-full">
              <div className="w-full p-3 rounded-md bg-card border">
                <div className="font-medium">{t.title} — Detaylar</div>
                <div className="text-xs text-muted-foreground mt-1">{t.long ?? t.desc}</div>
                {t.how && (
                  <div className="mt-2">
                    <div className="text-sm font-medium mb-1">Nasıl çalışır</div>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {t.how.map((h: string, i: number) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-3">
                  <div className="text-sm font-medium mb-1">İpuçları</div>
                  <div className="text-xs text-muted-foreground">Bu test açıklamaları rehberlik amaçlıdır ve doğruluk garanti edilmez.</div>
                </div>
                <div className="mt-3 text-right text-xs text-muted-foreground">Test özelliği bu sayfada devre dışı bırakıldı; sadece detaylar görüntülenir.</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
