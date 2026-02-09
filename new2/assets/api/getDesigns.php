<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../config.php';

try {
    // Read the project type from normal POST data (not JSON)
    $projectType = $_POST['projectType'] ?? '1';

    // Map projectType ID to interior_type
    $pid = (int)$projectType;
    if ($pid <= 0) $pid = 1;

    // Fetch design styles from database
    $styles_sql = "SELECT style_id, style_name FROM style_master WHERE interior_type = :pid ORDER BY style_id ASC";
    $stmt = $pdo->prepare($styles_sql);
    $stmt->execute(['pid' => $pid]);
    $styles_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $styles = [];
    foreach ($styles_data as $style) {
        $sid = (int)$style['style_id'];

        $styles[] = [
            'title' => $style['style_name'],
            'description' => $style['style_name'] . " design brings warmth and natural textures into the home, evoking a sense of simplicity and nature. It often uses materials like wood, stone, and other organic elements, creating a cozy and grounded atmosphere.",
            'mainImage' => "https://picsum.photos/600/400?random={$sid}",
            'features' => [
                "Natural materials like wood and stone",
                "Earthy tones",
                "Vintage accessories"
            ],
            'thumbs' => [
                "https://picsum.photos/200/150?random=" . ($sid * 3 + 1),
                "https://picsum.photos/200/150?random=" . ($sid * 3 + 2),
                "https://picsum.photos/200/150?random=" . ($sid * 3 + 3)
            ]
        ];
    }

    // Return only styles section
    echo json_encode([
        'success' => true,
        'styles' => $styles
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>