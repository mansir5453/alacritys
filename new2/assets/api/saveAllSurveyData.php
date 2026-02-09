<?php
// Enable error reporting for logging, but disable display to prevent JSON corruption
error_reporting(E_ALL);
ini_set('display_errors', 0);  // Changed from 1 to 0 - errors will still be logged

session_start();
header('Content-Type: application/json');

// DEBUG LOGGING
// Check if config file exists
if (!file_exists('../../config.php')) {
    echo json_encode([
        'success' => false,
        'message' => 'Configuration file not found'
    ]);
    exit;
}

include '../../config.php';

// Check if database connection is working
if (!isset($pdo)) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection not available'
    ]);
    exit;
}

// Get the raw POST data
$input = file_get_contents('php://input');

// Debug: Log the raw input
error_log("Raw input received: " . $input);

$data = json_decode($input, true);



if (!$data) {
    echo json_encode([
        'success' => false,
        'message' => 'No data received or invalid JSON.'
    ]);
    exit;
}

try {
    // Validate required data
    $requiredFields = ['city', 'firstName', 'lastName', 'selectedRooms', 'selectedCategory'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            throw new Exception(ucfirst(str_replace('selected', '', $field)) . ' not specified');
        }
    }

    // Check for styles - can be either selectedStyles array or selectedDesignStyle string
    $hasStyles = false;
    if (isset($data['selectedStyles']) && !empty($data['selectedStyles'])) {
        $hasStyles = true;
    } elseif (isset($data['selectedDesignStyle']) && !empty($data['selectedDesignStyle'])) {
        $hasStyles = true;
    }

    if (!$hasStyles) {
        throw new Exception('Design style not specified');
    }

    // Get session ID
    $session_id = session_id();

    // Check for Partial Update (Enhanced Data only)
    if (isset($data['partial_update']) && $data['partial_update'] === true) {
        error_log("--> PARTIAL UPDATE REQ: Validating Session ID...");
        $sessionIdPartial = $data['session_id'] ?? session_id();

        $offersJson = isset($data['offers_breakdown']) ? json_encode($data['offers_breakdown']) : null;
        $comparisonJson = isset($data['comparison_json']) ? json_encode($data['comparison_json']) : null;

        error_log("--> Session ID: " . $sessionIdPartial);
        error_log("--> Offers Payload Len: " . strlen($offersJson));

        if (!$sessionIdPartial) {
            error_log("--> ERROR: Session ID Missing for Partial Update");
            throw new Exception('Session ID required for partial update');
        }

        $stmt = $pdo->prepare("UPDATE cost_estimates SET offers_json = ?, comparison_json = ? WHERE session_id = ?");
        $stmt->execute([$offersJson, $comparisonJson, $sessionIdPartial]);

        error_log("--> ROWS UPDATED: " . $stmt->rowCount());

        echo json_encode([
            'success' => true,
            'message' => 'Enhanced data updated successfully',
            'session_id' => $sessionIdPartial,
            'debug_rows' => $stmt->rowCount()
        ]);
        exit;
    }

    // Sanitize inputs
    $city = $data['city'];

    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $clientName = trim($firstName . ' ' . $lastName); // Combine for backward compatibility
    $selectedRooms = $data['selectedRooms'];

    // Handle styles - can be either selectedStyles array or selectedDesignStyle string
    if (isset($data['selectedStyles']) && !empty($data['selectedStyles'])) {
        $selectedStyle = $data['selectedStyles'][0];
    } elseif (isset($data['selectedDesignStyle']) && !empty($data['selectedDesignStyle'])) {
        $selectedStyle = $data['selectedDesignStyle'];
    } else {
        throw new Exception('No valid design style found');
    }

    $selectedCategory = $data['selectedCategory'];
    $selectedServices = $data['selectedServices'] ?? [];

    // Contact information
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $pincode = $data['pincode'] ?? '';
    $whatsapp = $data['whatsapp'] ?? 0;
    $countryCode = $data['countryCode'] ?? '+91';

    // Survey responses
    $q1 = $data['q1'] ?? '';
    $q2 = $data['q2'] ?? '';
    $q3 = $data['q3'] ?? '';
    $q4 = $data['q4'] ?? '';
    $q5 = $data['q5'] ?? '';

    // Project type
    $projectType = $data['projectType'] ?? 'Home Interior';

    // Pre-calculated cost data with server-side validation
    $totalRoomArea = $data['totalRoomArea'] ?? 0;
    $constructionCost = $data['constructionCost'] ?? 0;
    $finalProjectCost = $data['finalProjectCost'] ?? 0;
    $serviceCost = $data['serviceCost'] ?? 0;
    $categoryComparisons = $data['categoryComparisons'] ?? [];
    $offer = $data['offerSelected'] ?? '';

    // SERVER-SIDE VALIDATION: Prevent unreasonable values
    if ($finalProjectCost < 0 || $finalProjectCost > 99999999) {
        throw new Exception('Invalid project cost value');
    }

    if ($serviceCost < 0 || $serviceCost > 10000000) {
        throw new Exception('Invalid service cost value');
    }

    if ($totalRoomArea < 0 || $totalRoomArea > 100000) {
        throw new Exception('Invalid room area value');
    }

    // Validate that final cost is reasonable compared to construction cost
    if ($constructionCost > 0 && $finalProjectCost > 0) {
        $ratio = $finalProjectCost / $constructionCost;
        // Final cost should be between 0.5x and 3x of construction cost (accounting for offers/discounts)
        if ($ratio < 0.3 || $ratio > 4.0) {
            error_log("WARNING: Suspicious cost ratio - Construction: $constructionCost, Final: $finalProjectCost");
            // Log but don't reject - could be legitimate edge case
        }
    }

    // Handle carpet areas - use standard area if user not providing
    $carpetAreas = $data['carpetAreas'] ?? [];
    $standardCarpetAreas = [];

    // Get standard areas for selected rooms
    foreach ($selectedRooms as $roomType => $count) {
        if ($count > 0) {
            $stmt = $pdo->prepare("SELECT standard_area FROM room_master WHERE room_type = ?");
            $stmt->execute([$roomType]);
            $standardArea = (float)$stmt->fetchColumn() ?: 200; // Default 200 sq ft
            $standardCarpetAreas[$roomType] = $standardArea;
        }
    }

    // Prepare carpet area data for cost_estimates table in JSON format
    $stdCarpetAreaJson = [];
    $userCarpetAreaJson = [];

    foreach ($selectedRooms as $roomType => $count) {
        if ($count > 0) {
            $standardArea = $standardCarpetAreas[$roomType] ?? 200;
            $userArea = $carpetAreas[$roomType] ?? null;

            // Standard carpet area (always available) - store as count
            // $stdCarpetAreaJson[$roomType] = $count;

            $stdCarpetAreaJson[$roomType] = $standardArea;


            // User carpet area - store as count if provided, otherwise null
            if ($userArea) {
                if (is_array($userArea)) {
                    $validAreas = array_filter($userArea, function ($area) {
                        return !empty($area) && is_numeric($area) && $area > 0;
                    });
                    if (!empty($validAreas)) {
                        // $userCarpetAreaJson[$roomType] = count($validAreas);
                        $userCarpetAreaJson[$roomType] = $userArea;
                    } else {
                        $userCarpetAreaJson[$roomType] = null;
                    }
                } else {
                    // $userCarpetAreaJson[$roomType] = 1; // Single area provided
                    $userCarpetAreaJson[$roomType] = $userArea; // Single area provided
                }
            } else {
                $userCarpetAreaJson[$roomType] = null;
            }
        }
    }

    $stdCarpetAreaText = json_encode($stdCarpetAreaJson);
    $userCarpetAreaText = json_encode($userCarpetAreaJson);

    // Handle company information
    $companyType = $data['companyType'] ?? 'Individual';
    $companyName = $data['companyName'] ?? null;
    $selectedOffer = $data['selectedOffer'] ?? null;
    $selectedOfferVal = $data['selectedOfferVal'] ?? null;

    // Debug removed - was breaking JSON output
    // var_dump($data['selectedOfferVal']);

    $gstNumber = $data['gstNumber'] ?? null;

    // If company name or GST is not provided, set company type to Individual
    if (empty($companyName) || empty($gstNumber)) {
        $companyType = 'Individual';
        $companyName = null;
        $gstNumber = null;
    }

    // BEGIN TRANSACTION - Save all data to database
    $pdo->beginTransaction();

    try {
        // 1. Save/Update user_sessions
        $stmt = $pdo->prepare("INSERT INTO user_sessions (session_id, user_id, ip_address, user_agent) 
                               VALUES (?, ?, ?, ?) 
                               ON DUPLICATE KEY UPDATE updated_at = NOW()");
        $stmt->execute([$session_id, NULL, $_SERVER['REMOTE_ADDR'] ?? '', $_SERVER['HTTP_USER_AGENT'] ?? '']);

        // 2. Save user_information (update if exists)
        $stmt = $pdo->prepare("INSERT INTO user_information (session_id, first_name, last_name, full_name, email, phone, pincode, whatsapp_updates, country_code, company_type, company_name, gst_number) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                               ON DUPLICATE KEY UPDATE 
                               first_name = VALUES(first_name),
                               last_name = VALUES(last_name),
                               full_name = VALUES(full_name),
                               email = VALUES(email),
                               phone = VALUES(phone),
                               pincode = VALUES(pincode),
                               whatsapp_updates = VALUES(whatsapp_updates),
                               country_code = VALUES(country_code),
                               company_type = VALUES(company_type),
                               company_name = VALUES(company_name),
                               gst_number = VALUES(gst_number)");
        $stmt->execute([$session_id, $firstName, $lastName, $clientName, $email, $phone, $pincode, $whatsapp, $countryCode, $companyType, $companyName, $gstNumber]);

        // 3. Save survey_responses (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM survey_responses WHERE session_id = ?");
        $stmt->execute([$session_id]);

        $surveyQuestions = [
            1 => $q1, // Priority
            2 => $q2, // Timeline
            3 => $q3, // Involvement
            4 => $q4, // Special Requirements
            5 => $q5  // Budget Range
        ];

        foreach ($surveyQuestions as $questionNumber => $answer) {
            if (!empty($answer)) {
                $stmt = $pdo->prepare("INSERT INTO survey_responses (session_id, question_number, answer) 
                                       VALUES (?, ?, ?)");
                $stmt->execute([$session_id, $questionNumber, $answer]);
            }
        }

        // 4. Save selected_rooms (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM selected_rooms WHERE session_id = ?");
        $stmt->execute([$session_id]);

        foreach ($selectedRooms as $roomType => $count) {
            if ($count > 0) {
                // Get room_id from room_master
                $stmt = $pdo->prepare("SELECT room_id FROM room_master WHERE room_type = ?");
                $stmt->execute([$roomType]);
                $roomId = $stmt->fetchColumn();

                if ($roomId) {
                    $stmt = $pdo->prepare("INSERT INTO selected_rooms (session_id, room_id, room_count, room_type) 
                                           VALUES (?, ?, ?, ?)");
                    $stmt->execute([$session_id, $roomId, $count, $roomType]);
                }
            }
        }

        // 5. Save selected_design_style (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM selected_design_style WHERE session_id = ?");
        $stmt->execute([$session_id]);

        $stmt = $pdo->prepare("SELECT style_id FROM style_master WHERE style_name = ?");
        $stmt->execute([$selectedStyle]);
        $styleId = $stmt->fetchColumn();

        if ($styleId) {
            $stmt = $pdo->prepare("INSERT INTO selected_design_style (session_id, style_id, created_at) 
                                   VALUES (?, ?, NOW())");
            $stmt->execute([$session_id, $styleId]);
        }

        // 6. Save selected_design_categories (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM selected_design_categories WHERE session_id = ?");
        $stmt->execute([$session_id]);

        $stmt = $pdo->prepare("SELECT category_id FROM design_categories WHERE category_name = ?");
        $stmt->execute([$selectedCategory]);
        $categoryId = $stmt->fetchColumn();

        if ($categoryId) {
            $stmt = $pdo->prepare("INSERT INTO selected_design_categories (session_id, category_id) 
                                   VALUES (?, ?)");
            $stmt->execute([$session_id, $categoryId]);
        }

        // 7. Save interior_selections (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM interior_selections WHERE session_id = ?");
        $stmt->execute([$session_id]);

        $selectedRoomsJson = json_encode($selectedRooms);
        $stmt = $pdo->prepare("INSERT INTO interior_selections (session_id, interior_type, selected_rooms) 
                               VALUES (?, ?, ?)");
        $stmt->execute([$session_id, $projectType, $selectedRoomsJson]);

        // 8. Save cost_estimates (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM cost_estimates WHERE email = ?");
        $stmt->execute([$email]);

        // Capture Enhanced Data (Offers & Comparison)    
        // JSON data with validation
        $offersJson = null;
        $comparisonJson = null;

        if (isset($data['offers_breakdown']) && is_array($data['offers_breakdown'])) {
            // Validate offers structure
            foreach ($data['offers_breakdown'] as $offerKey => $offerData) {
                if (!is_array($offerData) || !isset($offerData['price'])) {
                    error_log("WARNING: Invalid offer structure for key: $offerKey");
                }
            }
            $offersJson = json_encode($data['offers_breakdown']);

            // Verify JSON encoding was successful
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("ERROR: JSON encoding failed for offers: " . json_last_error_msg());
                $offersJson = null;
            }
        }

        if (isset($data['comparison_json']) && is_array($data['comparison_json'])) {
            // Validate comparison structure
            foreach ($data['comparison_json'] as $categoryData) {
                if (!is_array($categoryData) || !isset($categoryData['category_name'])) {
                    error_log("WARNING: Invalid comparison structure");
                }
            }
            $comparisonJson = json_encode($data['comparison_json']);

            // Verify JSON encoding was successful
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("ERROR: JSON encoding failed for comparison: " . json_last_error_msg());
                $comparisonJson = null;
            }
        }

        // Architecture details with validation
        $architectureJson = null;
        if (isset($data['architecture_details']) && is_array($data['architecture_details'])) {
            $architectureJson = json_encode($data['architecture_details']);

            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("ERROR: JSON encoding failed for architecture: " . json_last_error_msg());
                $architectureJson = null;
            }
        }
        $selectedServicesText = !empty($selectedServices) ? implode(',', $selectedServices) : '';

        // FIXED: Add total_room_area to the INSERT statement
        $stmt = $pdo->prepare("INSERT INTO cost_estimates (session_id, name, first_name, last_name, email, phone, pincode, city, whatsapp_status, 
                               selected_rooms, selected_style, selected_category, std_carpet_area, user_carpet_area, total_room_area,
                               total_estimate_cost, selected_services, service_cost, company_type, company_name, gst_number, flags, architecture_details,
                               offers_json, comparison_json) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $session_id,
            $clientName,
            $firstName,
            $lastName,
            $email,
            $phone,
            $pincode,
            $city,
            $whatsapp,
            $selectedRoomsJson,
            $selectedStyle,
            $selectedCategory,
            $stdCarpetAreaText,
            $userCarpetAreaText,
            $totalRoomArea,  // FIXED: Now saving the calculated total room area
            $constructionCost,
            $selectedServicesText,
            $serviceCost,
            $companyType,
            $selectedOffer,
            $selectedOfferVal,
            0,
            $architectureDetails,
            $offersJson,
            $comparisonJson
        ]);

        // 9. Save user_estimates (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM user_estimates WHERE session_id = ?");
        $stmt->execute([$session_id]);

        $roomsSelectedText = implode(', ', array_map(function ($room, $count) {
            return str_repeat($room . ', ', $count);
        }, array_keys($selectedRooms), $selectedRooms));
        $roomsSelectedText = rtrim($roomsSelectedText, ', ');

        $stmt = $pdo->prepare("INSERT INTO user_estimates (session_id, name, first_name, last_name, email, phone, pincode, interior_selection, rooms_selected, design_style, design_category, estimated_total_cost, selected_services, final_total_cost, flag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $session_id,
            $clientName,
            $firstName,
            $lastName,
            $email,
            $phone,
            $pincode,
            $projectType,
            $roomsSelectedText,
            $selectedStyle,
            $selectedCategory,
            $constructionCost,
            $selectedServicesText,
            $serviceCost,
            1
        ]);

        // 10. Save service_selections (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM service_selections WHERE session_id = ?");
        $stmt->execute([$session_id]);

        if (!empty($selectedServices)) {
            $stmt = $pdo->prepare("INSERT INTO service_selections (session_id, email, selected_services, total_cost, flag) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $session_id,
                $email,
                $selectedServicesText,
                $serviceCost,
                1
            ]);
        }

        // 11. Save package_comparison (delete old ones first, then insert new)
        $stmt = $pdo->prepare("DELETE FROM package_comparison WHERE session_id = ?");
        $stmt->execute([$session_id]);

        foreach ($categoryComparisons as $comparison) {
            $stmt = $pdo->prepare("INSERT INTO package_comparison (session_id, base_cost, style_cost, final_cost, 
                                   category, economy_cost, premium_cost, luxury_cost) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $session_id,
                $comparison['base_cost'] ?? 0,
                $comparison['style_cost'] ?? 0,
                $comparison['final_project_cost'] ?? 0,
                $comparison['category_name'] ?? '',
                $categoryComparisons[0]['final_project_cost'] ?? 0, // Economy (Standard)
                $categoryComparisons[1]['final_project_cost'] ?? 0, // Premium
                $categoryComparisons[2]['final_project_cost'] ?? 0  // Luxury
            ]);
        }

        // 12. Save admin_comparison_history (new table)
        $adminData = $data['adminComparisonData'] ?? [];
        if (!empty($adminData)) {
            $stmt = $pdo->prepare("INSERT INTO admin_comparison_history (session_id, standard_package_cost, premium_package_cost, luxury_package_cost, selected_offer_name, selected_offer_value, final_shown_total) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $session_id,
                $adminData['standard_package_cost'] ?? 0,
                $adminData['premium_package_cost'] ?? 0,
                $adminData['luxury_package_cost'] ?? 0,
                $adminData['selected_offer_name'] ?? null,
                $adminData['selected_offer_value'] ?? 0,
                $adminData['final_shown_total'] ?? 0
            ]);
        }

        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }

    $response = [
        'success' => true,
        'message' => 'All survey data saved successfully',
        'sessionId' => $session_id,
        'savedData' => [
            'user_information' => true,
            'survey_responses' => true,
            'selected_rooms' => true,
            'selected_design_style' => true,
            'selected_design_categories' => true,
            'interior_selections' => true,
            'cost_estimates' => true,
            'user_estimates' => true,
            'service_selections' => !empty($selectedServices),
            'package_comparison' => true
        ]
    ];
} catch (PDOException $e) {
    $response = [
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'errorCode' => $e->getCode()
    ];
} catch (Exception $e) {
    $response = [
        'success' => false,
        'message' => $e->getMessage()
    ];
}

echo json_encode($response);
exit;
