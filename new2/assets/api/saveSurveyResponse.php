<?php
session_start();
header('Content-Type: application/json');
include '../../config.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received or invalid JSON.']);
    exit;
}

try {
    // Validate required
    foreach (['city', 'firstName', 'lastName', 'selectedRooms', 'selectedStyles', 'selectedCategory'] as $f) {
        if (empty($data[$f])) throw new Exception(ucfirst(str_replace('selected', '', $f)) . ' not specified');
    }

    $session_id   = session_id();
    $city         = $data['city'];
    $firstName    = $data['firstName'];
    $lastName     = $data['lastName'];
    $clientName   = trim("$firstName $lastName");
    $selectedRooms = $data['selectedRooms'];
    $selectedStyle = $data['selectedStyles'][0];
    $selectedCategory = $data['selectedCategory'];
    $selectedFloor = $data['selectedFloor'] ?? '';
    $selectedPreconstruction = $data['selectedPreconstruction'] ?? [];
    $carpetAreas  = $data['carpetAreas'] ?? [];
    $email        = $data['email'] ?? '';
    $phone        = $data['phone'] ?? '';
    $pincode      = $data['pincode'] ?? '';
    $whatsapp     = $data['whatsapp'] ?? 0;
    $countryCode  = $data['countryCode'] ?? '+91';
    $q1 = $data['q1'] ?? '';
    $q2 = $data['q2'] ?? '';
    $q3 = $data['q3'] ?? '';
    $q4 = $data['q4'] ?? '';
    $q5 = $data['q5'] ?? '';
    $projectType  = $data['projectType'] ?? 'Home Interior';


    $precost = 1;
    $gmulti = 1;





    if ($selectedFloor == "Ground+Terrace") {
        $gmulti = 1;
    } else if ($selectedFloor == "Ground+1+Terrace") {
        $gmulti = 1.2;
    } else if ($selectedFloor == "Ground+2+Terrace") {
        $gmulti = 1.3;
    } else if ($selectedFloor == "Ground+3+Terrace") {
        $gmulti = 1.4;
    }


    // 1. City costs - try project-specific rates first, fallback to Home Interior
    $stmt = $pdo->prepare("SELECT labour, material FROM city_master WHERE city = ? AND project_type = ?");
    $stmt->execute([$city, $projectType]);
    $cityCosts = $stmt->fetch(PDO::FETCH_ASSOC);

    // Fallback to Home Interior if project-specific rates don't exist yet
    if (!$cityCosts) {
        $stmt = $pdo->prepare("SELECT labour, material FROM city_master WHERE city = ? AND project_type = 'Home Interior'");
        $stmt->execute([$city]);
        $cityCosts = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$cityCosts) throw new Exception('City data not found');
    $labourCost = (float)$cityCosts['labour'];
    $materialCost = (float)$cityCosts['material'];
    $baseConstructionCost = $labourCost + $materialCost;

    // 2. Style multiplier - try project-specific, fallback to Home Interior, then default
    $stmt = $pdo->prepare("
        SELECT COALESCE(scr.multiplier, sm.style_multiplier, 1.0)
        FROM style_master sm
        LEFT JOIN style_city_rates scr ON sm.style_id = scr.style_id AND scr.city = ? AND scr.project_type = ?
        WHERE sm.style_name = ?
    ");
    $stmt->execute([$city, $projectType, $selectedStyle]);
    $styleMultiplier = (float)$stmt->fetchColumn();

    // Fallback to Home Interior if project-specific multiplier doesn't exist
    if (!$styleMultiplier || $styleMultiplier == 0) {
        $stmt = $pdo->prepare("
            SELECT COALESCE(scr.multiplier, sm.style_multiplier, 1.0)
            FROM style_master sm
            LEFT JOIN style_city_rates scr ON sm.style_id = scr.style_id AND scr.city = ? AND scr.project_type = 'Home Interior'
            WHERE sm.style_name = ?
        ");
        $stmt->execute([$city, $selectedStyle]);
        $styleMultiplier = (float)$stmt->fetchColumn();
    }

    if (!$styleMultiplier) {
        $styleMultiplier = 1.0; // Final fallback
    }

    // 3. Categories
    $categories = $pdo->query("SELECT category_name, cost_multiplier FROM design_categories")
        ->fetchAll(PDO::FETCH_ASSOC);

    // 4. Bulk fetch room data
    $roomTypes = array_keys(array_filter($selectedRooms, fn($c) => $c > 0));
    if (!$roomTypes) throw new Exception('No rooms selected');
    $inClause = implode(',', array_fill(0, count($roomTypes), '?'));

    // Standard areas
    $areaStmt = $pdo->prepare("SELECT room_type, standard_area FROM room_master WHERE room_type IN ($inClause)");
    $areaStmt->execute($roomTypes);
    $areaMap = $areaStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // Features
    $featStmt = $pdo->prepare("SELECT * FROM room_features WHERE room_type IN ($inClause)");
    $featStmt->execute($roomTypes);
    $roomFeatures = [];
    foreach ($featStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $roomFeatures[$row['room_type']]['features'][] = $row;
    }

    // 5. Category cost comparisons
    $categoryComparisons = [];
    $selectedCategoryMultiplier = 1.0;
    $selectedTotalRoomArea = 0;
    foreach ($categories as $cat) {
        $catMul = (float)$cat['cost_multiplier'];
        $totalRoomArea = 0;
        foreach ($selectedRooms as $rt => $count) {
            if ($count <= 0) continue;
            $stdArea = $areaMap[$rt] ?? 200;
            $actual = $stdArea;
            if (isset($carpetAreas[$rt])) {
                $ca = $carpetAreas[$rt];
                if (is_array($ca)) {
                    $sum = 0;
                    foreach ($ca as $a) if (is_numeric($a) && $a > 0) $sum += $a;
                    if ($sum > 0) $actual = $sum;
                } elseif (is_numeric($ca) && $ca > 0) {
                    $actual = (float)$ca;
                }
            }
            $totalRoomArea += $actual * $count;
        }

        if ($projectType == "House Architecture") {
            $constructionCost = round($gmulti * $baseConstructionCost * $totalRoomArea * $styleMultiplier * $catMul, 2);
            //$selectedConstructionCost = $gmulti * $baseConstructionCost * $selectedTotalRoomArea * $styleMultiplier * $selectedCategoryMultiplier;
        } else {
            $constructionCost = round($baseConstructionCost * $totalRoomArea * $styleMultiplier * $catMul, 2);
            //$selectedConstructionCost = $baseConstructionCost * $selectedTotalRoomArea * $styleMultiplier * $selectedCategoryMultiplier;
        }

        //$constructionCost = round($baseConstructionCost * $totalRoomArea * $styleMultiplier * $catMul, 2);
        $categoryComparisons[] = [
            'category_name' => $cat['category_name'],
            'cost_multiplier' => $catMul,
            'total_room_area' => $totalRoomArea,
            'construction_cost' => $constructionCost,
            'final_project_cost' => $constructionCost
        ];
        if ($cat['category_name'] === $selectedCategory) {
            $selectedCategoryMultiplier = $catMul;
            $selectedTotalRoomArea = $totalRoomArea;
        }
    }



    // Only iterate if $selectedPreconstruction is a non-empty array
    if (is_array($selectedPreconstruction) && !empty($selectedPreconstruction)) {
        foreach ($selectedPreconstruction as $item) {
            if ($item == "Plot Survey and Layout Drawing") {
                $precost = $precost + 1500;
            } else if ($item == "Architectural Design Fees (per sq. ft.)") {
                $precost = $precost + (50 * $selectedTotalRoomArea);
            } else if ($item == "Approvals (lump sum)") {
                $precost = $precost + 100000;
            } else if ($item == "Soil Testing (lump sum)") {
                $precost = $precost + 1000;
            }
        }
    }


    // 6. Selected category room details
    $roomDetails = [];
    foreach ($selectedRooms as $rt => $count) {
        if ($count <= 0) continue;
        $stdArea = $areaMap[$rt] ?? 200;
        $actual = $stdArea;
        if (isset($carpetAreas[$rt])) {
            $ca = $carpetAreas[$rt];
            if (is_array($ca)) {
                $sum = 0;
                foreach ($ca as $a) if (is_numeric($a) && $a > 0) $sum += $a;
                if ($sum > 0) $actual = $sum;
            } elseif (is_numeric($ca) && $ca > 0) {
                $actual = (float)$ca;
            }
        }
        $roomDetails[] = [
            'room_type' => $rt,
            'count' => $count,
            'area_per_room' => $actual,
            'total_area' => $actual * $count
        ];
    }


    if ($projectType == "House Architecture") {
        $selectedConstructionCost = $gmulti * $baseConstructionCost * $selectedTotalRoomArea * $styleMultiplier * $selectedCategoryMultiplier;
        $formula = 'Construction Area * Number of Floors * ((Labour + Material) * Room Area * Style Multiplier * Category Multiplier)';
    } else {
        $selectedConstructionCost = $baseConstructionCost * $selectedTotalRoomArea * $styleMultiplier * $selectedCategoryMultiplier;
        $formula = '(Labour + Material) * Room Area * Style Multiplier * Category Multiplier';
    }



    // Response
    $response = [
        'success' => true,
        'message' => 'Survey response calculated successfully',
        'clientDetails' => [
            'firstName' => $firstName,
            'lastName' => $lastName,
            'name' => $clientName,
            'city' => $city,
            'projectType' => $projectType
        ],
        'designPreferences' => [
            'selectedStyle' => $selectedStyle,
            'styleMultiplier' => $styleMultiplier,
            'selectedCategory' => $selectedCategory,
            'selectedFloor' => $selectedFloor,
            'selectedPreconstruction' => $selectedPreconstruction,
            'preconstructionTotal' => $precost,
            'categoryMultiplier' => $selectedCategoryMultiplier,
            'priority' => $q1,
            'timeline' => $q2,
            'involvement' => $q3,
            'specialRequirements' => $q4,
            'budgetRange' => $q5
        ],
        'costBreakdown' => [
            'baseCosts' => [
                'labour_cost' => $labourCost,
                'material_cost' => $materialCost,
                'base_construction_cost' => $baseConstructionCost
            ],
            'areaCalculations' => [
                'total_room_area' => $selectedTotalRoomArea,
                'rooms' => $roomDetails
            ],
            'construction_cost' => round($selectedConstructionCost, 2),
            'final_project_cost' => round($selectedConstructionCost, 2),
            'category_comparisons' => $categoryComparisons
        ],
        'roomFeatures' => $roomFeatures,
        'currency' => '₹',
        'calculationFormula' => $formula,
        'additionalInfo' => [
            'contactInfo' => [
                'phone' => $phone,
                'email' => $email,
                'whatsapp' => $whatsapp,
                'pincode' => $pincode,
                'countryCode' => $countryCode
            ],
            'sessionId' => $session_id,
            'databaseSaved' => false
        ]
    ];
} catch (PDOException $e) {
    $response = ['success' => false, 'message' => 'Database error: ' . $e->getMessage(), 'errorCode' => $e->getCode()];
} catch (Exception $e) {
    $response = ['success' => false, 'message' => $e->getMessage()];
}

echo json_encode($response);
exit;
