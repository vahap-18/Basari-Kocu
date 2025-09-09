import React, { useState } from "react";

export const CoachOnboarding: React.FC<{ onComplete: (profile: any) => void; onClose?: () => void }> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(0);
  const [when, setWhen] = useState<string>("morning");
  const [session, setSession] = useState<number>(25);
  const [struggle, setStruggle] = useState<string>("focus");

  function finish() {
    const profile = {
      onboarding: { when, session, struggle },
      dominant: struggle === 'procrastination' ? 'Zorluk: Erteleme' : struggle === 'memory' ? 'Zorluk: Hafıza' : 'Odaklı',
      summary:
        struggle === 'procrastination'
          ? 'Erteleme eğiliminiz var; kısa hedefler ve zaman blokları işe yarar.'
          : struggle === 'memory'
          ? 'Hafıza odaklı stratejiler (aralıklı tekrar) faydalı olacaktır.'
          : 'Odak sürenizi optimize edin; Pomodoro ve çevresel düzenleme işe yarar.',
      recommendedPomodoro: { work: session },
    };
    try {
      localStorage.setItem('coach-onboard', '1');
      localStorage.setItem('personality-profile', JSON.stringify(profile));
    } catch {}
    try { window.dispatchEvent(new CustomEvent('personality-updated', { detail: profile })); } catch {}
    onComplete(profile);
  }

  const steps = [
    {
      title: 'Ne zaman daha verimli çalışıyorsun?',
      options: [
        { key: 'morning', label: 'Sabah' },
        { key: 'afternoon', label: 'Öğleden sonra' },
        { key: 'evening', label: 'Akşam' },
      ],
    },
    {
      title: 'Tercih ettiğin oturum uzunluğu?',
      options: [
        { key: 25, label: '25 dk' },
        { key: 50, label: '50 dk' },
        { key: 90, label: '90 dk' },
      ],
    },
    {
      title: 'En çok zorlandığın şey nedir?',
      options: [
        { key: 'focus', label: 'Odaklanma' },
        { key: 'procrastination', label: 'Erteleme' },
        { key: 'memory', label: 'Hafıza' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-card rounded-2xl border shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Kısa Tanışma</h3>
            <p className="text-sm text-muted-foreground">Size daha iyi tavsiye verebilmem için birkaç kısa soru.</p>
          </div>
          <button onClick={() => onClose && onClose()} className="px-3 py-1 rounded-xl border">Kapat</button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="font-medium mb-2">{steps[step].title}</div>
            <div className="grid grid-cols-3 gap-2">
              {steps[step].options.map((opt:any) => {
                const active = step === 0 ? when === opt.key : step === 1 ? session === opt.key : struggle === opt.key;
                return (
                  <button
                    key={String(opt.key)}
                    onClick={() => {
                      if (step === 0) setWhen(opt.key);
                      if (step === 1) setSession(opt.key as number);
                      if (step === 2) setStruggle(opt.key as string);
                    }}
                    className={"px-3 py-2 rounded-xl border " + (active ? 'bg-primary text-primary-foreground' : 'bg-background')}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="px-3 py-2 rounded-xl border">Geri</button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">İleri</button>
            ) : (
              <button onClick={finish} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Tamamla</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
