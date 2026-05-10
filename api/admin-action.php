<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$staff = require_staff();
$in = read_json();
$action = (string) ($in['action'] ?? '');
$note = substr((string) ($in['note'] ?? ''), 0, 500);
$pdo = pdo();

function log_admin_action(PDO $pdo, ?int $eventId, int $adminId, string $action, ?string $note = null): void {
    $allowed = ['approve', 'reject', 'highlight_on', 'highlight_off', 'delete_event', 'role_change', 'request_changes'];
    $safeAction = in_array($action, $allowed, true) ? $action : 'request_changes';
    $ins = $pdo->prepare(
        'INSERT INTO moderation_actions (event_id, admin_user_id, action, note) VALUES (?, ?, ?, ?)'
    );
    $ins->execute([$eventId, $adminId, $safeAction, $note]);
}

if (in_array($action, ['approve', 'reject', 'toggle_highlight', 'delete_event'], true)) {
    $eventId = (int) ($in['event_id'] ?? 0);
    if ($eventId <= 0) {
        json_out(['ok' => false, 'error' => 'Invalid event id'], 400);
    }

    $pdo->beginTransaction();
    try {
        $st = $pdo->prepare('SELECT id, status, is_highlight FROM events WHERE id = ? FOR UPDATE');
        $st->execute([$eventId]);
        $ev = $st->fetch(PDO::FETCH_ASSOC);
        if (!$ev) {
            $pdo->rollBack();
            json_out(['ok' => false, 'error' => 'Event not found'], 404);
        }

        if ($action === 'approve') {
            $pdo->prepare("UPDATE events SET status = 'approved', rejection_reason = NULL WHERE id = ?")->execute([$eventId]);
            log_admin_action($pdo, $eventId, (int) $staff['id'], 'approve', $note !== '' ? $note : null);
        } elseif ($action === 'reject') {
            $reason = $note !== '' ? $note : 'Rejected by moderator';
            $pdo->prepare("UPDATE events SET status = 'rejected', rejection_reason = ?, is_highlight = 0 WHERE id = ?")->execute([$reason, $eventId]);
            log_admin_action($pdo, $eventId, (int) $staff['id'], 'reject', $reason);
        } elseif ($action === 'toggle_highlight') {
            $next = (int) $ev['is_highlight'] === 1 ? 0 : 1;
            $pdo->prepare('UPDATE events SET is_highlight = ? WHERE id = ?')->execute([$next, $eventId]);
            log_admin_action($pdo, $eventId, (int) $staff['id'], $next ? 'highlight_on' : 'highlight_off', null);
        } elseif ($action === 'delete_event') {
            log_admin_action($pdo, $eventId, (int) $staff['id'], 'delete_event', 'deleted');
            $pdo->prepare('DELETE FROM events WHERE id = ?')->execute([$eventId]);
        }

        $pdo->commit();
        json_out(['ok' => true]);
    } catch (Throwable $e) {
        $pdo->rollBack();
        error_log('PartyAxis admin action error: ' . $e->getMessage());
        json_out(['ok' => false, 'error' => 'Server error'], 500);
    }
}

if ($action === 'set_user_role') {
    if (!is_admin_user($staff)) {
        json_out(['ok' => false, 'error' => 'Only admins can manage user roles'], 403);
    }
    $userId = (int) ($in['user_id'] ?? 0);
    $role = (string) ($in['role'] ?? '');
    if ($userId <= 0 || !in_array($role, ['user', 'moderator', 'admin'], true)) {
        json_out(['ok' => false, 'error' => 'Invalid user role payload'], 400);
    }
    if ($userId === (int) $staff['id'] && $role !== 'admin') {
        json_out(['ok' => false, 'error' => 'You cannot remove your own admin access'], 400);
    }

    $st = $pdo->prepare('SELECT email, role FROM users WHERE id = ? LIMIT 1');
    $st->execute([$userId]);
    $target = $st->fetch(PDO::FETCH_ASSOC);
    if (!$target) {
        json_out(['ok' => false, 'error' => 'User not found'], 404);
    }

    $up = $pdo->prepare('UPDATE users SET role = ? WHERE id = ?');
    $up->execute([$role, $userId]);
    log_admin_action($pdo, null, (int) $staff['id'], 'role_change', 'user_id=' . $userId . '; ' . $target['role'] . '->' . $role);
    json_out(['ok' => true]);
}

json_out(['ok' => false, 'error' => 'Invalid action'], 400);
