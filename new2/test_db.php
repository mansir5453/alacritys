<?php
require_once 'config.php';

try {
    // Attempt connection
    $stmt = $pdo->query("SELECT DATABASE()");
    $dbName = $stmt->fetchColumn();

    echo "<div style='color: green; font-family: Arial; padding: 20px; border: 1px solid green; background: #e0ffe0;'>";
    echo "<h1>✅ Database Connection Successful!</h1>";
    echo "<p>Connected to database: <strong>" . htmlspecialchars($dbName) . "</strong></p>";
    echo "<p>Host: " . htmlspecialchars($host) . "</p>";
    echo "<p>User: " . htmlspecialchars($user) . "</p>";
    echo "</div>";
} catch (PDOException $e) {
    echo "<div style='color: red; font-family: Arial; padding: 20px; border: 1px solid red; background: #ffe0e0;'>";
    echo "<h1>❌ Connection Failed</h1>";
    echo "<p>Error Message: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<h3>Troubleshooting Tips:</h3>";
    echo "<ul>";
    echo "<li>Check if the <strong>username</strong> and <strong>password</strong> in config.php are exactly what you set in cPanel.</li>";
    echo "<li>Ensure the user is <strong>added</strong> to the database in cPanel (MySQL Databases -> Add User to Database).</li>";
    echo "<li>Verify the <strong>hostname</strong> is 'localhost'.</li>";
    echo "</ul>";
    echo "</div>";
}
