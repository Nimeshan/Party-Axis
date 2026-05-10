<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$in = read_json();
$email = strtolower(trim((string) ($in['email'] ?? '')));
$consent = !empty($in['marketing_consent']);
$source = substr((string) ($in['source'] ?? ''), 0, 120);

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['ok' => false, 'error' => 'Valid email required'], 400);
}
if (!$consent) {
    json_out(['ok' => false, 'error' => 'Marketing consent required'], 400);
}

$pdo = pdo();
try {
    $st = $pdo->prepare(
        'INSERT INTO newsletter_subscribers (email, source, marketing_consent) VALUES (?, ?, 1)'
    );
    $st->execute([$email, $source ?: null]);
} catch (PDOException $e) {
    if ((int) $e->errorInfo[1] === 1062) {
        json_out(['ok' => true, 'message' => 'Already subscribed']);
    }
    throw $e;
}
json_out(['ok' => true]);
