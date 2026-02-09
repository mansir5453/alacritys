<?php
header('Content-Type: application/json');
include '../../config.php';

// Accept city from GET or POST (JSON)
$city = null;
if (isset($_GET['city'])) {
    $city = $_GET['city'];
} else {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (isset($data['city'])) {
        $city = $data['city'];
    }
}

if (!$city) {
    echo json_encode([
        'success' => false,
        'message' => 'City not provided.'
    ]);
    exit;
}

$city = strtolower(trim($city));

// Sanitize city name to match column naming convention (e.g. "Noida 2" -> "noida2")
// This matches the logic used in admin panel (add_new_city.php)
$cityStandardized = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '', $city));

// Map correct city names to database column names (which have typos)
// Keep this only for legacy typo support
$cityMapping = [
    'hyderabad' => 'hyderabbad',  // Typo in database column
    'nashik' => 'nasik'            // Different spelling in database
];

// Determine the database column name
if (isset($cityMapping[$cityStandardized])) {
    $dbColumnName = $cityMapping[$cityStandardized];
} else {
    $dbColumnName = $cityStandardized;
}

// Validate that the city column actually exists in the table (Security & Validity Check)
$colCheck = $pdo->query("SHOW COLUMNS FROM service_master LIKE '$dbColumnName'");
if ($colCheck->rowCount() == 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid city (No service data found for: ' . $city . ')'
    ]);
    exit;
}

// Proceed with $dbColumnName

// Get project type (default to Home Interior)
$projectType = isset($data['projectType']) ? $data['projectType'] : 'Home Interior';

try {
    // Prepare statement to fetch services
    $stmt = $pdo->prepare('SELECT service_id, services, description, ' . $dbColumnName . ' FROM service_master WHERE project_type = ?');
    $stmt->execute([$projectType]);

    $services = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $services[] = [
            'service_id' => $row['service_id'],
            'name' => $row['services'],
            'description' => $row['description'],
            'price' => $row[$dbColumnName]
        ];
    }

    // Debug logging
    error_log("Found " . count($services) . " services for city: " . $city);

    // Fetch offers from offersdiscounttbl
    $offerStmt = $pdo->query('SELECT id, offer_name, offer_percent, benefits_json FROM offersdiscounttbl ORDER BY id ASC');
    $rawOffers = $offerStmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch overrides for this city
    $ovrStmt = $pdo->prepare("SELECT offer_id, discount_value FROM offer_city_rates WHERE city = ?");
    $ovrStmt->execute([$city]);
    $overrides = [];
    while ($ov = $ovrStmt->fetch(PDO::FETCH_ASSOC)) {
        $overrides[$ov['offer_id']] = (float)$ov['discount_value'];
    }

    // Map offer_percent to discount_percent for frontend compatibility, applying overrides
    $offers = array_map(function ($offer) use ($overrides) {
        $percent = isset($overrides[$offer['id']]) ? $overrides[$offer['id']] : $offer['offer_percent'];
        return [
            'offer_id' => $offer['id'],
            'offer_name' => $offer['offer_name'],
            'discount_percent' => $percent,
            'details' => json_decode($offer['benefits_json'], true) // Include the detailed structure
        ];
    }, $rawOffers);

    // Fetch City Rates (Material & Labour) and Pincode Range
    $cityRateStmt = $pdo->prepare("SELECT material, labour, total_cost, pincode_start, pincode_end FROM city_master WHERE LOWER(city) = ? AND project_type = ? LIMIT 1");
    $cityRateStmt->execute([$city, $projectType]);
    $cityRates = $cityRateStmt->fetch(PDO::FETCH_ASSOC);

    // Fetch Style Rates (Multipliers)
    $stylesStmt = $pdo->query("SELECT style_id, style_name FROM style_master");
    $styleRates = [];
    while ($row = $stylesStmt->fetch(PDO::FETCH_ASSOC)) {
        $styleRates[$row['style_id']] = [
            'style_name' => $row['style_name'],
            'multiplier' => 1.0 // Default
        ];
    }

    $styleCityStmt = $pdo->prepare("SELECT style_id, multiplier FROM style_city_rates WHERE LOWER(city) = ? AND project_type = ?");
    $styleCityStmt->execute([$city, $projectType]);
    while ($row = $styleCityStmt->fetch(PDO::FETCH_ASSOC)) {
        if (isset($styleRates[$row['style_id']])) {
            $styleRates[$row['style_id']]['multiplier'] = (float)$row['multiplier'];
        }
    }

    echo json_encode([
        'success' => true,
        'city' => $city,
        'db_column' => $dbColumnName,
        'services' => $services,
        'offers' => $offers,
        'city_rates' => $cityRates,
        'style_rates' => array_values($styleRates)
    ]);
} catch (Exception $e) {
    error_log("getServicesByCity.php error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
