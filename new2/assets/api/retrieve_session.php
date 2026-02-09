<?php
header('Content-Type: application/json');
require_once '../../config.php';
error_reporting(0);
ini_set('display_errors', 0);

try {
    if (!isset($_GET['session_id'])) {
        throw new Exception('Session ID is required');
    }

    $session_id = $_GET['session_id'];
    $response = [];

    // 1. Get User Information
    $stmt = $pdo->prepare("SELECT * FROM user_information WHERE session_id = ?");
    $stmt->execute([$session_id]);
    $userInfo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userInfo) {
        $response['clientDetails'] = [
            'firstName' => $userInfo['first_name'] ?? $userInfo['full_name'] ?? '',
            'lastName' => $userInfo['last_name'] ?? '',
            'email' => $userInfo['email'] ?? '',
            'phone' => $userInfo['phone'] ?? '',
            'city' => $userInfo['city'] ?? '',
            'pincode' => $userInfo['pincode'] ?? '',
            'projectType' => 'Home Interior'
        ];
    }

    // 2. Get Survey Responses
    $stmt = $pdo->prepare("SELECT question_number, answer FROM survey_responses WHERE session_id = ?");
    $stmt->execute([$session_id]);
    $surveyData = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // Map to expected format (q1, q2, etc.)
    $response['surveyResponses'] = [];
    foreach ($surveyData as $q => $a) {
        $response['surveyResponses']['q' . $q] = $a;
    }

    // 3. Get Selected Rooms
    $stmt = $pdo->prepare("SELECT room_type, room_count FROM selected_rooms WHERE session_id = ?");
    $stmt->execute([$session_id]);
    $selectedRooms = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    $response['selectedRooms'] = $selectedRooms;

    // 3.5 Get Project Type from interior_selections
    $stmt = $pdo->prepare("SELECT interior_type FROM interior_selections WHERE session_id = ?");
    $stmt->execute([$session_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $realProjectType = $row['interior_type'] ?? 'Home Interior';

    if ($userInfo) {
        $response['clientDetails']['projectType'] = $realProjectType;
    }

    // 4. Get Cost Estimates (contains Style & Category)
    // 4. Get Cost Estimates (contains Style & Category)
    // CRITICAL: Order by ID DESC to get the LATEST estimate if multiple exist for the session
    $stmt = $pdo->prepare("SELECT * FROM cost_estimates WHERE session_id = ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$session_id]);
    $estimate = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($estimate) {
        $response['costEstimate'] = $estimate;

        // Map Style & Category from cost_estimates
        $response['selectedStyle'] = $estimate['selected_style'] ?? 'Modern Minimalist';
        $response['selectedCategory'] = $estimate['selected_category'] ?? 'Standard';

        // CRITICAL FIX: Prioritize Client Details from 'cost_estimates' (The Lead Data)
        // This resolves issues where user_information holds old/different data for the same session
        if (!empty($estimate['first_name'])) $response['clientDetails']['firstName'] = $estimate['first_name'];
        if (!empty($estimate['last_name'])) $response['clientDetails']['lastName'] = $estimate['last_name'];
        if (!empty($estimate['email'])) $response['clientDetails']['email'] = $estimate['email'];
        if (!empty($estimate['phone'])) $response['clientDetails']['phone'] = $estimate['phone'];
        if (!empty($estimate['city'])) $response['clientDetails']['city'] = $estimate['city'];
        if (!empty($estimate['pincode'])) $response['clientDetails']['pincode'] = $estimate['pincode'];
    } else {
        // Fallback defaults
        $response['selectedStyle'] = 'Modern Minimalist';
        $response['selectedCategory'] = 'Standard';
    }

    // 6. Get Admin Comparison History (to retrieve selected offer if stored)
    $stmt = $pdo->prepare("SELECT selected_offer_name FROM admin_comparison_history WHERE session_id = ?");
    $stmt->execute([$session_id]);
    $offer = $stmt->fetchColumn();

    // Fallback: Use 'company_name' from cost_estimates if history is empty (This holds the initial offer selection)
    if (empty($offer) && !empty($estimate['company_name'])) {
        $offer = $estimate['company_name'];
    }

    $response['selectedOffer'] = $offer;

    echo json_encode(['success' => true, 'data' => $response]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
