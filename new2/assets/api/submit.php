<?php
session_start();
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

include '../../config.php';

// include __DIR__ . '/../../config.php';

// Get session id
$session_id = session_id();

// Get form data
$first_name = $_POST['firstName'] ?? '';
$last_name = $_POST['lastName'] ?? '';
$full_name = trim($first_name . ' ' . $last_name); // Combine for backward compatibility
$email = $_POST['email'] ?? '';
$country_code = $_POST['countryCode'] ?? '';
$phone = $_POST['phone'] ?? '';
$pincode = $_POST['pincode'] ?? '';
$company = $_POST['company'] ?? '';
$gst = $_POST['gst'] ?? '';
$whatsapp_updates = isset($_POST['whatsapp']) ? 1 : 0;
$created_at = date('Y-m-d H:i:s');

// Combine country code and phone
$full_phone = trim($country_code . ' ' . $phone);

// Check if a record exists for this session_id and created_at
$stmt = $pdo->prepare('SELECT id FROM user_information WHERE session_id = ? AND created_at = ?');
$stmt->execute([$session_id, $created_at]);
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    // Update existing record
    $stmt = $pdo->prepare('UPDATE user_information SET first_name = ?, last_name = ?, full_name = ?, email = ?, phone = ?, pincode = ?, company_name = ?, gst_number = ?, whatsapp_updates = ?, country_code = ? WHERE session_id = ? AND created_at = ?');
    $stmt->execute([
        $first_name,
        $last_name,
        $full_name,
        $email,
        $full_phone,
        $pincode,
        $company,
        $gst,
        $whatsapp_updates,
        $country_code,
        $session_id,
        $created_at
    ]);
} else {
    // Insert new record
    $stmt = $pdo->prepare('INSERT INTO user_information (session_id, first_name, last_name, full_name, email, phone, pincode, company_name, gst_number, whatsapp_updates, country_code, company_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $session_id,
        $first_name,
        $last_name,
        $full_name,
        $email,
        $full_phone,
        $pincode,
        $company,
        $gst,
        $whatsapp_updates,
        $country_code,
        'Individual' // Default company type
    ]);
}

// INSERT INTO COST_ESTIMATES (Initial Lead)
// We check if it exists first to avoid duplicates if user clicks multiple times
$stmt = $pdo->prepare('SELECT id FROM cost_estimates WHERE email = ?');
$stmt->execute([$email]);
if (!$stmt->fetch()) {
    // Insert logic matching saveAllSurveyData columns (mostly empty/zeros)
    $stmt = $pdo->prepare("INSERT INTO cost_estimates (session_id, name, first_name, last_name, email, phone, pincode, city, whatsapp_status, 
                           selected_rooms, selected_style, selected_category, std_carpet_area, user_carpet_area, 
                           total_estimate_cost, selected_services, service_cost, company_type, company_name, gst_number, flags) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $session_id,
        $full_name,
        $first_name,
        $last_name,
        $email,
        $full_phone,
        $pincode,
        '', // City (fetched later)
        $whatsapp_updates,
        '{}', // selected_rooms
        '',   // selected_style
        '',   // selected_category
        '',   // std_carpet_area
        '',   // user_carpet_area
        0,    // total_estimate_cost
        '',   // selected_services
        0,    // service_cost
        'Individual',
        '', // company_name/offer
        '', // gst/offer_val
        0
    ]);
}

// Fetch city data from city_master table
$stmt = $pdo->prepare('SELECT city, pincode_start, pincode_end, labour, material, total_cost FROM city_master');
$stmt->execute();
$cityData = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Convert pincode to integer
$pincodeInt = (int)$pincode;
$cityFound = false;
$matchedCity = '';
$matchedCityData = null;

foreach ($cityData as $city) {
    if ($pincodeInt >= (int)$city['pincode_start'] && $pincodeInt <= (int)$city['pincode_end']) {
        $cityFound = true;
        $matchedCity = $city['city'];
        $matchedCityData = $city;
        break;
    }
}

if (!$cityFound) {
    http_response_code(400);
    echo "Invalid pincode: We do not serve this area yet.";
    exit;
}

// Respond for AJAX
http_response_code(200);
echo json_encode([
    'success' => true,
    'city' => $matchedCity,
    'cityData' => $matchedCityData,
    'session_id' => $session_id
]);
