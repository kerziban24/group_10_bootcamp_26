<?php
require_once 'config.php';

// Dinamik kullanıcı tespiti (React tarafından X-User-Id header'ı ile gönderilir)
$userId = isset($_SERVER['HTTP_X_USER_ID']) ? $_SERVER['HTTP_X_USER_ID'] : 'usr_001';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->prepare("SELECT * FROM watchlist WHERE user_id = ?");
            $stmt->execute([$userId]);
            $watchlist = $stmt->fetchAll();
            echo json_encode($watchlist, JSON_UNESCAPED_UNICODE);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        // JSON gövdesini al
        $input = json_decode(file_get_contents('php://input'), true);
        $ticker = isset($input['ticker']) ? strtoupper(trim($input['ticker'])) : '';
        $sector = isset($input['sector']) ? trim($input['sector']) : 'Teknoloji';

        if (empty($ticker)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Ticker boş bırakılamaz."]);
            exit();
        }

        try {
            // Ticker zaten ekli mi kontrol et
            $checkStmt = $pdo->prepare("SELECT watchlist_id FROM watchlist WHERE user_id = ? AND ticker = ?");
            $checkStmt->execute([$userId, $ticker]);
            if ($checkStmt->fetch()) {
                echo json_encode(["success" => false, "message" => "$ticker zaten takip listenizde."]);
                exit();
            }

            // Yeni watchlist_id oluştur
            $watchlistId = 'wl_' . uniqid();
            $addedAt = date('Y-m-d');

            $insertStmt = $pdo->prepare("INSERT INTO watchlist (watchlist_id, user_id, ticker, sector, added_at) VALUES (?, ?, ?, ?, ?)");
            $insertStmt->execute([$watchlistId, $userId, $ticker, $sector, $addedAt]);

            // Test kolaylığı için, ham veri yoksa rasgele ham veri ekleyelim
            $checkDataStmt = $pdo->prepare("SELECT id FROM raw_market_data WHERE date = ? AND ticker = ?");
            $today = date('Y-m-d');
            $checkDataStmt->execute([$today, $ticker]);
            if (!$checkDataStmt->fetch()) {
                $price = rand(50, 900) + (rand(0, 99) / 100);
                $changePct = (rand(-400, 500) / 100);
                $volume = rand(1, 99) . 'M';
                
                $insertDataStmt = $pdo->prepare("INSERT INTO raw_market_data (date, ticker, price, change_pct, volume) VALUES (?, ?, ?, ?, ?)");
                $insertDataStmt->execute([$today, $ticker, $price, $changePct, $volume]);
            }

            echo json_encode(["success" => true, "message" => "$ticker başarıyla eklendi."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? trim($_GET['id']) : '';

        if (empty($id)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Lütfen silinecek varlık ID'sini belirtin."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM watchlist WHERE watchlist_id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "Varlık listeden kaldırıldı."]);
            } else {
                echo json_encode(["success" => false, "message" => "Kayıt bulunamadı veya yetkiniz yok."]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Yöntem desteklenmiyor."]);
        break;
}
?>
