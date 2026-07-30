<?php
require_once 'config.php';

// Dinamik kullanıcı tespiti (React tarafından X-User-Id header'ı ile gönderilir)
$userId = isset($_SERVER['HTTP_X_USER_ID']) ? $_SERVER['HTTP_X_USER_ID'] : 'usr_001';

try {
    // 1. En son brifingi çek
    $briefingStmt = $pdo->prepare("SELECT * FROM daily_briefing WHERE user_id = ? ORDER BY date DESC LIMIT 1");
    $briefingStmt->execute([$userId]);
    $dbBriefing = $briefingStmt->fetch();

    $briefing = null;
    if ($dbBriefing) {
        $briefing = [
            "briefing_id" => $dbBriefing["briefing_id"],
            "user_id" => $dbBriefing["user_id"],
            "date" => date('d F Y', strtotime($dbBriefing["date"])), // ör: 30 Temmuz 2026
            "summary_text" => $dbBriefing["summary_text"],
            "risk_score" => (int)$dbBriefing["risk_score"],
            "top_3_headlines" => json_decode($dbBriefing["top_3_headlines"]),
            "sent_status" => $dbBriefing["sent_status"]
        ];
    } else {
        // DB boşsa varsayılan boş bir şablon oluştur
        $briefing = [
            "briefing_id" => "brf_empty",
            "user_id" => $userId,
            "date" => date('d F Y'),
            "summary_text" => "**Henüz brifing üretilmemiş.** ☕️\n\nTakip listenize hisse senetleri ekleyin. AI ajanımız sabah 06:00'da çalışarak size özel günlük bülteni burada yayınlayacaktır.",
            "risk_score" => 50,
            "top_3_headlines" => [],
            "sent_status" => "pending"
        ];
    }

    // 2. Takip listesindeki varlıkların fiyat verilerini çek
    $watchlistStmt = $pdo->prepare("SELECT ticker FROM watchlist WHERE user_id = ?");
    $watchlistStmt->execute([$userId]);
    $tickers = $watchlistStmt->fetchAll(PDO::FETCH_COLUMN);

    $marketData = [];
    if (!empty($tickers)) {
        // Ticker listesi için in query hazırla
        $inQuery = implode(',', array_fill(0, count($tickers), '?'));
        
        // En güncel fiyat verilerini al
        $marketStmt = $pdo->prepare("
            SELECT r.* FROM raw_market_data r
            INNER JOIN (
                SELECT ticker, MAX(date) as max_date 
                FROM raw_market_data 
                GROUP BY ticker
            ) latest ON r.ticker = latest.ticker AND r.date = latest.max_date
            WHERE r.ticker IN ($inQuery)
        ");
        $marketStmt->execute($tickers);
        $dbMarket = $marketStmt->fetchAll();

        foreach ($dbMarket as $row) {
            // Sparkline grafikleri için son fiyata göre rasgele geçmiş üret (görsel şölen için)
            $history = [];
            $basePrice = (float)$row['price'];
            for ($i = 0; $i < 7; $i++) {
                $history[] = $basePrice * (1 + (rand(-150, 150) / 10000));
            }
            $history[] = $basePrice; // En son değer güncel fiyat

            $marketData[] = [
                "date" => $row["date"],
                "ticker" => $row["ticker"],
                "price" => (float)$row["price"],
                "change_pct" => (float)$row["change_pct"],
                "volume" => $row["volume"],
                "history" => $history
            ];
        }
    }

    // 3. İlgili Haberleri Çek
    $news = [];
    if (!empty($tickers)) {
        $inQuery = implode(',', array_fill(0, count($tickers), '?'));
        $newsStmt = $pdo->prepare("
            SELECT * FROM raw_news 
            WHERE ticker_sector IN ($inQuery) 
            ORDER BY date DESC, id DESC 
            LIMIT 6
        ");
        $newsStmt->execute($tickers);
        $dbNews = $newsStmt->fetchAll();

        foreach ($dbNews as $row) {
            $news[] = [
                "date" => $row["date"],
                "ticker_sector" => $row["ticker_sector"],
                "headline" => $row["headline"],
                "source" => $row["source"],
                "url" => $row["url"],
                "raw_sentiment_score" => (float)$row["raw_sentiment_score"],
                "importance" => (abs($row["raw_sentiment_score"]) > 0.6) ? "High" : ((abs($row["raw_sentiment_score"]) > 0.3) ? "Medium" : "Low")
            ];
        }
    }

    // Sonuçları paketle ve döndür
    echo json_encode([
        "briefing" => $briefing,
        "marketData" => $marketData,
        "news" => $news
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
