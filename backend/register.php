<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Yöntem desteklenmiyor."]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';
$tone = isset($input['tone_preference']) ? trim($input['tone_preference']) : 'detaylı';

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Ad, E-Posta ve Şifre alanları zorunludur."]);
    exit();
}

try {
    // E-posta zaten kayıtlı mı kontrol et
    $checkStmt = $pdo->prepare("SELECT user_id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    $existingUser = $checkStmt->fetch();
    
    // Şifreyi BCRYPT ile hashle
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    if ($existingUser) {
        $userId = $existingUser['user_id'];
        // Mevcut kullanıcı bilgilerini güncelle
        $updateStmt = $pdo->prepare("UPDATE users SET name = ?, password = ?, tone_preference = ? WHERE user_id = ?");
        $updateStmt->execute([$name, $hashedPassword, $tone, $userId]);
        $message = "Kullanıcı profili güncellendi.";
    } else {
        // Yeni benzersiz kullanıcı ID'si oluştur
        $userId = 'usr_' . uniqid();
        // Yeni kullanıcıyı kaydet
        $insertStmt = $pdo->prepare("INSERT INTO users (user_id, email, name, password, tone_preference, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $insertStmt->execute([$userId, $email, $name, $hashedPassword, $tone]);
        $message = "Kullanıcı başarıyla kaydoldu.";
    }

    // 2. Takip Listesini Hazırla (Eğer daha önce eklenmemişse varsayılanları ekle)
    $wlCheck = $pdo->prepare("SELECT COUNT(*) FROM watchlist WHERE user_id = ?");
    $wlCheck->execute([$userId]);
    $hasWatchlist = $wlCheck->fetchColumn();

    if ($hasWatchlist == 0) {
        $defaultWatchlist = [
            ['wl_' . uniqid(), 'NVDA', 'Teknoloji / Yarı İletken'],
            ['wl_' . uniqid(), 'AAPL', 'Teknoloji / Tüketici Elektroniği'],
            ['wl_' . uniqid(), 'TSLA', 'Otomotiv / Temiz Enerji'],
            ['wl_' . uniqid(), 'BIST100', 'Türkiye Genel Endeks'],
            ['wl_' . uniqid(), 'GOLD', 'Emtia / Değerli Metaller']
        ];
        
        $wlInsert = $pdo->prepare("INSERT INTO watchlist (watchlist_id, user_id, ticker, sector, added_at) VALUES (?, ?, ?, ?, NOW())");
        foreach ($defaultWatchlist as $item) {
            $wlInsert->execute([$item[0], $userId, $item[1], $item[2]]);
        }
    }

    // 3. Kullanıcıya Özel Günlük Brifing Oluştur (İsmini dinamik olarak bültene yerleştir)
    $firstName = explode(' ', $name)[0];
    
    $briefingText = "";
    if ($tone === 'kısa') {
        $briefingText = "**Günaydın {$firstName}, kahven hazırsa 90 saniyelik HIZLI Sabah Turu başlıyor!** ☕️\n\nBugün portföyün **Nvidia** öncülüğünde pozitif bir hava yakalarken, **Apple** ve **Tesla** hisseleri tedarik zinciri darboğazları sebebiyle satış baskısı altında.\n\n*   🚀 **NVDA (+4.82%):** Blackwell mimarisine talep patlaması devam ediyor, portföyün en güçlüsü.\n*   ⚠️ **AAPL (+1.24%):** Asya sipariş kesintileri haberi nedeniyle bugün dalgalı seyredebilir.\n*   📉 **TSLA (-2.15%):** Batarya darboğazı Cybertruck teslimatlarını etkiliyor, en zayıf halka.\n*   ✨ **GOLD (+0.45%):** Fed indirim beklentileriyle tarihi zirve olan $2,350'da seyrediyor.\n\nGenel piyasa riski bugün **%42 (Dengeli)** seviyesinde. Altın koruması aktif.";
    } else {
        $briefingText = "**Günaydın {$firstName}, kahven hazırsa bugünün 90 saniyelik piyasa turu başlıyor!** ☕️\n\nBugün portföyünde **Nvidia** öncülüğündeki rüzgarı arkana alıyorsun, ancak **Apple** ve **Tesla** cephelerindeki bazı tedarik zinciri pürüzleri can sıkabilir. Altın ise zirve yürüyüşüne kararlı şekilde devam ediyor.\n\n### 🔍 Portföyünde Bugün Neler Var?\n\n*   🚀 **NVDA (+4.82%):** Yeni Blackwell çip mimarisine olan çılgın talep üretimi aşmış durumda. Bu gelişme, portföyünün teknoloji ağırlığını en yüksek getiriyle destekleyen lokomotif yapmaya devam ediyor.\n*   ⚠️ **AAPL (+1.24%):** Dünü artıda kapatsa da Asya'daki tedarikçilerden gelen **sipariş kesintisi** haberleri bugün Nasdaq açılışında hisse üzerinde bir miktar satış baskısı yaratabilir, temkinli olmakta fayda var.\n*   📉 **TSLA (-2.15%):** Batarya paketleme hatlarındaki darboğaz Cybertruck teslimatlarını yavaşlatıyor. Teknik olarak 180$ desteğinin altına sarkılması, kısa vadede portföyün en riskli pozisyonu haline getiriyor.\n*   📈 **BIST100 (+0.78%):** Yabancı girişlerinin artmasıyla 9,200 seviyesini destek haline getirdi. Bankacılık sektörü öncülüğünde dirençli duruyor.\n*   ✨ **GOLD (+0.45%):** Fed'in faiz indirim sinyalleriyle 2,350$ seviyesinde yeni tarihi zirve yaptı. Portföyünün güvenli liman koruması görevini kusursuz yapıyor.\n\n### 🛡️ Günün Risk Değerlendirmesi\nBugün en çok dikkat etmen gereken yer **Tesla'nın batarya sorunları** ve **Apple'ın Asya siparişlerindeki düşüş** sinyali. Teknoloji ağırlıklı portföyün için bugün hafif dalgalı ama Nvidia sayesinde pozitif eğilimli bir gün başlangıcı bekliyoruz.\n\n*Kahvenden bir yudum daha al ve aşağıdaki asistan sohbetinden \"Bugün en riskli pozisyonum hangisi?\" diye sorarak detayları alabilirsin!*";
    }

    // DailyBriefing tablosuna ekle/güncelle
    $dbBriefingId = 'brf_' . $userId;
    $dbBriefingInsert = $pdo->prepare("
        INSERT INTO daily_briefing (briefing_id, user_id, date, summary_text, risk_score, top_3_headlines, sent_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE summary_text = ?, risk_score = ?
    ");
    
    $today = date('Y-m-d');
    $topHeadlines = json_encode([
        "Nvidia Blackwell çiplerinde talep patlaması yaşanıyor.",
        "Apple Asya tedarik zincirinde sipariş azaltma iddiaları.",
        "Tesla batarya üretim darboğazı teslimatları yavaşlatabilir."
    ], JSON_UNESCAPED_UNICODE);

    $dbBriefingInsert->execute([
        $dbBriefingId, 
        $userId, 
        $today, 
        $briefingText, 
        42, 
        $topHeadlines, 
        'sent', 
        $briefingText, 
        42
    ]);

    // Kayıtlı olan veriyi döndür
    echo json_encode([
        "success" => true,
        "message" => $message,
        "user" => [
            "user_id" => $userId,
            "name" => $name,
            "email" => $email,
            "tone_preference" => $tone
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı Hatası: " . $e->getMessage()]);
}
?>
