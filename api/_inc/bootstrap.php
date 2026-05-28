<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = dirname(__DIR__) . '/config.php';
if (!is_file($configPath)) {
    error_log('PartyAxis API: missing api/config.php. Create api/config.php and set Hostinger database credentials.');
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Missing API database configuration. Please set api/config.php.']);
    exit;
}

/** @var array $CONFIG */
$CONFIG = require $configPath;
if (!is_array($CONFIG) || empty($CONFIG['db'])) {
    error_log('PartyAxis API: invalid api/config.php format.');
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Invalid API database configuration.']);
    exit;
}

require __DIR__ . '/db.php';

ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_path', '/');
if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
    ini_set('session.cookie_secure', '1');
}
if (PHP_VERSION_ID >= 70300) {
    ini_set('session.cookie_samesite', 'Lax');
}
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function json_out(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json(): array {
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function current_user(): ?array {
    if (empty($_SESSION['user_id'])) {
        return null;
    }
    $pdo = pdo();
    $st = $pdo->prepare('SELECT id, email, role FROM users WHERE id = ? LIMIT 1');
    $st->execute([(int) $_SESSION['user_id']]);
    $row = $st->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

function require_login(): array {
    $u = current_user();
    if (!$u) {
        json_out(['ok' => false, 'error' => 'Not authenticated'], 401);
    }
    return $u;
}

function require_admin(): array {
    $u = require_login();
    if (($u['role'] ?? '') !== 'admin') {
        json_out(['ok' => false, 'error' => 'Forbidden'], 403);
    }
    return $u;
}

function require_staff(): array {
    $u = require_login();
    if (!in_array(($u['role'] ?? ''), ['admin', 'moderator'], true)) {
        json_out(['ok' => false, 'error' => 'Forbidden'], 403);
    }
    return $u;
}

function is_admin_user(array $u): bool {
    return (($u['role'] ?? '') === 'admin');
}
