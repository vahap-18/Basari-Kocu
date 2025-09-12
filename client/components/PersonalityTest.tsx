import React, { useEffect, useMemo, useState } from "react";
import { useTheme, type ThemeKey } from "@/components/ThemeProvider";

export type PersonalityProfile = {
  createdAt: string;
  scores: Record<string, number>;
  dominant: string;
  summary: string;
  recommendedPomodoro: { work: number; short: number; long: number };
};

type Step =
  | { id: string; kind: "text"; label: string }
  | { id: string; kind: "single"; label: string; options: string[] };

const STEPS: Step[] = [
  { id: "displayName", kind: "text", label: "Adını nasıl görmek istersin?" },
  {
    id: "addressing",
    kind: "single",
    label: "Sana nasıl hitap edelim?",
    options: ["Sen / Samimi", "Siz / Resmi", "Dostum", "Kardeşim", "Arkadaşım"],
  },
  {
    id: "identity",
    kind: "single",
    label: "Kendini hangi kelimeyle tanımlıyorsun?",
    options: ["Sabırlı", "Cesur", "Girişimci", "Samimi", "Bilge", "Lider"],
  },
  {
    id: "exam",
    kind: "single",
    label: "Hangi sınava hazırlanıyorsun?",
    options: ["YKS / LGS", "KPSS", "Üniversite içi sınav", "Yabancı dil sınavı", "Diğer"],
  },
  {
    id: "goal",
    kind: "single",
    label: "Hedefin nedir?",
    options: ["Bölüm / okul kazanmak", "Derece yapmak (ilk 1000, yüksek sıralama)", "Sadece geçmek", "Kendimi geliştirmek"],
  },
  {
    id: "dailyHours",
    kind: "single",
    label: "Günlük çalışma hedefin nedir?",
    options: ["1-2 saat", "3-4 saat", "5-6 saat", "7+ saat"],
  },
  {
    id: "style",
    kind: "single",
    label: "Çalışma stilin nasıl?",
    options: ["Sessizlikte tek başıma", "Grup halinde", "Kısa ama sık molalar", "Uzun süre odak, az mola"],
  },
  {
    id: "challenge",
    kind: "single",
    label: "En çok zorlandığın nokta nedir?",
    options: ["Dikkat dağınıklığı", "Erteleme alışkanlığı", "Motivasyon kaybı", "Disiplin eksikliği", "Kaygı/stres"],
  },
  {
    id: "bestTime",
    kind: "single",
    label: "En verimli çalıştığın zaman dilimi hangisi?",
    options: ["Sabah erken", "Öğle saatleri", "Akşam", "Gece geç saatler"],
  },
  {
    id: "tools",
    kind: "single",
    label: "Çalışırken hangi araçlar seni daha çok destekler?",
    options: ["Pomodoro tekniği", "Görev listeleri / checklist", "Zaman bloklama (time blocking)", "Günlük not alma", "Hatırlatıcı bildirimler"],
  },
  {
    id: "motivation",
    kind: "single",
    label: "Seni daha çok motive eden şey nedir?",
    options: ["İlham verici başarı hikâyeleri", "Kısa ama güçlü motivasyon sözleri", "Görsel motivasyon (posterler, renkler)", "Video/animasyon tarzı motivasyon", "Günlük küçük hatırlatmalar"],
  },
  {
    id: "expectation",
    kind: "single",
    label: "Sınav sürecinde senden en çok ne beklenmeli?",
    options: ["İstikrarlı ve sabırlı olman", "Zorluklara rağmen cesur kalman", "Liderlik edip çevreni motive etmen", "Bilgeliğinle stratejik davranman", "Samimiyetinle yolculuğu keyifli hale getirmen"],
  },
];

export const PersonalityTest: React.FC<{
  onComplete?: (p: PersonalityProfile) => void;
  onClose?: () => void;
  examMode?: boolean;
  onStepChange?: (step: number, total: number) => void;
}> = ({ onComplete, onClose, examMode = false, onStepChange }) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    try {
      const v = localStorage.getItem("onboarding-data");
      return v ? JSON.parse(v) : {};
    } catch {
      return {};
    }
  });
  const [step, setStep] = useState(0);
  const [animClass, setAnimClass] = useState<string>("animate-pop");
  const { setTheme } = useTheme();

  useEffect(() => onStepChange?.(step, STEPS.length), [step, onStepChange]);

  useEffect(() => {
    const ref = setTimeout(() => setAnimClass(""), 400);
    return () => clearTimeout(ref);
  }, [step]);

  function setValue(id: string, v: string) {
    setValues((s) => {
      const next = { ...s, [id]: v };
      try {
        localStorage.setItem("onboarding-data", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function selectOption(id: string, option: string) {
    setValue(id, option);
    // auto advance for single selections
    if (step < STEPS.length - 1) {
      setAnimClass("animate-slide-left");
      setTimeout(() => setStep((s) => s + 1), 160);
    }
  }

  function next() {
    if (step < STEPS.length - 1) {
      setAnimClass("animate-slide-left");
      setStep((s) => s + 1);
    }
  }
  function prev() {
    if (step > 0) {
      setAnimClass("animate-slide-right");
      setStep((s) => s - 1);
    }
  }

  function finish() {
    // create a simple personality profile derived from identity and answers
    const identity = values["identity"] || "Bilge";
    const displayName = values["displayName"] || "Sen";

    const identityToDominant: Record<string, string> = {
      Sabırlı: "resilience",
      Cesur: "resilience",
      Girişimci: "curiosity",
      Samimi: "social",
      Bilge: "focus",
      Lider: "leadership",
    };

    const dominant = identityToDominant[identity] ?? "focus";

    const summary = `${displayName} — ${identity} bir yolcusun, vazgeçme!`;

    const daily = values["dailyHours"] || "3-4 saat";
    const recommendedPomodoro =
      daily === "7+ saat"
        ? { work: 50, short: 10, long: 30 }
        : daily === "5-6 saat"
        ? { work: 50, short: 10, long: 25 }
        : { work: 25, short: 5, long: 15 };

    const scores: Record<string, number> = {};
    scores[dominant] = 5;

    const profile: PersonalityProfile = {
      createdAt: new Date().toISOString(),
      scores,
      dominant,
      summary,
      recommendedPomodoro,
    };

    try {
      localStorage.setItem("personality-profile", JSON.stringify(profile));
      localStorage.setItem("personality-completed", "1");
      localStorage.setItem("onboarding-data", JSON.stringify(values));
      try {
        window.dispatchEvent(new CustomEvent("personality-updated", { detail: profile }));
      } catch {}
    } catch {}

    // set theme based on chosen identity
    const identityToTheme: Record<string, ThemeKey> = {
      Sabırlı: "sabir",
      Cesur: "cesur",
      Girişimci: "girisimci",
      Samimi: "samimi",
      Bilge: "bilge",
      Lider: "lider",
    };

    const chosen = identityToTheme[identity];
    if (chosen) setTheme(chosen);

    onComplete?.(profile);
  }

  const s = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/40 to-transparent p-4">
      <div className={"w-full max-w-lg bg-card rounded-3xl p-5 border shadow-lg " + (animClass || "animate-pop")}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold">{`Giriş Ekranı — ${step + 1}/${STEPS.length}`}</h3>
            <p className="text-sm text-muted-foreground">Bilgilerin uygulama deneyimini kişiselleştirmek için kullanılacaktır.</p>
          </div>
          <div className="text-sm text-muted-foreground">{new Array(step).fill(0).map((_, i) => "•")}</div>
        </div>

        <div className="mb-4">
          <div className={"p-4 rounded-xl border bg-background"}>
            <p className="font-medium text-lg text-center">{s.label}</p>

            <div className="mt-3">
              {s.kind === "text" ? (
                <input
                  value={values[s.id] ?? ""}
                  onChange={(e) => setValue(s.id, e.target.value)}
                  placeholder={s.label}
                  className="w-full px-3 py-2 rounded-xl border bg-background"
                />
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {s.options.map((opt) => {
                    const selected = values[s.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => selectOption(s.id, opt)}
                        className={
                          "w-full text-left px-4 py-3 rounded-lg border transition-colors " +
                          (selected ? "bg-primary text-primary-foreground" : "bg-background")
                        }
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {step > 0 && (
              <button onClick={prev} className="px-3 py-2 rounded-lg border mr-2">← Geri</button>
            )}
            {s.kind === "text" && step < STEPS.length - 1 && (
              <button onClick={next} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">İleri →</button>
            )}
          </div>

          <div>
            {step === STEPS.length - 1 && (
              <>
                <button onClick={onClose} className="px-3 py-2 rounded-lg border mr-2">Kapat</button>
                <button onClick={finish} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">Tamamla ✅</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
