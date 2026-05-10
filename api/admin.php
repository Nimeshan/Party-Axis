<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$staff = require_staff();
$pdo = pdo();

$status = (string) ($_GET['status'] ?? 'pending_review');
$allowedStatuses = ['pending_review', 'approved', 'rejected', 'draft', 'all'];
if (!in_array($status, $allowedStatuses, true)) {
    $status = 'pending_review';
}

$where = '';
$params = [];
if ($status !== 'all') {
    $where = 'WHERE e.status = ?';
    $params[] = $status;
}

$st = $pdo->prepare(
    "SELECT e.id, e.user_id, u.email AS host_email, e.event_type, e.title, e.description, e.start_at,
            e.city, e.location_name, e.address, e.visibility, e.image_url, e.status,
            e.is_highlight, e.rejection_reason, e.created_at
     FROM events e
     LEFT JOIN users u ON u.id = e.user_id
     $where
     ORDER BY e.created_at DESC
     LIMIT 200"
);
$st->execute($params);
$events = $st->fetchAll();

$users = is_admin_user($staff)
    ? $pdo->query('SELECT id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 200')->fetchAll()
    : [];

$audits = $pdo->query(
    'SELECT ma.id, ma.event_id, ma.admin_user_id, u.email AS admin_email, ma.action, ma.note, ma.created_at
     FROM moderation_actions ma
     LEFT JOIN users u ON u.id = ma.admin_user_id
     ORDER BY ma.created_at DESC LIMIT 100'
)->fetchAll();

$subscribers = is_admin_user($staff)
    ? $pdo->query('SELECT id, email, source, marketing_consent, created_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 100')->fetchAll()
    : [];

$statusRows = $pdo->query('SELECT status, COUNT(*) AS total FROM events GROUP BY status')->fetchAll();
$stats = [
    'pending_review' => 0,
    'approved' => 0,
    'rejected' => 0,
    'draft' => 0,
    'users' => is_admin_user($staff) ? (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn() : 0,
    'subscribers' => is_admin_user($staff) ? (int) $pdo->query('SELECT COUNT(*) FROM newsletter_subscribers')->fetchColumn() : 0,
];
foreach ($statusRows as $r) {
    $stats[(string) $r['status']] = (int) $r['total'];
}

json_out([
    'ok' => true,
    'me' => $staff,
    'can_manage_users' => is_admin_user($staff),
    'status' => $status,
    'stats' => $stats,
    'events' => $events,
    'pending' => array_values(array_filter($events, static fn($e) => ($e['status'] ?? '') === 'pending_review')),
    'users' => $users,
    'audits' => $audits,
    'subscribers' => $subscribers,
]);
