<?php
require_once 'config.php';

// ─── Dinamik kullanıcı tespiti ─────────────────────────────────────────────
$userId = isset($_SERVER['HTTP_X_USER_ID']) ? $_SERVER['HTTP_X_USER_ID'] : 'usr_001';

// ─── Groq API Yapılandırması (Ücretsiz · console.groq.com) ────────────────
// API Key .env dosyasından okunur
$envKey = getenv('GROQ_API_KEY') ?: ($_ENV['GROQ_API_KEY'] ?? '');
define('GROQ_API_KEY', $envKey);
define('GROQ_API_URL', 'https://api.groq.com/openai/v1/chat/completions');
define('GROQ_MODEL',   'llama-3.3-70b-versatile'); // Ücretsiz, hızlı, çok dilli

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Yöntem desteklenmiyor."]);
    exit();
}

// ─── Girdileri al (php://input + $_POST fallback) ─────────────────────────
$rawBody = file_get_contents('php://input');
$input = json_decode($rawBody, true);

// Eğer JSON parse başarısız olduysa $_POST'tan dene
if (!is_array($input)) {
    $input = $_POST;
}

$question = isset($input['question']) ? trim($input['question']) : '';

if (empty($question)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Soru boş bırakılamaz.", "raw" => $rawBody]);
    exit();
}

$answer = "";
$geminiSuccess = false;
$tickers = [];

// ─── 1. ADIM: Veritabanından kullanıcı bağlamını topla (RAG Context) ──────
$contextText = "";

try {
    // Kullanıcı bilgisi
    $userStmt = $pdo->prepare("SELECT name, tone_preference FROM users WHERE user_id = ?");
    $userStmt->execute([$userId]);
    $userInfo = $userStmt->fetch();
    $userName = $userInfo ? $userInfo['name'] : 'Kullanıcı';
    $userTone = $userInfo ? $userInfo['tone_preference'] : 'detaylı';

    // Takip listesi ve fiyat verileri
    $wlStmt = $pdo->prepare("
        SELECT w.ticker, w.sector, m.price, m.change_pct, m.volume
        FROM watchlist w 
        LEFT JOIN raw_market_data m ON w.ticker = m.ticker 
            AND m.date = (SELECT MAX(date) FROM raw_market_data)
        WHERE w.user_id = ?
    ");
    $wlStmt->execute([$userId]);
    $watchlistItems = $wlStmt->fetchAll();
    $tickers = array_column($watchlistItems, 'ticker');

    // En güncel brifing
    $briefingStmt = $pdo->prepare("
        SELECT summary_text, risk_score, top_3_headlines 
        FROM daily_briefing 
        WHERE user_id = ? 
        ORDER BY date DESC LIMIT 1
    ");
    $briefingStmt->execute([$userId]);
    $briefing = $briefingStmt->fetch();

    // Bugünkü haberler
    $newsStmt = $pdo->prepare("
        SELECT ticker_sector, headline, raw_sentiment_score, source 
        FROM raw_news 
        WHERE date = CURDATE() OR date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
        ORDER BY ABS(raw_sentiment_score) DESC 
        LIMIT 10
    ");
    $newsStmt->execute();
    $newsItems = $newsStmt->fetchAll();

    // ─── Bağlam metnini oluştur ───────────────────────────────────────────
    $contextText .= "## Kullanıcı Bilgisi\n";
    $contextText .= "İsim: {$userName}\n";
    $contextText .= "Tercih: {$userTone} özet\n\n";

    $contextText .= "## Takip Listesi ve Güncel Fiyatlar\n";
    if (!empty($watchlistItems)) {
        foreach ($watchlistItems as $item) {
            $change = $item['change_pct'] ?? 0;
            $dir = $change >= 0 ? "▲" : "▼";
            $price = $item['price'] ? "\${$item['price']}" : "Fiyat yok";
            $contextText .= "- {$item['ticker']} ({$item['sector']}): {$price} | {$dir}%{$change}\n";
        }
    } else {
        $contextText .= "- Takip listesi boş.\n";
    }

    if ($briefing) {
        $contextText .= "\n## Bugünkü AI Brifing Özeti\n";
        $contextText .= strip_tags($briefing['summary_text']) . "\n";
        $contextText .= "\nGenel Risk Skoru: {$briefing['risk_score']}/100\n";
        
        if ($briefing['top_3_headlines']) {
            $headlines = json_decode($briefing['top_3_headlines'], true);
            if ($headlines) {
                $contextText .= "\nÖne Çıkan Başlıklar:\n";
                foreach ($headlines as $h) {
                    $contextText .= "- {$h}\n";
                }
            }
        }
    }

    if (!empty($newsItems)) {
        $contextText .= "\n## Son Haberler (Duygu Analizi ile)\n";
        foreach ($newsItems as $news) {
            $sentiment = $news['raw_sentiment_score'] > 0.3 ? "📈 Boğa" 
                       : ($news['raw_sentiment_score'] < -0.3 ? "📉 Ayı" : "➡️ Nötr");
            $contextText .= "- [{$news['ticker_sector']}] {$news['headline']} | {$sentiment} ({$news['raw_sentiment_score']})\n";
        }
    }

} catch (PDOException $e) {
    $contextText = "Veritabanı bağlantı sorunu: " . $e->getMessage();
}

// ─── 2. ADIM: Groq API ile Llama'yı Çağır ────────────────────────────────
$systemPrompt = 'Sen "Sabah Turu" adlı kişisel finans asistanısın. Kullanıcının hisse senedi portföyüyle ilgili sorularını, verilen güncel piyasa bağlamı çerçevesinde Türkçe, özlü ve anlaşılır biçimde yanıtla.' . "\n\n" .
    "### Kuralların:\n" .
    "1. Her zaman Türkçe yanıt ver.\n" .
    "2. Yanıtlarını kısa ve net tut. Gereksiz uzun anlatımlardan kaçın.\n" .
    "3. Portföy bağlamını aktif kullan — her soruyu kullanıcının spesifik varlıklarına göre kişiselleştir.\n" .
    "4. Kesin fiyat tahmini yapma (\"yarın %5 yükselecek\" gibi).\n" .
    "5. Markdown formatını kullan (**kalın**, *italik*, madde işaretleri).\n" .
    "6. Cevap sonunda teşvik edici kısa bir kapanış cümlesine yer ver.\n\n" .
    "### Kullanıcının Güncel Portföy Bağlamı:\n" . $contextText;

$groqPayload = [
    'model'       => GROQ_MODEL,
    'messages'    => [
        ['role' => 'system', 'content' => $systemPrompt],
        ['role' => 'user',   'content' => $question]
    ],
    'temperature' => 0.7,
    'max_tokens'  => 800,
    'top_p'       => 0.9
];

$ch = curl_init(GROQ_API_URL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($groqPayload, JSON_UNESCAPED_UNICODE));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . GROQ_API_KEY
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$groqResponse = curl_exec($ch);
$httpCode     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError    = curl_error($ch);
curl_close($ch);

$usedModel = GROQ_MODEL;
if ($httpCode === 200 && $groqResponse) {
    $resData = json_decode($groqResponse, true);
    if (isset($resData['choices'][0]['message']['content'])) {
        $answer        = $resData['choices'][0]['message']['content'];
        $geminiSuccess = true; // Değişken adı aynı kalsın (fallback mantığı için)
    }
}

// ─── 3. ADIM: Gemini başarısız olduysa yerel PHP RAG Fallback ────────────
if (!$geminiSuccess) {
    try {
        $query = mb_strtolower($question, 'UTF-8');
        
        if (empty($watchlistItems)) {
            $answer = "Takip listenizde henüz hiçbir varlık bulunmadığı için analiz yapamıyorum. Lütfen Watchlist sekmesinden hisse senedi veya endeks ekleyin.";
        } elseif (strpos($query, 'risk') !== false || strpos($query, 'tehlike') !== false || strpos($query, 'kayıp') !== false) {
            usort($watchlistItems, fn($a, $b) => ($a['change_pct'] ?? 0) <=> ($b['change_pct'] ?? 0));
            $worst = $watchlistItems[0];
            $riskScore = $briefing ? $briefing['risk_score'] : 50;
            $answer = "Portföyünüzün bugünkü genel risk skoru **{$riskScore}/100** seviyesindedir. ";
            if (($worst['change_pct'] ?? 0) < 0) {
                $answer .= "En zayıf pozisyonunuz dünü **%{$worst['change_pct']}** değer kaybıyla kapatan **{$worst['ticker']}** hissesidir.";
            } else {
                $answer .= "Portföyünüzdeki tüm varlıklar pozitif seyretmektedir. Acil bir risk uyarısı bulunmamaktadır.";
            }
        } elseif (strpos($query, 'portföy') !== false || strpos($query, 'durum') !== false || strpos($query, 'özet') !== false) {
            $bullish = count(array_filter($watchlistItems, fn($i) => ($i['change_pct'] ?? 0) >= 0));
            $bearish = count($watchlistItems) - $bullish;
            $answer = "Takip listenizde **" . count($watchlistItems) . "** varlık var. **{$bullish}** tanesi yükselişte, **{$bearish}** tanesi düşüşte. ";
            if ($briefing) $answer .= "Genel risk seviyesi **%{$briefing['risk_score']}**.";
        } else {
            $answer = "Merhaba! Portföyünüzde **" . implode(', ', $tickers) . "** varlıklarını takip ediyorsunuz. Risk durumu, belirli bir hisse veya brifing özeti hakkında soru sorabilirsiniz.\n\n";
            $answer .= "*(Not: Gemini AI şu an ulaşılamıyor, yerel analiz motoru devrede.)*";
            if ($curlError) $answer .= "\nHata: " . $curlError;
        }
    } catch (Exception $e) {
        $answer = "Analiz sırasında hata oluştu: " . $e->getMessage();
    }
}

// ─── 4. ADIM: Sohbet geçmişine kaydet ───────────────────────────────────
try {
    $chatId = 'ch_' . uniqid();
    $foundTickers = array_filter($tickers, fn($t) => stripos($question, $t) !== false);
    $clickedTopics = implode(', ', $foundTickers);

    $insertStmt = $pdo->prepare("INSERT INTO chat_history (chat_id, user_id, question, answer, date, clicked_topics) VALUES (?, ?, ?, ?, NOW(), ?)");
    $insertStmt->execute([$chatId, $userId, $question, $answer, $clickedTopics]);
} catch (PDOException $e) {
    error_log("Chat history save failed: " . $e->getMessage());
}

// ─── Sonucu döndür ────────────────────────────────────────────────────────
echo json_encode([
    "success"        => true,
    "question"       => $question,
    "answer"         => $answer,
    "ai_source"      => $geminiSuccess ? "groq/{$usedModel}" : "local_rag"
], JSON_UNESCAPED_UNICODE);
?>
