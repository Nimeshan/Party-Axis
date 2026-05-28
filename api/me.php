<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

$user = current_user();
if (!$user) {
    json_out(['ok' => true, 'user' => null]);
}
json_out([
    'ok' => true,
    'user' => [
        'id' => (int) $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
    ],
]);
