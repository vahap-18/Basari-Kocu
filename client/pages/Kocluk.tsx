import React, { useEffect, useState } from "react";
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
                <li>Günlük hedeflerinizi 2��3 maddede sınırlayın.</li>
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

              <TestsSection />
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

function TestsSection() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [testsState, setTestsState] = useState<Record<string, any>>(() => {
    try {
      return JSON.parse(localStorage.getItem("scientific-tests") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("scientific-tests", JSON.stringify(testsState));
    try {
      window.dispatchEvent(
        new CustomEvent("tests-updated", {
          detail: { type: "scientific-tests", data: testsState },
        }),
      );
    } catch {}
  }, [testsState]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      try {
        const id = (e as CustomEvent).detail?.id;
        if (id) setOpen((o) => ({ ...o, [id]: true }));
      } catch {}
    };
    window.addEventListener("open-test", onOpen as EventListener);
    return () =>
      window.removeEventListener("open-test", onOpen as EventListener);
  }, []);

  function saveTest(key: string, payload: any) {
    setTestsState((s) => ({
      ...s,
      [key]: { ...payload, updatedAt: new Date().toISOString() },
    }));
  }

  // Generic 10-question test component
  function TenQuestionTest({ id, title, questions, calcResult }: any) {
    const isOpen = !!open[id];
    const [answers, setAnswers] = useState<number[]>(() =>
      Array(questions.length).fill(0),
    );
    const [index, setIndex] = useState(0);

    function submit() {
      // ensure all answered
      if (answers.some((v) => v === 0)) return;
      const result = calcResult(answers);
      saveTest(id, {
        name: title,
        ...result,
        createdAt: new Date().toISOString(),
      });
      setOpen((o) => ({ ...o, [id]: false }));
      try {
        window.dispatchEvent(
          new CustomEvent("tests-updated", {
            detail: {
              type: "scientific-tests",
              data: JSON.parse(
                localStorage.getItem("scientific-tests") || "{}",
              ),
            },
          }),
        );
      } catch {}
    }

    const autoAdvanceRef = React.useRef<number | null>(null as any);

    React.useEffect(() => {
      if (isOpen) {
        setAnswers(Array(questions.length).fill(0));
        setIndex(0);
      }
      return () => {
        if ((autoAdvanceRef as any).current)
          window.clearTimeout((autoAdvanceRef as any).current);
      };
    }, [isOpen, questions.length]);

    const answeredCount = answers.filter(Boolean).length;

    return (
      <div className="p-3 rounded-2xl border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{title}</div>
          </div>
          <button
            onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))}
            className="px-3 py-1 rounded-xl border"
          >
            {isOpen ? "Gizle" : "Başlat"}
          </button>
        </div>

        {isOpen && (
          <div className="mt-3">
            <div className="animate-pop p-4 rounded-xl bg-gradient-to-br from-primary/5 to-card shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">
                  Soru {index + 1} / {questions.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Cevaplanan: {answeredCount}
                </div>
              </div>

              <div className="text-center py-6">
                <div className="text-lg font-semibold mb-3 leading-tight">
                  {questions[index]}
                </div>

                <div className="grid grid-cols-5 gap-2 mt-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setAnswers((a) => {
                          const na = [...a];
                          na[index] = n;
                          return na;
                        });
                        // auto-advance after brief delay; if last question, submit
                        window.clearTimeout((autoAdvanceRef as any).current);
                        if (index < questions.length - 1) {
                          (autoAdvanceRef as any).current = window.setTimeout(
                            () =>
                              setIndex((i) =>
                                Math.min(questions.length - 1, i + 1),
                              ),
                            220,
                          );
                        } else {
                          (autoAdvanceRef as any).current = window.setTimeout(
                            () => submit(),
                            220,
                          );
                        }
                      }}
                      className={
                        "py-4 rounded-xl text-lg font-semibold border transition-colors " +
                        (answers[index] === n
                          ? "bg-primary text-primary-foreground"
                          : "bg-background")
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6">
                  <button
                    disabled={index === 0}
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                    className="px-4 py-2 rounded-xl border"
                  >
                    Geri
                  </button>
                  {index < questions.length - 1 ? (
                    <button
                      onClick={() =>
                        setIndex((i) => Math.min(questions.length - 1, i + 1))
                      }
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground"
                    >
                      Sonraki
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground"
                    >
                      Tamamla
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // define 10-question sets and simple scoring for several tests
  const mbtiQuestions = [
    "Sosyal etkinliklerde enerjinizi alır mıs��nız?",
    "Kararları mantıkla mı yoksa duygu ile mi verirsiniz?",
    "Yeni fikirlere açığımdır.",
    "Planlı ve düzenli çalışırım.",
    "Detaylara dikkat ederim.",
    "İnsanlarla kolay iletişim kurarım.",
    "Hızlı karar verirken sezgilere güvenirim.",
    "Soyut fikirleri düşünmeyi severim.",
    "Rutin tercihlerim vard��r.",
    "Yeni deneyimler ararım.",
  ];

  const bigFiveQuestions = [
    "Genelde dışa dönük biriyim.",
    "Sorumluluk sahibiyim ve düzenliyim.",
    "Diğerleriyle kolay anlaşırım.",
    "Çabuk endişelenirim.",
    "Yeni deneyimlere açığım.",
    "Sosyal ortamlarda enerjik hissederim.",
    "Görevleri zamanında tamamlama eğilimindeyim.",
    "Empati yeteneğim yüksek.",
    "Duygusal iniş çıkışlarım olur.",
    "Yaratıcı fikirler üretmeyi severim.",
  ];

  const enneagramQuestions = Array.from({ length: 10 }).map(
    (_, i) => `Enneagram soru ${i + 1} (kendinizi değerlendirin).`,
  );
  const discQuestions = Array.from({ length: 10 }).map(
    (_, i) => `DISC soru ${i + 1} (duruma göre 1-5 değerlendirin).`,
  );
  const eqQuestions = Array.from({ length: 10 }).map(
    (_, i) => `Duygusal zeka sorusu ${i + 1}.`,
  );
  const nbackQuestions = Array.from({ length: 10 }).map(
    (_, i) => `İşlem belleği sorusu ${i + 1} (eşleşme var mı?).`,
  );
  const stroopQuestions = Array.from({ length: 10 }).map(
    (_, i) => `Stroop testi maddesi ${i + 1} (renk/kelime uyumu).`,
  );
  const varkQuestions = Array.from({ length: 10 }).map(
    (_, i) => `Öğrenme stili soru ${i + 1}.`,
  );
  const kolbQuestions = Array.from({ length: 10 }).map(
    (_, i) => `Kolb soru ${i + 1}.`,
  );
  const honeyQuestions = Array.from({ length: 10 }).map(
    (_, i) => `Honey & Mumford soru ${i + 1}.`,
  );

  return (
    <div className="space-y-3">
      <TenQuestionTest
        id="mbti"
        title="MBTI (Kısa)"
        questions={mbtiQuestions}
        calcResult={(answers: number[]) => {
          const avg = Math.round(
            answers.reduce((a, b) => a + b, 0) / answers.length,
          );
          const interpretation =
            avg >= 4
              ? "Dışadönük ve karar odaklı."
              : avg === 3
                ? "Dengeli özellikler."
                : "İçe dönük yapılar daha baskın.";
          return { score: avg, scoreText: `${avg}/5`, interpretation };
        }}
      />

      <TenQuestionTest
        id="bigfive"
        title="Big Five (Kısa)"
        questions={bigFiveQuestions}
        calcResult={(answers: number[]) => {
          const avg = Math.round(
            answers.reduce((a, b) => a + b, 0) / answers.length,
          );
          const interpretation =
            avg >= 4
              ? "Yüksek genel kişilik puanı (pozitif)."
              : avg === 3
                ? "Orta düzeyde."
                : "Düşük bazı kişilik boyutlar��.";
          return { score: avg, scoreText: `${avg}/5`, interpretation };
        }}
      />

      <TenQuestionTest
        id="enneagram"
        title="Enneagram (Kısa)"
        questions={enneagramQuestions}
        calcResult={(answers: number[]) => {
          const avg = Math.round(
            answers.reduce((a, b) => a + b, 0) / answers.length,
          );
          return {
            score: avg,
            scoreText: `${avg}/5`,
            interpretation: "Enneagram tarzı eğilimleriniz gösterildi.",
          };
        }}
      />

      <TenQuestionTest
        id="disc"
        title="DISC (Kısa)"
        questions={discQuestions}
        calcResult={(answers: number[]) => ({
          score: Math.round(
            answers.reduce((a, b) => a + b, 0) / answers.length,
          ),
          scoreText: `${Math.round(answers.reduce((a, b) => a + b, 0) / answers.length)}/5`,
          interpretation: "Davranış eğilimleri gösterildi.",
        })}
      />

      <TenQuestionTest
        id="eqi"
        title="EQ-i (Kısa)"
        questions={eqQuestions}
        calcResult={(answers: number[]) => ({
          score: Math.round(
            answers.reduce((a, b) => a + b, 0) / answers.length,
          ),
          scoreText: `${Math.round(answers.reduce((a, b) => a + b, 0) / answers.length)}/5`,
          interpretation: "Duygusal zekâ profili.",
        })}
      />

      <TenQuestionTest
        id="nback"
        title="N-Back (Kısa)"
        questions={nbackQuestions}
        calcResult={(answers: number[]) => ({
          score: answers.filter(Boolean).length,
          scoreText: `${answers.filter(Boolean).length}/${answers.length}`,
          interpretation: "Çalışma belleği performansınız.",
        })}
      />

      <TenQuestionTest
        id="stroop"
        title="Stroop (Kısa)"
        questions={stroopQuestions}
        calcResult={(answers: number[]) => ({
          score: answers.filter(Boolean).length,
          scoreText: `${answers.filter(Boolean).length}/${answers.length}`,
          interpretation: "Dikkat ve bilişsel kontrol seviyesi.",
        })}
      />

      <TenQuestionTest
        id="vark"
        title="VARK"
        questions={varkQuestions}
        calcResult={(answers: number[]) => ({
          score: Math.round(
            answers.reduce((a, b) => a + b, 0) / answers.length,
          ),
          scoreText: `${Math.round(answers.reduce((a, b) => a + b, 0) / answers.length)}/5`,
          interpretation: "Tercih ettiğiniz öğrenme stilleri gösterildi.",
        })}
      />

      <TenQuestionTest
        id="kolb"
        title="Kolb"
        questions={kolbQuestions}
        calcResult={(answers: number[]) => ({
          score: Math.round(
            answers.reduce((a, b) => a + b, 0) / answers.length,
          ),
          scoreText: `${Math.round(answers.reduce((a, b) => a + b, 0) / answers.length)}/5`,
          interpretation: "Kolb öğrenme stiliniz değerlendirildi.",
        })}
      />

      <TenQuestionTest
        id="honey"
        title="Honey & Mumford"
        questions={honeyQuestions}
        calcResult={(answers: number[]) => ({
          score: Math.round(
            answers.reduce((a, b) => a + b, 0) / answers.length,
          ),
          scoreText: `${Math.round(answers.reduce((a, b) => a + b, 0) / answers.length)}/5`,
          interpretation: "Öğrenme tercihleriniz özetlendi.",
        })}
      />
    </div>
  );
}

function TestCatalog() {
  const tests = [
    {
      id: "mbti",
      title: "MBTI",
      emoji: "🧭",
      desc: "Myers-Briggs Type Indicator: 16 kişilik tipi sağlar. Karakterizi anlamaya yardımcı.",
    },
    {
      id: "bigfive",
      title: "Big Five (OCEAN)",
      emoji: "🌐",
      desc: "Beş faktör model: Dışadönüklük, Sorumluluk, Uyumluluk, Duygusal Denge, Deneyime Açıklık.",
    },
    {
      id: "enneagram",
      title: "Enneagram",
      emoji: "🔷",
      desc: "9 kişilik tipi; motivasyon temelli bir model.",
    },
    {
      id: "disc",
      title: "DISC Analizi",
      emoji: "🔶",
      desc: "Dominance, Influence, Steadiness, Conscientiousness; davranış profilleri.",
    },
    { id: "eqi", title: "EQ-i", emoji: "💖", desc: "Duygusal zekâ envanteri." },
    {
      id: "msceit",
      title: "MSCEIT",
      emoji: "🧩",
      desc: "Duyguları algılama, kullanma, anlama ve yönetme yeteneği testi.",
    },
    {
      id: "iq",
      title: "IQ Testleri",
      emoji: "🧠",
      desc: "Wechsler, Stanford-Binet gibi genel zekâ testleri.",
    },
    {
      id: "raven",
      title: "Raven's Matrices",
      emoji: "🔳",
      desc: "Soyut akıl yürütme ve deseni tamamlama.",
    },
    {
      id: "nback",
      title: "N-Back (Çalışma Belleği)",
      emoji: "🔁",
      desc: "Çalışma belleği kapasitesi testleri.",
    },
    {
      id: "stroop",
      title: "Stroop Testi",
      emoji: "🎨",
      desc: "Dikkat ve bilişsel kontrol testi.",
    },
    {
      id: "wcst",
      title: "WCST",
      emoji: "🃏",
      desc: "Esneklik ve problem çözme yeteneği.",
    },
    {
      id: "vark",
      title: "VARK",
      emoji: "👁️",
      desc: "Görsel, İşitsel, Okuma/Yazma, Kinestetik öğrenme tercihleri.",
    },
    {
      id: "kolb",
      title: "Kolb Öğrenme Stilleri",
      emoji: "🔄",
      desc: "Deneyimsel öğrenme tipleri: Diverger, Assimilator, Converger, Accommodator.",
    },
    {
      id: "honey",
      title: "Honey & Mumford",
      emoji: "📚",
      desc: "Aktivist, Teorisyen, Pragmatist, Yansıtıcı öğrenme stilleri.",
    },
  ];

  function startTest(t: any) {
    try {
      // request to open the detailed 10-question test for this id
      try {
        window.dispatchEvent(
          new CustomEvent("open-test", { detail: { id: t.id } }),
        );
      } catch {}
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-2 mt-2">
      <h5 className="font-semibold">Test Kataloğu</h5>
      {tests.map((t) => (
        <div
          key={t.id}
          className="p-3 rounded-xl border bg-background flex items-start justify-between"
        >
          <div>
            <div className="font-medium">
              {t.emoji} {t.title}
            </div>
            <div className="text-xs text-muted-foreground">{t.desc}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => startTest(t)}
              className="px-3 py-1 rounded-xl bg-primary text-primary-foreground"
            >
              Beni Test Et
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TestCRT({ open, setOpen, saveTest }: any) {
  const key = "crt";
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const questions = [
    {
      q: "Bir beyzbol sopası ve top toplam 1.10 TL tutuyorsa ve sopa topdan 1 TL daha pahalıysa, top kaç TL'dir?",
      a: "0.05",
    },
    {
      q: "Bir gölette nilüferler her gün iki katına çıkıyor. Tamamı 48 günde doluyorsa, yarısı kaçıncı günde doludur?",
      a: "47",
    },
    {
      q: "Bir makine 5 dakikada 5 parça yapıyorsa, 100 makine 100 dakikada kaç parça yapar?",
      a: "100",
    },
  ];

  function submit() {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if ((answers[i] || "").trim() === questions[i].a) score++;
    }
    const interpretation =
      score === 3
        ? "Yüksek analitik düşünce."
        : score === 2
          ? "İyi seviyede bilişsel refleks."
          : "Daha analitik düşünce egzersizleri faydalı olabilir.";
    saveTest(key, {
      name: "Cognitive Reflection Test",
      score,
      scoreText: `${score}/${questions.length}`,
      interpretation,
      createdAt: new Date().toISOString(),
    });
    setOpen((o: any) => ({ ...o, [key]: false }));
  }

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Cognitive Reflection Test (CRT)</div>
          <div className="text-sm text-muted-foreground">
            Kısa üç soruluk refleks testi.
          </div>
        </div>
        <button
          onClick={() => setOpen((o: any) => ({ ...o, [key]: !o[key] }))}
          className="px-3 py-1 rounded-xl border"
        >
          {open[key] ? "Gizle" : "Başlat"}
        </button>
      </div>
      {open[key] && (
        <div className="mt-3 space-y-2">
          {questions.map((qq, i) => (
            <div key={i}>
              <div className="text-sm font-medium">
                {i + 1}. {qq.q}
              </div>
              <input
                value={answers[i] || ""}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [i]: e.target.value }))
                }
                className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              onClick={submit}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground"
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TestGrit({ open, setOpen, saveTest }: any) {
  const key = "grit";
  const items = [
    "Uzun vadeli hedefler için gayret gösteririm.",
    "Hedeflerime ulaşmak için sabırlıyım.",
    "Zorluklar karşısında pes etmem.",
  ];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  function submit() {
    const vals = Object.values(answers).map((v: any) => Number(v) || 1);
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    const interpretation =
      avg >= 4
        ? "Yüksek grit: hedef odaklı ve ısrarcı."
        : avg === 3
          ? "Orta seviye grit."
          : "Daha fazla kararlılık çalışması faydalı olabilir.";
    saveTest(key, {
      name: "Grit (Kısa)",
      score: avg,
      scoreText: `${avg}/5`,
      interpretation,
      createdAt: new Date().toISOString(),
    });
    setOpen((o: any) => ({ ...o, [key]: false }));
  }
  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Grit Scale (Kısa)</div>
          <div className="text-sm text-muted-foreground">
            Kararlılık ve ısrar ölçümü (Likert 1-5).
          </div>
        </div>
        <button
          onClick={() => setOpen((o: any) => ({ ...o, [key]: !o[key] }))}
          className="px-3 py-1 rounded-xl border"
        >
          {open[key] ? "Gizle" : "Başlat"}
        </button>
      </div>
      {open[key] && (
        <div className="mt-3 space-y-2">
          {items.map((it, i) => (
            <div key={i}>
              <div className="text-sm">{it}</div>
              <select
                value={answers[i] || 3}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [i]: Number(e.target.value) }))
                }
                className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              onClick={submit}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground"
            >
              Tamamla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Test2Back({ open, setOpen, saveTest }: any) {
  const key = "2back";
  const sequence = ["A", "B", "A", "C", "A"]; // 2-back: positions matching 2 before: index2=A matches index0 A, index4=A matches index2 A => 2 targets
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  function submit() {
    let correct = 0;
    for (let i = 0; i < sequence.length; i++) {
      const target = i >= 2 && sequence[i] === sequence[i - 2];
      if ((answers[i] ? true : false) === target) correct++;
    }
    const interpretation =
      correct >= 4
        ? "Çok iyi çalışma belleği performansı."
        : correct >= 2
          ? "Orta seviye çalışma belleği."
          : "Çalışma belleğini güçlendirecek oyunlar faydalı.";
    saveTest(key, {
      name: "2-Back Kısa",
      score: correct,
      scoreText: `${correct}/${sequence.length}`,
      interpretation,
      createdAt: new Date().toISOString(),
    });
    setOpen((o: any) => ({ ...o, [key]: false }));
  }
  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Çalışma Belleği (2-Back)</div>
          <div className="text-sm text-muted-foreground">
            Basit 2-back görevi — doğru eşleşmeleri işaretleyin.
          </div>
        </div>
        <button
          onClick={() => setOpen((o: any) => ({ ...o, [key]: !o[key] }))}
          className="px-3 py-1 rounded-xl border"
        >
          {open[key] ? "Gizle" : "Başlat"}
        </button>
      </div>
      {open[key] && (
        <div className="mt-3 space-y-2">
          <div className="text-sm text-muted-foreground">
            Sıra: {sequence.join(" - ")}
          </div>
          <div>
            {sequence.map((s, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!answers[i]}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [i]: e.target.checked }))
                  }
                />
                <span>
                  {i + 1}. {s}
                </span>
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={submit}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground"
            >
              Tamamla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TestProcrastination({ open, setOpen, saveTest }: any) {
  const key = "procrast";
  const [val, setVal] = useState<number>(3);
  function submit() {
    const interpretation =
      val >= 4
        ? "Yüksek erteleme eğilimi; mikrotask ve zaman sınırlaması faydalı."
        : val === 3
          ? "Orta seviye."
          : "Düşük erteleme eğilimi.";
    saveTest(key, {
      name: "Procrastination (Kısa)",
      score: val,
      scoreText: `${val}/5`,
      interpretation,
      createdAt: new Date().toISOString(),
    });
    setOpen((o: any) => ({ ...o, [key]: false }));
  }
  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Erteleme Ölçeği (Kısa)</div>
          <div className="text-sm text-muted-foreground">
            Genel erteleme eğiliminizi değerlendirin (1-5).
          </div>
        </div>
        <button
          onClick={() => setOpen((o: any) => ({ ...o, [key]: !o[key] }))}
          className="px-3 py-1 rounded-xl border"
        >
          {open[key] ? "Gizle" : "Başlat"}
        </button>
      </div>
      {open[key] && (
        <div className="mt-3 space-y-2">
          <div className="text-sm">Genelde görevleri son ana bırakırım.</div>
          <input
            type="range"
            min={1}
            max={5}
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-end">
            <button
              onClick={submit}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
