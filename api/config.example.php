<?php
/**
 * Copy this file to `api/config.php` on the server and fill in your Hostinger MySQL credentials
 * (hPanel → Databases → MySQL). Do not commit `config.php` with real passwords to public repos.
 */
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'your_database_name',
        'user' => 'your_database_user',
        'pass' => 'your_database_password',
        'charset' => 'utf8mb4',
    ],
];
