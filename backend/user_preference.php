<?php
require_once 'config.php';

// Dinamik kullanıcı tespiti (React tarafından X-User-Id header'ı ile gönderilir)
$userId = isset($_SERVER['HTTP_X_USER_ID']) ? $_SERVER['HTTP_X_USER_ID'] : 'usr_001';
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Yöntem desteklenmiyor."]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$tone = isset($input['tone_preference']) ? trim($input['tone_preference']) : 'detaylı';

if ($tone !== 'kısa' && $tone !== 'detaylı') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Geçersiz tercih değeri."]);
    exit();
}

try {
    $stmt = $pdo->prepare("UPDATE users SET tone_preference = ? WHERE user_id = ?");
    $stmt->execute([$tone, $userId]);
    
    // Eğer ton değiştiyse, günlük brifing metnini de buna göre simüle et
    // Bu işlem normalde n8n/AI ajanı tarafında yapılır ancak test kolaylığı için buraya da ekledik
    if ($tone === 'kısa') {
        $shortText = "**Günaydın Ahmet, kahven hazırsa 90 saniyelik HIZLI Sabah Turu başlıyor!** ☕️\n\nBugün portföyün **Nvidia** öncülüğünde pozitif bir hava yakalarken, **Apple** ve **Tesla** hisseleri tedarik zinciri darboğazları sebebiyle satış baskısı altında.\n\n*   🚀 **NVDA (+4.82%):** Blackwell mimarisine talep patlaması devam ediyor, portföyün en güçlüsü.\n*   ⚠️ **AAPL (+1.24%):** Asya sipariş kesintileri haberi nedeniyle bugün dalgalı seyredebilir.\n*   📉 **TSLA (-2.15%):** Batarya darboğazı Cybertruck teslimatlarını etkiliyor, en zayıf halka.\n*   ✨ **GOLD (+0.45%):** Fed indirim beklentileriyle tarihi zirve olan $2,350'da seyrediyor.\n\nGenel piyasa riski bugün **%42 (Dengeli)** seviyesinde. Altın koruması aktif.";
        
        $briefingStmt = $pdo->prepare("UPDATE daily_briefing SET summary_text = ? WHERE user_id = ?");
        $briefingStmt->execute([$shortText, $userId]);
    } else {
        $longText = "**Günaydın Ahmet, kahven hazırsa bugünün 90 saniyelik piyasa turu başlıyor!** ☕️\n\nBugün portföyünde **Nvidia** öncülüğündeki rüzgarı arkana alıyorsun, ancak **Apple** ve **Tesla** cephelerindeki bazı tedarik zinciri pürüzleri can sıkabilir. Altın ise zirve yürüyüşüne kararlı şekilde devam ediyor.\n\n### 🔍 Portföyünde Bugün Neler Var?\n\n*   🚀 **NVDA (+4.82%):** Yeni Blackwell çip mimarisine olan çılgın talep üretimi aşmış durumda. Bu gelişme, portföyünün teknoloji ağırlığını en yüksek getiriyle destekleyen lokomotif yapmaya devam ediyor.\n*   ⚠️ **AAPL (+1.24%):** Dünü artıda kapatsa da Asya'daki tedarikçilerden gelen **sipariş kesintisi** haberleri bugün Nasdaq açılışında hisse üzerinde bir miktar satış baskısı yaratabilir, temkinli olmakta fayda var.\n*   📉 **TSLA (-2.15%):** Batarya paketleme hatlarındaki darboğaz Cybertruck teslimatlarını yavaşlatıyor. Teknik olarak 180$ desteğinin altına sarkılması, kısa vadede portföyün en riskli pozisyonu haline getiriyor.\n*   📈 **BIST100 (+0.78%):** Yabancı girişlerinin artmasıyla 9,200 seviyesini destek haline getirdi. Bankacılık sektörü öncülüğünde dirençli duruyor.\n*   ✨ **GOLD (+0.45%):** Fed'in faiz indirim sinyalleriyle 2,350$ seviyesinde yeni tarihi zirve yaptı. Portföyünün güvenli liman koruması görevini kusursuz yapıyor.\n\n### 🛡️ Günün Risk Değerlendirmesi\nBugün en çok dikkat etmen gereken yer **Tesla'nın batarya sorunları** ve **Apple'ın Asya siparişlerindeki düşüş** sinyali. Teknoloji ağırlıklı portföyün için bugün hafif dalgalı ama Nvidia sayesinde pozitif eğilimli bir gün başlangıcı bekliyoruz.\n\n*Kahvenden bir yudum daha al ve aşağıdaki asistan sohbetinden \"Bugün en riskli pozisyonum hangisi?\" diye sorarak detayları alabilirsin!*";
        
        $briefingStmt = $pdo->prepare("UPDATE daily_briefing SET summary_text = ? WHERE user_id = ?");
        $briefingStmt->execute([$longText, $userId]);
    }

    echo json_encode(["success" => true, "message" => "Okuma stili tercihi güncellendi."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
