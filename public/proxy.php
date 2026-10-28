<?php
/**
 * Proxy reverso para impressoras internas.
 * Roda no XAMPP dentro da rede corporativa (http://catjts21114029:8000).
 *
 * Uso: proxy.php?url=http://10.50.8.11/DevMgmt/ConsumableConfigDyn.xml
 *
 * Impressoras Canon exigem login na Interface Remota. As credenciais ficam em
 * proxy.config.php (fora do git — ver proxy.config.example.php).
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

$configFile = __DIR__ . '/proxy.config.php';
$config     = file_exists($configFile) ? require $configFile : [];
$canonAuth  = $config['canon'][$host] ?? null;

// Sessão da Canon reaproveitada entre requisições (um cookie jar por IP)
$cookieJar = $canonAuth ? sys_get_temp_dir() . '/sesi_proxy_' . md5($host) . '.txt' : null;

function printerRequest(string $url, ?string $cookieJar, ?string $postBody = null): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,   // aceita certificados autoassinados das impressoras
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT      => 'Mozilla/5.0',
    ]);
    if ($cookieJar) {
        curl_setopt($ch, CURLOPT_COOKIEJAR,  $cookieJar);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieJar);
    }
    if ($postBody !== null) {
        curl_setopt($ch, CURLOPT_POST,       true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postBody);
    }

    $res = [
        'body'  => curl_exec($ch),
        'code'  => curl_getinfo($ch, CURLINFO_HTTP_CODE),
        'ctype' => curl_getinfo($ch, CURLINFO_CONTENT_TYPE),
        'final' => curl_getinfo($ch, CURLINFO_EFFECTIVE_URL),
        'error' => curl_error($ch),
    ];
    curl_close($ch);
    return $res;
}

$res = printerRequest($url, $cookieJar);

// Sessão Canon expirada/inexistente → redireciona para t_sessError.html ou login.html
if ($canonAuth && empty($res['error']) && preg_match('/sessError|login\.html/', $res['final'])) {
    $base = "http://$host";
    printerRequest("$base/login.html", $cookieJar);
    printerRequest("$base/checkLogin.cgi", $cookieJar, http_build_query([
        'i0012' => '1', // Modo do Gerente do Sistema
        'i0014' => $canonAuth['id'],
        'i0016' => $canonAuth['pin'],
    ]));
    $res = printerRequest($url, $cookieJar);
}

if ($res['body'] === false || !empty($res['error'])) {
    http_response_code(502);
    echo json_encode(['error' => 'Impressora inacessível: ' . $res['error']]);
    exit;
}

header('Content-Type: ' . ($res['ctype'] ?: 'text/plain; charset=utf-8'));
http_response_code($res['code']);
echo $res['body'];
