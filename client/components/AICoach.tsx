import React, { useEffect, useState } from "react";
import { PersonalityProfile } from "./PersonalityTest";

function loadProfile(): PersonalityProfile | null {
  try {
    const v = localStorage.getItem("personality-profile");
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

function generateAdvice(profile: PersonalityProfile | null) {
  if (!profile) return ["Kişilik testini tamamla, sana özel tavsiyeler burada görünecek."];
  const adv: string[] = [];
  const s = profile.scores;
  if (s.focus >= 4) adv.push("Uzun odak seanslarında başarılısın — 50 dk çalışma + 10 dk mola deneyebilirsin.");
  else if (s.focus === 3) adv.push("Orta seviye odak; 25 dk çalışma + 5 dk mola iyi gelir.");
  else adv.push("Kısa ve sık seanslar (20 dk) verimli olabilir. Dikkat dağılması için çevrenizi düzenleyin.");

  if (s.procrastinate <= 2) adv.push("Erteleme eğilimlerin düşük; hedeflerini büyütebilirsin.");
  else if (s.procrastinate <= 4) adv.push("Bazen erteleme oluyor; Pomodoro başlangıcında 1 küçük ödül belirle.");
  else adv.push("Erteleme yüksek; günlük küçük görevlerle (2–3) başla ve başarı hissini kullan.");

  if (s.resilience >= 4) adv.push("Zorluklara karşı dayanıklısın; zor konuları sabah saatlerine koy.");
  if (s.curiosity >= 4) adv.push("Merakın güçlü; konuları sorgulayarak not al ve bağlantılar kur.");

  return adv;
}

export const AICoach: React.FC = () => {
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);
  const [messages, setMessages] = useState<{ from: "coach" | "user"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [autoTips, setAutoTips] = useState(() => localStorage.getItem("coach-auto") !== "0");

  useEffect(() => {
    setProfile(loadProfile());
    const onUpdate = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as any;
        setProfile(detail ?? loadProfile());
      } catch {
        setProfile(loadProfile());
      }
    };
    window.addEventListener("personality-updated", onUpdate as EventListener);
    return () => window.removeEventListener("personality-updated", onUpdate as EventListener);
  }, []);

  useEffect(() => {
    localStorage.setItem("coach-auto", autoTips ? "1" : "0");
  }, [autoTips]);

  useEffect(() => {
    // seed initial advice
    const adv = generateAdvice(profile);
    setMessages((m) => [{ from: "coach", text: adv.join(" ") }, ...m]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [{ from: "user", text }, ...m]);
    // simple rule-based reply
    const lower = text.toLowerCase();
    let reply = "Bunu nasıl uygulayacağını adım adım söyleyebilirim.";
    if (lower.includes("program") || lower.includes("plan")) {
      const rec = profile?.recommendedPomodoro ?? { work: 25, short: 5, long: 15 };
      reply = `Senin için öneri: ${rec.work}dk odak, ${rec.short}dk kısa mola. Günlük hedefleri 3-4 maddede tut.`;
    } else if (lower.includes("motivation") || lower.includes("motiv")) {
      reply = "Kendine küçük ödüller koy, sabit bir başlangıç rutini (5 dk) uygula.";
    } else if (lower.includes("focus") || lower.includes("dikkat")) {
      reply = "Dış uyarıcıları azalt, telefonunu başka bir odada bırak veya bildirimleri sessize al.";
    }

    setTimeout(() => {
      setMessages((m) => [{ from: "coach", text: reply }, ...m]);
    }, 600);

    setInput("");
  }

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-2xl border bg-gradient-to-br from-accent/10 to-card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">AI Koç</h3>
            <p className="text-sm text-muted-foreground">Kişilik testine göre sana özel öneriler sunar.</p>
          </div>
          <div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={autoTips} onChange={(e) => setAutoTips(e.target.checked)} />
              Günlük ipuçları
            </label>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl border bg-card">
        <div className="space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={m.from === "coach" ? "text-sm bg-secondary/10 p-2 rounded-lg" : "text-sm text-right p-2"}>
              <div>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Sorunuzu yazın..." className="flex-1 px-3 py-2 rounded-xl border bg-background" />
          <button onClick={handleSend} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Gönder</button>
        </div>
      </div>
    </div>
  );
};
