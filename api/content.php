<?php
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

$user = require_admin(($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET');
$github = config()['github'];
$repoPath = 'data/admin-content.json';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    $file = github_request('GET', content_api_path($repoPath) . '?ref=' . rawurlencode($github['branch']));
    $decoded = base64_decode(str_replace(["\r", "\n"], '', (string) ($file['content'] ?? '')), true);
    $content = json_decode($decoded ?: '', true);
    if (!is_array($content)) {
        respond(['error' => 'Fail kandungan GitHub tidak sah.'], 502);
    }
    respond(['content' => $content, 'sha' => $file['sha'] ?? null, 'updatedAt' => $file['_links']['html'] ?? null]);
}

request_method('PUT');
$data = request_json();
$content = $data['content'] ?? null;
if (!is_array($content)) {
    respond(['error' => 'Kandungan tidak sah.'], 422);
}
validate_content($content);

$file = github_request('GET', content_api_path($repoPath) . '?ref=' . rawurlencode($github['branch']));
$serializedContent = $content;
foreach (['certificates', 'lawyers', 'services'] as $mapKey) {
    if (($serializedContent[$mapKey] ?? []) === []) {
        $serializedContent[$mapKey] = new stdClass();
    }
}
$json = json_encode($serializedContent, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
$message = trim((string) ($data['message'] ?? 'Update website content'));
$result = github_request('PUT', content_api_path($repoPath), [
    'message' => mb_substr($message, 0, 120),
    'content' => base64_encode($json),
    'sha' => $file['sha'],
    'branch' => $github['branch'],
]);
audit('content_publish', $result['commit']['html_url'] ?? 'Content updated', $user['id']);
respond(['ok' => true, 'commit' => $result['commit']['html_url'] ?? null]);
