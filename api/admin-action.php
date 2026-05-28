<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$staff = require_staff();
$in    = read_json();
$action = (string) ($in['action'] ?? '');
$note   = substr((string) ($in['note'] ?? ''), 0, 500);
$pdo    = pdo();

function log_admin_action(PDO $pdo, ?int $eventId, int $adminId, string $action, ?string $note = null): void {
    $allowed = ['approve', 'reject', 'highlight_on', 'highlight_off', 'delete_event', 'role_change', 'request_changes'];
    $safeAction = in_array($action, $allowed, true) ? $action : 'request_changes';
    $ins = $pdo->prepare(
        'INSERT INTO moderation_actions (event_id, admin_user_id, action, note) VALUES (?, ?, ?, ?)'
    );
    $ins->execute([$eventId, $adminId, $safeAction, $note]);
}

function send_status_email(PDO $pdo, int $eventId, string $eventTitle, string $status, ?string $reason): void {
    // Get submitter email
    $st = $pdo->prepare(
        'SELECT u.email FROM users u
         JOIN events e ON e.user_id = u.id
         WHERE e.id = ? LIMIT 1'
    );
    $st->execute([$eventId]);
    $row = $st->fetch(PDO::FETCH_ASSOC);
    if (!$row || empty($row['email'])) return;

    $to = (string) $row['email'];
    if ($status === 'approved') {
        $subject = "Party Axis: \"{$eventTitle}\" is now live ✓";
        $body    = "Great news — your listing \"{$eventTitle}\" has been approved and is now live on Party Axis.\n\n"
                 . "— Party Axis team";
    } else {
        $reasonText = $reason ? "\n\nModerator note: {$reason}" : '';
        $subject = "Party Axis: \"{$eventTitle}\" was not approved";
        $body    = "Your listing \"{$eventTitle}\" was reviewed and could not be approved at this time.{$reasonText}\n\n"
                 . "If you believe this is an error, reply to this email.\n\n"
                 . "— Party Axis team";
    }

    if (function_exists('mail')) {
        @mail($to, $subject, $body, "From: no-reply@partyaxis.com\r\nContent-Type: text/plain; charset=utf-8");
    }
}

if (in_array($action, ['approve', 'reject', 'toggle_highlight', 'delete_event'], true)) {
    $eventId = (int) ($in['event_id'] ?? 0);
    if ($eventId <= 0) {
        json_out(['ok' => false, 'error' => 'Invalid event id'], 400);
    }

    $pdo->beginTransaction();
    try {
        $st = $pdo->prepare('SELECT id, title, status, is_highlight FROM events WHERE id = ? FOR UPDATE');
        $st->execute([$eventId]);
        $ev = $st->fetch(PDO::FETCH_ASSOC);
        if (!$ev) {
            $pdo->rollBack();
            json_out(['ok' => false, 'error' => 'Event not found'], 404);
        }

        if ($action === 'approve') {
            $pdo->prepare("UPDATE events SET status = 'approved', rejection_reason = NULL WHERE id = ?")->execute([$eventId]);
            log_admin_action($pdo, $eventId, (int) $staff['id'], 'approve', $note !== '' ? $note : null);
            $pdo->commit();
            send_status_email($pdo, $eventId, (string) $ev['title'], 'approved', null);
        } elseif ($action === 'reject') {
            $reason = $note !== '' ? $note : 'Rejected by moderator';
            $pdo->prepare("UPDATE events SET status = 'rejected', rejection_reason = ?, is_highlight = 0 WHERE id = ?")->execute([$reason, $eventId]);
            log_admin_action($pdo, $eventId, (int) $staff['id'], 'reject', $reason);
            $pdo->commit();
            send_status_email($pdo, $eventId, (string) $ev['title'], 'rejected', $reason);
        } elseif ($action === 'toggle_highlight') {
            $next = (int) $ev['is_highlight'] === 1 ? 0 : 1;
            $pdo->prepare('UPDATE events SET is_highlight = ? WHERE id = ?')->execute([$next, $eventId]);
            log_admin_action($pdo, $eventId, (int) $staff['id'], $next ? 'highlight_on' : 'highlight_off', null);
            $pdo->commit();
        } elseif ($action === 'delete_event') {
            log_admin_action($pdo, $eventId, (int) $staff['id'], 'delete_event', 'deleted');
            $pdo->prepare('DELETE FROM events WHERE id = ?')->execute([$eventId]);
            $pdo->commit();
        }

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
    $role   = (string) ($in['role'] ?? '');
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
