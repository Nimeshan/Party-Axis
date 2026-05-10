<?php
declare(strict_types=1);

function pdo(): PDO {
    static $pdo = null;
    global $CONFIG;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $db = $CONFIG['db'];
    $dsn = 'mysql:host=' . $db['host'] . ';dbname=' . $db['name'] . ';charset=' . ($db['charset'] ?? 'utf8mb4');
    $pdo = new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}
