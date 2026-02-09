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
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Extract data from survey responses
    $selectedCategory = $input['selectedCategory'] ?? 'Standard';
    $selectedRooms = $input['selectedRooms'] ?? [];
    $selectedStyles = $input['selectedStyles'] ?? [];
    $projectType = $input['projectType'] ?? 'Home Interior';

    $pid = 1;

    if ($projectType == "Home Interior") {
        $pid = 1;
    } else if ($projectType == "Office Interior") {
        $pid = 2;
    } else if ($projectType == "House Architecture") {
        $pid = 3;
    }

    // Validate category
    $validCategories = ['Standard', 'Premium', 'Luxury'];
    if (!in_array($selectedCategory, $validCategories)) {
        $selectedCategory = 'Standard';
    }

    $roomFeatures = [];

    // Fetch features for each selected room for all categories
    foreach ($selectedRooms as $roomType => $quantity) {
        if ($quantity > 0) {
            $stmt = $pdo->prepare("
                SELECT 
                    room_item,
                    standard_cat,
                    premium_cat,
                    luxury_cat
                FROM room_features 
                WHERE room_type = ? and interior_type = ?
                ORDER BY id ASC
            ");

            $stmt->execute([$roomType, $pid]);
            $features = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($features) {
                $roomFeatures[$roomType] = [
                    'quantity' => $quantity,
                    'features' => $features
                ];
            }
        }
    }




    // 3. Styles
    // 3. Styles
    $city = $input['city'] ?? $input['clientDetails']['city'] ?? ''; // Try to get city from input
    $city = trim($city);

    // Fetch styles with city-specific multiplier preference
    // LEFT JOIN style_city_rates ON style_master.style_id = style_city_rates.style_id AND style_city_rates.city = '$city'
    // COALESCE(style_city_rates.multiplier, style_master.style_multiplier, 1.0) as effective_multiplier

    $styles_sql = "
    SELECT sm.style_id, sm.style_name, 
           COALESCE(scr.multiplier, sm.style_multiplier, 1.0) as multiplier
    FROM style_master sm
    LEFT JOIN style_city_rates scr ON sm.style_id = scr.style_id AND scr.city = ?
    WHERE sm.interior_type = ?
    ORDER BY sm.style_id ASC
";

    $styles_stmt = $pdo->prepare($styles_sql);
    $styles_stmt->execute([$city, $pid]);
    $styles_data = $styles_stmt->fetchAll(PDO::FETCH_ASSOC);

    $styles = [];
    foreach ($styles_data as $style) {
        $styles[] = [
            'id' => $style['style_id'], // Useful for frontend to match
            'title' => $style['style_name'],
            'multiplier' => (float)$style['multiplier'],
            'description' => $style['style_name'] . " design brings warmth and natural textures into the home, evoking a sense of simplicity and nature. It often uses materials like wood, stone, and other organic elements, creating a cozy and grounded atmosphere.",
            'mainImage' => "https://picsum.photos/600/400?random=" . $style['style_id'],
            'features' => [
                "Natural materials like wood and stone",
                "Earthy tones",
                "Vintage accessories"
            ],
            'thumbs' => [
                "https://picsum.photos/200/150?random=" . ($style['style_id'] * 3 + 1),
                "https://picsum.photos/200/150?random=" . ($style['style_id'] * 3 + 2),
                "https://picsum.photos/200/150?random=" . ($style['style_id'] * 3 + 3)
            ]
        ];
    }


    // Prepare response data
    $response = [
        'success' => true,
        'roomFeatures' => $roomFeatures,
        'styles' => $styles
    ];

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
