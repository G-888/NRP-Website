<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

request_method('GET');
require_admin();
$stmt = database()->query("SELECT a.id, a.action, a.detail, a.created_at, COALESCE(u.username, 'system') AS username FROM admin_audit a LEFT JOIN admins u ON u.id = a.admin_id ORDER BY a.id DESC LIMIT 30");
respond(['entries' => $stmt->fetchAll()]);
