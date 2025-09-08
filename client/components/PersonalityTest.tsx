import React, { useState } from "react";

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
  { id: "resilience", text: "Zorluklarla karşılaştığımda tekrar denerim.", direction: "pos" },
  { id: "social", text: "Çalışmayı arkadaşlarımla tartışmak isterim.", direction: "pos" },
  { id: "structure", text: "Planlı ve programlı çalışırım.", direction: "pos" },
  { id: "curiosity", text: "Merakım beni ekstra araştırmaya iter.", direction: "pos" },
  { id: "stress", text: "Sınav kaygım performansımı etkiler.", direction: "neg" },
  { id: "leadership", text: "Sorumluluk almaktan hoşlanırım.", direction: "pos" },
];

export const PersonalityTest: React.FC<{ onComplete?: (p: PersonalityProfile) => void; onClose?: () => void }> = ({ onComplete, onClose }) => {
  const [answers, setAnswers] = useState<Record<string, number>>(() => ({}));
  const [step, setStep] = useState(0);

  function setAnswer(id: string, value: number) {
    setAnswers((s) => ({ ...s, [id]: value }));
  }

  function next() {
    if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
  }
  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  function finish() {
    // compute simple scores
    const scores: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const v = answers[q.id] ?? 3;
      const val = q.direction === "pos" ? v : 6 - v; // flip negatives
      scores[q.id] = val;
    }

    // derive dominant trait
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];

    // summary
    const summary = `Öne çıkan: ${dominant}. Senin için düzenli küçük hedefler ve kısa odak seansları öneriyorum.`;

    // recommend pomodoro
    const focusScore = scores["focus"] ?? 3;
    const recommendedPomodoro = focusScore >= 4 ? { work: 50, short: 10, long: 25 } : focusScore === 3 ? { work: 25, short: 5, long: 15 } : { work: 20, short: 5, long: 10 };

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
    } catch (e) {}

    onComplete?.(profile);
  }

  const q = QUESTIONS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-card rounded-2xl p-4 border">
        <h3 className="text-lg font-bold mb-2">Kısa Kişilik Testi</h3>
        <p className="text-sm text-muted-foreground mb-3">Bu test sana özel çalışma önerileri ve AI koç için başlangıç profili oluşturur. Yaklaşık 1-2 dakika.</p>

        <div className="mb-3">
          <p className="font-medium">{step + 1}. {q.text}</p>
          <div className="flex gap-2 mt-2 text-sm">
            {[1,2,3,4,5].map((v) => (
              <button
                key={v}
                onClick={() => setAnswer(q.id, v)}
                className={"px-3 py-2 rounded-full border " + ((answers[q.id] ?? 3) === v ? "bg-primary text-primary-foreground" : "bg-background")}
              >{v}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {step > 0 && <button onClick={prev} className="px-3 py-2 rounded-xl border mr-2">Geri</button>}
            {step < QUESTIONS.length - 1 && <button onClick={next} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground">İleri</button>}
          </div>
          <div>
            {step === QUESTIONS.length - 1 && (
              <>
                <button onClick={onClose} className="px-3 py-2 rounded-xl border mr-2">Kapat</button>
                <button onClick={finish} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground">Tamamla</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
