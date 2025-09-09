import React, { useEffect, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { AICoach } from "@/components/AICoach";
import { BarChart2, Sparkles, Star, Activity } from "lucide-react";

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
        setProfile(d ?? JSON.parse(String(localStorage.getItem("personality-profile"))));
      } catch {
        try { setProfile(JSON.parse(String(localStorage.getItem("personality-profile")))); } catch {}
      }
    };
    window.addEventListener("personality-updated", onUpdate as EventListener);
    return () => window.removeEventListener("personality-updated", onUpdate as EventListener);
  }, []);

  const scores = profile?.scores ?? null;

  function triggerAdvice() {
    try {
      window.dispatchEvent(new CustomEvent("personality-updated", { detail: profile }));
    } catch {}
  }

  return (
    <MobileLayout>
      <div className="space-y-6">
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
                  <button onClick={triggerAdvice} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground">Yeni Tavsiye</button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {profile?.dominant ? String(profile.dominant).slice(0,2).toUpperCase() : "?"}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Profil</div>
                  <div className="font-semibold capitalize">{profile?.dominant ?? "Henüz yok"}</div>
                  <div className="text-sm text-muted-foreground mt-1">{profile?.summary ?? "Kişilik testini tamamlayın, size özel öneriler oluşturulsun."}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Önerilen Pomodoro</div>
                  <div className="font-semibold mt-1">{profile?.recommendedPomodoro?.work ?? "25"} dk</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Breathing visual */}
        <section className="p-4 rounded-2xl border bg-gradient-to-br from-accent/10 to-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Nefes Egzersizi 4-4</h3>
              <p className="text-sm text-muted-foreground">Derin nefes al, ritmini bul. Zihnini sakinleştir.</p>
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
            <div className="text-xs text-muted-foreground">Profil bazlı öneriler</div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Odak</div>
                  <div className="font-semibold">{scores ? scores.focus : "—"} / 5</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border flex items-center gap-3">
                <Activity className="w-6 h-6 text-accent" />
                <div>
                  <div className="text-xs text-muted-foreground">Dayanıklılık</div>
                  <div className="font-semibold">{scores ? scores.resilience : "—"} / 5</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border">
              <h4 className="font-semibold mb-2">Kısa İpuçları</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>En zor konuları sabah saatlerine koyun.</li>
                <li>Pomodoro sürelerini profilinize göre ayarlayın.</li>
                <li>Günlük hedeflerinizi 2–3 maddede sınırlayın.</li>
                <li>Nefes egzersizleriyle dikkat toplama süresini %20 artırabilirsiniz.</li>
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
              <p className="text-sm text-muted-foreground mb-2">Kısa, güvenilir psikometrik ve bilişsel testlerle profilinizi derinleştirin. Her testi açıp tamamlayabilirsiniz.</p>

              <TestsSection />
            </div>
          </div>
        </section>

        {/* AI Coach */}
        <section className="p-4 rounded-2xl border">
          <AICoach />
        </section>
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
              onChange={(e) => e.target.checked && setGoals((arr) => arr.filter((_, idx) => idx !== i))}
            />
            <span className="text-sm">{g}</span>
          </li>
        ))}
        {goals.length === 0 && <li className="text-sm text-muted-foreground">Bugün bir hedef ekleyin.</li>}
      </ul>
    </div>
  );
}

function TestsSection() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [testsState, setTestsState] = useState<Record<string, any>>(() => {
    try { return JSON.parse(localStorage.getItem('scientific-tests') || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('scientific-tests', JSON.stringify(testsState));
    try { window.dispatchEvent(new CustomEvent('tests-updated', { detail: { type: 'scientific-tests', data: testsState } })); } catch {}
  }, [testsState]);

  function saveTest(key: string, payload: any) {
    setTestsState((s) => ({ ...s, [key]: { ...payload, updatedAt: new Date().toISOString() } }));
  }

  return (
    <div className="space-y-3">
      <TestCRT open={open} setOpen={setOpen} saveTest={saveTest} />
      <TestGrit open={open} setOpen={setOpen} saveTest={saveTest} />
      <Test2Back open={open} setOpen={setOpen} saveTest={saveTest} />
      <TestProcrastination open={open} setOpen={setOpen} saveTest={saveTest} />
    </div>
  );
}

function TestCRT({ open, setOpen, saveTest }: any) {
  const key = 'crt';
  const [answers, setAnswers] = useState<Record<number,string>>({});
  const questions = [
    { q: 'Bir beyzbol sopası ve top toplam 1.10 TL tutuyorsa ve sopa topdan 1 TL daha pahalıysa, top kaç TL\'dir?', a: '0.05' },
    { q: 'Bir gölette nilüferler her gün iki katına çıkıyor. Tamamı 48 günde doluyorsa, yarısı kaçıncı günde doludur?', a: '47' },
    { q: 'Bir makine 5 dakikada 5 parça yapıyorsa, 100 makine 100 dakikada kaç parça yapar?', a: '100' }
  ];

  function submit() {
    let score = 0;
    for (let i=0;i<questions.length;i++) { if ((answers[i]||'').trim() === questions[i].a) score++; }
    const interpretation = score === 3 ? 'Yüksek analitik düşünce.' : score === 2 ? 'İyi seviyede bilişsel refleks.' : 'Daha analitik düşünce egzersizleri faydalı olabilir.';
    saveTest(key, { name: 'Cognitive Reflection Test', score, scoreText: `${score}/${questions.length}`, interpretation, createdAt: new Date().toISOString() });
    setOpen((o:any)=>({ ...o, [key]: false }));
  }

  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Cognitive Reflection Test (CRT)</div>
          <div className="text-sm text-muted-foreground">Kısa üç soruluk refleks testi.</div>
        </div>
        <button onClick={() => setOpen((o:any)=>({ ...o, [key]: !o[key]}))} className="px-3 py-1 rounded-md border">{open[key] ? 'Gizle' : 'Başlat'}</button>
      </div>
      {open[key] && (
        <div className="mt-3 space-y-2">
          {questions.map((qq,i)=> (
            <div key={i}>
              <div className="text-sm font-medium">{i+1}. {qq.q}</div>
              <input value={answers[i]||''} onChange={(e)=> setAnswers(a=>({...a,[i]: e.target.value}))} className="w-full mt-1 px-3 py-2 rounded-md border bg-background" />
            </div>
          ))}
          <div className="flex justify-end">
            <button onClick={submit} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Gönder</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TestGrit({ open, setOpen, saveTest }: any) {
  const key = 'grit';
  const items = [
    'Uzun vadeli hedefler için gayret gösteririm.',
    'Hedeflerime ulaşmak için sabırlıyım.',
    'Zorluklar karşısında pes etmem.'
  ];
  const [answers, setAnswers] = useState<Record<number,number>>({});
  function submit(){
    const vals = Object.values(answers).map((v:any)=>Number(v)||1);
    const avg = Math.round((vals.reduce((a,b)=>a+b,0)/vals.length));
    const interpretation = avg >=4 ? 'Yüksek grit: hedef odaklı ve ısrarcı.' : avg ===3 ? 'Orta seviye grit.' : 'Daha fazla kararlılık çalışması faydalı olabilir.';
    saveTest(key, { name: 'Grit (Kısa)', score: avg, scoreText: `${avg}/5`, interpretation, createdAt: new Date().toISOString() });
    setOpen((o:any)=>({ ...o, [key]: false }));
  }
  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Grit Scale (Kısa)</div>
          <div className="text-sm text-muted-foreground">Kararlılık ve ısrar ölçümü (Likert 1-5).</div>
        </div>
        <button onClick={()=> setOpen((o:any)=>({...o,[key]: !o[key]}))} className="px-3 py-1 rounded-md border">{open[key] ? 'Gizle' : 'Başlat'}</button>
      </div>
      {open[key] && (
        <div className="mt-3 space-y-2">
          {items.map((it,i)=>(
            <div key={i}>
              <div className="text-sm">{it}</div>
              <select value={answers[i]||3} onChange={(e)=> setAnswers(a=>({...a,[i]: Number(e.target.value)}))} className="w-full mt-1 px-3 py-2 rounded-md border bg-background">
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          ))}
          <div className="flex justify-end">
            <button onClick={submit} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Tamamla</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Test2Back({ open, setOpen, saveTest }: any) {
  const key = '2back';
  const sequence = ['A','B','A','C','A']; // 2-back: positions matching 2 before: index2=A matches index0 A, index4=A matches index2 A => 2 targets
  const [answers, setAnswers] = useState<Record<number,boolean>>({});
  function submit(){
    let correct = 0;
    for (let i=0;i<sequence.length;i++){
      const target = i>=2 && sequence[i] === sequence[i-2];
      if ((answers[i] ? true : false) === target) correct++;
    }
    const interpretation = correct >= 4 ? 'Çok iyi çalışma belleği performansı.' : correct >=2 ? 'Orta seviye çalışma belleği.' : 'Çalışma belleğini güçlendirecek oyunlar faydalı.';
    saveTest(key, { name: '2-Back Kısa', score: correct, scoreText: `${correct}/${sequence.length}`, interpretation, createdAt: new Date().toISOString() });
    setOpen((o:any)=>({ ...o, [key]: false }));
  }
  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Çalışma Belleği (2-Back)</div>
          <div className="text-sm text-muted-foreground">Basit 2-back görevi — doğru eşleşmeleri işaretleyin.</div>
        </div>
        <button onClick={()=> setOpen((o:any)=>({...o,[key]: !o[key]}))} className="px-3 py-1 rounded-md border">{open[key] ? 'Gizle' : 'Başlat'}</button>
      </div>
      {open[key] && (
        <div className="mt-3 space-y-2">
          <div className="text-sm text-muted-foreground">Sıra: {sequence.join(' - ')}</div>
          <div>
            {sequence.map((s,i)=>(
              <label key={i} className="flex items-center gap-2">
                <input type="checkbox" checked={!!answers[i]} onChange={(e)=> setAnswers(a=>({...a,[i]: e.target.checked}))} />
                <span>{i+1}. {s}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={submit} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Tamamla</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TestProcrastination({ open, setOpen, saveTest }: any) {
  const key = 'procrast';
  const [val, setVal] = useState<number>(3);
  function submit(){
    const interpretation = val >=4 ? 'Yüksek erteleme eğilimi; mikrotask ve zaman sınırlaması faydalı.' : val===3 ? 'Orta seviye.' : 'Düşük erteleme eğilimi.';
    saveTest(key, { name: 'Procrastination (Kısa)', score: val, scoreText: `${val}/5`, interpretation, createdAt: new Date().toISOString() });
    setOpen((o:any)=>({ ...o, [key]: false }));
  }
  return (
    <div className="p-3 rounded-2xl border bg-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Erteleme Ölçeği (Kısa)</div>
          <div className="text-sm text-muted-foreground">Genel erteleme eğiliminizi değerlendirin (1-5).</div>
        </div>
        <button onClick={()=> setOpen((o:any)=>({...o,[key]: !o[key]}))} className="px-3 py-1 rounded-md border">{open[key] ? 'Gizle' : 'Başlat'}</button>
      </div>
      {open[key] && (
        <div className="mt-3 space-y-2">
          <div className="text-sm">Genelde görevleri son ana bırakırım.</div>
          <input type="range" min={1} max={5} value={val} onChange={(e)=> setVal(Number(e.target.value))} className="w-full" />
          <div className="flex justify-end">
            <button onClick={submit} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground">Kaydet</button>
          </div>
        </div>
      )}
    </div>
  );
}
