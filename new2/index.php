<?php
// At the very top for development (remove in production)
ini_set('display_errors', 1); // Show errors during development
error_reporting(E_ALL);       // Report all errors
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/frontend_errors.log');

// Include Razorpay classes at the top level
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/payment/config.php';
require_once __DIR__ . '/razorpay-php/razorpay-php-master/Razorpay.php';

use Razorpay\Api\Api;

// Handle AJAX requests for Razorpay order creation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  if (isset($input['action']) && $input['action'] === 'create_razorpay_order') {
    header('Content-Type: application/json');

    try {
      // Get POST data
      if (!$input) {
        throw new Exception('Invalid input data');
      }

      $sessionId = $input['session_id'] ?? '';
      $amount = $input['amount'] ?? 0;
      $paymentMethod = $input['payment_method'] ?? 'card';
      $projectType = $input['project_type'] ?? '';
      $selectedServices = $input['selected_services'] ?? [];
      $selectedOffers = $input['selected_offers'] ?? [];

      if (!$sessionId || $amount <= 0) {
        throw new Exception('Invalid session ID or amount');
      }

      // Initialize Razorpay
      $api = new Api($razorpay_config['api_key'], $razorpay_config['api_secret']);

      // Create Razorpay order
      $orderData = [
        'amount' => $amount * 100, // Convert to paise
        'currency' => 'INR',
        'receipt' => 'ord_' . substr(md5($sessionId), 0, 8) . '_' . time(),
        'notes' => [
          'session_id' => $sessionId,
          'payment_method' => $paymentMethod,
          'project_type' => $projectType
        ]
      ];

      $order = $api->order->create($orderData);

      // Check if there's already a pending payment for this session
      $checkStmt = $pdo->prepare("
            SELECT id FROM payment_details 
            WHERE session_id = ? AND payment_status = 'pending'
        ");
      $checkStmt->execute([$sessionId]);
      $existingPayment = $checkStmt->fetch();

      if ($existingPayment) {
        // Update existing pending payment
        $stmt = $pdo->prepare("
                UPDATE payment_details 
                SET razorpay_order_id = ?, 
                    amount = ?, 
                    currency = ?, 
                    payment_method = ?, 
                    project_type = ?, 
                    selected_services = ?, 
                    selected_offers = ?, 
                    updated_at = NOW() 
                WHERE id = ?
            ");

        $stmt->execute([
          $order->id,
          $amount,
          'INR',
          $paymentMethod,
          $projectType,
          json_encode($selectedServices),
          json_encode($selectedOffers),
          $existingPayment['id']
        ]);
      } else {
        // Insert new provisional row into payment_details
        $stmt = $pdo->prepare("
                INSERT INTO payment_details 
                (session_id, razorpay_order_id, amount, currency, payment_method, payment_status, project_type, selected_services, selected_offers, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ");

        $stmt->execute([
          $sessionId,
          $order->id,
          $amount,
          'INR',
          $paymentMethod,
          'pending',
          $projectType,
          json_encode($selectedServices),
          json_encode($selectedOffers)
        ]);
      }

      // Return order details
      echo json_encode([
        'success' => true,
        'order_id' => $order->id,
        'amount' => $amount,
        'key_id' => $razorpay_config['api_key'],
        'currency' => 'INR'
      ]);
    } catch (Exception $e) {
      echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
      ]);
    }

    exit;
  }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alacritys</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css" />
  <script src="https://unpkg.com/scrollreveal"></script>
  <link rel="stylesheet" href="assets/css/styles.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="assets/css/sticky-bar.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="assets/css/thank_you_scoped.css?v=<?php echo time(); ?>">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <!-- Font Awesome (for icons) -->

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="icon" type="image/x-icon" href="assets/images/Logo_for_Alacritys_Website.webp">
  <!-- Removed GSAP, ScrollTrigger, and SplitText CDN scripts -->


  <style>
    /* Fix for Offers/Summary Layout */
    .details-offers-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 20px;
      align-items: stretch;
      /* Ensure equal height columns */
    }

    .offers-column {
      flex: 0 0 68%;
      /* Adjusted for gap */
      max-width: 68%;
      display: flex;
      flex-direction: column;
      height: auto;
      /* Needs to be auto to stretch */
    }

    .details-column {
      flex: 0 0 30%;
      max-width: 30%;
      display: flex;
      flex-direction: column;
      height: auto;
    }

    .offers-card {
      height: 100%;
      flex: 1;
      /* Grow to fill column */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      /* Distribute content */
      position: relative;
      background-color: #fff;
      border-radius: 12px;

      box-shadow: 0 8px 15px rgb(53 53 53 / 15%);
      /* Match details-card shadow */

      /* Background Logo */
      background-image: url('assets/images/alacritys_logo_red_bg.webp');
      background-repeat: no-repeat;
      background-position: center bottom 40px;
      /* Reduced by ~20% from 140px */
      background-size: 112px;
      opacity: 0.99;
      /* Ensure visible */
      /* Ensure new stacking context */
    }


    .offers-grid {
      flex: 0 0 auto;
      /* Stop expanding to fill space */
      /* This pushes content to fill space, revealing background at bottom if empty */
      padding-bottom: 20px;
      /* Reduced to minimal spacing */
      /* Ensure space for logo */
      background: transparent !important;
      /* Ensure background shows through */
    }

    .offer-details-section,
    .offer-details-body {
      background: transparent !important;
      /* Ensure background shows through in details view */
      flex: 1;
    }

    /* Fix Layout for Watermark Background */
    .modal-plan-features {
      position: relative;
      display: block !important;
      /* Override flex if present */
    }

    .modal-features-text {
      position: relative;
      z-index: 2;
      /* Text on top */
      width: 100% !important;
    }

    .modal-features-visual {
      position: absolute;
      /* Take out of flow to be background */
      inset: 0;
      background-color: transparent;
      min-height: 100%;
      /* Cover parent */
      border-radius: 12px;
      margin-top: 0;
      overflow: hidden;
      pointer-events: none;
      /* Layout only */
      top: 0;
    }

    .modal-features-visual::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: url('assets/images/alacritys_logo_red_bg.webp');
      background-repeat: no-repeat;
      background-position: center right 20px;
      /* Position to right side */
      background-size: 35%;
      /* Adjusted size */
      opacity: 0.15;
      z-index: 0;
    }

    .offer-icon-container {
      display: none;
    }

    /* Tighten Summary List Spacing */
    .details-list .detail-row {
      padding: 1.1rem 0 !important;
      /* Increased spacing as requested */
    }

    .accordion-header {
      padding: 1.1rem 0 !important;
      /* Match detail-row padding */
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .detail-label,
    .detail-value {
      font-size: 0.95rem !important;
      /* Restored readable size */
    }

    /* Prevent summary items from spreading out vertically */
    .details-list {
      justify-content: flex-start !important;
      gap: 0 !important;
    }

    /* Ensure details card matches */
    .details-card {
      height: 100%;
      flex: 1;
      /* Match offers-card */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      /* Distribute content evenly */
    }

    @media (max-width: 768px) {
      .details-offers-container {
        flex-direction: column;
        /* Stack columns */
        margin-top: 10px;
        gap: 15px;
      }

      .offers-column,
      .details-column {
        flex: 0 0 100%;
        max-width: 100%;
      }

      /* Fix Watermark on Mobile */
      .modal-features-visual::before {
        background-position: center bottom;
        /* Center at bottom for mobile */
        background-size: 80%;
        /* Larger on mobile to be visible */
        opacity: 0.12;
        /* Subtle */
      }

      /* Fix Empty Space on Mobile */
      .offers-grid {
        padding-bottom: 0px !important;
        /* Remove padding */
      }

      .modal-plan-features {
        margin-top: 0 !important;
      }

      /* Ensure header text doesn't break layout */
      .details-header {
        white-space: normal;
        /* Allow wrapping if needed on very small screens */
        font-size: 1.8rem;
        /* Slightly smaller for mobile */
      }
    }

    @media (max-width: 900px) {

      .offers-column,
      .details-column {
        flex: 0 0 100%;
        max-width: 100%;
      }

      /* On mobile, maybe hide the logo or adjust? User said 'space comes for certain devices' */
      .offers-card {
        background-position: center bottom 20px;
        /* background-size: 100px; */
      }

      .offers-grid {
        padding-bottom: 120px;
      }
    }
  </style>
  <style>
    .btn-custom:hover {

      background: #cf0011;
      color: #fff;
    }

    .btn-custom {
      background: #e50215;
      color: #ffffff;
    }

    .progress-bar-circular .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #000000;
      font-size: 0.9rem;
      font-weight: bold;
      text-align: center;
    }

    /* .alacrity-service-price {
      font-size: 21px;
      font-weight: 700;
      margin-top: 0;
      margin-top: 10px;
      margin-bottom: 0;
      color: #000;
    } */

    /* .alacrity-service-card.alacrity-selected {
      border: 2px solid #e50215;
      box-shadow: 0 8px 16px rgba(215, 122, 97, 0.2);
      background-color: #fff1ea;
    } */


    /* .alacrity-service-name {
      font-size: 16px;
      text-align: center;
      margin-bottom: 0;
      font-weight: 600;
    } */

    .style-description {
      font-size: 14px;
    }



    .Start-btn-custom {
      background: var(--accent-color);
      color: white;
      font-weight: 600;
      font-size: 16px;
    }

    .circle-menu a:hover {
      opacity: 1;
      border: 3px solid #ffba12;
      box-shadow: #ffd407d6 0pt 0pt 18pt;

    }

    .circle-menu a {

      transition: ease-in all 0.3s;
    }

    .style-card {
      transition: ease-in all 0.2s !important;
      cursor: pointer;
    }

    .card-checkbox {

      position: absolute;
      left: 32px;
      top: 32px;
    }

    .alacrity-select-service {
      display: block;
    }

    .style-card.selected {

      box-shadow: 0 0 13px 2px #ef232345;

    }

    .card-column h3 {
      font-size: 1rem;
      color: var(--accent);
      margin-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
      font-weight: 700;
    }

    .card-column {
      flex: 1 1 100%;
      text-align: center;
    }

    .card-column span {
      /* background-color: #ffdcdc80; */
      font-size: 14px;
      padding: 4px;
      margin: 4px;
      /* line-height: 2.3rem; */
      white-space: normal;
      border-radius: 10px;
      display: inline-block;
      word-wrap: break-word;
      max-width: 100%;
    }

    .slider-container {

      padding-top: 59px;
    }

    /* .alacrity-service-card.active:not(:hover) .alacrity-select-service {
      display: block;
    } */

    .card-header img {
      width: 91px;
      position: absolute;
      top: -58px;
      background: #f00;
      padding: 14px;
      border-radius: 50%;
    }

    /* .alacrity-service-card.far-prev {
      transform: translateX(-234%) scale(0.8) rotateY(-10deg);
    }

    .alacrity-service-card.prev {
      transform: translateX(-147%) scale(0.9) rotateY(-5deg);
    }

    .alacrity-service-card.next {
      transform: translateX(47%) scale(0.9) rotateY(5deg);
    }

    .alacrity-service-card.far-next {
      transform: translateX(134%) scale(0.8) rotateY(10deg);
    } */

    /* .btn:hover {
      color: #ffe680;
      background-color: var(--bs-btn-hover-bg);
      border-color: var(--bs-btn-hover-border-color);
    } */

    .summary-cost {

      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .plan-price {
        font-size: 2.1rem;
      }

      button#estimateBackBtn {
        position: fixed;
        top: 17px;
        right: 89px;
      }
    }

    /* #plans-scroll {
      padding: 27px;
    } */

    button#estimateBackBtn {
      position: fixed;
      top: 17px;
      right: 589px;
      z-index: 1001;
      background: #000000;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgb(13 13 13 / 30%);
    }

    .progress-bar-circular .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #000000;
      font-size: 0.7rem;
    }

    .details-plan-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-color);
      text-align: center;
      margin-bottom: 1rem;
    }

    .offer-details-card {
      background: var(--white-color);
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 15px rgb(53 53 53 / 15%);
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .details-header {
      background: #ffeee1;
      color: #383838;
      padding: 1.5rem 1.5rem;
      /* Increased padding slightly */
      font-size: 2.2rem;
      /* Explicit large size to match screenshot */
      font-weight: 700;
      text-align: center;
      border-bottom: 2px solid var(--accent-color);
      white-space: nowrap;
      /* Force single line */
    }

    .offers-grid-column {
      flex: 0 0 75%;
    }

    .offers-card {
      background: var(--white-color);
      border: none;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .offers-card:hover {
      box-shadow: 0 12px 40px rgb(82 82 82 / 25%);
      transform: translateY(-2px);
    }


    .offer-item:hover {
      border-color: var(--accent-color);
      background: linear-gradient(135deg, #fff5f5 0%, #ffe6e60a 100%);
      transform: translateY(-5px) scale(1.02);
      box-shadow: 5px 4px 11px rgb(97 97 97 / 25%);
    }


    .details-card {
      background: var(--white-color);
      border: none;
      border-radius: 16px;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .details-card:hover {
      box-shadow: 0 12px 40px rgb(79 79 79 / 25%);
      transform: translateY(-2px);
    }

    .details-list {

      box-shadow: none;

    }

    .content_class {
      background: #f0f0f075;
      margin-top: 10px;
    }

    .offer-details-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 13px;
    }

    .offer-details-card:hover {
      box-shadow: 0 12px 40px rgb(0 0 0 / 18%);
      transform: translateY(-2px);
    }

    :root {
      --font-size-sm: calc(0.4rem + 0.7vw);
    }

    @media (max-width: 425px) {
      .services-header {
        margin-bottom: 0;
      }
    }

    button.alacrity-slider-arrow.alacrity-left::before {
      content: "❮";
    }

    button.alacrity-slider-arrow.alacrity-right::before {
      content: "❯";
    }
  </style>
</head>

<body>

  <nav class="navbar" style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding-left: 1rem;">
    <a href="index.php" class="logo" style="margin-left: 0.5rem;"><img src="assets/images/alacritys_logo_new.webp" alt="Brand Logo"
        style="height:40px;vertical-align:middle;"></a>

    <div class="progress-container">

      <div class="progress-bar-horizontal"></div>
      <div class="progress-bar-circular"></div>
    </div>
    <button class="hamburger">☰</button>
  </nav>








  <main>
    <!-- survey section  -->
    <section id="arrow-section">
      <!-- <div class="arrow-header" style="text-align:center;">
        <h1 class="arrow-heading">Dreaming of a <span class="accent">New Look?</span></h1>
        <p class="arrow-subtitle">Unlock Your Project Estimate in Minutes — Just Answer Quick Questions!</p>
      </div>
      <div class="start-btn-container">
        <button class="Start-btn-custom">START</button>
        <div class="bubble-row">
          <img src="https://alacritys.in/wp-content/uploads/2025/07/Profile-Photo-YouTube-Post-2-1.png" alt="avatar"
            class="avatar-img">
          <div class="bubble-speech">
            We evaluate your space to reveal design opportunities, optimize your budget, and enhance your living
            experience.
          </div>
        </div>
      </div> -->
      <!-- Consolidated Title Section -->
      <div id="step-info-box" style="text-align: center; padding: 0 1rem; display: block;">
        <h1 class="prj_typeheading" style="color: #333; text-align: center; margin: 0 auto; line-height: 1.4; width: 100%; max-width: 100%;">
          Just a Few <span style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215; text-underline-offset: 5px;">Details</span> to Begin
        </h1>
        <p class="room-config-subtitle" style="margin-top: 0.75rem; margin-bottom: 0;">
          This helps us arrive at a more accurate estimate.
        </p>
      </div>

      <div id="app">
        <div id="mainContent">
          <div id="mainTop">
            <div id="content">
              <div id="step-counter" class="step-counter">
                (<span id="current-step">1</span> / <span id="total-steps">5</span> Steps)
              </div>
              <div id="main" class="question-bubble"></div>
              <div id="sub"></div>
            </div>
            <div id="chatBubbleContainer"></div>
          </div>
          <div id="controls">
            <div id="left" class="arrow">&#8592;</div>
            <div id="menuContainer">

              <div id="textContainer">
                <div class="item">1</div>
                <!-- ...circle content if any... -->
              </div>
            </div>
            <div id="right" class="arrow">&#8594;</div>
          </div>
        </div>
      </div>
    </section>

    <!-- project type section  -->
    <section id='prj-type-sel-section'>
      <div class="contain-center">
        <div class="services-header">
          <h1 class="prj_typeheading">Know Your Project <strong><span style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215;">Cost in Moments!</span></strong>
          </h1>
          <p class="prj_subtitle">
            <span class="desktop-text">Calculate your costs in a snap by following a few simple steps!<br><strong>Select your project type below.</strong></span>
            <span class="mobile-text">Calculate your costs in a snap by following a few simple steps!<br><strong>Select your project type below.</strong></span>
          </p>
        </div>
        <div class="circle-menu" id="circleMenu">
          <!-- JS will populate items -->
        </div>
      </div>
    </section>

    <!-- New Room Configuration Section -->
    <section id="room-config-section" class="room-config-bg" style="display: none;">
      <div class="room-config-header">
        <h1 class="prj_typeheading room_config_heading">
          Choose the Room/Area(s)<br>You <span
            style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215;">Want to Transform</span>
        </h1>
        <p class="room-config-subtitle">
          Customize your space by selecting room types and quantities
          <span class="info-tooltip" data-tooltip="Select all rooms that apply to your project">
            <i class="fas fa-info-circle"></i>
          </span>
        </p>
      </div>

      <div id="roomConfigContainer" style="width: 90%;   margin: 2rem auto;">
        <!-- JS will populate room configuration here -->
      </div>

      <button id="roomConfigDownArrow" class="section-arrow-down-btn" aria-label="Scroll Down">
        &#8595;
      </button>
    </section>


    <section id="house_architecture_section" style="display:none;">
      <div class="container mt-4">
        <div class="row">
          <!-- Number of Floors -->
          <div class="col-md-6">
            <h2 class="mb-3">Number of Floors</h2>
            <div class="option-box floor-option" data-value="Ground+Terrace">Ground+Terrace</div>
            <div class="option-box floor-option" data-value="Ground+1+Terrace">Ground+1+Terrace</div>
            <div class="option-box floor-option" data-value="Ground+2+Terrace">Ground+2+Terrace</div>
            <div class="option-box floor-option" data-value="Ground+3+Terrace">Ground+3+Terrace</div>
          </div>

          <!-- Pre-Construction -->
          <div class="col-md-6">
            <h2 class="mb-3">Pre-Construction</h2>
            <div class="option-box precon-option" data-value="Plot Survey and Layout Drawing">Plot Survey and Layout Drawing</div>
            <div class="option-box precon-option" data-value="Architectural Design Fees">Architectural Design Fees (per sq. ft.)</div>
            <div class="option-box precon-option" data-value="Approvals">Approvals (lump sum)</div>
            <div class="option-box precon-option" data-value="Soil Testing">Soil Testing (lump sum)</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hidden fields for form submission -->
    <input type="hidden" name="floor_type" id="floor_type">
    <input type="hidden" name="preconstruction_items" id="preconstruction_items">

    <style>
      .option-box {
        border: 2px solid #e50215;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 10px;
        font-weight: 600;
        background: #fffaf8;
        cursor: pointer;
        transition: 0.3s ease;
      }

      .option-box:hover {
        background: #ffeaea;
      }

      .option-box.active {
        background: #e50215;
        color: #fff;
      }
    </style>

    <script>

    </script>

    <!-- New Room Configuration Section -->
    <section id="room-config-section" class="room-config-bg" style="display: none;">
      <div class="room-config-header">
        <h1 class="prj_typeheading room_config_heading">
          Choose the Room/Area(s)<br>You <span
            style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215;">Want to Transform</span>
        </h1>
        <p class="room-config-subtitle">
          Customize your space by selecting room types and quantities
          <span class="info-tooltip" data-tooltip="Select all rooms that apply to your project">
            <i class="fas fa-info-circle"></i>
          </span>
        </p>
      </div>

      <div id="roomConfigContainer" style="width: 90%;   margin: 2rem auto;">
        <!-- JS will populate room configuration here -->
      </div>

      <button id="roomConfigDownArrow" class="section-arrow-down-btn" aria-label="Scroll Down">
        &#8595;
      </button>
    </section>

    <!-- design style section  -->
    <section id="Design_Style" class="Design_Style">
      <div class="dsg-main-container">
        <div class="dsg-header">
          <h1 class="prj_typeheading dsg-main-heading">Decide on Your <strong><span
                style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215;">Perfect Design Style</span></strong>
          </h1>
          <p class="dsg-subtitle">Browse our signature aesthetics to find your <span style="white-space: nowrap;">perfect match</span></p>
        </div>

        <!-- Desktop layout -->
        <div class="dsg-desktop-container">
          <!-- Desktop navigation (left side) -->
          <div class="dsg-desktop-nav" id="desktopNav">
            <div class="dsg-nav-item active" data-target="Modern Minimalist">Minimalist</div>
            <div class="dsg-nav-item" data-target="Mid-Century Modern">Mid-Century Design</div>
            <div class="dsg-nav-item" data-target="Urban Design">Urban Design</div>
            <div class="dsg-nav-item" data-target="Hollywood Glam">Hollywood Glam</div>
            <div class="dsg-nav-item" data-target="Shabby Chic Design">Shabby Chic Design</div>
            <div class="dsg-nav-item" data-target="Classic Contemporary">Classic Contemporary</div>
            <div class="dsg-nav-item" data-target="Fusion Style">Fusion Style</div>
            <div class="dsg-nav-item" data-target="Industrial Design">Industrial Design</div>
            <div class="dsg-nav-item" data-target="Contemporary Design">Contemporary Design</div>
            <div class="dsg-nav-item" data-target="Traditional">Traditional</div>
            <div class="dsg-nav-item" data-target="Classic">Classic</div>
            <div class="dsg-nav-item" data-target="Transitional">Transitional</div>
            <div class="dsg-nav-item" data-target="Modern">Modern</div>
          </div>

          <!-- Content area -->
          <div class="dsg-content-area">
            <div class="dsg-mobile-top">
              <div class="dsg-mobile-nav" id="mobileNav">
                <div class="dsg-nav-item active" data-target="Modern Minimalist">Minimalist</div>
                <div class="dsg-nav-item" data-target="Mid-Century Modern">Mid-Century</div>
                <div class="dsg-nav-item" data-target="Urban Design">Urban Design</div>
                <div class="dsg-nav-item" data-target="Hollywood Glam">Hollywood</div>
                <div class="dsg-nav-item" data-target="Shabby Chic Design">Shabby Chic</div>
                <div class="dsg-nav-item" data-target="Classic Contemporary">Contemporary</div>
                <div class="dsg-nav-item" data-target="Fusion Style">Fusion</div>
                <div class="dsg-nav-item" data-target="Industrial Design">Industrial</div>
                <div class="dsg-nav-item" data-target="Contemporary Design">Contemporary</div>
                <div class="dsg-nav-item" data-target="Traditional">Traditional</div>
                <div class="dsg-nav-item" data-target="Classic">Classic</div>
                <div class="dsg-nav-item" data-target="Transitional">Transitional</div>
                <div class="dsg-nav-item" data-target="Modern">Modern</div>
              </div>
            </div>

            <!-- Minimalist Section -->
            <div id="Modern Minimalist" class="dsg-content-section active">
              <div class="dsg-desktop-hero"><img
                  src="assets/images/ForCostEstimation/For Cost Estimation Tool - Modern Minimalist Living Room.webp"
                  alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Modern Minimalist</h3>
                  <p class="dsg-section-desc">The focus is on the purity and simplicity of the shape and form.This also
                    includes Design sub-styles - Scandinavian & Coastal.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Simplicity in form and function</li>
                    <li class="dsg-feature-item">Uncomplicated cladding & wall finishes</li>
                    <li class="dsg-feature-item">Clean, open, light-filled spaces</li>
                    <li class="dsg-feature-item">Simple detailing, devoid of decoration</li>
                    <li class="dsg-feature-item">Strategic use of materials for visual interest, texture, and
                      personality</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Kitchen.webp"
                      alt=""></div>
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Bedroom.webp"
                      alt=""></div>
                </div>

              </div>
            </div>

            <!-- Mid-Century Modern Section -->
            <div id="Mid-Century Modern" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img
                  src="assets\images\ForCostEstimation\For Cost Estimation Tool - Mid-Century Modern Living Room.webp"
                  alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Mid-Century Modern</h3>
                  <p class="dsg-section-desc">The focus is on organic shapes, minimal decor, functionality, & making it
                    timeless.This also includes Design sub-styles - Vintage & French-Country.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Organic & geometric shapes</li>
                    <li class="dsg-feature-item">Function over form</li>
                    <li class="dsg-feature-item">Minimal ornamentation</li>
                    <li class="dsg-feature-item">Contradicting materials & textures</li>
                    <li class="dsg-feature-item">Neutral (& bold!) colours</li>
                    <li class="dsg-feature-item">Bringing nature indoors</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Mid-Century Modern Kitchen.webp"
                      alt=""></div>
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Mid-Century Modern Bedroom.webp"
                      alt=""></div>
                </div>
              </div>
            </div>

            <!-- Urban Design Section -->
            <div id="Urban Design" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img
                  src="assets\images\ForCostEstimation\For Cost Estimation Tool - Urban Design Living Room.webp" alt="">
              </div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Urban Design</h3>
                  <p class="dsg-section-desc">The focus is on simplicity, practicality, & functionality.This also
                    includes Design sub-styles - Contemporary, Modern, & Industrial.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Smooth clean lines</li>
                    <li class="dsg-feature-item">Clean appearances</li>
                    <li class="dsg-feature-item">Open & natural lighting</li>
                    <li class="dsg-feature-item">Simplistic furniture design</li>
                    <li class="dsg-feature-item">Deliberate use of textures</li>
                    <li class="dsg-feature-item">Subtle sophistication</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Urban Design Kitchen.webp" alt="">
                  </div>
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Urban Design Bedroom.webp" alt="">
                  </div>
                </div>
              </div>
            </div>

            <!-- Hollywood Glam Section -->
            <div id="Hollywood Glam" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img
                  src="assets\images\ForCostEstimation\For Cost Estimation Tool - Hollywood Glam Living Room.webp"
                  alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Hollywood Glam</h3>
                  <p class="dsg-section-desc">The focus is on organic open layouts, high contrast colour palette, and
                    how it blends the theatrical with the practical. This also includes Design sub-styles - Mid-Century
                    & Dramatic.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">1-2 vibrant colours to the palette</li>
                    <li class="dsg-feature-item">Main colours - Neutral, black, White, Grey, & Beige</li>
                    <li class="dsg-feature-item">Clean lines for the furniture & curved, elegant lines in the
                      accessories & decor</li>
                    <li class="dsg-feature-item">Best Fixture finishes - Brass, Chrome, Crystal, Finished hardwood,&
                      Lacquer</li>
                    <li class="dsg-feature-item">Glamorous without being overbearing</li>
                    <li class="dsg-feature-item">1-2 statement pieces like chandelier, sculpture, or art piece</li>
                    <li class="dsg-feature-item">Use of rich textures such as, velvet, silk, fur, or leather</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Hollywood Glam Kitchen.webp"
                      alt=""></div>
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Hollywood Glam Bedroom.webp"
                      alt=""></div>
                </div>
              </div>
            </div>

            <!-- Shabby Chic Design Section -->
            <div id="Shabby Chic Design" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img
                  src="assets\images\ForCostEstimation\For Cost Estimation Tool - Shabby Chic Living Room.webp" alt="">
              </div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Shabby Chic Design</h3>
                  <p class="dsg-section-desc">The focus is on creating a fusion of elegance with boldness & classic with
                    romantic aesthetics. This also includes Design sub-styles - Vintage, Rustic with Trendy &
                    Fashionable.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Distressed furniture</li>
                    <li class="dsg-feature-item">Mix & match accessories</li>
                    <li class="dsg-feature-item">Add in natural elements</li>
                    <li class="dsg-feature-item">Could be neutral background</li>
                    <li class="dsg-feature-item">Relaxed appearance</li>
                    <li class="dsg-feature-item">Wall moulding</li>
                    <li class="dsg-feature-item">Floral wallpapers, & vintage accessories</li>
                    chandeliers</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Shabby Chic Kitchen.webp" alt="">
                  </div>
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Shabby Chic Bedroom.webp" alt="">
                  </div>
                </div>
              </div>
            </div>

            <!-- Contemporary Section -->
            <div id="Classic Contemporary" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img
                  src="assets\images\ForCostEstimation\For Cost Estimation Tool - Classic Contemporary Living Room.webp"
                  alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Classic Contemporary</h3>
                  <p class="dsg-section-desc">The focus is on creating curated, minimal to maximalist, uncluttered
                    semi-cluttered, simplicity to classic, subtle sophistication, deliberate use of texture, & clean
                    lines. Handcrafted quality made pieces are incorporated to reflect individual's style. This includes
                    Design sub-styles - Modern, Minimalism, & Maximalism.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Clever use of colours from light to bold colour, i.e., tones of colours
                    </li>
                    <li class="dsg-feature-item">Blend of textures & materials</li>
                    <li class="dsg-feature-item">Simple shapes & crisp lines</li>
                    <li class="dsg-feature-item">Combination of artificial & natural
                      elements</li>
                    <li class="dsg-feature-item">Sense of openness and spaciousness</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Classic Contemporary Kitchen.webp"
                      alt=""></div>
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Classic Contemporary Bedroom.webp"
                      alt=""></div>
                </div>
              </div>
            </div>

            <!-- Fusion Section -->
            <div id="Fusion Style" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Fusion Style Living Room.webp" alt="">
              </div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Fusion Style</h3>
                  <p class="dsg-section-desc">The focus is on creating own logical creative designs without any
                    boundaries of particular styles.This also includes Design sub-styles - Trendy & Fashionable.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Soft with contrast colour palette combination</li>
                    <li class="dsg-feature-item">Natural & artificial elements combination</li>
                    <li class="dsg-feature-item">Could be of dark to light or no theme to thematic combination</li>
                    <li class="dsg-feature-item">Blend of any lines, shapes, & forms</li>
                    <li class="dsg-feature-item">Maximum lighting to the required ambience lighting</li>
                    <li class="dsg-feature-item">Soft to hard fabrics, finishes, or textures</li>
                    <li class="dsg-feature-item">Simple to detailed oriented furniture</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Fusion Style Kitchen.webp" alt="">
                  </div>
                  <div class="dsg-thumbnail"><img
                      src="assets\images\ForCostEstimation\For Cost Estimation Tool - Fusion Style Bedroom.webp" alt="">
                  </div>
                </div>
              </div>
            </div>



            <!-- Industrial Design Section -->
            <div id="Industrial Design" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img src="assets/images/ForCostEstimation/For Cost Estimation Tool - Modern Minimalist Living Room.webp" alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Industrial Design</h3>
                  <p class="dsg-section-desc">Focuses on raw materials, exposed finishes, and utilitarian design inspired by factories and warehouses.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Exposed brick walls and ducts</li>
                    <li class="dsg-feature-item">Metal and wood combination</li>
                    <li class="dsg-feature-item">Neutral color palette</li>
                    <li class="dsg-feature-item">Open layout with minimal partitions</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Kitchen.webp" alt=""></div>
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Bedroom.webp" alt=""></div>
                </div>
              </div>
            </div>

            <!-- Contemporary Design Section -->
            <div id="Contemporary Design" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img src="assets/images/ForCostEstimation/For Cost Estimation Tool - Modern Minimalist Living Room.webp" alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Contemporary Design</h3>
                  <p class="dsg-section-desc">A fluid design approach that adapts modern trends and focuses on clean lines and functionality.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Neutral tones with pops of bold color</li>
                    <li class="dsg-feature-item">Smooth textures and sleek materials</li>
                    <li class="dsg-feature-item">Minimalist furniture</li>
                    <li class="dsg-feature-item">Ample natural light</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Kitchen.webp" alt=""></div>
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Bedroom.webp" alt=""></div>
                </div>
              </div>
            </div>

            <!-- Traditional Design Section -->
            <div id="Traditional" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img src="assets/images/ForCostEstimation/For Cost Estimation Tool - Modern Minimalist Living Room.webp" alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Traditional</h3>
                  <p class="dsg-section-desc">Inspired by classic European decor, it features elegant furniture, symmetry, and warm tones.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Rich wood tones</li>
                    <li class="dsg-feature-item">Classic furniture styles</li>
                    <li class="dsg-feature-item">Warm and inviting palette</li>
                    <li class="dsg-feature-item">Layered textures and fabrics</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Kitchen.webp" alt=""></div>
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Bedroom.webp" alt=""></div>
                </div>
              </div>
            </div>

            <!-- Classic Design Section -->
            <div id="Classic" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img src="assets/images/ForCostEstimation/For Cost Estimation Tool - Modern Minimalist Living Room.webp" alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Classic</h3>
                  <p class="dsg-section-desc">Evokes timeless elegance with symmetry, ornate details, and sophisticated materials.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Symmetrical layouts</li>
                    <li class="dsg-feature-item">Elegant moldings and trims</li>
                    <li class="dsg-feature-item">Luxury fabrics like silk or velvet</li>
                    <li class="dsg-feature-item">Neutral tones and gold accents</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Kitchen.webp" alt=""></div>
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Bedroom.webp" alt=""></div>
                </div>
              </div>
            </div>

            <!-- Transitional Design Section -->
            <div id="Transitional" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img src="assets/images/ForCostEstimation/For Cost Estimation Tool - Modern Minimalist Living Room.webp" alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Transitional</h3>
                  <p class="dsg-section-desc">A perfect balance between traditional elegance and contemporary simplicity.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Mix of classic and modern elements</li>
                    <li class="dsg-feature-item">Neutral palette with texture variety</li>
                    <li class="dsg-feature-item">Streamlined furniture</li>
                    <li class="dsg-feature-item">Comfort-focused layouts</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Kitchen.webp" alt=""></div>
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Bedroom.webp" alt=""></div>
                </div>
              </div>
            </div>

            <!-- Modern Design Section -->
            <div id="Modern" class="dsg-content-section">
              <div class="dsg-desktop-hero"><img src="assets/images/ForCostEstimation/For Cost Estimation Tool - Modern Minimalist Living Room.webp" alt=""></div>
              <div class="dsg-section-wrapper">
                <div class="dsg-text-group">
                  <h3 class="dsg-section-title">Modern</h3>
                  <p class="dsg-section-desc">Characterized by simplicity, open spaces, and a focus on function over ornamentation.</p>
                  <ul class="dsg-feature-list">
                    <li class="dsg-feature-item">Clean lines and geometric forms</li>
                    <li class="dsg-feature-item">Open floor plans</li>
                    <li class="dsg-feature-item">Neutral and monochrome color schemes</li>
                    <li class="dsg-feature-item">Functional furniture and minimal clutter</li>
                  </ul>
                  <div class="dsg-actions"><button class="btn-custom select-style-btn">Select This Style</button></div>
                </div>
                <div class="dsg-image-group">
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Kitchen.webp" alt=""></div>
                  <div class="dsg-thumbnail"><img src="assets\images\ForCostEstimation\For Cost Estimation Tool - Modern Minimalist Bedroom.webp" alt=""></div>
                </div>
              </div>
            </div>



          </div>
        </div>

        <button id="designStyleDownArrow" class="section-arrow-down-btn" aria-label="Scroll Down">
          &#8595;
        </button>
        <!-- Image Modal -->
        <div class="dsg-image-modal" id="imageModal">
          <div class="dsg-modal-content">
            <button class="dsg-modal-close" id="modalClose">&times;</button>
            <img class="dsg-modal-image" id="modalImage" src="" alt="">
          </div>
        </div>
      </div>

    </section>

    <!-- category section  -->
    <section id="design_categories" class="design-section-container">
      <div class="slider-header">
        <h1 class="prj_typeheading design_categories_heading">Pick the Material & Finish Package<br><span
            style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215;">that Suits You the Best</span></h1>
        <p class=" design_categories_subtitle">Discover styles crafted for comfort, elegance, and functionality.</p>
      </div>

      <div class="slider-container">
        <div class="slider-nav">
          <button class="slider-btn" id="prevBtn">&#10094;</button>
          <button class="slider-btn" id="nextBtn">&#10095;</button>
        </div>
        <div class="slider-track" id="sliderTrack"></div>
        <div class="slider-dots" id="sliderDots"></div>
      </div>



    </section>

    <!-- contact us -->
    <section id="qform-alt">
      <div class="btn-alt" id="btn-alt">Unlock Cost</div>

      <div class="menu-alt" id="menu-alt">
        <div class="contact-form-box">
          <div class="close-alt" id="close-alt">&times;</div>
          <h2 style="margin-bottom: 5px;"><span style="color:#fff; font-weight: 800;">Almost</span> <span
              style="color: #000; text-decoration: underline; text-decoration-color: #000; font-weight: 800;">There</span>
          </h2>
          <p style="font-size: 16px; margin-top: 0px; margin-bottom: 20px; font-weight: 500; text-align: center;">Provide Your Details To View And Receive Your Cost Summary.</p>
          <form id="contactForm" action="assets/api/submit.php" method="POST">
            <!-- Restored backup structure -->
            <div class="form-group">
              <div class="name-input-group" style="display: flex; gap: 10px; flex-direction: row;">
                <div class="name-field" style="flex: 1; min-width: 0;">
                  <label for="firstName" class="form-label">First Name *</label>
                  <input type="text" class="form-control" id="firstName" name="firstName" placeholder="First Name" required />
                </div>
                <div class="name-field" style="flex: 1; min-width: 0;">
                  <label for="lastName" class="form-label">Last Name *</label>
                  <input type="text" class="form-control" id="lastName" name="lastName" placeholder="Last Name" required />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email *</label>
              <input type="email" class="form-control" id="email" name="email" placeholder="Eg: myname@gmail.com" required />
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">Phone Number *</label>
              <div class="phone-input-group">
                <select class="country-code-select" id="countryCode" name="countryCode" required>
                  <option value="+91" selected>🇮🇳 +91 (India)</option>
                  <option value="+1">🇺🇸 +1 (USA)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+61">🇦🇺 +61 (Australia)</option>
                  <option value="+971">🇦🇪 +971 (UAE)</option>
                </select>
                <input type="tel" class="form-control" id="phone" name="phone" placeholder="10 digits" pattern="[0-9]{6,15}" required />
              </div>
            </div>

            <div class="form-group">
              <label for="pincode" class="form-label">PIN Code *</label>
              <input type="text" class="form-control" id="pincode" name="pincode" placeholder="6 digit PIN code" pattern="[0-9]{6}" required />
            </div>

            <!-- WhatsApp Checkbox Removed -->
          </form>

          <div style="text-align: center; margin-top: 1rem;">
            <button type="submit" class="btn-custom" style="width: fit-content; padding: 10px 20px; background: #000 !important; color: #fff !important;" form="contactForm">Get
              Quote</button>
          </div>
        </div>
      </div>

    </section>

    <!-- style="display: none; -->
    <section class="estimate_container" id="estimate_section" style="display: none;">

      <button id="estimateBackBtn" class="section-arrow-up-btn" aria-label="Go Back"
        style="position: fixed; top: 95px; left: 2px; z-index: 1001; background: #383838; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 20px; cursor: pointer; box-shadow: 0 4px 12px rgba(229, 2, 21, 0.3);">
        &#8592;
      </button>

      <!-- estimate_header -->
      <div class="estimate_header">
        <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js" type="module"></script>

        <div align="center" class="text-center" style="display: inline-flex; margin-top: 40px;">
          <dotlottie-wc src="https://lottie.host/5c15d255-a7e7-493b-911a-df972073d379/FU0Iex3uxi.lottie"
            style="width: 370px;" speed="1" autoplay loop></dotlottie-wc>
        </div>
        <h1 style="color: #23272e; font-size: 1.2rem !important; margin-bottom: 1.2rem;">Hey <span
            id="summaryUserName">{{clientDetails.firstName}}</span>, <br>
          Your estimate is ready!</h1>
        <h2 class="estimate-main-heading summary-cost">
          {{currency}}{{costBreakdown.final_project_cost.toLocaleString()}}<span
            style="font-size: var(--font-size-lg);">/-</span>
        </h2>
        <div class="note">
          ★ Inludes Labour and Material Supply
        </div>
      </div>

      <!-- ========================================
           STICKY REFINEMENT BAR (TOP)
           ======================================== -->
      <div id="refinement-sticky-bar-top" class="refinement-sticky-container">
        <div class="refinement-sticky-inner">
          <div class="refinement-arrows refinement-arrows-left" onclick="scrollToServices()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 3 12 9 18 3"></polyline>
              <polyline points="6 9 12 15 18 9"></polyline>
              <polyline points="6 15 12 21 18 15"></polyline>
            </svg>
          </div>
          <div class="refinement-message">
            <span class="refinement-desktop">You're in control now. Select only the services that make sense for your space and budget.</span>
            <span class="refinement-mobile">You're in control now.<br>Select only the services that make sense for your space and budget.</span>
          </div>
          <div class="refinement-arrows refinement-arrows-right" onclick="scrollToServices()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 3 12 9 18 3"></polyline>
              <polyline points="6 9 12 15 18 9"></polyline>
              <polyline points="6 15 12 21 18 15"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <section class="compare-packages-section">
        <div class="compare_packages">
          <div class="container">
            <div class="compare_packages_title">
              <h2 tabindex="0" class="focus-visible-auto-imp">
                Compare The <span
                  style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215;">Packages</span>
              </h2>
              <button tabindex="0" class="compare-showmore-evt focus-visible-auto-imp">Show More</button>
            </div>

            <div class="card_wrapper card_wrapper-htm">
              <!-- Economy Card -->
              <div class="compare_packages_card">
                <div class="card_title">
                  <div class="card-icon"><img src="assets/images/003-medal.webp"></div>
                  <h3 tabindex="0" aria-label="Economy" class="focus-visible-auto-imp">Standard</h3>
                </div>
                <div class="card_price">
                  <p tabindex="0" aria-label="card price" class="card_price-compare-economy-txt focus-visible-auto-imp">
                    ₹ 0/-</p>
                  <span tabindex="0" aria-label="card description"
                    class="card_desc-compare-economy-txt focus-visible-auto-imp">Kitchen Standard | Guest Bedroom
                    Standard
                    | Bathroom Standard | Living Room Standard</span>
                </div>

                <div class="card_info card_info-compare-economy-htm">
                  <div class="room_category">
                    <p tabindex="0" aria-label="Rooms" class="focus-visible-auto-imp">Selected rooms</p>
                    <span tabindex="0" aria-label="" class="focus-visible-auto-imp" id="economy-rooms">Kitchen
                      (1)</span>
                    <ul class="room_list">
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Furniture
                        <ul>
                          <li>High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets.</li>
                        </ul>
                      </li>
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Shutter Options
                        <ul>
                          <li>Gloss & Matt Laminate</li>
                          <li>Premium Textured Laminate</li>
                          <li>Anti-Scratch Acrylic</li>
                          <li>or Profile Glass Doors.</li>
                        </ul>
                      </li>
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Accessories
                        <ul>
                          <li>Hob & Chimney</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Premium Card -->
              <div class="compare_packages_card">
                <div class="card_title">
                  <div class="card-icon"><img src="assets/images/001-star.webp"></div>
                  <h3 tabindex="0" aria-label="Premium" class="focus-visible-auto-imp">Premium</h3>
                </div>
                <div class="card_price">
                  <p tabindex="0" aria-label="card price" class="card_price-compare-premium-txt focus-visible-auto-imp">
                    ₹ 0/-</p>
                  <span tabindex="0" aria-label="card description"
                    class="card_desc-compare-premium-txt focus-visible-auto-imp">Kitchen Premium | Guest Bedroom Premium
                    | Bathroom Premium | Living Room Premium</span>
                </div>

                <div class="card_info card_info-compare-premium-htm">
                  <div class="room_category">
                    <p tabindex="0" aria-label="Rooms" class="focus-visible-auto-imp">Selected rooms</p>
                    <span tabindex="0" aria-label="" class="focus-visible-auto-imp" id="premium-rooms">Kitchen
                      (1)</span>
                    <ul class="room_list">
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Furniture
                        <ul>
                          <li>High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets.</li>
                        </ul>
                      </li>
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Shutter Options
                        <ul>
                          <li>PU Painted Gloss and Matt</li>
                          <li>PU Painted Toughened Glass</li>
                          <li>Gloss & Matt Laminate</li>
                          <li>Premium Textured Laminate</li>
                          <li>Anti-Scratch Acrylic</li>
                          <li>or Profile Glass Doors.</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Luxury Card -->
              <div class="compare_packages_card">
                <div class="card_title">
                  <div class="card-icon"><img src="assets/images/002-diamond.webp"></div>
                  <h3 tabindex="0" aria-label="Luxury" class="focus-visible-auto-imp">Luxury</h3>
                </div>
                <div class="card_price">
                  <p tabindex="0" aria-label="card price" class="card_price-compare-luxury-txt focus-visible-auto-imp">₹
                    0/-</p>
                  <span tabindex="0" aria-label="card description"
                    class="card_desc-compare-luxury-txt focus-visible-auto-imp">Kitchen Luxury | Guest Bedroom Luxury |
                    Bathroom Luxury | Living Room Luxury</span>
                </div>

                <div class="card_info card_info-compare-luxury-htm">
                  <div class="room_category">
                    <p tabindex="0" aria-label="Rooms" class="focus-visible-auto-imp">Selected rooms</p>
                    <span tabindex="0" aria-label="" class="focus-visible-auto-imp" id="luxury-rooms">Kitchen (1)</span>
                    <ul class="room_list">
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Furniture
                        <ul>
                          <li>High-Density Fiberboard/Boiling Water Resistant (HDF/BWR) cabinets.</li>
                        </ul>
                      </li>
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Shutter Options
                        <ul>
                          <li>PU Painted Gloss and Matt</li>
                          <li>PU Painted Toughened Glass</li>
                          <li>Veneer and Ceramic</li>
                          <li>and Exotic Crest Finishes.</li>
                        </ul>
                      </li>
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Accessories
                        <ul>
                          <li>Hob & Chimney</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Personalized Card -->
              <div class="compare_packages_card">
                <div class="card_title">
                  <div class="card-icon"><img src="assets/images/004-medals.webp"></div>
                  <h3 tabindex="0" aria-label="Personalized" class="focus-visible-auto-imp">Personalized</h3>
                </div>
                <div class="card_price">
                  <p tabindex="0" aria-label="card price"
                    class="card_price-compare-personalized-txt focus-visible-auto-imp">Custom Quote</p>
                  <span tabindex="0" aria-label="card description"
                    class="card_desc-compare-personalized-txt focus-visible-auto-imp">Customize your own package</span>
                </div>

                <div class="card_info card_info-compare-personalized-htm">
                  <div class="room_category">
                    <p tabindex="0" aria-label="Features" class="focus-visible-auto-imp">Features</p>
                    <ul class="room_list">
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Options
                        <ul>
                          <li>Choose from any of our materials and finishes</li>
                          <li>Select exactly the rooms you need</li>
                          <li>Custom furniture designs</li>
                          <li>Premium appliances</li>
                        </ul>
                      </li>
                      <li tabindex="0" aria-label="room types" class="room_types focus-visible-auto-imp">Benefits
                        <ul>
                          <li>Tailored to your specific needs</li>
                          <li>Flexible budget options</li>
                          <li>One-on-one design consultation</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div class="personalized-contact-btn">
                    <button class="contact-btn" onclick="contactUs()">Contact Us</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Show Less Button (initially hidden) -->
            <div class="compare-showless-container" style="display: none;">
              <button class="compare-showless-evt" onclick="showLessAndScroll()">Show Less</button>
            </div>
          </div>

          <button id="comparePackagesDownArrow" class="section-arrow-down-btn" aria-label="Scroll Down"
            style="display: none;">
            &#8595;
          </button>
        </div>
      </section>

      <section id="service_section">
        <div class="alacrity-services-container">
          <div class="alacrity-services-header">
            <div class="slider-header service-slider-header">
              <h1 class="prj_typeheading service-slider-heading">Choose the <span
                  style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215;">Services You Require</span>
                <span class="service-arrow-animated">↓</span>
              </h1>
              <p class=" design_categories_subtitle service-slider-subtitle">Tell us what you want us to handle next.
              </p>
            </div>
          </div>

          <div class="alacrity-slider-container">
            <button class="alacrity-slider-arrow alacrity-left">
              <i class=" fa fas fa-chevron-left"></i>❮
            </button>

            <div class="alacrity-slider-viewport">
              <div class="alacrity-slider-track" id="alacrity-slider-track">
                <!-- Service cards will be dynamically inserted here -->
              </div>
            </div>

            <button class="alacrity-slider-arrow alacrity-right">
              <i class="fas fa-chevron-right"></i>❯
            </button>
          </div>
        </div>
      </section>

      <div class="content_class">
        <!-- Cost Summary Section -->
        <div class="cost-summary">
          <!-- Two Column Layout: Offers & Details -->
          <div class="details-offers-container">
            <!-- Left Column: Offers (70%) -->
            <div class="offers-column">
              <div class="offers-card">
                <div class="offers-header" style="background: #e50215; color: #fff; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
                  <span style="font-size: var(--font-size-lg-laptop); font-weight: bold;">Alacritys Signature <span style="text-decoration: underline; text-decoration-color: #fff; text-decoration-thickness: 3px; text-underline-offset: 5px;">Offers</span></span>
                  <p style="color: rgba(255,255,255,0.9); font-weight: normal; margin-top: 10px;font-size: var(--font-size-sm); max-width: 600px; text-align: center; margin-left: auto; margin-right: auto;">
                    Optional offers designed to add extra value to your project.</p>

                  <!-- Mobile Dropdown -->
                  <div class="mobile-offer-select-container" style="display: none; margin-top: 15px;">
                    <select id="mobileOfferSelect" class="form-control" style="border-radius: 8px; font-weight: bold; text-align: center;">
                      <option value="custom-elite" selected>Start Smart, Scale Fast</option>
                      <option value="ultimate">Design-First Confidence</option>
                      <option value="premium-plus">Premium Design Blueprint</option>
                      <option value="luxury">Execution-Ready Starter Pack</option>
                      <option value="pro">Premium Execution Pack</option>
                      <option value="starter">Luxury Turnkey Transformation</option>
                    </select>
                  </div>
                </div>
                <div class="offers-grid-container" style="position: relative;">
                  <button class="offer-nav-arrow offer-prev" aria-label="Previous Offer">❮</button>
                  <div class="offers-grid">
                    <div class="offer-item active" data-plan="custom-elite">
                      <div class="offer-top-row">
                        <div class="offer-icon">🏆</div>
                        <div class="offer-price">₹0 (Complete)</div>
                      </div>
                      <div class="offer-name">Start Smart, Scale Fast</div>
                    </div>
                    <div class="offer-item" data-plan="ultimate">
                      <div class="offer-top-row">
                        <div class="offer-icon">🌟</div>
                        <div class="offer-price">₹0/month</div>
                      </div>
                      <div class="offer-name">Design-First Confidence</div>
                    </div>
                    <div class="offer-item" data-plan="premium-plus">
                      <div class="offer-top-row">
                        <div class="offer-icon">👑</div>
                        <div class="offer-price">₹0/month</div>
                      </div>
                      <div class="offer-name">Premium Design Blueprint</div>
                    </div>
                    <div class="offer-item" data-plan="luxury">
                      <div class="offer-top-row">
                        <div class="offer-icon">💎</div>
                        <div class="offer-price">₹0/month</div>
                      </div>
                      <div class="offer-name">Execution-Ready Starter Pack</div>
                    </div>
                    <div class="offer-item" data-plan="pro">
                      <div class="offer-top-row">
                        <div class="offer-icon">⚡</div>
                        <div class="offer-price">₹0/month</div>
                      </div>
                      <div class="offer-name">Premium Execution Pack</div>
                    </div>
                    <div class="offer-item" data-plan="starter">
                      <div class="offer-top-row">
                        <div class="offer-icon">🚀</div>
                        <div class="offer-price">₹0/month</div>
                      </div>
                      <div class="offer-name">Luxury Turnkey Transformation</div>
                    </div>
                  </div>
                  <button class="offer-nav-arrow offer-next" aria-label="Next Offer">❯</button>
                </div>

                <!-- Offer Details Section (Desktop/Laptop Only) -->
                <!-- Mobile Toggle Button for Offer Details -->
                <button class="offer-details-toggle" id="offerDetailsToggle" onclick="toggleOfferDetails()">
                  <span>View Offer Details</span>
                  <span class="toggle-icon">▼</span>
                </button>
                <div class="offer-details-section" id="offerDetailsSection" style="display: none;">
                  <div class="offer-details-body">
                    <div class="modal-plan-features">
                      <div class="modal-features-text">
                        <h4>Offer Details: <span id="detailsPlanName">Start Smart, Scale Fast</span></h4>
                        <ul id="detailsPlanFeatures">
                          <li>• Site Visit + High-End 3D Renders</li>
                        </ul>
                      </div>
                      <div class="modal-features-visual">
                        <div class="offer-icon-container" id="detailsOfferIcon">
                          <i class="fa fa-shield"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="offer-details-footer">
                    <button class="btn-choose-plan" id="choosePlanBtnDesktop" onclick="selectCurrentOffer(this)">Select This Offer</button>
                  </div>
                </div>
              </div>

              <!-- Payment Section -->
              <div class="col-md-8">
                <!-- Account Details Section -->
                <div class="payment-main-content mb-3" style="display:none">
                  <h3 class="payment-section-header" data-bs-toggle="collapse" data-bs-target="#paymentAccountDetails"
                    aria-expanded="true">
                    ACCOUNT DETAILS
                    <span class="payment-toggle-icon">▼</span>
                  </h3>
                  <div class="collapse show" id="paymentAccountDetails">
                    <div class="payment-section-body">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_name">Full Name</label>
                            <input type="text" class="form-control payment-form-control" name="payment_name"
                              id="payment_name" required="" readonly="" style="background-color: rgb(245, 245, 245);">
                            <!-- <div class="payment-help-text">Name</div> -->
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_email">Email</label>
                            <input type="email" class="form-control payment-form-control" name="payment_email"
                              id="payment_email" required="" readonly="" style="background-color: rgb(245, 245, 245);">
                          </div>
                        </div>
                        <!-- <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_website">Website URL</label>
                            <input type="url" class="form-control payment-form-control" name="payment_website" id="payment_website" value="https://" required="" readonly="" style="background-color: rgb(245, 245, 245);">
                            <div class="payment-help-text">Your Website Url</div>
                          </div>
                        </div> -->
                      </div>

                      <!-- <div class="row">
                        <div class="col-12">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_email">Email</label>
                            <input type="email" class="form-control payment-form-control" name="payment_email" id="payment_email" required="" readonly="" style="background-color: rgb(245, 245, 245);">
                          </div>
                        </div>
                      </div> -->

                      <div class="row">
                        <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_country_code">Country Code</label>
                            <select class="form-select payment-form-control" name="payment_country_code"
                              id="payment_country_code" required="" disabled=""
                              style="background-color: rgb(245, 245, 245);">
                              <option value="IN">India (+91)</option>
                              <option value="US">United States (+1)</option>
                              <option value="GB">United Kingdom (+44)</option>
                              <option value="CA">Canada (+1)</option>
                              <option value="AU">Australia (+61)</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_phone">Phone</label>
                            <input type="tel" class="form-control payment-form-control" name="payment_phone"
                              id="payment_phone" required="" readonly="" style="background-color: rgb(245, 245, 245);">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Billing Details Section -->
                <div class="payment-main-content mb-3" style="display:none">
                  <h3 class="payment-section-header collapsed" data-bs-toggle="collapse"
                    data-bs-target="#paymentBillingDetails" aria-expanded="false">
                    BILLING DETAILS
                    <span class="payment-toggle-icon">▼</span>
                  </h3>
                  <div class="collapse" id="paymentBillingDetails">
                    <div class="payment-section-body">
                      <div class="row">
                        <div class="col-12">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_billing_address">Full address</label>
                            <input type="text" class="form-control payment-form-control" name="payment_billing_address"
                              id="payment_billing_address" placeholder="Optional">
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_billing_country">Country</label>
                            <select class="form-select payment-form-control" name="payment_billing_country"
                              id="payment_billing_country" required="" disabled=""
                              style="background-color: rgb(245, 245, 245);">
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Canada">Canada</option>
                              <option value="Australia">Australia</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_billing_pincode">Pincode</label>
                            <input type="text" class="form-control payment-form-control" name="payment_billing_pincode"
                              id="payment_billing_pincode" value="411001" required="" readonly=""
                              style="background-color: rgb(245, 245, 245);">
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_billing_city">City/District</label>
                            <input type="text" class="form-control payment-form-control" name="payment_billing_city"
                              id="payment_billing_city" value="Pune" required="" readonly=""
                              style="background-color: rgb(245, 245, 245);">
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="payment-form-group">
                            <label class="payment-form-label" for="payment_billing_state">State</label>
                            <input type="text" class="form-control payment-form-control" name="payment_billing_state"
                              id="payment_billing_state" value="Maharashtra" required="" readonly=""
                              style="background-color: rgb(245, 245, 245);">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Company Details Section -->
                <div class="payment-main-content mb-3" style="display:none">
                  <h3 class="payment-section-header collapsed" data-bs-toggle="collapse"
                    data-bs-target="#paymentCompanyDetails" aria-expanded="false">
                    COMPANY DETAILS (Optional)
                    <span class="payment-toggle-icon">▼</span>
                  </h3>
                  <div class="collapse" id="paymentCompanyDetails">
                    <div class="payment-section-body">
                      <div class="payment-form-group">
                        <label class="payment-form-label">Company type</label>
                        <div class="payment-company-type-cards">
                          <div class="payment-company-card selected" onclick="selectCompanyType('individual', this)">
                            <input type="radio" name="payment_company_type" value="individual" id="paymentIndividual"
                              checked="">
                            <div class="payment-company-title">Individual</div>
                            <div class="payment-company-desc">For personal use</div>
                          </div>
                          <div class="payment-company-card" onclick="selectCompanyType('business', this)">
                            <input type="radio" name="payment_company_type" value="business" id="paymentBusiness">
                            <div class="payment-company-title">Business</div>
                            <div class="payment-company-desc">For business use</div>
                          </div>
                        </div>
                      </div>

                      <div id="paymentBusinessFields" style="display: none;">
                        <div class="payment-form-group">
                          <label class="payment-form-label" for="payment_business_name">Company name</label>
                          <input type="text" class="form-control payment-form-control" name="payment_business_name"
                            id="payment_business_name">
                        </div>

                        <div class="payment-form-group">
                          <label class="payment-form-label" for="payment_gst_number">GST number</label>
                          <input type="text" class="form-control payment-form-control" name="payment_gst_number"
                            id="payment_gst_number">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Details (30%) -->
            <div class="details-column">
              <div class="details-card">
                <div class="details-header">
                  Grab Your <span
                    style="color: #e50215; text-decoration: underline; text-decoration-color: #e50215; text-decoration-thickness: 3px; text-underline-offset: 4px;">Summary</span>
                  <p style="color: #666666; font-weight: normal; margin-top: 10px; font-size: 1rem; line-height: 1.4;">
                    Review your project details and <br> finalize your order.
                  </p>
                </div>

                <div class="details-list">

                  <!-- Project Type -->
                  <div class="detail-row">
                    <span class="detail-label">Project Type</span>
                    <span class="detail-value" id="summaryProjectType"></span>
                  </div>

                  <!-- No of Rooms -->
                  <div class="accordion-item" id="roomsAccordionItem">
                    <div class="accordion-header" id="roomsAccordionHeader" onclick="toggleAccordion('roomsAccordion')">
                      <span class="detail-label">Rooms Selected</span>
                      <div class="accordion-container">
                        <span class="detail-value" id="summaryNumRooms"></span>
                        <span class="accordion-arrow" id="roomsAccordionArrow">▼</span>
                      </div>
                    </div>
                    <div class="accordion-collapse" id="roomsAccordionCollapse">
                      <div class="accordion-body" id="roomsAccordionContent">
                        <ol class="rooms-list" id="roomsOrderedList"></ol>
                      </div>
                    </div>
                  </div>

                  <!-- Total Carpet Area -->
                  <div class="detail-row">
                    <span class="detail-label">Estimated Carpet Area</span>
                    <span class="detail-value" id="summaryCarpetArea"></span>
                  </div>

                  <!-- Design Style -->
                  <div class="detail-row">
                    <span class="detail-label">Design Style</span>
                    <span class="detail-value" id="summaryStyle"></span>
                  </div>

                  <div class="detail-row" id="fdiv" style="display:none">
                    <span class="detail-label">No. of Floors</span>
                    <span class="detail-value" id="floor"></span>
                  </div>

                  <div class="detail-row" id="pdiv" style="display:none">
                    <span class="detail-label">Pre-construction Cost</span>
                    <span class="detail-value" id="precost"></span>
                  </div>


                  <!-- Selected Category -->
                  <div class="detail-row">
                    <span class="detail-label">Material & Finish Package</span>
                    <span class="detail-value" id="summaryDesignCategory"></span>
                  </div>

                  <!-- Project Cost -->
                  <div class="detail-row">
                    <span class="detail-label">Tentative Project Cost (Materials + Labour)</span>
                    <span class="detail-value" id="summaryProjectCost"></span>
                  </div>

                  <!-- Required Services -->
                  <div class="accordion-item" id="servicesAccordionItem">
                    <div class="accordion-header" id="servicesAccordionHeader"
                      onclick="toggleAccordion('servicesAccordion')">
                      <span class="detail-label">Required Services</span>
                      <div class="accordion-container">
                        <span class="detail-value" id="summaryNumServices">Not Selected</span>
                        <span class="accordion-arrow" id="servicesAccordionArrow">▼</span>
                      </div>
                    </div>
                    <div class="accordion-collapse" id="servicesAccordionCollapse">
                      <div class="accordion-body" id="servicesAccordionContent"></div>
                    </div>
                  </div>

                  <!-- Total Service Cost -->
                  <div class="detail-row" style="display:none;">
                    <span class="detail-label">Total service cost</span>
                    <span class="detail-value" id="totalServiceCost">₹0</span>
                  </div>

                  <!-- Chosen Offer -->
                  <div class="detail-row">
                    <span class="detail-label">Selected Offer</span>
                    <span class="detail-value" id="chosenOffer">None</span>
                  </div>

                  <!-- Offer Services -->
                  <div class="accordion-item" id="offerServicesAccordionItem">
                    <div class="accordion-header" id="offerServicesAccordionHeader"
                      onclick="toggleAccordion('offerServicesAccordion')">
                      <span class="detail-label">Services Included in Offer</span>
                      <div class="accordion-container">
                        <span class="detail-value" id="summaryOfferServices">Not Selected</span>
                        <span class="accordion-arrow" id="offerServicesAccordionArrow">▼</span>
                      </div>
                    </div>
                    <div class="accordion-collapse" id="offerServicesAccordionCollapse">
                      <div class="accordion-body" id="offerServicesAccordionContent">
                        <!-- Offer service items will be populated by JavaScript -->
                      </div>
                    </div>
                  </div>

                  <!-- Total Amount to Pay -->
                  <div class="detail-row" style="background-color: #f0f0f0;background-color: #fff;display:none;">
                    <span class="detail-label" style="font-size: 18px">Final Estimate Amount</span>
                    <!--<span class="detail-label" style="font-size: 16px">Total amount to pay for design services</span>-->
                    <span class="detail-value" id="totalAmountToPay" style="font-size: 18px;color:#000;">₹0</span>
                  </div>

                  <div style="display:none">
                    <!-- Coupon Section -->
                    <div class="coupon-section" style="display: none;">
                      <a href="#" class="coupon-link" onclick="toggleCouponInput(event)">Have a coupon?</a>
                      <div id="couponInput" style="display: none; margin-top: 0.75rem;">
                        <div class="coupon-input-group">
                          <input type="text" class="coupon-input" id="couponCode" placeholder="Coupon code">
                          <button class="coupon-apply-btn" type="button">Apply</button>
                        </div>
                      </div>
                    </div>

                    <!-- Payment Method Section -->
                    <div class="payment-method-section" style="display: none;">
                      <div class="payment-method-title">SELECT PAYMENT METHOD</div>

                      <div class="payment-method-option selected" onclick="selectPaymentMethod('card', this)">
                        <label class="payment-method-label">
                          <input type="radio" name="payment_method" value="card" class="payment-method-radio" checked>
                          <div class="payment-method-content">
                            <div class="payment-method-name">RazorPay</div>
                            <div class="payment-method-desc">Note: Pay in EMI is totally controlled by Razorpay so we cannot control this split of full payment and EMI payment. Instead it should be a single button of Make Payment with a note (Check for EMI eligibility and offers on checkout).
                            </div>
                          </div>
                          <div class="payment-method-icons">
                            <span class="payment-method-icon-text">Secure and encrypted</span>
                          </div>
                        </label>
                      </div>

                      <div class="payment-method-option d-none" style="display:none;" onclick="selectPaymentMethod('emi', this)">
                        <label class="payment-method-label">
                          <input type="radio" name="payment_method" value="emi" class="payment-method-radio">
                          <div class="payment-method-content">
                            <div class="payment-method-name">EMI</div>
                          </div>
                          <div class="payment-method-icons">
                            <span class="payment-method-icon-text">RazorPay</span>
                          </div>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="details-action-button">
                  <div class="terms-section" style="display: none;">
                    <label class="terms-checkbox-label">
                      <input type="checkbox" class="terms-checkbox" id="termsCheckbox" checked
                        onchange="toggleCompleteButton()">
                      <span class="terms-text">I've read the <a href="https://alacritys.in/terms-of-use/" target="_blank" class="terms-link">Terms & Conditions</a></span>
                    </label>
                  </div>

                  <div class="complete-purchase-section" style="display: none;">
                    <!--<button type="button" class="complete-purchase-btn"  id="completePurchaseBtn" disabled-->
                    <!--  onclick="handleDetailsActions()">-->
                    <button type="button" class="complete-purchase-btn" id="completePurchaseBtn"
                      onclick="generatePDF(1)">
                      <i class="fa fa-download"></i> Download Summary &
                      Get Free Design Proposal
                    </button>
                    <!--<button class="secondary-btn pdf-download-btn" style="display:none" id="summaryBtn" onclick="generatePDF(2)">-->
                    <!--<i class="fa fa-download"></i> Free PDF Download-->
                    <!--  <i class="fa fa-download"></i> Download Summary-->
                    <!--</button>-->
                  </div>
                  <br>
                  <div class="secondary-action-buttons" style="display:none">
                    <button class="secondary-btn pdf-download-btn" id="summaryBtnx" onclick="generatePDF()">
                      <!--<i class="fa fa-download"></i> Free PDF Download-->
                      <i class="fa fa-download"></i> Download Summary
                    </button>
                    <!-- <button class="secondary-btn share-quote-btn" onclick="openShareModal()">
                        <i class="fa fa-share"></i> Share Quote
                      </button> -->
                    <!--<button class="secondary-btn whatsapp-quote-btn" onclick="openWhatsApp()">-->
                    <!--  <i class="fa fa-whatsapp"></i> WhatsApp Quote-->
                    <!--</button>-->
                    <!--<button class="secondary-btn email-quote-btn" onclick="openEmail()">-->
                    <!--  <i class="fa fa-envelope"></i> Send To Email-->
                    <!--</button>-->
                  </div>
                  <div class="what-happens-note">
                    <strong>What Happens Next?</strong>
                    Our team will schedule a short virtual discussion to understand your space and requirements.<br>
                    <em>No Obligation • No hidden charges</em>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Offer Modal -->
          <div class="offer-modal" id="offerModal">
            <div class="offer-modal-content">
              <div class="offer-modal-header">
                <h3 id="modalPlanName">Most Popular</h3>
                <button class="offer-modal-close" id="offerModalClose">&times;</button>
              </div>
              <div class="offer-modal-body">
                <div class="modal-plan-features">
                  <div class="modal-features-text">
                    <h4>Offer Details: <span id="modalDetailsPlanName">Most Popular</span></h4>
                    <ul id="modalPlanFeatures">
                      <li>Loading offer details...</li>
                    </ul>
                  </div>
                  <div class="modal-features-visual">
                    <div class="offer-icon-container" id="modalOfferIcon">
                      <!-- Icon will be injected via JS -->
                      <i class="fa fa-shield"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="offer-modal-footer">
                <button class="btn-choose-plan" id="choosePlanBtn" onclick="selectCurrentOffer(this)">Select This Offer</button>
              </div>
            </div>
          </div>

        </div>



        <!-- Room Features Section -->
        <div class="room-summary-table-wrapper"></div>
      </div>

      <!-- Fixed WhatsApp Button -->
      <a class="cta-whatsapp" target="_blank" id="ctaWhatsappBtn" href="https://wa.me/919665017607">
        <i class="fa fa-whatsapp"></i> <span class="cta-whatsapp__text">Chat with a designer</span>
      </a>

      <!-- Thank You Section -->
      <div id="thankyou-include" class="thank-you" style="display: none;">
      </div>
    </section>

    <section id="footer-section">
      <div id="footer-include">Loading footer...</div>
    </section>
  </main>



  <script>
    document.querySelectorAll("li").forEach(li => {
      li.innerHTML = li.innerHTML.replace(/\b2d\b/g, "2D");
    });

    document.querySelectorAll("li").forEach(li => {
      li.innerHTML = li.innerHTML.replace(/\b3d\b/g, "3D");
    });

    function updateComparePackageDescriptions() {
      const selectedRooms = window.surveyResponses?.selectedRooms || {};

      // Extract room names that have quantity > 0
      const roomNames = Object.keys(selectedRooms).filter(room => selectedRooms[room] > 0);

      // If no rooms selected, keep default text
      if (roomNames.length === 0) return;

      // Helper to create room description string
      const makeRoomDesc = (suffix) => roomNames.map(room => `${room} ${suffix}`).join(' | ');

      // Update all three package cards
      const economySpan = document.querySelector('.card_desc-compare-economy-txt');
      const premiumSpan = document.querySelector('.card_desc-compare-premium-txt');
      const luxurySpan = document.querySelector('.card_desc-compare-luxury-txt');

      if (economySpan) economySpan.textContent = makeRoomDesc('Standard');
      if (premiumSpan) premiumSpan.textContent = makeRoomDesc('Premium');
      if (luxurySpan) luxurySpan.textContent = makeRoomDesc('Luxury');
    }

    // Function to update room details based on selection
    function updateCompareSectionRooms() {
      const selectedRooms = window.surveyResponses?.selectedRooms || {};
      const selectedCategory = window.surveyResponses?.selectedCategory || 'Standard';

      // Get selected room names and quantities
      const selectedRoomNames = Object.keys(selectedRooms).filter(room => selectedRooms[room] > 0);

      let roomText = '';
      if (selectedRoomNames.length > 0) {
        // Show each room separately
        roomText = selectedRoomNames.map(roomName => {
          const quantity = selectedRooms[roomName];
          return `${roomName} (${quantity})`;
        }).join('<br>');
      } else {
        roomText = 'Kitchen (1)';
      }

      // Update room text for all cards
      const economyRooms = document.getElementById('economy-rooms');
      const premiumRooms = document.getElementById('premium-rooms');
      const luxuryRooms = document.getElementById('luxury-rooms');

      if (economyRooms) economyRooms.innerHTML = roomText;
      if (premiumRooms) premiumRooms.innerHTML = roomText;
      if (luxuryRooms) luxuryRooms.innerHTML = roomText;

      // Update prices using existing cost estimate logic
      updateComparePricesFromEstimate();

      // Fetch room features from API if rooms are selected
      if (selectedRoomNames.length > 0) {
        fetchRoomFeatures(selectedRooms, selectedCategory);
      }

      var ppid = 1;
      const pType = window.surveyResponses?.projectType || "Home Interior";

      if (pType == "Home Interior") {
        ppid = 1;
      } else if (pType == "Office Interior") {
        ppid = 2;
      } else if (pType == "House Architecture") {
        ppid = 3;
      }

      $.ajax({
        url: 'assets/api/getDesigns.php',
        type: 'POST',
        dataType: 'json',
        data: {
          projectType: ppid
        },
        success: function(response) {
          if (response.styles && Array.isArray(response.styles)) {
            // Safety check: ensure function exists (app.js may not be loaded yet)
            if (typeof updateVisibleDesignStyles === 'function') {
              updateVisibleDesignStyles(response.styles);
            } else {
              // Store styles for later use when app.js loads
              window.pendingDesignStyles = response.styles;
              console.log('Design styles cached for later use');
            }
          } else {
            console.warn('No styles found in response');
          }
        },
        error: function(xhr, status, error) {
          console.error('Error fetching design styles:', error);
        }
      });


    }

    // Function to update prices using existing cost estimate logic
    function updateComparePricesFromEstimate() {
      const estimateData = window.estimateData;

      if (estimateData && estimateData.costBreakdown && estimateData.costBreakdown.category_comparisons) {
        // Use the existing category comparisons from the API response
        updateComparePricesFromServerData(estimateData.costBreakdown.category_comparisons);
      } else {
        // If no category_comparisons available, calculate using the same logic as the API
        calculateComparePricesFromSurveyData();
      }
    }

    // Function to calculate prices using server data
    function calculateComparePricesFromSurveyData() {
      // Use server-calculated data if available
      if (window.estimateData && window.estimateData.costBreakdown && window.estimateData.costBreakdown.category_comparisons) {
        updateComparePricesFromServerData(window.estimateData.costBreakdown.category_comparisons);
        return;
      }

      // If no server data, show loading or default values
      const economyPriceEl = document.querySelector('.card_price-compare-economy-txt');
      const premiumPriceEl = document.querySelector('.card_price-compare-premium-txt');
      const luxuryPriceEl = document.querySelector('.card_price-compare-luxury-txt');

      if (economyPriceEl) economyPriceEl.textContent = '₹ 0/-';
      if (premiumPriceEl) premiumPriceEl.textContent = '₹ 0/-';
      if (luxuryPriceEl) luxuryPriceEl.textContent = '₹ 0/-';
    }

    // Function to update compare prices from server data
    function updateComparePricesFromServerData(categoryComparisons) {
      let standardPrice = 0;
      let premiumPrice = 0;
      let luxuryPrice = 0;

      categoryComparisons.forEach(category => {
        switch (category.category_name) {
          case 'Standard':
            standardPrice = category.final_project_cost;
            break;
          case 'Premium':
            premiumPrice = category.final_project_cost;
            break;
          case 'Luxury':
            luxuryPrice = category.final_project_cost;
            break;
        }
      });

      // Update price displays
      const economyPriceEl = document.querySelector('.card_price-compare-economy-txt');
      const premiumPriceEl = document.querySelector('.card_price-compare-premium-txt');
      const luxuryPriceEl = document.querySelector('.card_price-compare-luxury-txt');

      if (economyPriceEl && standardPrice > 0) economyPriceEl.textContent = `₹ ${Math.round(standardPrice).toLocaleString()}/-`;
      if (premiumPriceEl && premiumPrice > 0) premiumPriceEl.textContent = `₹ ${Math.round(premiumPrice).toLocaleString()}/-`;
      if (luxuryPriceEl && luxuryPrice > 0) luxuryPriceEl.textContent = `₹ ${Math.round(luxuryPrice).toLocaleString()}/-`;
    }






    // Function to fetch room features from API
    function fetchRoomFeatures(selectedRooms, selectedCategory) {
      fetch('assets/api/getRoomFeatures.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedRooms: selectedRooms,
            selectedCategory: selectedCategory,
            selectedStyles: window.surveyResponses?.selectedStyles || [],
            projectType: window.surveyResponses?.projectType || 'Home Interior'
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success && data.roomFeatures) {


            updateComparePackageDescriptions();
            updateCardFeatures(data.roomFeatures, selectedCategory);
          }
        })
        .catch(error => {
          console.error('Error fetching room features:', error);
        });
    }

    // Function to update card features based on API data
    function updateCardFeatures(roomFeatures, selectedCategory) {
      // Update each card's features based on category
      const categories = ['Standard', 'Premium', 'Luxury'];
      const cardIds = ['economy', 'premium', 'luxury'];

      categories.forEach((category, index) => {
        const cardId = cardIds[index];
        const cardInfo = document.querySelector(`.card_info-compare-${cardId}-htm`);

        if (cardInfo) {
          const roomList = cardInfo.querySelector('.room_list');
          if (roomList) {
            // Clear existing features
            roomList.innerHTML = '';

            // Add features for each room separately
            Object.keys(roomFeatures).forEach(roomName => {
              const roomData = roomFeatures[roomName];
              const features = roomData.features || [];

              // Create room section
              const roomSection = document.createElement('div');
              roomSection.className = 'room-section';
              roomSection.style.marginBottom = '20px';

              // Add room title
              const roomTitle = document.createElement('h4');
              roomTitle.textContent = roomName;
              roomTitle.style.fontWeight = 'bold';
              roomTitle.style.marginBottom = '10px';
              roomTitle.style.color = '#333';
              roomSection.appendChild(roomTitle);

              // Add features for this room
              features.forEach(feature => {
                let featureDescription = '';
                switch (category) {
                  case 'Standard':
                    featureDescription = feature.standard_cat;
                    break;
                  case 'Premium':
                    featureDescription = feature.premium_cat;
                    break;
                  case 'Luxury':
                    featureDescription = feature.luxury_cat;
                    break;
                  default:
                    featureDescription = feature.standard_cat;
                }

                if (featureDescription && featureDescription.trim() !== '') {
                  const listItem = document.createElement('li');
                  listItem.className = 'room_types focus-visible-auto-imp';
                  listItem.setAttribute('tabindex', '0');
                  listItem.setAttribute('aria-label', 'room types');

                  listItem.innerHTML = `
                                    ${feature.room_item}
                                    <ul>
                                        <li>${featureDescription}</li>
                                    </ul>
                                `;

                  roomSection.appendChild(listItem);
                }
              });

              roomList.appendChild(roomSection);
            });
          }
        }
      });
    }

    // Contact function for personalized package
    function contactUs() {
      const contactSection = document.getElementById('qform-alt');
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        alert('Please contact us for personalized quotes!');
      }
    }

    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', function() {
      updateCompareSectionRooms();
    });

    // Update when room selection changes
    if (typeof window !== 'undefined') {
      window.updateCompareSection = function() {
        updateCompareSectionRooms();
      };
    }
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

  <script src="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"></script>
  <!-- Swiper initialization moved to app.js for dynamic content -->

  <script>
    function includeHTML(id, url) {
      fetch(url)
        .then(res => res.ok ? res.text() : Promise.reject('Failed to load'))
        .then(html => {
          document.getElementById(id).innerHTML = html;
        })
        .catch(() => {
          document.getElementById(id).innerHTML = 'Could not load ' + url;
        });
    }

    // Load footer
    includeHTML('footer-include', 'assets/footer/footer.html?v=<?php echo time(); ?>');

    // Load thank-you page
    includeHTML('thankyou-include', 'assets/thankyou/thanku.html?v=<?php echo time(); ?>');
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <!-- Razorpay Integration -->
  <script src="payment/razorpay-integration.js?v=<?php echo time(); ?>"></script>

  <!-- QRCode library is available -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>


  <script src="assets/images/images_base64.js?v=<?php echo time(); ?>"></script>
  <script src="assets/js/renderRoomConfig.js?v=<?php echo time(); ?>"></script>
  <script src="assets/js/previous_pdf_logic.js?v=<?php echo time(); ?>"></script>
  <script src="assets/js/app.js?v=<?php echo time(); ?>"></script>
  <script src="assets/js/sticky-bar.js?v=<?php echo time(); ?>"></script>
  <script>

  </script>
</body>

</html>