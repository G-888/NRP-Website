<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

request_method('POST');
$user = require_admin(true);
if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    respond(['error' => 'Fail imej tidak ditemui.'], 422);
}
$file = $_FILES['file'];
if ((int) $file['error'] !== UPLOAD_ERR_OK || (int) $file['size'] > 4 * 1024 * 1024) {
    respond(['error' => 'Imej mesti lebih kecil daripada 4 MB.'], 422);
}
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
if (!isset($extensions[$mime])) {
    respond(['error' => 'Format imej mesti JPG, PNG atau WebP.'], 422);
}
$base = pathinfo((string) $file['name'], PATHINFO_FILENAME);
$slug = strtolower(trim((string) preg_replace('/[^a-zA-Z0-9]+/', '-', $base), '-')) ?: 'image';
$filename = gmdate('Ymd-His') . '-' . substr(bin2hex(random_bytes(4)), 0, 8) . '-' . substr($slug, 0, 50) . '.' . $extensions[$mime];
$repoPath = 'public/images/admin/' . $filename;
$github = config()['github'];
$result = github_request('PUT', content_api_path($repoPath), [
    'message' => 'Upload website image ' . $filename,
    'content' => base64_encode((string) file_get_contents($file['tmp_name'])),
    'branch' => $github['branch'],
]);
audit('image_upload', $result['content']['html_url'] ?? $repoPath, $user['id']);
respond(['ok' => true, 'path' => '/images/admin/' . $filename]);
