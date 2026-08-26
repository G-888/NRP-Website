<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

function ensure_appointments_table(): void
{
    database()->exec("CREATE TABLE IF NOT EXISTS appointments (
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
}

function appointment_id(array $data): int
{
    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false) {
        respond(['error' => 'Rekod temujanji tidak sah.'], 422);
    }
    return (int) $id;
}

ensure_appointments_table();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    verify_origin();
    $data = request_json();

    // This field is hidden from people and catches basic automated submissions.
    if (trim((string) ($data['website'] ?? '')) !== '') {
        respond(['ok' => true, 'message' => 'Pertanyaan anda telah diterima.'], 201);
    }

    $name = trim((string) ($data['name'] ?? ''));
    $phone = trim((string) ($data['phone'] ?? ''));
    $email = trim((string) ($data['email'] ?? ''));
    $caseType = trim((string) ($data['caseType'] ?? ''));
    $preferredDate = trim((string) ($data['preferredDate'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));
    $consent = ($data['consent'] ?? false) === true;

    if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
        respond(['error' => 'Nama penuh tidak sah.'], 422);
    }
    if (!preg_match('/^[0-9+() .-]{7,30}$/', $phone)) {
        respond(['error' => 'Nombor telefon tidak sah.'], 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
        respond(['error' => 'Alamat email tidak sah.'], 422);
    }
    if ($caseType === '' || mb_strlen($caseType) > 120) {
        respond(['error' => 'Sila pilih jenis kes.'], 422);
    }
    if ($preferredDate !== '') {
        $parsedDate = DateTimeImmutable::createFromFormat('!Y-m-d', $preferredDate);
        if ($parsedDate === false || $parsedDate->format('Y-m-d') !== $preferredDate) {
            respond(['error' => 'Tarikh pilihan tidak sah.'], 422);
        }
    }
    if (mb_strlen($message) < 10 || mb_strlen($message) > 4000) {
        respond(['error' => 'Ringkasan isu mesti antara 10 hingga 4,000 aksara.'], 422);
    }
    if (!$consent) {
        respond(['error' => 'Persetujuan diperlukan sebelum pertanyaan dihantar.'], 422);
    }

    $remoteAddress = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $salt = (string) (config()['security']['setup_key'] ?? 'nrp-appointments');
    $ipHash = hash('sha256', $salt . '|' . $remoteAddress);
    $pdo = database();
    $rate = $pdo->prepare("SELECT COUNT(*) FROM appointments WHERE ip_hash = ? AND created_at > DATE_SUB(NOW(), INTERVAL 60 MINUTE)");
    $rate->execute([$ipHash]);
    if ((int) $rate->fetchColumn() >= 5) {
        respond(['error' => 'Terlalu banyak pertanyaan dihantar. Sila cuba semula kemudian.'], 429);
    }

    $stmt = $pdo->prepare('INSERT INTO appointments (name, phone, email, case_type, preferred_date, message, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$name, $phone, $email, $caseType, $preferredDate !== '' ? $preferredDate : null, $message, $ipHash]);
    $id = (int) $pdo->lastInsertId();
    audit('appointment_created', 'Appointment #' . $id);
    respond(['ok' => true, 'id' => $id, 'message' => 'Pertanyaan anda telah diterima.'], 201);
}

if ($method === 'GET') {
    require_admin();
    $appointments = database()->query('SELECT id, name, phone, email, case_type, preferred_date, message, status, created_at, updated_at FROM appointments ORDER BY created_at DESC LIMIT 200')->fetchAll();
    $newCount = (int) database()->query("SELECT COUNT(*) FROM appointments WHERE status = 'new'")->fetchColumn();
    respond(['appointments' => $appointments, 'newCount' => $newCount]);
}

if ($method === 'PUT') {
    $user = require_admin(true);
    $data = request_json();
    $id = appointment_id($data);
    $status = (string) ($data['status'] ?? '');
    if (!in_array($status, ['new', 'contacted', 'closed'], true)) {
        respond(['error' => 'Status temujanji tidak sah.'], 422);
    }
    $stmt = database()->prepare('UPDATE appointments SET status = ? WHERE id = ?');
    $stmt->execute([$status, $id]);
    if ($stmt->rowCount() === 0) {
        $exists = database()->prepare('SELECT 1 FROM appointments WHERE id = ?');
        $exists->execute([$id]);
        if (!$exists->fetchColumn()) {
            respond(['error' => 'Rekod temujanji tidak ditemui.'], 404);
        }
    }
    audit('appointment_status', 'Appointment #' . $id . ' set to ' . $status, $user['id']);
    respond(['ok' => true]);
}

if ($method === 'DELETE') {
    $user = require_admin(true);
    $data = request_json();
    $id = appointment_id($data);
    $stmt = database()->prepare('DELETE FROM appointments WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        respond(['error' => 'Rekod temujanji tidak ditemui.'], 404);
    }
    audit('appointment_deleted', 'Appointment #' . $id, $user['id']);
    respond(['ok' => true]);
}

header('Allow: GET, POST, PUT, DELETE');
respond(['error' => 'Kaedah permintaan tidak dibenarkan.'], 405);
