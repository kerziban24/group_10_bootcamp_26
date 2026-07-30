
# 🚀 Takım 10 - Fintel

---

# 📌 Ürün ile İlgili Bilgiler

## 👥 Takım Elemanları

- **Sümeyye Köse:** Product Owner
- **Yasemin Akgül:** Scrum Master
- **Kerziban Sicim:** Team Member / Developer
- **Mehmet Anıl Köse:** Team Member / Developer
- **Ahmet Kağan Ertürk:** Team Member / Developer

---

## 📱 Ürün İsmi

# **Sabah Turu**

---

## 📝 Ürün Açıklaması

Sabah Turu, kullanıcıların takip ettiği hisse senetleri, sektörler ve piyasa endekslerine özel, her sabah otomatik olarak üretilen kişiselleştirilmiş bir piyasa brifingi sunan bir web uygulamasıdır. Bir yapay zeka ajanı gece boyunca oluşan haberleri ve fiyat hareketlerini tarar, kullanıcının portföyüne göre önem sırasına koyar, duygu analizi yapar ve kısa bir özet üretir. Kullanıcılar ayrıca bir sohbet arayüzü üzerinden portföyleriyle ilgili doğal dilde sorular sorabilir.

---

## ⭐ Ürün Özellikleri

- Kişiselleştirilmiş watchlist ve portföy yönetimi
- Her sabah otomatik üretilen AI destekli piyasa brifingi (özet + duygu skoru)
- Haberlerin önem sırasına göre etiketlenmesi
- Portföy hakkında doğal dilde soru-cevap (RAG tabanlı sohbet)
- E-posta ile günlük brifing gönderimi
- Kullanıcı etkileşim geçmişine dayalı kişiselleştirme (hafıza)

---

## 🎯 Hedef Kitle

- Bireysel yatırımcılar
- Finansal piyasaları takip eden öğrenciler
- Piyasa haberlerini tek kaynaktan takip etmek isteyen profesyoneller
- 18 - 55 yaş arası kullanıcılar

---

## 🔗 Product Backlog URL

[Miro Backlog Board](https://miro.com/app/board/uXjVH-wP4D8=/?share_link_id=786246253629)

---

# 🚀 Sprint 1

## 📋 Sprint Planlaması

**Backlog düzeni ve Story seçimleri**

Backlog'umuz, ürünün temel iskeletini (veri modeli, ilk API bağlantıları, boş arayüz) kurmayı hedefleyen story'lere göre düzenlenmiştir. Sprint başına tahmin edilen puan sayısını geçmeyecek şekilde sıradan seçimler yapılmıştır. Story başına çıkan tahmin puanı, toplam puanın yarısından az tutulmuştur. Story'ler yapılacak işlere (task'lere) bölünmüştür. 

<img width="1812" height="628" alt="image" src="https://github.com/user-attachments/assets/352ffd0d-2d6c-46d3-8896-794d3e413465" />


Miro Board'da gözüken;

- 🔴 Kırmızı item'lar yapılacak işleri (task)
- 🔵 Mavi item'lar story'leri temsil etmektedir.

---

## 💬 Daily Scrum

Daily Scrum toplantılarının zamansal sebeplerden ötürü Slack üzerinden asenkron olarak yapılmasına karar verilmiştir.

**Daily Scrum toplantısı notları:**

[Sprint 1 Daily Scrum Notları](docs/sprint-1/daily-scrum-notes.md)

---

## 📌 Sprint Board Update

**Sprint board screenshotları:**

[Sprint 1 Board](docs/sprint-1/sprint-board-screenshot.png)

---

## 💻 Ürün Durumu

**Ekran görüntüleri:**

<img width="1600" height="760" alt="WhatsApp Image 2026-07-03 at 22 47 54" src="https://github.com/user-attachments/assets/0eb601cb-f603-427a-87aa-e34b09b38cd2" />

<img width="1600" height="485" alt="WhatsApp Image 2026-07-03 at 22 48 02" src="https://github.com/user-attachments/assets/c3224de4-7dac-46f5-ae5b-01f4b4f13180" />


[Sprint 1 Ürün Durumu](docs/sprint-1/urun-durumu-screenshot.png)

Tamamlanan çalışmalar:

- Airtable veri modeli kuruldu (Users, Watchlist, RawMarketData, RawNews, DailyBriefing, ChatHistory)
- Finnhub API'den ilk gerçek fiyat verisi çekildi
- Claude API ile ilk özetleme testi yapıldı
- Bubble projesi açıldı, watchlist formu taslağı hazırlandı

---

## ✅ Sprint Review

**Alınan kararlar**

Kullanıcı hafızası (ChatHistory) mekanizmasının Sprint 1'de tasarlanması yerine Sprint 2'ye aktarılmasına karar verilmiştir, çünkü öncelik uçtan uca temel veri akışının kurulmasına verilmiştir.

Çıkan iskeletin (API bağlantıları, veri modeli) çalışmasında bir problem görülmemiştir.

Sprint 2'de eklenmesi gereken özellikler (n8n/Make otomasyonu, sentiment tagging, dashboard entegrasyonu) belirlenmiştir.

**Sprint Review katılımcıları**

---

## 🔄 Sprint Retrospective

- Takım içindeki görev dağılımıyla ilgili küçük düzenlemeler yapılması kararı alınmıştır (veri ve AI katmanı arasındaki bağımlılıklar netleştirilecek).
- Tahmin puanları gözden geçirilmeli ve sprint planlama toplantılarında developer'ların geri bildirim vermesine daha fazla zaman ayrılmalı.
- API entegrasyonları için ayrılan efor/saat, rate-limit ve hata yönetimi göz önüne alınarak artırılmalı.

---

# 🚀 Sprint 2

---

# 🚀 Sprint 3

# Sabah Turu — Kişisel Piyasa Asistanı

> Bloomberg terminali değil; sabah kahvenizi yudumlarken okuyacağınız, portföyünüze özel 90 saniyelik piyasa özeti.

---

## 📋 İçindekiler
- [Gereksinimler](#gereksinimler)
- [Kurulum (Adım Adım)](#kurulum)
- [Test Kullanıcısı](#test-kullanıcısı)
- [Proje Yapısı](#proje-yapısı)
- [Sık Karşılaşılan Sorunlar](#sorun-giderme)

---

## Gereksinimler

Başlamadan önce bilgisayarınızda şunların kurulu olması gerekiyor:

| Program | İndirme Linki | Notlar |
|---|---|---|
| **XAMPP** | [apachefriends.org](https://www.apachefriends.org) | Apache + MySQL için |
| **Node.js** (v18+) | [nodejs.org](https://nodejs.org) | LTS sürümünü indirin |
| **Git** | [git-scm.com](https://git-scm.com) | |

---

## Kurulum

### Adım 1 — Projeyi İndir

```bash
git clone https://github.com/KULLANICI_ADI/group_10_bootcamp_26.git
```

---

### Adım 2 — XAMPP'ı Başlat

1. **XAMPP Control Panel**'i açın
2. **Apache** → Start butonuna basın ✅
3. **MySQL** → Start butonuna basın ✅
4. İkisi de yeşil `Running` yazmalı

---

### Adım 3 — Proje Klasörünü XAMPP'a Kopyala

Klonladığınız `group_10_bootcamp_26` klasörünün tamamını şu konuma kopyalayın:

```
C:\xampp\htdocs\group_10_bootcamp_26
```

> ⚠️ Klasör adı tam olarak `group_10_bootcamp_26` olmalı, farklı bir isim koyarsanız çalışmaz.

---

### Adım 4 — Veritabanını Oluştur

1. Tarayıcıda şu adresi açın: **http://localhost/phpmyadmin**
2. Sol üstte **"Yeni"** (New) butonuna tıklayın
3. Veritabanı adı olarak `sabah_turu` yazın → **Oluştur** butonuna basın
4. Oluşturulan `sabah_turu` veritabanına tıklayın
5. Üst menüden **"İçe Aktar"** (Import) sekmesine gidin
6. **"Dosya Seç"** butonuna tıklayın → `database/sabah_turu.sql` dosyasını seçin
7. Sayfanın altındaki **"İçe Aktar"** (Go) butonuna basın
8. ✅ "İçe aktarma başarıyla tamamlandı" mesajını görmelisiniz

---

### Adım 5 — .env Dosyasını Oluştur

`backend/` klasöründe `.env` adında bir dosya oluşturun.  
İçeriği aşağıdaki gibi doldurun:

```env
# Veritabanı
DB_HOST=localhost
DB_NAME=sabah_turu
DB_USER=root
DB_PASS=

# Groq AI (size ayrıca iletilecek)
GROQ_API_KEY=BURAYA_API_KEY_YAZIN

# Gmail SMTP (opsiyonel — e-posta özelliği için)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=GMAIL_ADRESINIZ
SMTP_PASS=GOOGLE_UYGULAMA_SIFRESI
```

> 💡 `DB_PASS` alanını boş bırakın — XAMPP'ın varsayılan MySQL şifresi yoktur.

---

### Adım 6 — Frontend Bağımlılıklarını Kur

Terminalı açın ve şu komutları sırasıyla çalıştırın:

```bash
cd group_10_bootcamp_26/frontend
npm install
```

> Bu işlem internet bağlantısına göre 1-3 dakika sürebilir.

---

### Adım 7 — Frontend'i Başlat

```bash
npm run dev
```

Terminalde şunu görmelisiniz:
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

### Adım 8 — Siteyi Aç 🎉

Tarayıcıda açın: **http://localhost:5173**

---

## Test Kullanıcısı

Kayıt olmadan direkt giriş yapmak için:

| Alan | Değer |
|---|---|
| **E-Posta** | `ahmet@sabah-turu.com` |
| **Şifre** | `123456` |

---

## Proje Yapısı

```
group_10_bootcamp_26/
│
├── frontend/               ← React uygulaması (Vite)
│   ├── src/
│   │   ├── App.jsx         ← Ana uygulama
│   │   ├── mockData.js     ← Sunucu kapalıyken gösterilecek örnek veri
│   │   └── components/     ← UI bileşenleri
│   └── package.json
│
├── backend/                ← PHP API (XAMPP üzerinde çalışır)
│   ├── config.php          ← Veritabanı bağlantısı
│   ├── login.php           ← Giriş endpoint'i
│   ├── register.php        ← Kayıt endpoint'i
│   ├── briefing.php        ← Günlük brifing verisi
│   ├── watchlist.php       ← Takip listesi CRUD
│   ├── chat.php            ← Groq AI sohbet
│   ├── send_email.php      ← Gmail ile mail gönderimi
│   └── .env                ← 🔒 Gizli anahtarlar (git'e gitmez!)
│
└── database/
    └── sabah_turu.sql      ← Veritabanı şeması + örnek veriler
```

---

## Sorun Giderme

### ❌ "Sunucuya bağlanılamadı" hatası
- XAMPP'ta Apache ve MySQL'in çalıştığını kontrol edin
- `C:\xampp\htdocs\group_10_bootcamp_26\backend` klasörünün var olduğunu doğrulayın

### ❌ "Database Connection Error" hatası
- phpMyAdmin'de `sabah_turu` veritabanının oluşturulduğunu kontrol edin
- SQL dosyasını tekrar içe aktarın

### ❌ "npm install" hata veriyor
- Node.js'in kurulu olduğunu doğrulayın: `node --version`
- `frontend/` klasöründe olduğunuzdan emin olun

### ❌ Sayfa açılmıyor (5173 portu)
- `npm run dev` komutunun çalışır durumda olduğunu kontrol edin
- Başka bir uygulama 5173 portunu kullanıyor olabilir

---

## Teknik Detaylar

| Katman | Teknoloji |
|---|---|
| Frontend | React 18 + Vite |
| Backend | PHP 8.2 (XAMPP) |
| Veritabanı | MySQL / MariaDB |
| AI | Groq API (LLaMA 3.3 70B) |
| E-Posta | Gmail SMTP |
| Stil | Vanilla CSS |
