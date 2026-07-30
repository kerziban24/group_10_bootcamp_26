// Sabah Turu - Jüri ve Testler İçin Mock Veri Seti
// Bu veri yapısı Airtable/MySQL veri tabanı modeline birebir uygundur.

export const mockUsers = [
  {
    user_id: "usr_001",
    name: "Ahmet Yılmaz",
    email: "ahmet@sabah-turu.com",
    tone_preference: "detaylı", // "kısa" veya "detaylı"
    created_at: "2026-07-01 08:00:00"
  }
];

export const mockWatchlist = [
  { watchlist_id: "wl_001", user_id: "usr_001", ticker: "NVDA", sector: "Teknoloji / Yarı İletken", added_at: "2026-07-02" },
  { watchlist_id: "wl_002", user_id: "usr_001", ticker: "AAPL", sector: "Teknoloji / Tüketici Elektroniği", added_at: "2026-07-03" },
  { watchlist_id: "wl_003", user_id: "usr_001", ticker: "TSLA", sector: "Otomotiv / Temiz Enerji", added_at: "2026-07-05" },
  { watchlist_id: "wl_004", user_id: "usr_001", ticker: "BIST100", sector: "Türkiye Genel Endeks", added_at: "2026-07-10" },
  { watchlist_id: "wl_005", user_id: "usr_001", ticker: "GOLD", sector: "Emtia / Değerli Metaller", added_at: "2026-07-12" }
];

export const mockRawMarketData = [
  { date: "2026-07-30", ticker: "NVDA", price: 875.12, change_pct: 4.82, volume: "41.2M", history: [840, 852, 848, 860, 855, 868, 875.12] },
  { date: "2026-07-30", ticker: "AAPL", price: 189.84, change_pct: 1.24, volume: "52.4M", history: [192, 191, 188, 187, 189, 188, 189.84] },
  { date: "2026-07-30", ticker: "TSLA", price: 175.34, change_pct: -2.15, volume: "88.1M", history: [184, 182, 180, 183, 179, 178, 175.34] },
  { date: "2026-07-30", ticker: "BIST100", price: 9245.50, change_pct: 0.78, volume: "12.4B", history: [9120, 9150, 9080, 9180, 9200, 9210, 9245.50] },
  { date: "2026-07-30", ticker: "GOLD", price: 2350.20, change_pct: 0.45, volume: "2.1M", history: [2320, 2335, 2328, 2342, 2338, 2345, 2350.20] }
];

export const mockRawNews = [
  {
    date: "2026-07-30",
    ticker_sector: "NVDA",
    headline: "Nvidia, yeni Blackwell mimarisine talebin üretim kapasitesini aştığını duyurdu",
    source: "Bloomberg",
    url: "https://www.bloomberg.com",
    raw_sentiment_score: 0.95, // Olumlu
    importance: "High" // Yüksek
  },
  {
    date: "2026-07-30",
    ticker_sector: "AAPL",
    headline: "Asya tedarikçilerinden gelen raporlar, iPhone siparişlerinde %8'lik bir daralmaya işaret ediyor",
    source: "Reuters",
    url: "https://www.reuters.com",
    raw_sentiment_score: -0.65, // Olumsuz
    importance: "High"
  },
  {
    date: "2026-07-30",
    ticker_sector: "TSLA",
    headline: "Tesla'nın batarya üretim hattındaki darboğaz Cybertruck teslimat hedeflerini tehlikeye sokuyor",
    source: "Electrek",
    url: "https://www.electrek.co",
    raw_sentiment_score: -0.45, // Olumsuz
    importance: "Medium"
  },
  {
    date: "2026-07-30",
    ticker_sector: "BIST100",
    headline: "Borsa İstanbul yabancı yatırımcı girişlerinin etkisiyle 9,200 puan seviyesinin üzerine yerleşti",
    source: "Bloomberg HT",
    url: "https://www.bloomberght.com",
    raw_sentiment_score: 0.75, // Olumlu
    importance: "Medium"
  },
  {
    date: "2026-07-30",
    ticker_sector: "GOLD",
    headline: "ABD Merkez Bankası Fed'den faiz indirimi beklentileri altını yeni tarihi zirveye taşıdı",
    source: "CNBC",
    url: "https://www.cnbc.com",
    raw_sentiment_score: 0.80, // Olumlu
    importance: "High"
  },
  {
    date: "2026-07-30",
    ticker_sector: "TSLA",
    headline: "Avrupa pazarında elektrikli araç teşviklerinin kalkması Tesla satışlarını yavaşlatıyor",
    source: "Financial Times",
    url: "https://www.ft.com",
    raw_sentiment_score: -0.30, // Kısmen Olumsuz
    importance: "Medium"
  }
];

export const mockDailyBriefing = {
  briefing_id: "brf_001",
  user_id: "usr_001",
  date: "30 Temmuz 2026",
  summary_text: `**Günaydın Ahmet, bugünün piyasa turu başlıyor.**

Bugün portföyünde **Nvidia** öncülüğündeki rüzgarı arkana alıyorsun, ancak **Apple** ve **Tesla** cephelerindeki bazı tedarik zinciri pürüzleri can sıkabilir. Altın ise zirve yürüyüşüne kararlı şekilde devam ediyor.

### 🔍 Portföyünde Bugün Neler Var?

*   🚀 **NVDA (+4.82%):** Yeni Blackwell çip mimarisine olan talep üretimi aşmış durumda. Bu gelişme, portföyünün teknoloji ağırlığını en yüksek getiriyle destekleyen lokomotif yapmaya devam ediyor.
*   ⚠️ **AAPL (+1.24%):** Dünü artıda kapatsa da Asya'daki tedarikçilerden gelen **sipariş kesintisi** haberleri bugün Nasdaq açılışında hisse üzerinde bir miktar satış baskısı yaratabilir, temkinli olmakta fayda var.
*   📉 **TSLA (-2.15%):** Batarya paketleme hatlarındaki darboğaz Cybertruck teslimatlarını yavaşlatıyor. Teknik olarak 180$ desteğinin altına sarkılması, kısa vadede portföyün en riskli pozisyonu haline getiriyor.
*   📈 **BIST100 (+0.78%):** Yabancı girişlerinin artmasıyla 9,200 seviyesini destek haline getirdi. Bankacılık sektörü öncülüğünde dirençli duruyor.
*   ✨ **GOLD (+0.45%):** Fed'in faiz indirim sinyalleriyle 2,350$ seviyesinde yeni tarihi zirve yaptı. Portföyünün güvenli liman koruması görevini kusursuz yapıyor.

### 🛡️ Günün Risk Değerlendirmesi
Bugün en çok dikkat etmen gereken yer **Tesla'nın batarya sorunları** ve **Apple'ın Asya siparişlerindeki düşüş** sinyali. Teknoloji ağırlıklı portföyün için bugün hafif dalgalı ama Nvidia sayesinde pozitif eğilimli bir gün başlangıcı bekliyoruz.`,
  risk_score: 42, // 100 üzerinden risk skoru
  top_3_headlines: [
    "Nvidia Blackwell çiplerinde talep patlaması yaşanıyor.",
    "Apple Asya tedarik zincirinde sipariş azaltma iddiaları.",
    "Tesla batarya üretim darboğazı teslimatları yavaşlatabilir."
  ],
  sent_status: "sent"
};

export const mockChatHistory = [
  {
    chat_id: "ch_001",
    user_id: "usr_001",
    question: "Portföyümün genel durumu nasıl?",
    answer: "Bugün portföyünüz genel olarak pozitif eğilimli ancak hisse bazında ciddi ayrışmalar var. **Nvidia (+%4.82)** yeni Blackwell çiplerine gelen devasa taleple başı çekerken, **Tesla (-%2.15)** batarya tedarikindeki sıkışma sebebiyle negatif ayrışıyor. Altın ise tarihi zirvesine ulaştı. Genel risk skorunuz dengeli görünüyor.",
    date: "2026-07-30 08:30:00",
    clicked_topics: "NVDA, TSLA"
  },
  {
    chat_id: "ch_002",
    user_id: "usr_001",
    question: "Bugün en riskli pozisyonum ne?",
    answer: "Bugün en riskli pozisyonunuz net bir şekilde **Tesla (TSLA)**. Batarya üretimindeki darboğaz teslimat hedeflerini zorluyor ve dün hisse %2.15 geriledi. Teknik olarak da zayıf bir seyir izliyor. Ayrıca, **Apple (AAPL)** için gelen Asya'daki siparişlerin %8 azaldığı yönündeki haberler, hisse üzerinde bugün baskı yaratabilir.",
    date: "2026-07-30 08:31:00",
    clicked_topics: "TSLA, AAPL"
  }
];
