# Başarı Kulübü — Sınav Hazırlık Koçun

![Başarı Kulübü Logo](./public/placeholder.svg)

Türkçe açıklama: Mobil odaklı, offline öncelikli sınav hazırlık uygulaması. Kişiselleştirilmiş giriş (13 soru), koçluk/plan oluşturma, profil & görsel analiz panosu, Pomodoro, takvim ve hedef takip özellikleri içerir. Uygulama tüm kullanıcı verilerini istemci üzerinde (localStorage) saklayarak sunucu gereksinimini en aza indirir.

---

## Hızlı Başlangıç

Geliştirme ortamını çalıştırmak için:

```bash
pnpm install
pnpm dev
```

Üretim build:

```bash
pnpm build
pnpm start
```

Testler:

```bash
pnpm test
```

> Not: Bu proje PNPM ile hazırlanmıştır; package.json içindeki scriptlere bakınız.

---

## Öne çıkan özellikler

- Kapsamlı Giriş Ekranı (13 soru): Ad, hitap tercihi ve kişilik tanımı ile kişiselleştirilmiş deneyim.
- Offline-first veri yönetimi: localStorage kullanılarak `onboarding-data`, `personality-profile`, `user-goals`, `pomodoro-sessions`, `ai-plan-history` gibi anahtarlar üzerinden veri saklanır.
- Profil sayfası: Zengin görsel grafikler (Recharts) ve gerçek zamanlı benzetimli akışlar.
- Adaptif Plan Oluşturma: AI servisi yoksa (veya çevrimdışıyken) cihaz üzerinde basit, üretken bir plan oluşturma fallback'i vardır.
- Animasyonlar & Organik UI: framer-motion, SVG bloblar ve "nefes alan" bileşen animasyonları.

---

## LocalStorage anahtarları (geliştiriciler için)

- `onboarding-data` — Giriş ekranı cevapları
- `personality-profile` — Hesaplanmış kişilik profili ve öneriler
- `user-goals` / `goals` — Kullanıcının hedefleri
- `pomodoro-sessions` — Toplam tamamlanan pomodoro oturum sayısı
- `ai-plan-history` — Oluşturulmuş çalışma planlarının geçmişi
- `personality-completed` — Kişilik testinin tamamlandığını gösterir

Bu anahtarlar ile uygulamayı manuel test edebilir veya temizleyebilirsiniz.

---

## Nasıl çalışır — Plan Oluştur (Çevrimdışı)

1. Koçluk sayfasına gidin ("Koçluk").
2. "Plan Oluştur" butonuna basın.
3. Sunucuya erişilemiyorsa uygulama otomatik olarak offline fallback üretir ve liste halinde adım adım planı gösterir.

Uygulama planları `ai-plan-history` anahtarında saklar.

---

## Dosya yapısı (kısa)

- `client/` — React frontend
  - `pages/` — Route sayfaları (Index, Kocluk, Profil, Ayarlar, Pomodoro...)
  - `components/` — Yeniden kullanılabilir UI bileşenleri (AdaptivePlan, PersonalityTest, ProfileCharts...)
  - `global.css` — Temalar ve animasyonlar (nefes, blob, renk tokenları)
- `server/` — Express backend (mininal; istenirse genişletilebilir)

---

## MCP (Önerilen entegrasyonlar)

Bu proje çevrimdışı çalışacak şekilde tasarlanmıştır; yine de ileride gerçek zamanlı, yedekleme veya auth entegrasyonu isterseniz şu MCP/servisler faydalı olacaktır:

• Neon — serverless Postgres (veri depolama, migration)
• Netlify — Host & CI/CD
• Zapier — İş akış otomasyonları
• Figma — Tasarımdan koda geçiş (Builder.io Figma plugin önerilir)
• Supabase — Auth & realtime DB (kolay entegrasyon)
• Builder.io — İçerik yönetimi & CMS
• Linear — Issue takibi
• Notion — Dokümantasyon
• Sentry — Hata takibi
• Context7 — Kütüphane dokümantasyonları
• Semgrep — Güvenlik taramaları
• Prisma Postgres — ORM / DB yönetimi

Bu MCP listesindeki tüm servisleri bağlamak için Builder.io MCP popover'ını kullanabilirsiniz.

---

## Görsel materyaller

- Uygulama logo/placeholder: `./public/placeholder.svg`
- Örnek ekran görüntüleri: `./public/` klasörüne ekleyerek README içinde görüntüleyebilirsiniz.

---

## Katkıda bulunma

1. Fork oluşturun
2. Yeni bir branch açın: `git checkout -b feature/isim`
3. Değişiklikleri commit edin
4. PR açın

---

## Lisans

Bu proje açık kaynaklıdır — uygun lisansı ekleyin (örn. MIT) veya kurumsal gereksiniminize göre güncelleyin.

---

Herhangi bir bölümün içeriğini genişletmemi istersen (kurulum, CI, deploy, detaylı localStorage kullanım örnekleri veya README'ye ekran görüntüleri ekleme), söyle yeterli; ben ekleyeyim.
