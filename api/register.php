<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$in = read_json();
$email     = strtolower(trim((string) ($in['email'] ?? '')));
$password  = (string) ($in['password'] ?? '');
$fullName  = trim((string) ($in['full_name'] ?? ''));
$phone     = trim((string) ($in['phone'] ?? '')) ?: null;
$city      = trim((string) ($in['city'] ?? '')) ?: null;
$heard     = trim((string) ($in['heard'] ?? '')) ?: null;
$intent    = trim((string) ($in['intent'] ?? '')) ?: null;
$terms     = !empty($in['terms_accepted']);
$privacy   = !empty($in['privacy_accepted']);
$rules     = !empty($in['rules_accepted']);
$age       = !empty($in['age_21_plus']);

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['ok' => false, 'error' => 'Valid email required'], 400);
}
if (strlen($password) < 10) {
    json_out(['ok' => false, 'error' => 'Password must be at least 10 characters'], 400);
}
if (!$terms || !$privacy || !$rules || !$age) {
    json_out(['ok' => false, 'error' => 'All agreements and age confirmation are required'], 400);
}

$pdo = pdo();
$st = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$st->execute([$email]);
if ($st->fetch()) {
    json_out(['ok' => false, 'error' => 'Email already registered'], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$ins = $pdo->prepare(
    'INSERT INTO users (email, password_hash, role, terms_accepted, privacy_accepted, rules_accepted, age_21_plus)
     VALUES (?, ?, \'user\', ?, ?, ?, ?)'
);
$ins->execute([$email, $hash, $terms ? 1 : 0, $privacy ? 1 : 0, $rules ? 1 : 0, $age ? 1 : 0]);
$id = (int) $pdo->lastInsertId();

$_SESSION['user_id'] = $id;
json_out([
    'ok' => true,
    'user' => [
        'id'    => $id,
        'email' => $email,
        'role'  => 'user',
    ],
]);
