<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

request_method('POST');
verify_origin();
$data = request_json();
$setupKey = (string) ($data['setupKey'] ?? '');
$expectedKey = (string) (config()['security']['setup_key'] ?? '');
if ($setupKey === '' || $expectedKey === '' || !hash_equals($expectedKey, $setupKey)) {
    respond(['error' => 'Kunci pemasangan tidak sah.'], 403);
}

$username = trim((string) ($data['username'] ?? ''));
$password = (string) ($data['password'] ?? '');
if (!preg_match('/^[a-zA-Z0-9._-]{3,50}$/', $username) || strlen($password) < 12) {
    respond(['error' => 'Nama pengguna tidak sah atau kata laluan kurang daripada 12 aksara.'], 422);
}

$pdo = database();
$pdo->exec("CREATE TABLE IF NOT EXISTS admins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
$pdo->exec("CREATE TABLE IF NOT EXISTS admin_audit (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id INT UNSIGNED NULL,
    action VARCHAR(80) NOT NULL,
    detail VARCHAR(500) NOT NULL DEFAULT '',
    ip_address VARCHAR(45) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_created (created_at),
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
$pdo->exec("CREATE TABLE IF NOT EXISTS admin_settings (
    setting_key VARCHAR(80) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
$pdo->exec("CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    email VARCHAR(190) NOT NULL,
    case_type VARCHAR(120) NOT NULL,
    preferred_date DATE NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    ip_hash CHAR(64) NOT NULL,
    consent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_appointments_status_created (status, created_at),
    INDEX idx_appointments_ip_created (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

$completed = $pdo->query("SELECT setting_value FROM admin_settings WHERE setting_key = 'setup_completed'")->fetchColumn();
if ($completed === '1') {
    respond(['error' => 'Pemasangan admin telah diselesaikan.'], 409);
}

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
    $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
    $pdo->prepare("INSERT INTO admin_settings (setting_key, setting_value) VALUES ('setup_completed', '1') ON DUPLICATE KEY UPDATE setting_value = '1'")->execute();
    $pdo->commit();
} catch (Throwable $error) {
    $pdo->rollBack();
    error_log('NRP setup failed: ' . $error->getMessage());
    respond(['error' => 'Pemasangan admin gagal.'], 500);
}

respond(['ok' => true, 'message' => 'Akaun admin berjaya dicipta.']);
