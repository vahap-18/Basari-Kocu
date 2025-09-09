import React from "react";

const STUDY_TECHNIQUES = [
  {
    title: "Spaced Repetition",
    desc: "Bilginin kalıcılığı için tekrarları zamanla artırın. Anki gibi araçlarla küçük tekrarlar yapın.",
  },
  {
    title: "Active Recall",
    desc: "Notları pasif okumak yerine sorulara cevap vermeye çalışın. Sınav benzeri sorular hazırlayın.",
  },
  {
    title: "Interleaving",
    desc: "Farklı konuları karıştırarak çalışın; bu, transfer yeteneğini artırır.",
  },
  {
    title: "Dual Coding",
    desc: "Metinleri grafiklerle eşleştirin (şemalar, tablolar) — iki kaynaktan öğrenme kalıcılığı artırır.",
  },
  {
    title: "Pomodoro",
    desc: "Kısa odak seanslarıyla dikkat dağılımını azaltın. İşlemi tekrarlayıp aralıkları ayarlayın.",
  },
  {
    title: "Feynman Tekniği",
    desc: "Konuyu basit bir dille birine anlatın; eksiklerinizi bu sayede keşfedin.",
  },
];

const UPLIFTING = [
  "Sen zaten buradasın — bu büyük bir adım.",
  "Her küçük ilerleme birikerek başarıya dönüşür.",
  "Hatalar öğretmendir; vazgeçme.",
  "Bugün kendin için çalışıyorsun; bu değerlidir.",
  "Konsantre olduğunda en iyi haline ulaşırsın.",
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
    <div className={"p-4 rounded-2xl border bg-card shadow-sm transform transition-all hover:scale-[1.02] " + className}>
      {children}
    </div>
  );
}

export const StudyTechniquesCard: React.FC = () => {
  return (
    <Card className="animate-pop">
      <h3 className="font-semibold mb-2">Bilimsel Çalışma Teknikleri</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {STUDY_TECHNIQUES.slice(0, 4).map((s) => (
          <li key={s.title} className="">
            <div className="font-medium">{s.title}</div>
            <div className="text-sm text-muted-foreground">{s.desc}</div>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-muted-foreground">Daha fazlası için Teknikler sayfasına gidin.</div>
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
  const idx = Math.floor(Date.now() / (1000 * 60 * 60)) % UPLIFTING.length; // rotates hourly
  return (
    <Card className="animate-fade-in">
      <h3 className="font-semibold mb-2">Kendini İyi Hisset</h3>
      <p className="text-lg">“{UPLIFTING[idx]}”</p>
    </Card>
  );
};
