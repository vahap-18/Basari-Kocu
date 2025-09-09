import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MOTIVATIONS, UPLIFTINGS } from "@/data/quotes";
import { pickDailyIndex, pickRandomAndStore } from "@/lib/daily";

const CATEGORIES: { title: string; items: { id: string; title: string }[] }[] = [
  {
    title: "🎯 Öğrenme ve Hafıza Kanunları",
    items: [
      { id: "ebbinghaus", title: "Ebbinghaus’un Unutma Eğrisi" },
      { id: "spacing", title: "Spacing Effect (Aralıklı Tekrar)" },
      { id: "testing_effect", title: "Testing Effect (Kendini Test Etme)" },
      { id: "primacy_recency", title: "Primacy & Recency (İlk ve Son Etkisi)" },
      { id: "miller", title: "Çalışma Belleği Sınırı (7±2 Kuralı – Miller)" },
      { id: "emotional_binding", title: "Duygusal Bağ Kurma İlkesi" },
    ],
  },
  {
    title: "⚡ Motivasyon ve Performans Kanunları",
    items: [
      { id: "yerkesdodson", title: "Yerkes-Dodson Yasası" },
      { id: "flow", title: "Flow Teorisi (Akış Hali)" },
      { id: "pareto", title: "Pareto İlkesi (80/20)" },
      { id: "parkinson", title: "Parkinson Yasası" },
      { id: "murphy", title: "Murphy Yasası" },
      { id: "selfdetermination", title: "Self-Determination Theory" },
    ],
  },
  {
    title: "⏳ Çalışma Teknikleri ve Odaklanma",
    items: [
      { id: "pomodoro", title: "Pomodoro Tekniği" },
      { id: "zeigarnik", title: "Zeigarnik Etkisi" },
      { id: "chunking", title: "Chunking (Bilgiyi parçalara bölmek)" },
      { id: "eisenhower", title: "Eisenhower Matrisi" },
      { id: "goalgradient", title: "Goal Gradient Effect" },
    ],
  },
  {
    title: "🧠 Psikoloji ve Gelişim İlkeleri",
    items: [
      { id: "growthmindset", title: "Carol Dweck – Growth Mindset" },
      { id: "kaizen", title: "Kaizen Felsefesi" },
      { id: "pavlov", title: "Pavlov – Koşullanma" },
      { id: "hebbian", title: "Hebbian Learning" },
      { id: "socratic", title: "Socratic Learning" },
    ],
  },
  {
    title: "🌍 Hayat ve Verimlilik Kanunları",
    items: [
      { id: "diminishing", title: "Law of Diminishing Returns" },
      { id: "occam", title: "Ockham’ın Usturası" },
      { id: "firstprinciples", title: "First Principles Thinking" },
      { id: "feynman", title: "Feynman Tekniği" },
      { id: "hawthorne", title: "Hawthorne Effect" },
      { id: "procrastination", title: "Procrastination Loop" },
      { id: "momentum", title: "Momentum İlkesi" },
      { id: "butterfly", title: "Butterfly Effect" },
    ],
  },
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
        <div className="w-10 h-10 rounded-md flex items-center justify-center text-xl font-semibold" style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}>✨</div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export const StudyTechniquesCard: React.FC = () => {
  const flat = CATEGORIES.flatMap((c) => c.items);
  const shown = flat.slice(0, 5);
  return (
    <Card className="animate-pop">
      <h3 className="font-semibold mb-2">Bilimsel Çalışma Teknikleri</h3>
      <p className="text-sm text-muted-foreground mb-3">Öne çıkan beş teknik — isme tıklayarak detay sayfasına atlayabilirsiniz.</p>

      <ul className="space-y-2">
        {shown.map((it) => (
          <li key={it.id} className="flex items-center justify-between">
            <Link to={`/teknikler#${it.id}`} className="text-sm text-foreground hover:underline">{it.title}</Link>
            <Link to={`/teknikler#${it.id}`} className="text-xs text-muted-foreground">Detay</Link>
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
