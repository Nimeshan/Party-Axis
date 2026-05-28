<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$in = read_json();
$email = strtolower(trim((string) ($in['email'] ?? '')));
$password = (string) ($in['password'] ?? '');

if ($email === '' || $password === '') {
    json_out(['ok' => false, 'error' => 'Email and password required'], 400);
}

$pdo = pdo();
$st = $pdo->prepare('SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
$st->execute([$email]);
$row = $st->fetch(PDO::FETCH_ASSOC);
if (!$row || !password_verify($password, $row['password_hash'])) {
    json_out(['ok' => false, 'error' => 'Invalid email or password'], 401);
}

$_SESSION['user_id'] = (int) $row['id'];
json_out([
    'ok' => true,
    'user' => [
        'id' => (int) $row['id'],
        'email' => $row['email'],
        'role' => $row['role'],
    ],
]);
