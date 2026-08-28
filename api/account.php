<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

request_method('PUT');
$user = require_admin(true);
$data = request_json();
$currentPassword = (string) ($data['currentPassword'] ?? '');
$newPassword = (string) ($data['newPassword'] ?? '');

if (strlen($newPassword) < 12 || strlen($newPassword) > 200) {
    respond(['error' => 'Kata laluan baharu mesti antara 12 hingga 200 aksara.'], 422);
}
if (hash_equals($currentPassword, $newPassword)) {
    respond(['error' => 'Kata laluan baharu mestilah berbeza.'], 422);
}

$stmt = database()->prepare('SELECT password_hash FROM admins WHERE id = ? AND enabled = 1 LIMIT 1');
$stmt->execute([$user['id']]);
$passwordHash = $stmt->fetchColumn();
if (!is_string($passwordHash) || !password_verify($currentPassword, $passwordHash)) {
    usleep(350000);
    audit('password_change_failed', 'Current password rejected', $user['id']);
    respond(['error' => 'Kata laluan semasa tidak tepat.'], 401);
}

$update = database()->prepare('UPDATE admins SET password_hash = ? WHERE id = ?');
$update->execute([password_hash($newPassword, PASSWORD_DEFAULT), $user['id']]);
session_regenerate_id(true);
$_SESSION['csrf'] = bin2hex(random_bytes(32));
audit('password_changed', 'Admin password changed', $user['id']);
respond(['ok' => true, 'csrf' => $_SESSION['csrf']]);
