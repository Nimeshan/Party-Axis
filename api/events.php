<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

$pdo = pdo();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $highlight = isset($_GET['highlight']) && (string) $_GET['highlight'] === '1';
    $sql = "SELECT id, title, description, start_at, city, event_type, visibility, image_url, status, is_highlight
            FROM events WHERE status = 'approved'";
    if ($highlight) {
        $sql .= ' AND is_highlight = 1';
    }
    $sql .= ' ORDER BY start_at ASC';
    $rows = $pdo->query($sql)->fetchAll();
    $out = [];
    foreach ($rows as $r) {
        $ts = strtotime((string) $r['start_at']);
        $out[] = [
            'id' => (int) $r['id'],
            'title' => $r['title'],
            'description' => $r['description'],
            'start_at' => $ts ? date('c', $ts) : null,
            'city' => $r['city'],
            'event_type' => $r['event_type'],
            'visibility' => $r['visibility'],
            'image_url' => $r['image_url'],
            'status' => $r['status'],
            'is_highlight' => (bool) (int) $r['is_highlight'],
        ];
    }
    json_out(['ok' => true, 'data' => $out]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = require_login();
    $in = read_json();
    $eventType = trim((string) ($in['event_type'] ?? ''));
    $title = trim((string) ($in['title'] ?? ''));
    $description = trim((string) ($in['description'] ?? ''));
    $startAt = (string) ($in['start_at'] ?? '');
    $city = trim((string) ($in['city'] ?? 'Singapore')) ?: 'Singapore';
    $locationName = trim((string) ($in['location_name'] ?? ''));
    $address = trim((string) ($in['address'] ?? ''));
    $visIn = (string) ($in['visibility'] ?? 'public');
    $visibility = in_array($visIn, ['public', 'invite_only'], true) ? $visIn : 'public';
    $imageUrl = isset($in['image_url']) ? trim((string) $in['image_url']) : '';
    $imageUrl = $imageUrl === '' ? null : substr($imageUrl, 0, 500);

    if ($eventType === '' || $title === '' || $description === '' || $startAt === '' || $locationName === '' || $address === '') {
        json_out(['ok' => false, 'error' => 'Missing required fields'], 400);
    }
    $ts = strtotime($startAt);
    if ($ts === false) {
        json_out(['ok' => false, 'error' => 'Invalid start time'], 400);
    }
    $dt = date('Y-m-d H:i:s', $ts);

    $st = $pdo->prepare(
        'INSERT INTO events (user_id, event_type, title, description, start_at, city, location_name, address, visibility, image_url, status, is_highlight)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'pending_review\', 0)'
    );
    $st->execute([
        (int) $u['id'],
        substr($eventType, 0, 64),
        substr($title, 0, 255),
        $description,
        $dt,
        substr($city, 0, 120),
        substr($locationName, 0, 255),
        substr($address, 0, 500),
        $visibility,
        $imageUrl,
    ]);
    json_out(['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
}

json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
