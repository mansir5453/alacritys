<?php
session_start();
header('Content-Type: application/json');
include '../../config.php';

// Get the raw POST data
$input = file_get_contents('php://input');
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
    if (!isset($data['session_id']) || empty($data['session_id'])) {
        throw new Exception('Session ID is required');
    }

    $session_id = $data['session_id'];
    $company_type = $data['company_type'] ?? 'Individual';
    $company_name = $data['company_name'] ?? null;
    $gst_number = $data['gst_number'] ?? null;
    $full_address = $data['full_address'] ?? null;
    $coupon_code = $data['coupon_code'] ?? null;
    $payment_method = $data['payment_method'] ?? 'Online';
    
    // Debug: Log the received data
    error_log("Payment Complete API - Received data: " . json_encode($data));
    error_log("Payment Complete API - Processed values: session_id=$session_id, company_type=$company_type, company_name=$company_name, gst_number=$gst_number");

    // BEGIN TRANSACTION
    $pdo->beginTransaction();
    
    try {
        // 1. Update user_information with company details and billing address
        $stmt = $pdo->prepare("UPDATE user_information SET 
                               company_type = ?, 
                               company_name = ?, 
                               gst_number = ?,
                               full_address = ?
                               WHERE session_id = ?");
        $stmt->execute([$company_type, $company_name, $gst_number, $full_address, $session_id]);
        error_log("Payment Complete API - Updated user_information for session_id=$session_id");

        // 2. Update cost_estimates with payment details and company info
        $stmt = $pdo->prepare("UPDATE cost_estimates SET 
                               coupon_code = ?, 
                               payment_method = ?, 
                               company_type = ?,
                               company_name = ?,
                               gst_number = ?,
                               flags = 1 
                               WHERE email = (SELECT email FROM user_information WHERE session_id = ? LIMIT 1)
                               ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$coupon_code, $payment_method, $company_type, $company_name, $gst_number, $session_id]);
        error_log("Payment Complete API - Updated cost_estimates for session_id=$session_id");

        // 3. Update user_estimates with payment details and set flag to 1
        $stmt = $pdo->prepare("UPDATE user_estimates SET 
                               flag = 1 
                               WHERE session_id = ?");
        $stmt->execute([$session_id]);
        error_log("Payment Complete API - Updated user_estimates for session_id=$session_id");

        $pdo->commit();
        
        $response = [
            'success' => true,
            'message' => 'Payment completed successfully',
            'data' => [
                'session_id' => $session_id,
                'company_type' => $company_type,
                'company_name' => $company_name,
                'gst_number' => $gst_number,
                'full_address' => $full_address,
                'coupon_code' => $coupon_code,
                'payment_method' => $payment_method,
                'updated_tables' => ['user_information', 'cost_estimates', 'user_estimates'],
                'flags_updated_to' => 1
            ]
        ];

    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }

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

