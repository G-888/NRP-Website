<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'GET') {
    $setupRequired = false;
    try {
        $completed = database()->query("SELECT setting_value FROM admin_settings WHERE setting_key = 'setup_completed'")->fetchColumn();
        $setupRequired = $completed !== '1';
    } catch (Throwable $error) {
        $setupRequired = true;
    }
    $user = current_user();
    respond([
        'authenticated' => $user !== null,
        'setupRequired' => $setupRequired,
        'user' => $user ? ['username' => $user['username']] : null,
        'csrf' => $user ? (string) ($_SESSION['csrf'] ?? '') : null,
    ]);
}

if ($method === 'DELETE') {
    $user = require_admin(true);
    audit('logout', 'Admin logged out', $user['id']);
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    respond(['ok' => true]);
}

request_method('POST');
verify_origin();
$data = request_json();
$username = trim((string) ($data['username'] ?? ''));
$password = (string) ($data['password'] ?? '');
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');

$attempts = database()->prepare("SELECT COUNT(*) FROM admin_audit WHERE action = 'login_failed' AND ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
$attempts->execute([$ip]);
if ((int) $attempts->fetchColumn() >= 5) {
    respond(['error' => 'Terlalu banyak percubaan. Cuba semula selepas 15 minit.'], 429);
}

$stmt = database()->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? AND enabled = 1 LIMIT 1');
$stmt->execute([$username]);
$admin = $stmt->fetch();
if (!$admin || !password_verify($password, $admin['password_hash'])) {
    audit('login_failed', 'Invalid credentials for ' . mb_substr($username, 0, 50));
    usleep(350000);
    respond(['error' => 'Nama pengguna atau kata laluan tidak tepat.'], 401);
}

start_admin_session();
session_regenerate_id(true);
$_SESSION['admin_id'] = (int) $admin['id'];
$_SESSION['username'] = (string) $admin['username'];
$_SESSION['csrf'] = bin2hex(random_bytes(32));
audit('login', 'Admin logged in', (int) $admin['id']);
respond(['csrf' => $_SESSION['csrf'], 'user' => ['username' => $_SESSION['username']]]);
