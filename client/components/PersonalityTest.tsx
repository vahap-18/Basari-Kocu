import React, { useState } from "react";

import React, { useEffect, useMemo, useState } from "react";

export type PersonalityProfile = {
  createdAt: string;
  scores: Record<string, number>;
  dominant: string;
  summary: string;
  recommendedPomodoro: { work: number; short: number; long: number };
};

const QUESTIONS: { id: string; text: string; direction: string }[] = [
  { id: "focus", text: "Uzun süre tek bir işe odaklanırım.", direction: "pos" },
  { id: "procrastinate", text: "Çalışmayı ertelerim.", direction: "neg" },
  {
    id: "resilience",
    text: "Zorluklarla karşılaştığımda tekrar denerim.",
    direction: "pos",
  },
  {
    id: "social",
    text: "Çalışmayı arkadaşlarımla tartışmak isterim.",
    direction: "pos",
  },
  { id: "structure", text: "Planlı ve programlı çalışırım.", direction: "pos" },
  {
    id: "curiosity",
    text: "Merakım beni ekstra araştırmaya iter.",
    direction: "pos",
  },
  {
    id: "stress",
    text: "Sınav kaygım performansımı etkiler.",
    direction: "neg",
  },
  {
    id: "leadership",
    text: "Sorumluluk almaktan hoşlanırım.",
    direction: "pos",
  },
];

export const PersonalityTest: React.FC<{
  onComplete?: (p: PersonalityProfile) => void;
  onClose?: () => void;
  examMode?: boolean;
  onStepChange?: (step: number, total: number) => void;
}> = ({ onComplete, onClose, examMode = false, onStepChange }) => {
  const [answers, setAnswers] = useState<Record<string, number>>(() => ({}));
  const [step, setStep] = useState(0);
  const [animClass, setAnimClass] = useState<string>("animate-pop");

  function setAnswer(id: string, value: number) {
    setAnswers((s) => ({ ...s, [id]: value }));
    // auto advance in exam mode
    if (examMode) {
      setAnimClass("animate-slide-left");
      setTimeout(() => {
        if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
        else finish();
      }, 220);
      setTimeout(() => setAnimClass(""), 500);
    }
  }

  function next() {
    if (step < QUESTIONS.length - 1) {
      setAnimClass("animate-slide-left");
      setStep((s) => s + 1);
      setTimeout(() => setAnimClass(""), 500);
    }
  }
  function prev() {
    if (step > 0) {
      setAnimClass("animate-slide-right");
      setStep((s) => s - 1);
      setTimeout(() => setAnimClass(""), 500);
    }
  }

  // expose step changes
  React.useEffect(() => {
    onStepChange?.(step, QUESTIONS.length);
  }, [step, onStepChange]);

  // keep a ref for step to avoid re-registering keyboard listener on every render
  const stepRef = React.useRef(step);
  React.useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // keyboard navigation for exam mode (stable listener)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (/^[1-5]$/.test(e.key)) {
        const v = Number(e.key);
        const q = QUESTIONS[stepRef.current];
        if (q) setAnswer(q.id, v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function finish() {
    const scores: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const v = answers[q.id] ?? 3;
      const val = q.direction === "pos" ? v : 6 - v;
      scores[q.id] = val;
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];

    const summary = {
      focus:
        "Odaklı, uzun süre konsantre olabilirsin. Uzun çalışma blokları senin için etkili olabilir. 🧠",
      procrastinate:
        "Erteleme eğilimi var; küçük hedefler ve zaman sınırlamaları işe yarar. ⏳",
      resilience:
        "Zorluklara karşı dirençlisin; zor konularda ısrar etmelisin. 💪",
      social:
        "Grupla tartışarak ö��renme verimli; çalışma grupları faydalı olabilir. 🤝",
      structure:
        "Planlı çalışıyorsun; liste ve programlar verimliliği artırır. 📋",
      curiosity:
        "Meraklısın; keşfetme ve derinlemesine araştırma seni besler. 🔎",
      stress:
        "Kaygı sınav performansını etkileyebilir; nefes çalışmaları ve simülasyon sınavları yardımcı olur. 🌬️",
      leadership:
        "Sorumluluk almaktan hoşlanıyorsun; grup liderliği ve öğretme seni motive eder. 🌟",
    } as Record<string, string>;

    const profileSummary = summary[dominant] ?? `Öne çıkan: ${dominant}`;

    const focusScore = scores["focus"] ?? 3;
    const recommendedPomodoro =
      focusScore >= 4
        ? { work: 50, short: 10, long: 25 }
        : focusScore === 3
          ? { work: 25, short: 5, long: 15 }
          : { work: 20, short: 5, long: 10 };

    const profile: PersonalityProfile = {
      createdAt: new Date().toISOString(),
      scores,
      dominant,
      summary: profileSummary,
      recommendedPomodoro,
    };

    try {
      localStorage.setItem("personality-profile", JSON.stringify(profile));
      localStorage.setItem("personality-completed", "1");
      try {
        window.dispatchEvent(
          new CustomEvent("personality-updated", { detail: profile }),
        );
      } catch {}
    } catch (e) {}

    onComplete?.(profile);
  }

  const q = QUESTIONS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/40 to-transparent p-4">
      <div
        className={
          "w-full max-w-lg bg-card rounded-3xl p-5 border shadow-lg " +
          (animClass || "animate-pop")
        }
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold">
              {examMode
                ? `Sınav — ${step + 1}/${QUESTIONS.length}`
                : `Kişilik Testi — ${step + 1}/${QUESTIONS.length} ✨`}
            </h3>
            {!examMode && (
              <p className="text-sm text-muted-foreground">
                Her soru ayrı kartta — kısa ve animasyonlu. Tamamlandığında
                kişisel stratejin hazırlanır.
              </p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {new Array(step).fill(0).map((_, i) => "•")}
          </div>
        </div>

        <div className="mb-4">
          <div
            className={
              "p-4 rounded-xl border " +
              (examMode ? "bg-transparent" : "bg-background")
            }
          >
            <p className="font-medium text-lg text-center">{q.text}</p>
            <div
              className={
                "flex gap-2 mt-3 text-sm " + (examMode ? "justify-center" : "")
              }
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setAnswer(q.id, v)}
                  className={
                    "flex-1 px-4 py-3 rounded-lg border text-center mx-1 transition-colors " +
                    ((answers[q.id] ?? 3) === v
                      ? "bg-primary text-primary-foreground"
                      : "bg-background")
                  }
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {step > 0 && (
              <button
                onClick={prev}
                className="px-3 py-2 rounded-lg border mr-2"
              >
                ← Geri
              </button>
            )}
            {!examMode && step < QUESTIONS.length - 1 && (
              <button
                onClick={next}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                İleri →
              </button>
            )}
          </div>
          <div>
            {step === QUESTIONS.length - 1 && (
              <>
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg border mr-2"
                >
                  Kapat
                </button>
                <button
                  onClick={finish}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                >
                  {examMode ? "Tamamla" : "Testi Tamamla ✅"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
