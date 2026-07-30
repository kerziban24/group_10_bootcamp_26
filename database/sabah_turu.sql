-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 30 Tem 2026, 12:43:18
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `sabah_turu`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `chat_history`
--

CREATE TABLE `chat_history` (
  `chat_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `clicked_topics` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `chat_history`
--

INSERT INTO `chat_history` (`chat_id`, `user_id`, `question`, `answer`, `date`, `clicked_topics`) VALUES
('ch_001', 'usr_001', 'Portföyümün genel durumu nasıl?', 'Bugün portföyünüz genel olarak pozitif eğilimli ancak hisse bazında ciddi ayrışmalar var. **Nvidia (+%4.82)** yeni Blackwell çiplerine gelen devasa taleple başı çekerken, **Tesla (-%2.15)** batarya tedarikindeki sıkışma sebebiyle negatif ayrışıyor. Altın ise tarihi zirvesine ulaştı. Genel risk skorunuz dengeli görünüyor.', '2026-07-30 05:30:00', 'NVDA, TSLA'),
('ch_002', 'usr_001', 'Bugün en riskli pozisyonum ne?', 'Bugün en riskli pozisyonunuz net bir şekilde **Tesla (TSLA)**. Batarya üretimindeki darboğaz teslimat hedeflerini zorluyor ve dün hisse %2.15 geriledi. Teknik olarak da zayıf bir seyir izliyor. Ayrıca, **Apple (AAPL)** için gelen Asya\'daki siparişlerin %8 azaldığı yönündeki haberler, hisse üzerinde bugün baskı yaratabilir.', '2026-07-30 05:31:00', 'TSLA, AAPL');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `daily_briefing`
--

CREATE TABLE `daily_briefing` (
  `briefing_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `summary_text` text NOT NULL,
  `risk_score` int(11) DEFAULT 50,
  `top_3_headlines` text NOT NULL,
  `sent_status` varchar(20) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `daily_briefing`
--

INSERT INTO `daily_briefing` (`briefing_id`, `user_id`, `date`, `summary_text`, `risk_score`, `top_3_headlines`, `sent_status`) VALUES
('brf_001', 'usr_001', '2026-07-30', '**Günaydın Ahmet, kahven hazırsa bugünün 90 saniyelik piyasa turu başlıyor!** ☕️\n\nBugün portföyünde **Nvidia** öncülüğündeki rüzgarı arkana alıyorsun, ancak **Apple** ve **Tesla** cephelerindeki bazı tedarik zinciri pürüzleri can sıkabilir. Altın ise zirve yürüyüşüne kararlı şekilde devam ediyor.\n\n### 🔍 Portföyünde Bugün Neler Var?\n\n*   🚀 **NVDA (+4.82%):** Yeni Blackwell çip mimarisine olan çılgın talep üretimi aşmış durumda. Bu gelişme, portföyünün teknoloji ağırlığını en yüksek getiriyle destekleyen lokomotif yapmaya devam ediyor.\n*   ⚠️ **AAPL (+1.24%):** Dünü artıda kapatsa da Asya\'daki tedarikçilerden gelen **sipariş kesintisi** haberleri bugün Nasdaq açılışında hisse üzerinde bir miktar satış baskısı yaratabilir, temkinli olmakta fayda var.\n*   📉 **TSLA (-2.15%):** Batarya paketleme hatlarındaki darboğaz Cybertruck teslimatlarını yavaşlatıyor. Teknik olarak 180$ desteğinin altına sarkılması, kısa vadede portföyün en riskli pozisyonu haline getiriyor.\n*   📈 **BIST100 (+0.78%):** Yabancı girişlerinin artmasıyla 9,200 seviyesini destek haline getirdi. Bankacılık sektörü öncülüğünde dirençli duruyor.\n*   ✨ **GOLD (+0.45%):** Fed\'in faiz indirim sinyalleriyle 2,350$ seviyesinde yeni tarihi zirve yaptı. Portföyünün güvenli liman koruması görevini kusursuz yapıyor.\n\n### 🛡️ Günün Risk Değerlendirmesi\nBugün en çok dikkat etmen gereken yer **Tesla\'nın batarya sorunları** ve **Apple\'ın Asya siparişlerindeki düşüş** sinyali. Teknoloji ağırlıklı portföyün için bugün hafif dalgalı ama Nvidia sayesinde pozitif eğilimli bir gün başlangıcı bekliyoruz.\n\n*Kahvenden bir yudum daha al ve aşağıdaki asistan sohbetinden \"Bugün en riskli pozisyonum hangisi?\" diye sorarak detayları alabilirsin!*', 42, '[\"Nvidia Blackwell çiplerinde talep patlaması yaşanıyor.\",\"Apple Asya tedarik zincirinde sipariş azaltma iddiaları.\",\"Tesla batarya üretim darboğazı teslimatları yavaşlatabilir.\"]', 'sent');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `raw_market_data`
--

CREATE TABLE `raw_market_data` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `ticker` varchar(20) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `change_pct` decimal(5,2) NOT NULL,
  `volume` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `raw_market_data`
--

INSERT INTO `raw_market_data` (`id`, `date`, `ticker`, `price`, `change_pct`, `volume`) VALUES
(1, '2026-07-30', 'NVDA', 875.12, 4.82, '41.2M'),
(2, '2026-07-30', 'AAPL', 189.84, 1.24, '52.4M'),
(3, '2026-07-30', 'TSLA', 175.34, -2.15, '88.1M'),
(4, '2026-07-30', 'BIST100', 9245.50, 0.78, '12.4B'),
(5, '2026-07-30', 'GOLD', 2350.20, 0.45, '2.1M');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `raw_news`
--

CREATE TABLE `raw_news` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `ticker_sector` varchar(50) NOT NULL,
  `headline` text NOT NULL,
  `source` varchar(100) NOT NULL,
  `url` text DEFAULT NULL,
  `raw_sentiment_score` decimal(4,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `raw_news`
--

INSERT INTO `raw_news` (`id`, `date`, `ticker_sector`, `headline`, `source`, `url`, `raw_sentiment_score`) VALUES
(1, '2026-07-30', 'NVDA', 'Nvidia, yeni Blackwell mimarisine talebin üretim kapasitesini aştığını duyurdu', 'Bloomberg', 'https://www.bloomberg.com', 0.95),
(2, '2026-07-30', 'AAPL', 'Asya tedarikçilerinden gelen raporlar, iPhone siparişlerinde %8\'lik bir daralmaya işaret ediyor', 'Reuters', 'https://www.reuters.com', -0.65),
(3, '2026-07-30', 'TSLA', 'Tesla\'nın batarya üretim hattındaki darboğaz Cybertruck teslimat hedeflerini tehlikeye sokuyor', 'Electrek', 'https://www.electrek.co', -0.45),
(4, '2026-07-30', 'BIST100', 'Borsa İstanbul yabancı yatırımcı girişlerinin etkisiyle 9,200 puan seviyesinin üzerine yerleşti', 'Bloomberg HT', 'https://www.bloomberght.com', 0.75),
(5, '2026-07-30', 'GOLD', 'ABD Merkez Bankası Fed\'den faiz indirimi beklentileri altını yeni tarihi zirveye taşıdı', 'CNBC', 'https://www.cnbc.com', 0.80);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tone_preference` enum('kısa','detaylı') DEFAULT 'detaylı',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eğer tablo daha önce var ise eksik sütunu ekle
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `password` varchar(255) NOT NULL DEFAULT '';

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`user_id`, `email`, `name`, `password`, `tone_preference`, `created_at`) VALUES
('usr_001', 'ahmet@sabah-turu.com', 'Ahmet Yılmaz', '$2y$10$w3q.b.rXoVwQGZgXqE5Q8uqfKx/g4qO0Zg/YkFv46n1x0N3rPjCee', 'detaylı', '2026-07-30 08:37:46')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `password` = VALUES(`password`),
  `tone_preference` = VALUES(`tone_preference`);

-- --------------------------------------------------------

--
-- Migration: Mevcut veritabanına password sütununu ekle
--

ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `password` varchar(255) NOT NULL DEFAULT '';

UPDATE `users`
SET `password` = '$2y$10$w3q.b.rXoVwQGZgXqE5Q8uqfKx/g4qO0Zg/YkFv46n1x0N3rPjCee'
WHERE `user_id` = 'usr_001' AND (`password` = '' OR `password` IS NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `watchlist`
--

CREATE TABLE `watchlist` (
  `watchlist_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `ticker` varchar(20) NOT NULL,
  `sector` varchar(100) NOT NULL,
  `added_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `watchlist`
--

INSERT INTO `watchlist` (`watchlist_id`, `user_id`, `ticker`, `sector`, `added_at`) VALUES
('wl_001', 'usr_001', 'NVDA', 'Teknoloji / Yarı İletken', '2026-07-02'),
('wl_002', 'usr_001', 'AAPL', 'Teknoloji / Tüketici Elektroniği', '2026-07-03'),
('wl_003', 'usr_001', 'TSLA', 'Otomotiv / Temiz Enerji', '2026-07-05'),
('wl_004', 'usr_001', 'BIST100', 'Türkiye Genel Endeks', '2026-07-10'),
('wl_005', 'usr_001', 'GOLD', 'Emtia / Değerli Metaller', '2026-07-12');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `chat_history`
--
ALTER TABLE `chat_history`
  ADD PRIMARY KEY (`chat_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `daily_briefing`
--
ALTER TABLE `daily_briefing`
  ADD PRIMARY KEY (`briefing_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Tablo için indeksler `raw_market_data`
--
ALTER TABLE `raw_market_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_date_ticker` (`date`,`ticker`);

--
-- Tablo için indeksler `raw_news`
--
ALTER TABLE `raw_news`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Tablo için indeksler `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`watchlist_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `raw_market_data`
--
ALTER TABLE `raw_market_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `raw_news`
--
ALTER TABLE `raw_news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `chat_history`
--
ALTER TABLE `chat_history`
  ADD CONSTRAINT `chat_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `daily_briefing`
--
ALTER TABLE `daily_briefing`
  ADD CONSTRAINT `daily_briefing_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `watchlist`
--
ALTER TABLE `watchlist`
  ADD CONSTRAINT `watchlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
