import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MOTIVATIONS, UPLIFTINGS } from "@/data/quotes";
import { pickDailyIndex, pickRandomAndStore } from "@/lib/daily";

const STUDY_TECHNIQUES = [
  { id: "spaced", title: "Spaced Repetition", desc: "Tekrarları zamanla yayarak bilgiyi kalıcı hale getirme yöntemi." },
  { id: "testing_effect", title: "Testing Effect", desc: "Öğrendiklerinizi sınayarak daha kalıcı hale getirme yöntemi." },
  { id: "dual_coding", title: "Dual Coding", desc: "Metin ve görselleri birlikte kullanarak bilgiyi pekiştirme." },
  { id: "feynman", title: "Feynman Tekniği", desc: "Bir konuyu basitçe anlatarak eksikleri keşfetme yöntemi." },
  { id: "pomodoro", title: "Pomodoro", desc: "Kısa odak seansları ile süre yönetimi ve dikkat artırma." },
];

const LAWS = [
  { name: "Murphy Kanunu", text: "Eğer yanlış gidebilecek bir şey varsa, yanlış gidecektir. Sınav hazırlığında yedek planınız olsun: ekstra materyal, yedek notlar, ve teknik aksaklıklara karşı çözümler." },
  { name: "Parkinson Yasası", text: "İş, kendisine verilen zamanı doldurur. Süre sınırlamaları koyun, kısa ve net hedeflerle çalışın." },
  { name: "Pareto (80/20)", text: "Genelde sonuçların %80'i çabalarınızın %20'sinden gelir. En yüksek getirili konuları önceleyin." },
  { name: "Zeigarnik Etkisi", text: "Tamamlanmamış işler zihninizde daha çok yer edinir; küçük tamamlanabilir görevler yaratın ve bitirdikçe motivasyonunuz artar." },
];

const HISTORY_MAP: Record<string, string[]> = {
  "01-01": ["1801: Richard Trevithick ilk buhar lokomotifini icat etti."],
  "03-14": ["1879: Albert Einstein doğdu (14 Mart)."],
  "07-20": ["1969: Apollo 11 Ay'a iniş yaptı."],
};

function getHistoryForToday() {
  const d = new Date();
  const key = String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  return HISTORY_MAP[key] ?? ["Bugün tarihte önemli bir olay kaydedilmemiş. Ancak her gün öğrenmek için bir fırsattır."];
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"p-4 rounded-2xl border bg-card shadow-md transform transition-all hover:scale-[1.02] " + className}>
      <div className="flex items-start gap-3 mb-2">
        <div className="text-2xl">✨</div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export const StudyTechniquesCard: React.FC = () => {
  return (
    <Card className="animate-pop">
      <h3 className="font-semibold mb-2">Bilimsel Çalışma Teknikleri</h3>
      <p className="text-sm text-muted-foreground mb-3">Önemli tekniklerin isimleri ve kısa açıklamaları. Detayı görmek için isme dokun.</p>

      <ul className="space-y-2">
        {STUDY_TECHNIQUES.map((s, idx) => (
          <li key={s.id} className="flex items-start justify-between">
            <div>
              <Link to={`/teknikler#${s.id}`} className="font-medium text-base text-foreground hover:underline">
                {s.title}
              </Link>
              {idx < 2 && <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>}
            </div>
            <Link to={`/teknikler#${s.id}`} className="text-sm text-muted-foreground ml-4">Aç</Link>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center gap-2">
        <Link to="/teknikler" className="px-3 py-2 rounded-xl bg-primary text-primary-foreground">Tüm tekniklere gözat</Link>
        <Link to="/teknikler" className="text-sm text-muted-foreground">Detaylı rehber</Link>
      </div>
    </Card>
  );
};

export const HistoryTodayCard: React.FC = () => {
  const events = getHistoryForToday();
  return (
    <Card className="animate-slide-up">
      <h3 className="font-semibold mb-2">Tarihte Bugün</h3>
      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
        {events.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </Card>
  );
};

export const UpliftingCard: React.FC = () => {
  const key = "uplifting-daily-index";
  const [idx, setIdx] = useState(() => pickDailyIndex(UPLIFTINGS.length, key));
  useEffect(() => {
    // refresh if date changes
    const id = setInterval(() => {
      const current = pickDailyIndex(UPLIFTINGS.length, key);
      setIdx(current);
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  function randomize() {
    const n = pickRandomAndStore(UPLIFTINGS.length, key);
    setIdx(n);
  }

  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold mb-2">Kendini İyi Hisset</h3>
        <button onClick={randomize} className="text-xs px-2 py-1 rounded-md border">Değiştir</button>
      </div>
      <div className="flex items-center gap-3">
        <img src="https://media.giphy.com/media/l0HlJz2s5k0s7b9Wk/giphy.gif" alt="uplift" className="w-16 h-16 rounded-md" />
        <p className="text-lg">“{UPLIFTINGS[idx]}”</p>
      </div>
    </Card>
  );
};

export const MotivationCard: React.FC = () => {
  const key = "motivation-daily-index";
  const [idx, setIdx] = useState(() => pickDailyIndex(MOTIVATIONS.length, key));

  function randomize() {
    const n = pickRandomAndStore(MOTIVATIONS.length, key);
    setIdx(n);
  }

  return (
    <Card className="animate-pop">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold mb-2">Günün Motivasyonu</h3>
        <button onClick={randomize} className="text-xs px-2 py-1 rounded-md border">Değiştir</button>
      </div>
      <div className="flex items-center gap-3">
        <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="sparkle" className="w-16 h-16 rounded-md" />
        <p className="text-sm text-muted-foreground">{MOTIVATIONS[idx]} ✨</p>
      </div>
    </Card>
  );
};
