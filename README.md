
# 🚀 Takım 10 - Sabah Turu

---

# 📌 Ürün ile İlgili Bilgiler

## 👥 Takım Elemanları

- **Sümeyye Köse:** Product Owner
- **Yasemin Akgül:** Scrum Master
- **Kerziban Sicim:** Team Member / Developer
- **Mehmet Anıl Köse:** Team Member / Developer

---

## 📱 Ürün İsmi

# **Sabah Turu**

---

## 📝 Ürün Açıklaması

Sabah Turu, kullanıcıların takip ettiği hisse senetleri ve sektörlere özel, kişiselleştirilmiş bir piyasa brifingi ve sohbet asistanı sunan bir web uygulamasıdır. Kullanıcı kayıt olup kendi takip listesini oluşturur; uygulama, bu listeye göre güncel piyasa özetini üretir ve kullanıcının doğal dilde sorduğu sorulara yapay zeka destekli bir sohbet arayüzü üzerinden cevap verir. Günlük brifing isteğe bağlı olarak e-posta yoluyla da kullanıcıya iletilir.

---

## ⭐ Ürün Özellikleri

- Kullanıcı kayıt ve giriş sistemi
- Kişiselleştirilmiş watchlist yönetimi (ekleme/silme/görüntüleme)
- Yapay zeka destekli günlük piyasa brifingi üretimi (Groq API — LLaMA 3.3 70B)
- Doğal dilde soru-cevap imkanı sunan AI sohbet arayüzü
- Gmail SMTP üzerinden e-posta ile brifing gönderimi
- Ayrık frontend/backend mimarisi sayesinde birden fazla giriş/çıkış noktası (çoklu istemci desteğine açık API yapısı)

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

- İlk veri modeli tasarımı yapıldı (kullanıcı, watchlist, brifing verisi)
- Finnhub API üzerinden ilk gerçek fiyat verisi çekildi
- AI özetleme için ilk prompt testleri yapıldı
- No-code araçlar (Airtable, Bubble, n8n) ile ilk prototip denemesi başlatıldı

---

## ✅ Sprint Review

**Alınan kararlar**

Kullanıcı hafızası (ChatHistory) mekanizmasının Sprint 1'de tasarlanması yerine Sprint 2'ye aktarılmasına karar verilmiştir, çünkü öncelik uçtan uca temel veri akışının kurulmasına verilmiştir.

Çıkan iskeletin (API bağlantıları, veri modeli) çalışmasında bir problem görülmemiştir.

Sprint 2'de eklenmesi gereken özellikler (n8n/Make otomasyonu, sentiment tagging, dashboard entegrasyonu) belirlenmiştir.

**Sprint Review katılımcıları**

Sümeyye, Anıl, Kerziban, Yasemin

---

## 🔄 Sprint Retrospective

- Takım içindeki görev dağılımıyla ilgili küçük düzenlemeler yapılması kararı alınmıştır (veri ve AI katmanı arasındaki bağımlılıklar netleştirilecek).
- Tahmin puanları gözden geçirilmeli ve sprint planlama toplantılarında developer'ların geri bildirim vermesine daha fazla zaman ayrılmalı.
- Kullanılan no-code araçların (API rate-limit, entegrasyon esnekliği) proje ihtiyaçlarını ne ölçüde karşıladığı ekipçe tartışılmaya başlanmıştır.

---

# 🚀 Sprint 2

## 📋 Sprint Planlaması

Sprint 1'de kurulan no-code tabanlı iskele üzerinden ilerlenirken, ekip içinde tam kodlama (full-code) deneyimine sahip bir üyenin bulunması ve bu üyenin backend/frontend geliştirmeyi daha hızlı ve kontrollü şekilde yürütebileceğinin görülmesi üzerine, mimari kararın yeniden değerlendirilmesine karar verilmiştir. Bu doğrultuda Sprint 2'nin planlaması, mimari pivotun değerlendirilmesi ve yeni teknoloji yığınının temelinin atılmasına odaklanmıştır.

## Sprint 2 içerisinde:

React (Vite) tabanlı frontend projesi başlatıldı
PHP tabanlı backend API iskeleti kuruldu (login, register, watchlist, briefing, chat endpoint'leri tanımlandı)
MySQL veritabanı şeması tasarlandı
Groq API (LLaMA 3.3 70B) entegrasyonu için ilk test çağrıları yapıldı

## ✅ Sprint Review

Alınan kararlar — Mimari Pivot

Ekip, projenin kalan süresi ve gereksinimleri göz önünde bulundurularak no-code tabanlı yığından (Airtable/Bubble/n8n) tam kodlanmış bir yığına (React + PHP + MySQL + Groq API) geçiş yapılmasına karar vermiştir. Bu kararın gerekçeleri:

Ekip deneyimi: Takım üyelerinden birinin full-stack geliştirme deneyimine sahip olması, bu yönde ilerlemenin daha hızlı ve güvenilir sonuç vereceği değerlendirilmiştir.
Mimari esneklik: Özel kod tabanı, sisteme birden fazla giriş/çıkış noktası (farklı istemcilerin — web, olası mobil — aynı API'yi kullanabilmesi) eklemeyi kolaylaştırmaktadır; no-code platformların kapalı yapısına kıyasla bu noktada daha esnek bulunmuştur.
Maliyet: Kendi barındırılan bir PHP/MySQL yapısı ve tek bir AI API'si (Groq), birden fazla no-code platform aboneliğine kıyasla daha düşük ve öngörülebilir maliyetli bulunmuştur.

Bu karar, projenin kalan iki sprintlik sürecinde tüm geliştirme kapasitesinin bu yeni yığın üzerinde yoğunlaşmasını gerektirmiştir.

Sprint Review katılımcıları: Sümeyye, Anıl, Kerziban, Yasemin

## 🔄 Sprint Retrospective

Mimari kararın Sprint 1'in başında değil Sprint 2'de alınmış olması, ilk sprintteki bazı efor harcamalarının (no-code prototipleme) doğrudan final ürüne taşınamamasına yol açmıştır; ekip bunu bir öğrenme noktası olarak not etmiştir.
Full-code geçişin, kalan sürede fonksiyonel eksiksizliğe ulaşmak için doğru karar olduğu değerlendirilmiştir.
Sprint 3'e girmeden önce backend endpoint'lerinin ve veritabanı şemasının netleştirilmiş olması, ekibin sonraki sprintte hızlı ilerlemesini kolaylaştırmıştır.

---

# 🚀 Sprint 3

## 📋 Sprint Planlaması

Sprint 3, mimari pivot sonrası kalan tüm backlog'un tamamlanmasına ayrılmıştır. Bu sprint boyunca ürünün uçtan uca çalışır hale getirilmesi — kullanıcı kayıt/girişinden AI destekli brifing ve sohbet özelliğine, e-posta gönderimine kadar — hedeflenmiştir.

## ✅ Sprint Review

Ürün, teslim tarihine yetişecek şekilde uçtan uca çalışır duruma getirilmiştir. Tüm temel özellikler (kayıt/giriş, watchlist, AI brifing, AI sohbet, e-posta gönderimi) fonksiyoneldir ve test kullanıcısı ile doğrulanmıştır.

Sprint Review katılımcıları: Yasemin, Anıl, Kerziban, Sümeyye

## 🔄 Sprint Retrospective
Mimari pivotun getirdiği risk, ekibin son sprintte yoğun ve odaklı çalışmasıyla yönetilebilmiştir.
Backend/frontend ayrımının net olması, paralel çalışmayı (biri API'lerde, biri arayüzde) kolaylaştırmıştır.
İleriye dönük not: benzer bir mimari karar gerekiyorsa, bunun ilk sprintin başında, ekip yetkinlikleri netleşir netleşmez alınması önerilir.

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
