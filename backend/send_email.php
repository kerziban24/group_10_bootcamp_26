<?php
require_once 'config.php';

$userId = isset($_SERVER['HTTP_X_USER_ID']) ? $_SERVER['HTTP_X_USER_ID'] : 'usr_001';
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Yöntem desteklenmiyor."]);
    exit();
}

// ─── Native PHP SMTP - Port 587 + STARTTLS (Gmail) ───────────────────────────
function sendGmailSMTP($toEmail, $toName, $fromEmail, $fromPass, $subject, $htmlBody) {
    $socket = @fsockopen('smtp.gmail.com', 587, $errno, $errstr, 10);
    if (!$socket) throw new Exception("SMTP bağlantısı kurulamadı: $errstr ($errno)");

    $read = function() use ($socket) {
        $resp = '';
        while ($line = fgets($socket, 512)) {
            $resp .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $resp;
    };
    $write = function($cmd) use ($socket) {
        fwrite($socket, "$cmd\r\n");
    };
    $expect = function($code) use ($read) {
        $resp = $read();
        if ((int)substr($resp, 0, 3) !== $code)
            throw new Exception("SMTP Hata (beklenen $code): " . trim($resp));
        return $resp;
    };

    $expect(220);                                   // Greeting

    $write("EHLO smtp.gmail.com"); $expect(250);
    $write("STARTTLS");           $expect(220);

    // TLS yükseltme
    stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

    $write("EHLO smtp.gmail.com"); $expect(250);
    $write("AUTH LOGIN");          $expect(334);
    $write(base64_encode($fromEmail)); $expect(334);
    $write(base64_encode($fromPass));  $expect(235); // ← Auth onayı

    $write("MAIL FROM:<$fromEmail>"); $expect(250);
    $write("RCPT TO:<$toEmail>");     $expect(250);
    $write("DATA");                   $expect(354);

    $boundary = md5(uniqid());
    $msg  = "From: Sabah Turu <$fromEmail>\r\n";
    $msg .= "To: $toName <$toEmail>\r\n";
    $msg .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
    $msg .= "Date: " . date('r') . "\r\n\r\n";
    $msg .= "--$boundary\r\n";
    $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
    $msg .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $msg .= chunk_split(base64_encode($htmlBody)) . "\r\n";
    $msg .= "--$boundary--\r\n";

    $write($msg . "\r\n.");
    $expect(250); // Gönderim onayı

    $write("QUIT");
    fclose($socket);
    return true;
}
// ─────────────────────────────────────────────────────────────────────────────

try {
    $smtpUser = getenv('SMTP_USER');
    $smtpPass = getenv('SMTP_PASS');

    if (!$smtpUser || !$smtpPass)
        throw new Exception("SMTP kimlik bilgileri .env dosyasında bulunamadı.");

    // Kullanıcı bilgilerini veritabanından al
    $userStmt = $pdo->prepare("SELECT email, name FROM users WHERE user_id = ?");
    $userStmt->execute([$userId]);
    $userData = $userStmt->fetch();
    if (!$userData) throw new Exception("Kullanıcı bulunamadı.");

    $userEmail = $userData['email'];
    $userName  = $userData['name'];

    // En güncel brifingi al
    $briefingStmt = $pdo->prepare(
        "SELECT summary_text, date FROM daily_briefing WHERE user_id = ? ORDER BY date DESC LIMIT 1"
    );
    $briefingStmt->execute([$userId]);
    $briefingData = $briefingStmt->fetch();
    if (!$briefingData) throw new Exception("Gönderilecek günlük brifing bulunamadı.");

    $briefingText = $briefingData['summary_text'];
    $briefingDate = date('d-m-Y', strtotime($briefingData['date']));

    // Markdown → HTML
    $html = htmlspecialchars($briefingText, ENT_QUOTES, 'UTF-8');
    $html = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $html);
    $html = preg_replace('/### (.*?)(\n|$)/', '<h2 style="color:#d4a373;margin:16px 0 6px 0;">$1</h2>', $html);
    $html = preg_replace('/\* (.*?)(\n|$)/', '<li style="margin:4px 0;">$1</li>', $html);
    $html = nl2br($html);

    // Premium HTML e-posta şablonu
    $emailHtml = "<!DOCTYPE html>
<html lang='tr'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;'>
<div style='max-width:600px;margin:32px auto;background:#1a1410;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.3);'>
  <div style='background:linear-gradient(135deg,#2d1f0e,#1a1410);padding:36px 40px;text-align:center;border-bottom:2px solid #d4a373;'>
    <div style='font-size:36px;margin-bottom:8px;'>☕</div>
    <h1 style='color:#d4a373;margin:0;font-size:28px;letter-spacing:2px;font-weight:normal;'>SABAH TURU</h1>
    <p style='color:#a89070;font-size:13px;margin:8px 0 0;font-style:italic;'>Kişisel Piyasa Özetin &middot; $briefingDate</p>
  </div>
  <div style='padding:36px 40px;'>
    <p style='color:#e8dcc8;font-size:16px;margin:0 0 24px;'>Merhaba <strong style='color:#d4a373;'>$userName</strong>,</p>
    <p style='color:#b8a898;font-size:14px;margin:0 0 28px;line-height:1.6;'>İşte bugünün piyasa özeti. Kahvenizi yudumlarken okuyabileceğiniz 90 saniyelik brifing:</p>
    <div style='background:#251a0f;border-left:3px solid #d4a373;border-radius:0 8px 8px 0;padding:24px 28px;line-height:1.8;color:#d4c8b8;font-size:14px;'>
      $html
    </div>
    <div style='text-align:center;margin:32px 0 0;'>
      <a href='http://localhost:5173' style='display:inline-block;background:linear-gradient(135deg,#d4a373,#b8865a);color:#1a1410;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:14px;'>📊 Uygulamayı Aç</a>
    </div>
  </div>
  <div style='background:#120e0a;padding:20px 40px;text-align:center;border-top:1px solid #2d2218;'>
    <p style='color:#5a4a3a;font-size:11px;margin:0;line-height:1.6;'>
      Bloomberg terminali değil, sabah kahvenizi içerken okuyacağınız kişisel piyasa özetiniz.<br>
      &copy; " . date('Y') . " Sabah Turu &middot; Tüm hakları saklıdır.
    </p>
  </div>
</div>
</body></html>";

    $subject = "☕ Sabah Turu - $briefingDate Piyasa Brifing";

    sendGmailSMTP($userEmail, $userName, $smtpUser, $smtpPass, $subject, $emailHtml);

    echo json_encode([
        "success"   => true,
        "message"   => "Brifing e-postası başarıyla $userEmail adresine gönderildi! 📬",
        "recipient" => $userEmail
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Mail gönderilemedi: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
