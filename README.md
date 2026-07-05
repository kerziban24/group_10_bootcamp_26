Takım 10

#Ürün İle İlgili Bilgiler
##Takım Elemanları

* Sümeyye Köse: Product Owner
* Yasemin Akgül: Scrum Master
* Kerziban Sicim: Team Member/Developer
* Mehmet Anıl Köse: Team Member/Developer
* Ahmet Kağan Ertürk: Team Member/Developer

##Ürün İsmi
--Sabah Turu--

##Ürün Açıklaması

* Sabah Turu, kullanıcıların takip ettiği hisse senetleri, sektörler ve piyasa endekslerine özel, her sabah otomatik olarak üretilen kişiselleştirilmiş bir piyasa brifingi sunan bir web uygulamasıdır. Bir yapay zeka ajanı gece boyunca oluşan haberleri ve fiyat hareketlerini tarar, kullanıcının portföyüne göre önem sırasına koyar, duygu analizi yapar ve kısa bir özet üretir. Kullanıcılar ayrıca bir sohbet arayüzü üzerinden portföyleriyle ilgili doğal dilde sorular sorabilir.

##Ürün Özellikleri

* Kişiselleştirilmiş watchlist ve portföy yönetimi
* Her sabah otomatik üretilen AI destekli piyasa brifingi (özet + duygu skoru)
* Haberlerin önem sırasına göre etiketlenmesi
* Portföy hakkında doğal dilde soru-cevap (RAG tabanlı sohbet)
* E-posta ile günlük brifing gönderimi
* Kullanıcı etkileşim geçmişine dayalı kişiselleştirme (hafıza)

##Hedef Kitle

* Bireysel yatırımcılar
* Finansal piyasaları takip eden öğrenciler
* Piyasa haberlerini tek kaynaktan takip etmek isteyen profesyoneller
* 18 - 55 yaş arası kullanıcılar

##Product Backlog URL
[Miro Backlog Board](MİRO_LİNKİNİZİ_BURAYA_EKLEYİN)

#Sprint 1

* Backlog düzeni ve Story seçimleri: Backlog'umuz, ürünün temel iskeletini (veri modeli, ilk API bağlantıları, boş arayüz) kurmayı hedefleyen story'lere göre düzenlenmiştir. Sprint başına tahmin edilen puan sayısını geçmeyecek şekilde sıradan seçimler yapılmıştır. Story başına çıkan tahmin puanı, toplam puanın yarısından az tutulmuştur. Story'ler yapılacak işlere (task'lere) bölünmüştür. Miro Board'da gözüken kırmızı item'lar yapılacak işleri (task) gösterirken, mavi item'lar story'leri temsil etmektedir.

* Daily Scrum: Daily Scrum toplantılarının zamansal sebeplerden ötürü Slack üzerinden asenkron olarak yapılmasına karar verilmiştir. Daily Scrum toplantısı notları Readme'de tarafımızdan paylaşılmaktadır: [Sprint 1 Daily Scrum Notları](docs/sprint-1/daily-scrum-notes.md)

* Sprint board update: Sprint board screenshotları: [Sprint 1 Board](docs/sprint-1/sprint-board-screenshot.png)

* Ürün Durumu: Ekran görüntüleri: [Sprint 1 Ürün Durumu](docs/sprint-1/urun-durumu-screenshot.png)
  * Airtable veri modeli kuruldu (Users, Watchlist, RawMarketData, RawNews, DailyBriefing, ChatHistory)
  * Finnhub API'den ilk gerçek fiyat verisi çekildi
  * Claude API ile ilk özetleme testi yapıldı
  * Bubble projesi açıldı, watchlist formu taslağı hazırlandı

* Sprint Review: Alınan kararlar: Kullanıcı hafızası (ChatHistory) mekanizmasının Sprint 1'de tasarlanması yerine Sprint 2'ye aktarılmasına karar verilmiştir, çünkü öncelik uçtan uca temel veri akışının kurulmasına verilmiştir. Çıkan iskeletin (API bağlantıları, veri modeli) çalışmasında bir problem görülmemiştir. Sprint 2'de eklenmesi gereken özellikler (n8n/Make otomasyonu, sentiment tagging, dashboard entegrasyonu) belirlenmiştir. Sprint Review katılımcıları: [İSİM, İSİM, İSİM, İSİM, İSİM]

* Sprint Retrospective:
   * Takım içindeki görev dağılımıyla ilgili küçük düzenlemeler yapılması kararı alınmıştır (veri ve AI katmanı arasındaki bağımlılıklar netleştirilecek)
   * Tahmin puanları gözden geçirilmeli ve sprint planlama toplantılarında developer'ların geri bildirim vermesine daha fazla zaman ayrılmalı
   * API entegrasyonları için ayrılan efor/saat, rate-limit ve hata yönetimi göz önüne alınarak artırılmalı

#Sprint 2

#Sprint 3
