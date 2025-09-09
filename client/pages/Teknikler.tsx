import React, { useEffect, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";

const TECHNIQUES = [
  // 1-6 Learning & Memory
  {
    id: "ebbinghaus",
    title: "Ebbinghaus’un Unutma Eğrisi",
    emoji: "📉",
    difficulty: "Kolay",
    time: "İlk 24 saat kritik",
    story:
      "Sınavdan sonra bir öğrenci notlarını gözden geçirmeyince bir hafta içinde büyük kısmını unuttu.",
    what: "Zamanla unutma hızını gösteren eğri; erken tekrarlar bilgiyi kurtarır.",
    how: [
      "İlk 24 saatte kısa tekrar yap.",
      "İlk haftada birkaç tekrar planla.",
      "Aralıklı tekrar çizelgesi oluştur.",
    ],
    motivation:
      "Küçük tekrarlar, büyük kazanç sağlar — hemen tekrar et ve unutmayı yavaşlat.",
    visual: { icon: "📉", color: "#FF6B6B", shape: "line-chart" },
  },
  {
    id: "spacing",
    title: "Spacing Effect (Aralıklı Tekrar)",
    emoji: "🔁",
    difficulty: "Orta",
    time: "Günlük kısa tekrarlar",
    story:
      "Düzenli aralıklarla çalı��arak aynı bilgiyi daha iyi hatırlayan öğrenciler gördün mü?",
    what: "Tekrarları zaman içinde yayarak bilginin uzun süreli kalıcılığını artırma.",
    how: [
      "Kısa, hedefe yönelik tekrar oturumları planla.",
      "Zor konuları daha sık tekrarla.",
      "Anki gibi araç kullan.",
    ],
    motivation:
      "Az ama düzenli tekrar, unutmayı durdurur — küçük adımlarla kalıcı öğrenme.",
    visual: { icon: "🔁", color: "#4F46E5", shape: "repeat" },
  },
  {
    id: "testing_effect",
    title: "Testing Effect (Kendini Test Etme)",
    emoji: "🧪",
    difficulty: "Kolay-Orta",
    time: "Her oturumda kısa quiz",
    story:
      "Bir grup öğrenci sadece okunaklı notlar yerine küçük self-test uyguladı ve daha iyi performans gösterdi.",
    what: "Öğrendiklerini test ederek hatırlamayı güçlendirme etkisi.",
    how: [
      "Kısa quizler hazırla.",
      "Yanlışları not edip tekrar et.",
      "Gerçek sınav koşullarını taklit et.",
    ],
    motivation:
      "Kendini test etmek, gerçek ilerlemeyi gösterir — hata yapmaktan korkma, onlardan öğren.",
    visual: { icon: "🧪", color: "#059669", shape: "checklist" },
  },
  {
    id: "primacy_recency",
    title: "Primacy & Recency (İlk ve Son Etkisi)",
    emoji: "🧾",
    difficulty: "Kolay",
    time: "Ders/oturum planlaması",
    story:
      "En önemli noktaları dersin başına veya sonuna koyan bir öğrenci, sınavda daha iyi hatırladı.",
    what: "İlk ve son öğrenilen bilgilerin daha iyi hatırlandığı etkisi.",
    how: [
      "Kritik konuları oturum başı/sonuna yerleştir.",
      "Önemli notları tekrarında vurgula.",
    ],
    motivation: "Doğru yerleştirme ile hatırlama şansını artırırsın.",
    visual: { icon: "🧾", color: "#F59E0B", shape: "bookmark" },
  },
  {
    id: "miller",
    title: "Çalışma Belleği Sınırı (7±2 Kuralı – Miller)",
    emoji: "📦",
    difficulty: "Kolay",
    time: "Kısa (örnekleme)",
    story:
      "Uzun bilgi yığınlarını tek seferde anlamaya çalışmak zor olabilir; bilgiyi parçalara bölmek işleri kolaylaştırır.",
    what: "İnsanların kısa süreli belleğinin sınırlı olduğunu (yaklaşık 7±2 birim) öne süren kural.",
    how: [
      "Bilgiyi küçük parçalara böl (chunking).",
      "Tek bir seferde çok fazla bilgi verme.",
    ],
    motivation: "Parçala ve fethet — küçük adımlar büyük ilerleme getirir.",
    visual: { icon: "📦", color: "#EF4444", shape: "grid" },
  },
  {
    id: "emotional_binding",
    title: "Duygusal Bağ Kurma İlkesi",
    emoji: "❤️",
    difficulty: "Orta",
    time: "Uygulama odaklı",
    story:
      "Bir öğrenci öğrenirken örneklerle duygusal bağlantı kurunca bilgi daha kalıcı hale geldi.",
    what: "Duygu ile bağlantılı öğrenme, bilgiyi daha güçlü ve kalıcı kılar.",
    how: [
      "Konuya kişisel örnekler bağla.",
      "Anlatırken duygusal çağrışımlar kullan.",
    ],
    motivation: "Duyguyla bağlanınca öğrenme daha anlamlı olur.",
    visual: { icon: "❤️", color: "#EC4899", shape: "heart" },
  },

  // 7-12 Motivation & Performance
  {
    id: "yerkesdodson",
    title: "Yerkes–Dodson Yasası",
    emoji: "⚖️",
    difficulty: "Orta",
    time: "Stres yönetimi çalışmaları",
    story:
      "Çok stresli ya da çok rahat bir öğrenci, performansında düşüş yaşadı; orta düzeyde uyarılma en iyisiydi.",
    what: "Uyarılma (stres) ile performans arasında ters U şeklinde ilişki vardır.",
    how: [
      "Stres yönetimi teknikleri uygula.",
      "Simülasyon sınavlarda uygun uyarılma seviyesini test et.",
    ],
    motivation:
      "Orta düzeyde gerilim, seni en iyi performansa taşır — dengeyi bul.",
    visual: { icon: "⚖️", color: "#64748B", shape: "gauge" },
  },
  {
    id: "flow",
    title: "Flow Teorisi (Akış Hali)",
    emoji: "🌊",
    difficulty: "Zor",
    time: "Odak blokları boyunca",
    story:
      "Tam konsantre olduğunda bir öğrenci saatlerce verimli çalışabildi; zorluk ve beceri dengedeydi.",
    what: "Beceri ve zorluk dengelendiğinde ortaya çıkan derin odaklanma hali.",
    how: ["Görevleri becerine göre ayarla.", "Dikkat dağıtıcıları kaldır."],
    motivation:
      "Akış, derin öğrenme için ideal bir yoldur — hazır olduğunda ona gir.",
    visual: { icon: "🌊", color: "#06B6D4", shape: "wave" },
  },
  {
    id: "pareto",
    title: "Pareto İlkesi (80/20 Kuralı)",
    emoji: "🎯",
    difficulty: "Orta",
    time: "Analiz ve önceliklendirme",
    story:
      "Sınav hazırlarken küçük bir konu setinin büyük başarı getirdiğini fark eden öğrenci.",
    what: "Çabaların %20'sinin sonuçların %80'ini oluşturduğunu gösterir.",
    how: [
      "Geçmiş soruları analiz et.",
      "%20'lik kritik konuları belirle ve önce öğren.",
    ],
    motivation: "Doğru yere odaklanmak, seni daha hızlı başarıya götürür.",
    visual: { icon: "🎯", color: "#10B981", shape: "pie-chart" },
  },
  {
    id: "parkinson",
    title: "Parkinson Yasası",
    emoji: "⏳",
    difficulty: "Kolay",
    time: "Zaman kutuları",
    story: "Süre sınırı koyan öğrenci, aynı işi daha hızlı ve odaklı yaptı.",
    what: "İş, kendisine verilen zamanı doldurma eğilimindedir; sınır koymak verimlidir.",
    how: ["Görevlere süre sınırı koy.", "Kısa hedeflerle çalış."],
    motivation: "Süre sınırlamaları seni daha üretken yapar — deneyin.",
    visual: { icon: "⏳", color: "#F59E0B", shape: "timer" },
  },
  {
    id: "murphy",
    title: "Murphy Kanunu",
    emoji: "⚠️",
    difficulty: "Kolay",
    time: "Hazırlık planı",
    story:
      "Sınav gününde beklenmedik bir aksilik oldu; plan B hazırlığı işini kurtardı.",
    what: "Eğer yanlış gidebilecek bir şey varsa, yanlış gidebilir; yedek plan yap.",
    how: ["Yedek materyal hazırla.", "Çevrimiçi kaynakların kopyasını al."],
    motivation:
      "Hazırlıklı olmak, panikten daha iyidir — küçük önlemler büyük fayda getirir.",
    visual: { icon: "⚠️", color: "#EF4444", shape: "alert" },
  },
  {
    id: "selfdetermination",
    title: "Self-Determination Theory",
    emoji: "🌱",
    difficulty: "Orta",
    time: "Uzun vadeli hedefler",
    story:
      "Özerklik ve amaç bulan öğrenciler daha motive ve kalıcı öğrenme gösterdi.",
    what: "Özerklik, yeterlilik ve bağlılık duyguları motivasyonu artırır.",
    how: [
      "Küçük hedefler belirle.",
      "İlerlemeni takip et ve özerk seçimler yap.",
    ],
    motivation: "Senin kontrolünde olan hedefler seni daha çok motive eder.",
    visual: { icon: "🌱", color: "#84CC16", shape: "seed" },
  },

  // 13-17 Study Techniques
  {
    id: "pomodoro",
    title: "Pomodoro Tekniği",
    emoji: "⏳",
    difficulty: "Kolay",
    time: "25/5 veya 50/10",
    story: "Kısa odak blokları ile çalışan bir öğrenci verimini artırdı.",
    what: "Kısa, zamanlanmış odak seansları ile dikkat yönetimi tekniği.",
    how: [
      "25dk odak, 5dk mola; 4 oturumda uzun mola.",
      "Hedef belirle ve say.",
    ],
    motivation: "Küçük bloklar büyük ilerleme sağlar — başlamak en zorudur.",
    visual: { icon: "⏳", color: "#6366F1", shape: "clock" },
  },
  {
    id: "zeigarnik",
    title: "Zeigarnik Etkisi",
    emoji: "🔔",
    difficulty: "Kolay",
    time: "Kısa görevler",
    story:
      "Yarım bırakılan işleri hatırlamak daha kolaydır; küçük tamamlamalar motivasyon sağlar.",
    what: "Tamamlanmamış işleri zihnin daha çok hatırlaması etkisi.",
    how: [
      "Büyük işleri küçük parçalara böl.",
      "Küçük bir kısmını bitirip ara ver.",
    ],
    motivation: "Tamamladıkça enerji gelir — küçük zaferler oluştur.",
    visual: { icon: "🔔", color: "#F97316", shape: "bell" },
  },
  {
    id: "chunking",
    title: "Chunking (Bilgiyi parçalara bölmek)",
    emoji: "🧩",
    difficulty: "Kolay",
    time: "Kısa oturumlar",
    story:
      "Büyük veri setlerini mantıklı parçalara ayıran öğrenciler daha iyi hatırladı.",
    what: "Bilgiyi yönetilebilir parçalara bölerek belleği kolaylaştırma.",
    how: ["Kavramları grupla.", "Her parçayı ayrı çalış ve sonra birleştir."],
    motivation: "Parçalama, karmaşayı azaltır ve öğrenmeyi hızlandırır.",
    visual: { icon: "🧩", color: "#06B6D4", shape: "puzzle" },
  },
  {
    id: "eisenhower",
    title: "Eisenhower Matrisi",
    emoji: "🗂️",
    difficulty: "Kolay",
    time: "Günlük planlama",
    story:
      "Önceliklendirme ile zamanın en verimli kullanılacağı işler seçildi.",
    what: "Acil/önemli ayrımına göre görevleri sınıflandırma matrisi.",
    how: ["Görevleri 4 kutuya ayır.", "Önceliklere göre zaman ayır."],
    motivation: "Doğru işi doğru zamanda yap — verimli olmanın sırrı budur.",
    visual: { icon: "🗂️", color: "#8B5CF6", shape: "matrix" },
  },
  {
    id: "goalgradient",
    title: "Goal Gradient Effect",
    emoji: "🏁",
    difficulty: "Kolay",
    time: "Hedef takibi",
    story: "Hedefe yaklaştıkça bir öğrenci daha hızlı çalışmaya başladı.",
    what: "Hedefe yaklaşıldıkça motivasyon artma etkisi.",
    how: ["Hedefleri küçük aşamalara böl.", "İlerlemeni görünür kıl."],
    motivation: "İlerlemeni görmek hızlandırır — küçük kilometre taşları koy.",
    visual: { icon: "🏁", color: "#10B981", shape: "flag" },
  },

  // 18-22 Psychology
  {
    id: "growthmindset",
    title: "Carol Dweck – Growth Mindset",
    emoji: "🌱",
    difficulty: "Orta",
    time: "Sürekli uygulama",
    story: "Hataları gelişme fırsatı olarak gören öğrenci zamanla gelişti.",
    what: "Yetenekler değişebilir; çaba ve strateji ile gelişme mümkündür.",
    how: ["Hatalardan öğrenmeyi teşvik et.", "Çabayı ve stratejiyi öne çıkar."],
    motivation: "Gelişim odaklı bakış, uzun vadeli başarı getirir.",
    visual: { icon: "🌱", color: "#84CC16", shape: "sprout" },
  },
  {
    id: "kaizen",
    title: "Kaizen Felsefesi",
    emoji: "🔧",
    difficulty: "Kolay",
    time: "Günlük küçük adımlar",
    story:
      "Her gün küçük bir adım atan öğrenci bir yıl sonra büyük fark gördü.",
    what: "Sürekli küçük iyileştirmeler ile büyük gelişim sağlama yaklaşımı.",
    how: ["Günlük küçük hedefler belirle.", "Her gün bir iyileştirme yap."],
    motivation:
      "Küçük adımlar, büyük değişimler getirir — bugün bir şey değiştir.",
    visual: { icon: "🔧", color: "#F59E0B", shape: "gear" },
  },
  {
    id: "pavlov",
    title: "Pavlov – Koşullanma İlkesi",
    emoji: "🔔",
    difficulty: "Kolay",
    time: "Alışkanlık oluşturma",
    story: "Rutin ile tetiklenen çalışma alışkanlığı oluştu.",
    what: "Davranışları tetikleyicilerle eşleştirerek alışkanlık oluşturma.",
    how: ["Tutarlı tetikleyiciler kullan.", "Küçük ödüller ekle."],
    motivation: "Rutin oluştur, otomatik davranış geliştir.",
    visual: { icon: "🔔", color: "#F97316", shape: "bell" },
  },
  {
    id: "hebbian",
    title: "Hebbian Learning",
    emoji: "🧠",
    difficulty: "Orta",
    time: "Tekrarlı uygulama",
    story: "Tekrar eden uygulamalar sinaptik bağlantıları güçlendirdi.",
    what: "Birlikte ateşlenen nöronlar birlikte bağlanır — pratik öğrenmeyi pekiştirir.",
    how: [
      "Tekrarla ve ilişkilendir.",
      "Karmaşık görevleri basit bileşenlere ayır.",
    ],
    motivation: "Sürekli uygulama beynini yeniden şekillendirir.",
    visual: { icon: "🧠", color: "#6366F1", shape: "neuron" },
  },
  {
    id: "socratic",
    title: "Socratic Learning",
    emoji: "❓",
    difficulty: "Orta",
    time: "Sorgulama temelli",
    story: "Sorular soran öğrenci derin kavrayışa ulaştı.",
    what: "Soru ve tartışma yoluyla öğrenme; kendi anlayışını test etme.",
    how: ["Kendine sorular sor.", "Nedenini açıklamaya çalış."],
    motivation: "Soru sormak, yüzeysel bilgiyi derinleştirir.",
    visual: { icon: "❓", color: "#06B6D4", shape: "question" },
  },

  // 23-30 Life & Productivity
  {
    id: "diminishing",
    title: "Law of Diminishing Returns",
    emoji: "📉",
    difficulty: "Orta",
    time: "Zaman yönetimi",
    story:
      "Uzun süre aynı ��eyi yapmak verim düşürdü; mola dönüşümünü keşfettiler.",
    what: "Aynı çabanın getirisinin zamanla azalması.",
    how: ["Verim azaldığında mola ver.", "Farklı araçlar dene."],
    motivation: "Dozunda çalışma, verim artırır.",
    visual: { icon: "📉", color: "#EF4444", shape: "decline" },
  },
  {
    id: "occam",
    title: "Ockham’ın Usturası",
    emoji: "🪒",
    difficulty: "Kolay",
    time: "Problem çözme",
    story: "Basit çözümü tercih eden öğrenci daha hızlı sonuca ulaştı.",
    what: "Gereksiz varsayımları eleyip en basit açıklamayı seçme ilkesi.",
    how: ["Çözümü basitleştir.", "Önce temel nedenleri sorgula."],
    motivation: "Basitlik genelde en etkili yoldur.",
    visual: { icon: "🪒", color: "#111827", shape: "line" },
  },
  {
    id: "firstprinciples",
    title: "First Principles Thinking",
    emoji: "🏗️",
    difficulty: "Zor",
    time: "Derinlemesine düşünme",
    story: "Problemi temelden yeniden kuran öğrenci yeni yollar buldu.",
    what: "Problemleri en temel gerçeklere indirgeme yaklaşımı.",
    how: ["Varsayımları parçala.", "Temel öğeleri yeniden değerlendir."],
    motivation: "Temelden düşünmek, yenilik getirir.",
    visual: { icon: "🏗️", color: "#0EA5A4", shape: "blocks" },
  },
  {
    id: "feynman",
    title: "Feynman Tekniği",
    emoji: "🗣️",
    difficulty: "Kolay",
    time: "10–20 dk",
    story: "Bir konuyu basitçe anlatan öğrenci gerçek boşlukları fark etti.",
    what: "Kavramı basitçe anlatma ve eksikleri bulma yöntemi.",
    how: ["Boş bir sayfaya anlat.", "Basit örnekler kullan."],
    motivation: "Anlattıkça öğrenirsin — öğretmek en iyi sınavdır.",
    visual: { icon: "🗣️", color: "#F59E0B", shape: "megaphone" },
  },
  {
    id: "hawthorne",
    title: "Hawthorne Effect",
    emoji: "👀",
    difficulty: "Kolay",
    time: "Gözlem temelli",
    story: "Gözlendiğini bilen bir ekip performans��nı artırdı.",
    what: "Gözlenme algısının performansı etkilemesi.",
    how: [
      "Hedefleri paylaş ve rapor et.",
      "Hafif sosyal baskı motivasyon sağlar.",
    ],
    motivation:
      "Paylaşmak motivasyonu artırabilir — sorumlu tutulmak işe yarar.",
    visual: { icon: "👀", color: "#8B5CF6", shape: "eye" },
  },
  {
    id: "procrastination",
    title: "Procrastination Loop",
    emoji: "⏰",
    difficulty: "Orta",
    time: "Farkındalık çalışmaları",
    story: "Erteleme döngüsünü fark eden öğrenci küçük adımlarla kırdı.",
    what: "Erteleme alışkanlığının döngüsel yapısı ve müdahale yolları.",
    how: ["Farkındalık egzersizleri yap.", "Zaman blokları ile başla."],
    motivation: "Küçük ilk adım ertelemeyi kırar — bugün 5 dakika başla.",
    visual: { icon: "⏰", color: "#EF4444", shape: "loop" },
  },
  {
    id: "momentum",
    title: "Momentum İlkesi",
    emoji: "🚀",
    difficulty: "Kolay",
    time: "Başlangıç odaklı",
    story:
      "Başlayan öğrenci kısa sürede hız kazandı ve düzenli çalışmaya geçti.",
    what: "Başlamak en zor, devam etmek momentum getirir.",
    how: ["Küçük başlangıç hedefleri koy.", "Sürekli ayn�� saatte çalış."],
    motivation: "Başlamak, başarıya giden en büyük adımdır.",
    visual: { icon: "🚀", color: "#06B6D4", shape: "rocket" },
  },
  {
    id: "butterfly",
    title: "Butterfly Effect",
    emoji: "🦋",
    difficulty: "Kolay",
    time: "Uzun vadeli düşünme",
    story: "Küçük bir değişiklik büyük sonuçlara yol açtı.",
    what: "Küçük eylemlerin zincirleme büyük etkileri olabileceği fikri.",
    how: [
      "Küçük iyi alışkanlıklar oluştur.",
      "Değişiklikleri izleyip optimize et.",
    ],
    motivation: "Küçük adımlar zamanla büyük fark yaratır.",
    visual: { icon: "🦋", color: "#F472B6", shape: "butterfly" },
  },
];

export default function TekniklerPage() {
  const [openTech, setOpenTech] = useState<Record<string, boolean>>({});

  return (
    <MobileLayout>
      <div className="space-y-4">
        <header className="p-3">
          <h1 className="text-xl font-bold">Bilimsel Çalışma Teknikleri</h1>
          <p className="text-sm text-muted-foreground">
            Detaylı açıklamalar, kullanım önerileri, zorluk seviyeleri ve pratik
            ipuçları. Her tekniği açarak detayları görün.
          </p>
        </header>

        <section className="space-y-3">
          {TECHNIQUES.map((t) => (
            <article
              key={t.id}
              id={t.id}
              className="p-4 rounded-2xl border bg-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">
                    {t.emoji} {t.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Zorluk: {t.difficulty} • Süre: {t.time}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setOpenTech((o) => ({ ...o, [t.id]: !o[t.id] }))
                  }
                  className="px-3 py-1 rounded-md border text-sm"
                >
                  {openTech[t.id] ? "Gizle" : "Detay"}
                </button>
              </div>
              {openTech[t.id] && (
                <div className="mt-3 text-sm text-muted-foreground space-y-2">
                  <div className="font-medium">📖 Hikâye Girişi</div>
                  <div>{t.story}</div>

                  <div className="font-medium">🧠 Nedir?</div>
                  <div>{t.what}</div>

                  <div className="font-medium">��� Nasıl Uygula?</div>
                  <ul className="list-disc pl-5">
                    {t.how.map((h: any, i: number) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>

                  <div className="font-medium">⚡ Zorluk Seviyesi</div>
                  <div>{t.difficulty}</div>

                  <div className="font-medium">💬 Motivasyon Mesajı</div>
                  <div>{t.motivation}</div>

                  <div className="font-medium">🎨 Görsel Öneri</div>
                  <div className="text-sm text-muted-foreground">
                    İkon: {t.visual.icon} • Renk: {t.visual.color} • Şekil:{" "}
                    {t.visual.shape}
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </MobileLayout>
  );
}
