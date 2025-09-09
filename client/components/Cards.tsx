import React, { useEffect, useState } from "react";
import { MOTIVATIONS, UPLIFTINGS } from "@/data/quotes";
import { pickDailyIndex, pickRandomAndStore } from "@/lib/daily";

const STUDY_TECHNIQUES = [
  {
    title: "Spaced Repetition",
    desc: "Bilginin kalıcılığı için tekrarları zamanla artırın. Anki gibi araçlarla küçük, hedefe yönelik tekrarlar yapın. Hangi kartların zorlandığını takip edin ve zorlanılan konuları sık tekrar edin. (Çakışma: yoğun tekrar, öğrenme tükenmesine yol açarsa mola ve varyasyon ekleyin.)",
  },
  {
    title: "Active Recall",
    desc: "Bilgiyi hatırlamaya çalışarak öğrenin; notları pasif okumak yerine kendi sorularınızı yazın, cevaplayın ve yanlışları inceleyin. (Çakışma: sadece tekrar etmek yerine, anlamaya yönelik Feynman ile birleşince etkilidir.)",
  },
  {
    title: "Interleaving",
    desc: "Benzer konuları karıştırarak çalışmak, farklı problemlere uyum yeteneğinizi geliştirir. Uygulamada farklı soru tiplerini birleştirin. (Çakışma: başlangıçta zorlayıcı olabilir; temel öğrenme sonrası uygulayın.)",
  },
  {
    title: "Dual Coding",
    desc: "Kavramları metin + görsel ile eşleştirin: şemalar, zaman çizelgeleri, tablolar. Bu, bilgiyi farklı yollarla kodlamanızı sağlar. (Tamamlayıcı: Active Recall ile birlikte güçlü sonuç verir.)",
  },
  {
    title: "Pomodoro",
    desc: "Kısa odak seansları (25/5, 50/10 gibi) ile dikkat sürenizi artırın. Hedefe yönelik görevler belirleyip oturumları sayın. (Uyum: bazı kişiler daha uzun odak sürelerinde verimli olabilir.)",
  },
  {
    title: "Feynman Tekniği",
    desc: "Bir konuyu basit bir dille anlatmaya çalışın; kavramdaki boşlukları bu şekilde keşfedin. Öğretmek, en etkili öğrenme yöntemlerindendir.",
  },
  {
    title: "Self-Explanation",
    desc: "Çözerken her adımı kendinize açıklayın; bu zihinsel model kurmayı güçlendirir ve transferi destekler.",
  },
  {
    title: "Practice Testing",
    desc: "Gerçek sınav koşullarında düzenli denemeler yapın; sınav stratejileri, süre yönetimi ve yanlış analizine odaklanın.",
  },
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
      <p className="text-sm text-muted-foreground mb-3">Temel tekniklerin özetleri burada. Detaylı rehber için Teknikler sayfasına gidin.</p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {STUDY_TECHNIQUES.slice(0,3).map((s) => (
          <li key={s.title}>
            <div className="font-medium">• {s.title}</div>
            <div className="text-sm text-muted-foreground">{s.desc}</div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2">
        <a href="/teknikler" className="px-3 py-2 rounded-xl bg-primary text-primary-foreground">Tekniklere Git 🔎</a>
        <a href="/teknikler" className="text-sm text-muted-foreground">Tüm tekniklere gözat</a>
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
      <p className="text-lg">“{UPLIFTINGS[idx]}”</p>
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
      <p className="text-sm text-muted-foreground">{MOTIVATIONS[idx]}</p>
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
      <p className="text-lg">“{UPLIFTINGS[idx]}”</p>
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
      <p className="text-sm text-muted-foreground">{MOTIVATIONS[idx]}</p>
    </Card>
  );
};
