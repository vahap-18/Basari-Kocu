import React, { useEffect, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";

const TECHNIQUES = [
  {
    id: "spaced",
    title: "Aralıklı Tekrar (Spaced Repetition)",
    emoji: "🔁",
    difficulty: "Orta",
    time: "Günlük (kısa tekrarlar)",
    description: "Bilginin uzun süreli kalıcılığını sağlamak için tekrarleri zamanla yaymak. Anki veya benzeri kart uygulamaları ile zorlandığınız kartları daha sık gösterin.",
    tips: [
      "Küçük, hedefe yönelik tekrar oturumları planlayın.",
      "Zor konuları daha sık tekrar edin.",
      "Günlük 15–30 dakika yeterli olabilir."
    ],
    conflicts: "Aşırı tekrar tükenmeye yol açabilir; mola ve farklı tekniklerle dengeleyin."
  },
  {
    id: "ebbinghaus",
    title: "Ebbinghaus’un Unutma Eğrisi",
    emoji: "📉",
    difficulty: "Kolay",
    time: "Tekrarlamalar: ilk 24 saat kritik",
    description: "Öğrenilen bilginin zamanla hızla unutulduğunu gösterir; erken tekrarlar bilgiyi kurtarmak için çok etkili.",
    tips: ["İlk 24 saatte kısa tekrar yapın.", "İlk haftada birkaç tekrar planlayın.", "Süreleri giderek artırın."],
    conflicts: "Tekrarlar zaman yönetimi gerektirir."
  },
  {
    id: "testing_effect",
    title: "Testing Effect (Test Etme Etkisi)",
    emoji: "🧪",
    difficulty: "Kolay-Orta",
    time: "Her çalışma oturumunda kısa testler",
    description: "Öğrendiklerinizi kendinize test ederek hatırlamak, sadece okumaktan daha kalıcıdır. Deneme sınavları ve kısa quizler kullanın.",
    tips: ["Küçük quizler yapın.", "Yanlışları not edip tekrar edin."],
    conflicts: "Sürekli test etme morali bozabilir; dengeli kullanın."
  },
  {
    id: "flow",
    title: "Flow (Akış) Teorisi",
    emoji: "🌊",
    difficulty: "Zor",
    time: "Odak blokları boyunca",
    description: "Zorluk seviyesi ile beceri seviyesinin dengede olduğu durumda kişinin tamamen odaklandığı durum (akış) oluşur; bu öğrenme için idealdir.",
    tips: ["Görevleri zorluk seviyesine göre ayarlayın.", "Dikkat dağıtıcıları en aza indirin."],
    conflicts: "Akışa girmek enerji ve hazırlanma gerektirir."
  },
  {
    id: "primacy_recency",
    title: "Primacy & Recency Etkileri",
    emoji: "🧾",
    difficulty: "Kolay",
    time: "Ders/oturum planlaması",
    description: "İlk ve son öğrenilen bilgilerin daha iyi hatırlandığını gösterir. Önemli konuları bu pozisyonlara koyun.",
    tips: ["Günün en önemli konusu ilk ya da son sırada olsun."],
    conflicts: "Uzun oturumlarda etkisi azalabilir."
  },
  {
    id: "dual_coding",
    title: "Dual Coding (Çift Kodlama)",
    emoji: "🖼️",
    difficulty: "Kolay",
    time: "Her konu için 1–2 şema",
    description: "Metin ve görselleri birlikte kullanın (şemalar, tablolar). Farklı kodlama yolları bilgiyi pekiştirir.",
    tips: ["Ana fikirleri şemalara dökün.", "Zor olan kavramları grafiğe çevirin."],
    conflicts: "Görsel hazırlamak zaman alabilir; öz ve hedefe yönelik görseller kullanın."
  },
  {
    id: "feynman",
    title: "Feynman Tekniği",
    emoji: "🗣️",
    difficulty: "Kolay",
    time: "Kısa (10–20 dk)",
    description: "Bir konuyu basit bir dille anlatın; eksiklerinizi tespit edin ve düzeltin.",
    tips: ["Boş bir sayfaya anlatın.", "Basit örnekler kullanın."],
    conflicts: "Yalnız yapılırsa geri bildirim eksik olabilir; grup ile denemek faydalı."
  },
  {
    id: "pomodoro",
    title: "Pomodoro",
    emoji: "⏳",
    difficulty: "Kolay",
    time: "25/5 veya 50/10 önerilir",
    description: "Kısa odak seansları ile dikkat sürdürün. Kendi veriminize göre süreleri ayarlayın.",
    tips: ["Net görev belirleyin.", "Her 4 oturumda uzun mola verin."],
    conflicts: "Bazı kişiler daha uzun bloklarda daha verimli olabilir; deneyin ve ayarlayın."
  }
];

const LAWS = [
  { id: 'murphy', title: 'Murphy Kanunu', emoji: '⚠️', difficulty: 'Kolay', description: 'Eğer yanlış gidebilecek bir şey varsa, yanlış gider. Sınav hazırlığında yedek planlarınız olsun: cihaz, materyal, internet sorunlarına karşı alternatifler.' , usage: ['Sınav günü için B planı hazırlayın.','Dijital dosyaları yedekleyin.'], challenges: 'Hazırlık için ekstra zaman gerektirir.' },
  { id: 'parkinson', title: "Parkinson Yasası", emoji: '⏳', difficulty: 'Kolay', description: 'İş, kendisine verilen zamanı doldurur. Zaman sınırlamaları koyun; kısa ve net hedefler belirleyin.', usage: ['Göreve süre sınırı koyun.','Zaman kutucukları ile çalışın.'], challenges: 'Sert zaman sınırlamaları bazen stres yaratabilir.' },
  { id: 'pareto', title: 'Pareto (80/20)', emoji: '🎯', difficulty: 'Orta', description: 'Genelde sonuçların %80’i, çabaların %20’sinden gelir. Öncelikli konulara odaklanın.', usage: ['Kritik konuları belirleyin.','Zafiyet analizi yapın.'], challenges: 'Öncelik belirleme öznel olabilir.' },
  { id: 'zeigarnik', title: 'Zeigarnik Etkisi', emoji: '🔔', difficulty: 'Kolay', description: 'Tamamlanmamış işler zihinde daha çok yer eder; küçük tamamlanabilir görevlerle motivasyon sağlayın.', usage: ['Görevleri küçük parçalara bölün.','Bir kısmını tamamlayıp bırakın, geri dönün.'], challenges: 'Parçalama yanlış uygulandığında verimsizlik olabilir.' },
  { id: 'thorndike', title: 'Thorndike: Hazırbulunuşluk, Tekrar, Etki', emoji: '📚', difficulty: 'Kolay', description: 'Hazırbulunuşluk: Öğrenci hazırsa öğrenme kolaylaşır. Tekrar: Tekrar edilen bilgi güçlenir. Etki: Keyif veren öğrenme daha kalıcıdır.', usage: ['Hazırsa zorlu görev verin.','Tekrarı düzenli hale getirin.','Ödüllendirici öğrenme deneyimleri tasarlayın.'], challenges: 'Hazırbulunuşluk ölçümü zordur.' },
  { id: 'yerkesdodson', title: 'Yerkes–Dodson Yasası', emoji: '⚖️', difficulty: 'Orta', description: 'Orta düzeyde uyarılma öğrenmeyi artırır; çok düşük veya çok yüksek uyarılma verimi düşürür.', usage: ['Stres yönetimi çalışmaları ekleyin.','Simülasyon sınavlarla uygun uyarılma seviyesini test edin.'], challenges: 'İdeal uyarılma kişiden kişiye değişir.' }
];

export default function TekniklerPage() {
  const [openTech, setOpenTech] = useState<Record<string, boolean>>({});
  const [openLaw, setOpenLaw] = useState<Record<string, boolean>>({});

  return (
    <MobileLayout>
      <div className="space-y-4">
        <header className="p-3">
          <h1 className="text-xl font-bold">Bilimsel Çalışma Teknikleri</h1>
          <p className="text-sm text-muted-foreground">Detaylı açıklamalar, kullanım önerileri, zorluk seviyeleri ve pratik ipuçları. Her tekniği açarak detayları görün.</p>
        </header>

        <section className="space-y-3">
          {TECHNIQUES.map((t) => (
            <article key={t.id} className="p-4 rounded-2xl border bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{t.emoji} {t.title}</div>
                  <div className="text-xs text-muted-foreground">Zorluk: {t.difficulty} • Süre: {t.time}</div>
                </div>
                <button onClick={() => setOpenTech((o) => ({ ...o, [t.id]: !o[t.id]}))} className="px-3 py-1 rounded-md border text-sm">{openTech[t.id] ? 'Gizle' : 'Detay'}</button>
              </div>
              {openTech[t.id] && (
                <div className="mt-3 text-sm text-muted-foreground space-y-2">
                  <div>{t.description}</div>
                  <div>
                    <div className="font-medium">İpuçları</div>
                    <ul className="list-disc pl-5">
                      {t.tips.map((p:any,i:number)=>(<li key={i}>{p}</li>))}
                    </ul>
                  </div>
                  <div className="text-xs text-muted-foreground">Çakışma / Zorluk: {t.conflicts}</div>
                </div>
              )}
            </article>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">Sınava Hazırlık Kanunları</h2>
          <div className="space-y-3">
            {LAWS.map((l) => (
              <article key={l.id} className="p-4 rounded-2xl border bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{l.emoji} {l.title}</div>
                    <div className="text-xs text-muted-foreground">Zorluk: {l.difficulty}</div>
                  </div>
                  <button onClick={() => setOpenLaw((o) => ({ ...o, [l.id]: !o[l.id]}))} className="px-3 py-1 rounded-md border text-sm">{openLaw[l.id] ? 'Gizle' : 'Detay'}</button>
                </div>
                {openLaw[l.id] && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    <div className="mb-2">{l.description}</div>
                    <div className="font-medium">Nasıl Kullanılır?</div>
                    <ul className="list-disc pl-5 mb-2">
                      {l.usage.map((u:any,i:number)=>(<li key={i}>{u}</li>))}
                    </ul>
                    <div className="text-xs text-muted-foreground">Zorluklar: {l.challenges}</div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
