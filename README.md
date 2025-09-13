<!-- Başlık ve görsel -->

<p align="center">
  <img src="./public/placeholder.svg" alt="Başarı Kulübü" width="140" />
  <h1 align="center">Başarı Kulübü — Sınav Hazırlık Koçun</h1>
  <p align="center">Kişiselleştirilmiş, offline-öncelikli ve görsel açıdan zengin bir çalışma arkadaşı.</p>
  <p align="center">
    <a href="#h%C4%B1zl%C4%B1-ba%C5%9Flang%C4%B1%C3%A7"><img src="https://img.shields.io/badge/Status-Development-yellow" alt="status"/></a>
    <img src="https://img.shields.io/badge/Platform-Web-blue" alt="platform"/>
    <img src="https://img.shields.io/badge/License-MIT-lightgrey" alt="license"/>
  </p>
</p>

---

## Kısa Tanıtım

Başarı Kulübü, sınav hazırlık sürecini görselleştirip kişiselleştiren mobil-odaklı bir uygulamadır. Cihaz üzerinde verileri saklar ve internet olmasa bile akıllı fallback mekanizmaları ile çalışır. Animasyonlar, SVG bloblar ve "nefes alan" UI öğeleri ile uygulama canlı ve organik bir his verir.

![Ekran Görüntüsü](./public/placeholder.svg)

---

## Öne Çıkan Özellikler

- ✨ 13 soruluk giriş ekranı: isim, hitap şekli, kişilik tanımı ve çalışma tercihleri
- 📦 Offline-first: Tüm kritik veriler localStorage'ta saklanır
- 🧭 Profil sayfası: Gerçek zamanlı benzetimli grafikler, hedef takibi (günlük/haftalık/aylık)
- 🤖 Adaptif Plan: AI servisi yoksa cihaz üzerinde liste halinde plan üretir
- 🎨 Görsellik: SVG blob animasyonları, framer-motion geçişleri, nefes alan bileşenler

---

## Hızlı Başlangıç

Terminalde projeyi çalıştır:

```bash
pnpm install
pnpm dev
```

Üretim için:

```bash
pnpm build
pnpm start
```

Testler:

```bash
pnpm test
```

---

## Kullanım Notları / LocalStorage Anahtarları

Uygulama yerel olarak şu anahtarları kullanır — geliştirirken bu anahtarları temizleyebilir veya test verileri koyabilirsiniz:

- `onboarding-data` — Giriş ekranı cevapları
- `personality-profile` — Hesaplanmış profil ve öneriler
- `user-goals` / `goals` — Kullanıcının hedef listesi
- `pomodoro-sessions` — Tamamlanan pomodoro sayısı
- `ai-plan-history` — Oluşturulan planların geçmişi
- `personality-completed` — Test tamamlanma durumu

---

## Nasıl Çalışır — Plan Oluşturma (Offline davranış)

1. Koçluk → "Plan Oluştur" butonuna basın.
2. Eğer AI servisine erişim varsa, sunucu çağrısı yapılır.
3. Sunucuya erişilemiyorsa (veya hata alınırsa) uygulama cihaz üzerinde basit bir liste halinde plan üretir ve gösterir.
4. Oluşturulan plan `ai-plan-history` anahtarına kaydedilir.

---

## Görseller & Ekranlar

README içinde demo görselleri için `./public/placeholder.svg` kullanıldı. Gerçek ekran görüntüleri eklemek isterseniz `public/` klasörüne `screenshot-1.png`, `screenshot-2.png` ekleyip bu dosya yollarını aşağıdaki gibi referanslayabilirsiniz:

```md
![Ana Sayfa](./public/screenshot-1.png)
![Profil](./public/screenshot-2.png)
```

---

## Katkıda Bulunma

1. Fork yapın
2. `feature/...` branch'i açın
3. Değişiklikleri commit edin
4. PR gönderin

Kod standardı: TypeScript + React + Vite + Tailwind

---

## Lisans

MIT — Lisansı projenize uygun şekilde güncelleyebilirsiniz.

---

Herhangi bir bölüm için daha fazla görsel, daha detaylı kurulum adımı veya deploy rehberi istersen README'yi genişleteyim.
