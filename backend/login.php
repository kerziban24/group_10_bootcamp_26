<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Yöntem desteklenmiyor."]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "E-Posta ve Şifre alanları zorunludur."]);
    exit();
}

try {
    // E-postaya göre kullanıcıyı ara
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // Şifreyi doğrula
        if (password_verify($password, $user['password'])) {
            echo json_encode([
                "success" => true,
                "message" => "Giriş başarılı.",
                "user" => [
                    "user_id" => $user['user_id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "tone_preference" => $user['tone_preference']
                ]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "E-Posta veya şifre hatalı."]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "E-Posta veya şifre hatalı."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı Hatası: " . $e->getMessage()]);
}
?>
