<?php
declare(strict_types=1);

const NRP_API_ROOT = __DIR__;

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function config(): array
{
    static $config;
    if (is_array($config)) {
        return $config;
    }

    $configuredPath = getenv('NRP_ADMIN_CONFIG') ?: '';
    $documentRoot = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''), '/\\');
    $candidates = array_filter([
        $configuredPath,
        $documentRoot !== '' ? dirname($documentRoot) . '/nrp-admin-config.php' : '',
        NRP_API_ROOT . '/config.php',
    ]);
    $path = '';
    foreach ($candidates as $candidate) {
        if (is_file($candidate)) {
            $path = $candidate;
            break;
        }
    }
    if ($path === '') {
        respond(['error' => 'API admin belum dikonfigurasi.'], 503);
    }

    $loaded = require $path;
    if (!is_array($loaded)) {
        respond(['error' => 'Konfigurasi API tidak sah.'], 503);
    }
    $config = $loaded;
    return $config;
}

function database(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $db = config()['database'] ?? [];
    foreach (['host', 'name', 'user', 'password'] as $key) {
        if (!isset($db[$key]) || $db[$key] === '') {
            respond(['error' => 'Konfigurasi pangkalan data tidak lengkap.'], 503);
        }
    }

    try {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $db['host'], (int) ($db['port'] ?? 3306), $db['name']);
        $pdo = new PDO($dsn, $db['user'], $db['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $error) {
        error_log('NRP database connection failed: ' . $error->getMessage());
        respond(['error' => 'Sambungan pangkalan data gagal.'], 503);
    }
    return $pdo;
}

function request_json(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    if (!is_array($data)) {
        respond(['error' => 'Data permintaan tidak sah.'], 400);
    }
    return $data;
}

function request_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== $method) {
        header('Allow: ' . $method);
        respond(['error' => 'Kaedah permintaan tidak dibenarkan.'], 405);
    }
}

function verify_origin(): void
{
    $origin = rtrim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''), '/');
    $allowed = rtrim((string) (config()['security']['site_origin'] ?? ''), '/');
    if ($origin !== '' && $allowed !== '' && !hash_equals($allowed, $origin)) {
        respond(['error' => 'Origin permintaan tidak dibenarkan.'], 403);
    }
}

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $security = config()['security'] ?? [];
    session_name((string) ($security['session_name'] ?? 'nrp_admin_session'));
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function current_user(): ?array
{
    start_admin_session();
    if (empty($_SESSION['admin_id']) || empty($_SESSION['username'])) {
        return null;
    }
    return ['id' => (int) $_SESSION['admin_id'], 'username' => (string) $_SESSION['username']];
}

function require_admin(bool $csrf = false): array
{
    $user = current_user();
    if (!$user) {
        respond(['error' => 'Sesi admin telah tamat. Sila log masuk semula.'], 401);
    }
    if ($csrf) {
        verify_origin();
        $provided = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
        $expected = (string) ($_SESSION['csrf'] ?? '');
        if ($provided === '' || $expected === '' || !hash_equals($expected, $provided)) {
            respond(['error' => 'Token keselamatan tidak sah.'], 403);
        }
    }
    return $user;
}

function audit(string $action, string $detail = '', ?int $adminId = null): void
{
    try {
        $stmt = database()->prepare('INSERT INTO admin_audit (admin_id, action, detail, ip_address) VALUES (?, ?, ?, ?)');
        $stmt->execute([$adminId, mb_substr($action, 0, 80), mb_substr($detail, 0, 500), mb_substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45)]);
    } catch (Throwable $error) {
        error_log('NRP audit failed: ' . $error->getMessage());
    }
}

function github_request(string $method, string $path, ?array $body = null): array
{
    $github = config()['github'] ?? [];
    foreach (['owner', 'repo', 'branch', 'token'] as $key) {
        if (empty($github[$key])) {
            respond(['error' => 'Konfigurasi GitHub tidak lengkap.'], 503);
        }
    }

    $url = 'https://api.github.com/repos/' . rawurlencode($github['owner']) . '/' . rawurlencode($github['repo']) . '/' . ltrim($path, '/');
    $curl = curl_init($url);
    $headers = [
        'Accept: application/vnd.github+json',
        'Authorization: Bearer ' . $github['token'],
        'User-Agent: NRP-Website-Admin',
        'X-GitHub-Api-Version: 2022-11-28',
    ];
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
    ]);
    if ($body !== null) {
        $encoded = json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $encoded);
        $headers[] = 'Content-Type: application/json';
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    }

    $raw = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $curlError = curl_error($curl);
    curl_close($curl);
    if ($raw === false || $curlError !== '') {
        error_log('NRP GitHub request failed: ' . $curlError);
        respond(['error' => 'Tidak dapat menghubungi GitHub.'], 502);
    }
    $data = json_decode($raw, true);
    if ($status < 200 || $status >= 300 || !is_array($data)) {
        error_log('NRP GitHub API error ' . $status . ': ' . mb_substr($raw, 0, 1000));
        $message = $status === 401 || $status === 403 ? 'Akses GitHub ditolak. Semak token pelayan.' : 'GitHub tidak dapat memproses perubahan.';
        respond(['error' => $message], 502);
    }
    return $data;
}

function content_api_path(string $repoPath): string
{
    return 'contents/' . implode('/', array_map('rawurlencode', explode('/', $repoPath)));
}

function validate_content(array $content): void
{
    $requiredObjects = ['site', 'hero', 'pageHeroes', 'about'];
    $requiredArrays = ['whyChooseUs', 'faqs', 'galleryItems', 'blogPosts', 'customLawyers', 'hiddenLawyers', 'customServices', 'hiddenServices'];
    foreach ($requiredObjects as $key) {
        if (!isset($content[$key]) || !is_array($content[$key])) {
            respond(['error' => 'Kandungan tidak lengkap: ' . $key], 422);
        }
    }
    foreach ($requiredArrays as $key) {
        if (!isset($content[$key]) || !is_array($content[$key])) {
            respond(['error' => 'Senarai kandungan tidak sah: ' . $key], 422);
        }
    }
    $encoded = json_encode($content, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($encoded === false || strlen($encoded) > 1000000) {
        respond(['error' => 'Kandungan terlalu besar atau tidak sah.'], 422);
    }
}
