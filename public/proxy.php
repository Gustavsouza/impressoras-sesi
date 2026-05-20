<?php
/**
 * Proxy reverso para impressoras internas.
 * Roda no XAMPP dentro da rede corporativa.
 * Ignora certificados autoassinados e adiciona cabeçalhos CORS.
 *
 * Uso: proxy.php?url=https://10.50.8.11/DevMgmt/ConsumableConfigDyn.xml
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('X-SESI-Proxy: true'); // sinaliza ao frontend que o proxy está ativo

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$url = isset($_GET['url']) ? trim($_GET['url']) : '';

if (empty($url)) {
    http_response_code(400);
    echo json_encode(['error' => 'Parâmetro url ausente']);
    exit;
}

// Segurança: apenas IPs das sub-redes corporativas conhecidas
$host = parse_url($url, PHP_URL_HOST);
if (!preg_match('/^10\.(50|40)\.8\./', $host)) {
    http_response_code(403);
    echo json_encode(['error' => 'Host não permitido']);
    exit;
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,   // aceita certificados autoassinados
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_TIMEOUT        => 8,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT      => 'Mozilla/5.0',
]);

$body      = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$ctype     = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$curlError = curl_error($ch);
curl_close($ch);

if ($body === false || !empty($curlError)) {
    http_response_code(502);
    echo json_encode(['error' => 'Impressora inacessível: ' . $curlError]);
    exit;
}

header('Content-Type: ' . ($ctype ?: 'text/plain; charset=utf-8'));
http_response_code($httpCode);
echo $body;
