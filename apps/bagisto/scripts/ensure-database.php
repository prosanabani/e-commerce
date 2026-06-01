<?php

declare(strict_types=1);

$appRoot = dirname(__DIR__);
$envPath = $appRoot.'/.env';

if (! is_file($envPath)) {
    fwrite(STDERR, "Missing apps/bagisto/.env\n");
    exit(1);
}

$config = [];

foreach (file($envPath, FILE_IGNORE_NEW_LINES) ?: [] as $line) {
    $line = trim($line);

    if ($line === '' || str_starts_with($line, '#') || ! str_contains($line, '=')) {
        continue;
    }

    [$key, $value] = explode('=', $line, 2);
    $value = trim($value, " \t\"'");

    $config[$key] = $value;
}

$driver = $config['DB_CONNECTION'] ?? '';

if ($driver !== 'mysql') {
    echo "Skipping database bootstrap (DB_CONNECTION is not mysql).\n";
    exit(0);
}

$host = $config['DB_HOST'] ?? '127.0.0.1';
$port = $config['DB_PORT'] ?? '3306';
$database = $config['DB_DATABASE'] ?? '';
$username = $config['DB_USERNAME'] ?? '';
$password = $config['DB_PASSWORD'] ?? '';

if ($database === '' || $username === '') {
    fwrite(STDERR, "Set DB_DATABASE and DB_USERNAME in apps/bagisto/.env\n");
    exit(1);
}

if (! preg_match('/^[a-zA-Z0-9_]+$/', $database)) {
    fwrite(STDERR, "DB_DATABASE must contain only letters, numbers, and underscores.\n");
    exit(1);
}

$dsn = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', $host, $port);

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $exception) {
    fwrite(STDERR, "Could not connect to MySQL at {$host}:{$port} as {$username}.\n");
    fwrite(STDERR, $exception->getMessage()."\n");
    fwrite(STDERR, "Ensure MySQL is running and DB_* credentials in .env are correct.\n");
    exit(1);
}

$exists = (bool) $pdo
    ->query('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '.$pdo->quote($database))
    ->fetchColumn();

if ($exists) {
    echo "Database \"{$database}\" already exists.\n";
    exit(0);
}

echo "Creating MySQL database \"{$database}\"...\n";

$pdo->exec(
    'CREATE DATABASE `'.$database.'` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
);

echo "Database \"{$database}\" created.\n";
