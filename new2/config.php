<?php
// Local XAMPP (ACTIVE)
$host = '127.0.0.1';
$db = 'alacritys';
$user = 'root';
$pass = '';

// Production (cPanel/Shared Hosting) - COMMENTED OUT
// $host = 'localhost'; 
// $db   = 'getpickp_alacritys';
// $user = 'getpickp_alacritys';
// $pass = 'alacritys@2025';

// Match the database's utf8mb4 settings
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
