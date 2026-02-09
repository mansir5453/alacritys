-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 06, 2026 at 04:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alacritys`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'admin', 'admin@example.com', '$2y$10$beESqT25VrefmZdjWq14uOlw8FsTlEnZ4KqMR9zldsi1he5NBAn.6', '2025-07-22 18:26:49'),
(5, 'Adis', 'Adis5453@gmail.com', '5453Adis', '2025-12-22 10:10:41');

-- --------------------------------------------------------

--
-- Table structure for table `admin_comparison_history`
--

CREATE TABLE `admin_comparison_history` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `standard_package_cost` decimal(15,2) DEFAULT 0.00,
  `premium_package_cost` decimal(15,2) DEFAULT 0.00,
  `luxury_package_cost` decimal(15,2) DEFAULT 0.00,
  `selected_offer_name` varchar(255) DEFAULT NULL,
  `selected_offer_value` decimal(15,2) DEFAULT 0.00,
  `final_shown_total` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `name`, `created_at`) VALUES
(1, 'admin', '$2y$10$xYwab2q2EI674Qurj4ywfe7OuOcERFzRYHy11s8raDQ.f/2T2.cwG', 'Site Admin', '2025-09-21 20:29:09'),
(2, 'Adis', '5453Adis', 'Aditya', '2025-12-22 10:05:55'),
(4, 'Adis5453', '5453Adis', 'Aditya', '2025-12-22 10:06:38');

-- --------------------------------------------------------

--
-- Table structure for table `city_master`
--

CREATE TABLE `city_master` (
  `project_type` varchar(50) NOT NULL DEFAULT 'Home Interior',
  `city_id` int(11) NOT NULL,
  `city` varchar(9) DEFAULT NULL,
  `tire` int(1) DEFAULT NULL,
  `pincode_start` int(6) DEFAULT NULL,
  `pincode_end` int(6) DEFAULT NULL,
  `labour` varchar(5) DEFAULT NULL,
  `material` varchar(5) DEFAULT NULL,
  `total_cost` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `city_master`
--

INSERT INTO `city_master` (`project_type`, `city_id`, `city`, `tire`, `pincode_start`, `pincode_end`, `labour`, `material`, `total_cost`) VALUES
('Home Interior', 1, 'Ahmedabad', 2, 380001, 380061, '480', '720', '1200'),
('Home Interior', 2, 'Bangalore', 1, 560001, 560107, '720', '1080', '1800'),
('Home Interior', 3, 'Hyderabad', 1, 500001, 500098, '680', '1020', '1700'),
('Home Interior', 4, 'Indore', 2, 452001, 452020, '440', '660', '1100'),
('Home Interior', 5, 'Jaipur', 2, 302001, 302032, '440', '660', '1100'),
('Home Interior', 6, 'Mumbai', 1, 400001, 400104, '800', '1200', '2000'),
('Home Interior', 7, 'Nagpur', 2, 440001, 440037, '400', '600', '1000'),
('Home Interior', 8, 'Nashik', 3, 422001, 422013, '360', '540', '900'),
('Home Interior', 9, 'Noida', 1, 201301, 201309, '700', '1020', '1720'),
('Home Interior', 10, 'Pune', 1, 411001, 411062, '640', '960', '1600'),
('Home Interior', 11, 'Surat', 2, 395001, 395017, '440', '660', '1100'),
('Office Interior', 101, 'Ahmedabad', 2, 380001, 380061, '580', '820', '1400'),
('Office Interior', 102, 'Bangalore', 1, 560001, 560107, '820', '1180', '2000'),
('Office Interior', 103, 'Hyderabad', 1, 500001, 500098, '780', '1120', '1900'),
('Office Interior', 104, 'Indore', 2, 452001, 452020, '540', '760', '1300'),
('Office Interior', 105, 'Jaipur', 2, 302001, 302032, '540', '760', '1300'),
('Office Interior', 106, 'Mumbai', 1, 400001, 400104, '900', '1300', '2200'),
('Office Interior', 107, 'Nagpur', 2, 440001, 440037, '500', '700', '1200'),
('Office Interior', 108, 'Nashik', 3, 422001, 422013, '460', '640', '1100'),
('Office Interior', 109, 'Noida', 1, 201301, 201309, '800', '1120', '1920'),
('Office Interior', 110, 'Pune', 1, 411001, 411062, '740', '1060', '1800'),
('Office Interior', 111, 'Surat', 2, 395001, 395017, '540', '760', '1300'),
('House Architecture', 112, 'Ahmedabad', 2, 380001, 380061, '480', '720', '1200'),
('House Architecture', 113, 'Bangalore', 1, 560001, 560107, '720', '1080', '1800'),
('House Architecture', 114, 'Hyderabad', 1, 500001, 500098, '680', '1020', '1700'),
('House Architecture', 115, 'Indore', 2, 452001, 452020, '440', '660', '1100'),
('House Architecture', 116, 'Jaipur', 2, 302001, 302032, '440', '660', '1100'),
('House Architecture', 117, 'Mumbai', 1, 400001, 400104, '800', '1200', '2000'),
('House Architecture', 118, 'Nagpur', 2, 440001, 440037, '400', '600', '1000'),
('House Architecture', 119, 'Nashik', 3, 422001, 422013, '360', '540', '900'),
('House Architecture', 120, 'Noida', 1, 201301, 201309, '700', '1020', '1720'),
('House Architecture', 121, 'Pune', 1, 411001, 411062, '640', '960', '1600'),
('House Architecture', 122, 'Surat', 2, 395001, 395017, '440', '660', '1100'),
('Hospital Interior', 123, 'Ahmedabad', 2, 380001, 380061, '480', '720', '1200'),
('Hospital Interior', 124, 'Bangalore', 1, 560001, 560107, '720', '1080', '1800'),
('Hospital Interior', 125, 'Hyderabad', 1, 500001, 500098, '680', '1020', '1700'),
('Hospital Interior', 126, 'Indore', 2, 452001, 452020, '440', '660', '1100'),
('Hospital Interior', 127, 'Jaipur', 2, 302001, 302032, '440', '660', '1100'),
('Hospital Interior', 128, 'Mumbai', 1, 400001, 400104, '800', '1200', '2000'),
('Hospital Interior', 129, 'Nagpur', 2, 440001, 440037, '400', '600', '1000'),
('Hospital Interior', 130, 'Nashik', 3, 422001, 422013, '360', '540', '900'),
('Hospital Interior', 131, 'Noida', 1, 201301, 201309, '700', '1020', '1720'),
('Hospital Interior', 132, 'Pune', 1, 411001, 411062, '640', '960', '1600'),
('Hospital Interior', 133, 'Surat', 2, 395001, 395017, '440', '660', '1100'),
('Clinic Interior', 134, 'Ahmedabad', 2, 380001, 380061, '480', '720', '1200'),
('Clinic Interior', 135, 'Bangalore', 1, 560001, 560107, '720', '1080', '1800'),
('Clinic Interior', 136, 'Hyderabad', 1, 500001, 500098, '680', '1020', '1700'),
('Clinic Interior', 137, 'Indore', 2, 452001, 452020, '440', '660', '1100'),
('Clinic Interior', 138, 'Jaipur', 2, 302001, 302032, '440', '660', '1100'),
('Clinic Interior', 139, 'Mumbai', 1, 400001, 400104, '800', '1200', '2000'),
('Clinic Interior', 140, 'Nagpur', 2, 440001, 440037, '400', '600', '1000'),
('Clinic Interior', 141, 'Nashik', 3, 422001, 422013, '360', '540', '900'),
('Clinic Interior', 142, 'Noida', 1, 201301, 201309, '700', '1020', '1720'),
('Clinic Interior', 143, 'Pune', 1, 411001, 411062, '640', '960', '1600'),
('Clinic Interior', 144, 'Surat', 2, 395001, 395017, '440', '660', '1100'),
('Gym Interior', 145, 'Ahmedabad', 2, 380001, 380061, '480', '720', '1200'),
('Gym Interior', 146, 'Bangalore', 1, 560001, 560107, '720', '1080', '1800'),
('Gym Interior', 147, 'Hyderabad', 1, 500001, 500098, '680', '1020', '1700'),
('Gym Interior', 148, 'Indore', 2, 452001, 452020, '440', '660', '1100'),
('Gym Interior', 149, 'Jaipur', 2, 302001, 302032, '440', '660', '1100'),
('Gym Interior', 150, 'Mumbai', 1, 400001, 400104, '800', '1200', '2000'),
('Gym Interior', 151, 'Nagpur', 2, 440001, 440037, '400', '600', '1000'),
('Gym Interior', 152, 'Nashik', 3, 422001, 422013, '360', '540', '900'),
('Gym Interior', 153, 'Noida', 1, 201301, 201309, '700', '1020', '1720'),
('Gym Interior', 154, 'Pune', 1, 411001, 411062, '640', '960', '1600'),
('Gym Interior', 155, 'Surat', 2, 395001, 395017, '440', '660', '1100'),
('Cafe Interior', 156, 'Ahmedabad', 2, 380001, 380061, '480', '720', '1200'),
('Cafe Interior', 157, 'Bangalore', 1, 560001, 560107, '720', '1080', '1800'),
('Cafe Interior', 158, 'Hyderabad', 1, 500001, 500098, '680', '1020', '1700'),
('Cafe Interior', 159, 'Indore', 2, 452001, 452020, '440', '660', '1100'),
('Cafe Interior', 160, 'Jaipur', 2, 302001, 302032, '440', '660', '1100'),
('Cafe Interior', 161, 'Mumbai', 1, 400001, 400104, '800', '1200', '2000'),
('Cafe Interior', 162, 'Nagpur', 2, 440001, 440037, '400', '600', '1000'),
('Cafe Interior', 163, 'Nashik', 3, 422001, 422013, '360', '540', '900'),
('Cafe Interior', 164, 'Noida', 1, 201301, 201309, '700', '1020', '1720'),
('Cafe Interior', 165, 'Pune', 1, 411001, 411062, '640', '960', '1600'),
('Cafe Interior', 166, 'Surat', 2, 395001, 395017, '440', '660', '1100'),
('Restaurant Interior', 167, 'Ahmedabad', 2, 380001, 380061, '480', '720', '1200'),
('Restaurant Interior', 168, 'Bangalore', 1, 560001, 560107, '720', '1080', '1800'),
('Restaurant Interior', 169, 'Hyderabad', 1, 500001, 500098, '680', '1020', '1700'),
('Restaurant Interior', 170, 'Indore', 2, 452001, 452020, '440', '660', '1100'),
('Restaurant Interior', 171, 'Jaipur', 2, 302001, 302032, '440', '660', '1100'),
('Restaurant Interior', 172, 'Mumbai', 1, 400001, 400104, '800', '1200', '2000'),
('Restaurant Interior', 173, 'Nagpur', 2, 440001, 440037, '400', '600', '1000'),
('Restaurant Interior', 174, 'Nashik', 3, 422001, 422013, '360', '540', '900'),
('Restaurant Interior', 175, 'Noida', 1, 201301, 201309, '700', '1020', '1720'),
('Restaurant Interior', 176, 'Pune', 1, 411001, 411062, '640', '960', '1600'),
('Restaurant Interior', 177, 'Surat', 2, 395001, 395017, '440', '660', '1100'),
('Hotel Interior', 178, 'Ahmedabad', 2, 380001, 380061, '480', '720', '1200'),
('Hotel Interior', 179, 'Bangalore', 1, 560001, 560107, '720', '1080', '1800'),
('Hotel Interior', 180, 'Hyderabad', 1, 500001, 500098, '680', '1020', '1700'),
('Hotel Interior', 181, 'Indore', 2, 452001, 452020, '440', '660', '1100'),
('Hotel Interior', 182, 'Jaipur', 2, 302001, 302032, '440', '660', '1100'),
('Hotel Interior', 183, 'Mumbai', 1, 400001, 400104, '800', '1200', '2000'),
('Hotel Interior', 184, 'Nagpur', 2, 440001, 440037, '400', '600', '1000'),
('Hotel Interior', 185, 'Nashik', 3, 422001, 422013, '360', '540', '900'),
('Hotel Interior', 186, 'Noida', 1, 201301, 201309, '700', '1020', '1720'),
('Hotel Interior', 187, 'Pune', 1, 411001, 411062, '640', '960', '1600'),
('Hotel Interior', 188, 'Surat', 2, 395001, 395017, '440', '660', '1100'),
('Cafe Interior', 210, 'Delhi', 2, 110001, 110075, '0', '0', '0'),
('Clinic Interior', 211, 'Delhi', 2, 110001, 110075, '0', '0', '0'),
('Gym Interior', 212, 'Delhi', 2, 110001, 110075, '0', '0', '0'),
('Home Interior', 213, 'Delhi', 2, 110001, 110075, '800', '750', '1550'),
('Hospital Interior', 214, 'Delhi', 2, 110001, 110075, '0', '0', '0'),
('Hotel Interior', 215, 'Delhi', 2, 110001, 110075, '0', '0', '0'),
('House Architecture', 216, 'Delhi', 2, 110001, 110075, '0', '0', '0'),
('Office Interior', 217, 'Delhi', 2, 110001, 110075, '0', '0', '0'),
('Restaurant Interior', 218, 'Delhi', 2, 110001, 110075, '0', '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `cms_posts`
--

CREATE TABLE `cms_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cost_estimates`
--

CREATE TABLE `cost_estimates` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  `city` varchar(255) NOT NULL,
  `whatsapp_status` tinyint(1) NOT NULL,
  `selected_rooms` text NOT NULL,
  `selected_style` varchar(255) NOT NULL,
  `selected_category` varchar(255) NOT NULL,
  `std_carpet_area` varchar(1000) NOT NULL,
  `user_carpet_area` varchar(1000) NOT NULL,
  `total_room_area` decimal(10,2) DEFAULT NULL,
  `total_estimate_cost` decimal(10,2) NOT NULL,
  `selected_services` text NOT NULL,
  `service_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `flags` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `coupon_code` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `company_type` varchar(255) NOT NULL DEFAULT 'individual',
  `company_name` text DEFAULT NULL,
  `gst_number` varchar(255) DEFAULT NULL,
  `offers_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`offers_json`)),
  `comparison_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`comparison_json`)),
  `architecture_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`architecture_details`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `design_categories`
--

CREATE TABLE `design_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  `cost_multiplier` decimal(5,2) NOT NULL,
  `percent_off` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `design_categories`
--

INSERT INTO `design_categories` (`category_id`, `category_name`, `cost_multiplier`, `percent_off`) VALUES
(1, 'Standard', 1.00, 0.00),
(2, 'Premium', 1.15, 5.00),
(3, 'Luxury', 1.25, 8.00);

-- --------------------------------------------------------

--
-- Table structure for table `interior_selections`
--

CREATE TABLE `interior_selections` (
  `id` int(11) NOT NULL,
  `session_id` varchar(50) DEFAULT NULL,
  `interior_type` varchar(100) NOT NULL,
  `selected_rooms` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interior_types`
--

CREATE TABLE `interior_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interior_types`
--

INSERT INTO `interior_types` (`id`, `name`) VALUES
(9, 'Cafe Interior'),
(5, 'Clinic Interior'),
(6, 'Gym Interior'),
(1, 'Home Interior'),
(4, 'Hospital Interior'),
(7, 'Hotel Interior'),
(3, 'House Architecture'),
(2, 'Office Interior'),
(8, 'Restaurant Interior');

-- --------------------------------------------------------

--
-- Table structure for table `offersdiscounttbl`
--

CREATE TABLE `offersdiscounttbl` (
  `id` int(11) NOT NULL,
  `offer_name` varchar(50) NOT NULL,
  `offer_percent` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `benefits_json` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offersdiscounttbl`
--

INSERT INTO `offersdiscounttbl` (`id`, `offer_name`, `offer_percent`, `created_at`, `benefits_json`) VALUES
(1, 'Start Smart, Scale Fast', 2, '2025-08-24 09:30:48', '{\n    \"features\": [\n        \"First Site Visit\",\n        \"Site Measurements\"\n    ],\n    \"start_stage_1\": \"Stage 1: (Small Commitment)\",\n    \"start_stage_1_details\": [\n        \"Site Visit + Expert Consultation\",\n        \"Work Order Confirmation ➔ Measurements Scheduled\",\n        \"Project Timeline Locked\"\n    ],\n    \"start_stage_2\": \"Stage 2: (Pay Balance Linked to Sq. Ft.)\",\n    \"start_stage_2_details\": [\n        \"Tailored 2D Layout + Cost Estimate\",\n        \"(Details in your free design proposal)\"\n    ],\n    \"why_this_offer\": [\n        \"Low-risk way to begin\",\n        \"Clarity before full commitment\",\n        \"Ideal for budget-conscious homeowners\"\n    ],\n    \"positioning\": \"Try before you commit — flexible payment\",\n    \"cta\": \"Start with a Smart First Step\"\n}'),
(2, 'Design-First Confidence', 3, '2025-08-24 09:30:48', '{\n    \"features\": [\n        \"First Site Visit\",\n        \"2D Design\",\n        \"3D Design\"\n    ],\n    \"start_stage_1\": \"Stage 1:\",\n    \"start_stage_1_details\": [\n        \"Detailed Design Briefing + Vision Mapping\",\n        \"Space Planning + 2D Layout Options\",\n        \"Theme Direction Finalized\"\n    ],\n    \"start_stage_2\": \"Stage 2:\",\n    \"start_stage_2_details\": [\n        \"High-quality 3D Renders\",\n        \"Material Palette + Cost Guidance (No execution yet)\"\n    ],\n    \"why_this_offer\": [\n        \"Perfect for clients wanting clarity before execution\",\n        \"Visual confidence in design outcome\",\n        \"No pressure to start execution\"\n    ],\n    \"positioning\": \"Get full design clarity before you spend big\",\n    \"cta\": \"Begin with Design Confidence\"\n}'),
(3, 'Premium Design Blueprint', 5, '2025-08-24 09:30:48', '{\n    \"features\": [\n        \"2D Design\",\n        \"3D Design\"\n    ],\n    \"start_stage_1\": \"Stage 1:\",\n    \"start_stage_1_details\": [\n        \"2D Layout + Theme Board\",\n        \"Style Direction + Moodboard\",\n        \"Functional + Storage Planning\"\n    ],\n    \"start_stage_2\": \"Stage 2:\",\n    \"start_stage_2_details\": [\n        \"Photo-realistic 3D Renders\",\n        \"Premium Material Specifications\",\n        \"Pre-execution Cost Sheet\"\n    ],\n    \"why_this_offer\": [\n        \"Best for 2–3 BHK owners\",\n        \"Balanced visuals + material detailing\",\n        \"Saves money during execution\"\n    ],\n    \"positioning\": \"Get a complete design blueprint you can execute anywhere\",\n    \"cta\": \"Unlock Your Premium Blueprint\"\n}'),
(4, 'Execution-Ready Starter Pack', 6, '2025-08-24 09:30:48', '{\n    \"features\": [\n        \"First Site Visit\",\n        \"2D Design\",\n        \"3D Design\"\n    ],\n    \"start_stage_1\": \"Stage 1:\",\n    \"start_stage_1_details\": [\n        \"On-site Measurement\",\n        \"Civil Scope Finalization\",\n        \"Basic Modular + Electrical Plan\"\n    ],\n    \"start_stage_2\": \"Stage 2:\",\n    \"start_stage_2_details\": [\n        \"Starter Execution (Civil + Basic Modular)\",\n        \"Essential Electrical + Lighting\",\n        \"Budget-level Materials Included\"\n    ],\n    \"why_this_offer\": [\n        \"Practical, no-frills execution\",\n        \"Ideal for rentals & quick setups\",\n        \"Fast turnaround\"\n    ],\n    \"positioning\": \"Essential execution without overspending\",\n    \"cta\": \"Start Practical Execution\"\n}'),
(5, 'Premium Execution Pack', 10, '2025-08-24 09:30:48', '{\n    \"features\": [\n        \"First Site Visit\",\n        \"2D Design\"\n    ],\n    \"start_stage_1\": \"Stage 1:\",\n    \"start_stage_1_details\": [\n        \"Civil + Modular + False Ceiling\",\n        \"Premium Finishes + Branded Hardware\",\n        \"Electrical + Lighting + Plumbing Setup\"\n    ],\n    \"start_stage_2\": \"Stage 2:\",\n    \"start_stage_2_details\": [\n        \"Soft Furnishings + Decor\",\n        \"Appliance Integration\",\n        \"Site Styling + Final Finishing\"\n    ],\n    \"why_this_offer\": [\n        \"Premium look without luxury pricing\",\n        \"End-to-end finishing\",\n        \"Mid-range homes love this\"\n    ],\n    \"positioning\": \"Complete premium interiors with perfect detailing\",\n    \"cta\": \"Book Your Premium Execution\"\n}'),
(6, 'Luxury Turnkey Transformation', 15, '2025-08-24 09:30:48', '{\n    \"features\": [\n        \"First Site Visit\",\n        \"Site Measurements\",\n        \"2D Design\"\n    ],\n    \"start_stage_1\": \"Stage 1:\",\n    \"start_stage_1_details\": [\n        \"Full Civil + Bespoke Carpentry\",\n        \"Luxury Modular + High-end Materials\",\n        \"Lighting, Technology & Smart Home Planning\"\n    ],\n    \"start_stage_2\": \"Stage 2:\",\n    \"start_stage_2_details\": [\n        \"Custom Furnishings + Art + Styling\",\n        \"Handover as \\\"Ready-to-Move-In\\\"\",\n        \"Professional Photoshoot of your home\"\n    ],\n    \"why_this_offer\": [\n        \"Zero-hassle luxury\",\n        \"One team from design to styling\",\n        \"Perfect for villas & high-end flats\"\n    ],\n    \"positioning\": \"Signature luxury interiors—done end-to-end\",\n    \"cta\": \"Transform My Home Luxuriously\"\n}');

-- --------------------------------------------------------

--
-- Table structure for table `offer_city_rates`
--

CREATE TABLE `offer_city_rates` (
  `id` int(11) NOT NULL,
  `offer_id` int(11) NOT NULL,
  `city` varchar(255) NOT NULL,
  `discount_value` double DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `package_comparison`
--

CREATE TABLE `package_comparison` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `base_cost` decimal(10,2) NOT NULL,
  `style_cost` decimal(10,2) NOT NULL,
  `final_cost` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `economy_cost` decimal(10,2) NOT NULL,
  `premium_cost` decimal(10,2) NOT NULL,
  `luxury_cost` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_details`
--

CREATE TABLE `payment_details` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `razorpay_order_id` varchar(255) NOT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'INR',
  `payment_method` varchar(50) NOT NULL DEFAULT 'card',
  `payment_status` enum('pending','success','failed','cancelled') NOT NULL DEFAULT 'pending',
  `project_type` varchar(100) DEFAULT NULL,
  `selected_services` text DEFAULT NULL,
  `selected_offers` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_features`
--

CREATE TABLE `room_features` (
  `id` int(3) NOT NULL,
  `room_type` varchar(28) DEFAULT NULL,
  `room_item` varchar(33) DEFAULT NULL,
  `standard_cat` varchar(139) DEFAULT NULL,
  `premium_cat` varchar(152) DEFAULT NULL,
  `luxury_cat` varchar(205) DEFAULT NULL,
  `interior_type` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `room_features`
--

INSERT INTO `room_features` (`id`, `room_type`, `room_item`, `standard_cat`, `premium_cat`, `luxury_cat`, `interior_type`) VALUES
(1, 'Entrance Lobby & Living Room', 'Seating', 'Unwind in comfort with our classic sofa set and basic armchairs.', 'Experience elevated relaxation with a sofa cum bed adorned with premium fabrics, complemented by designer armchairs and basic recliners.', 'Indulge in ultimate comfort with a designer sofa set, exquisitely upholstered recliners, and bespoke lounge chairs.', 1),
(2, 'Entrance Lobby & Living Room', 'Storage', 'Organize with simplicity using a basic TV unit and a straightforward shoe cupboard.', 'Upgrade with a TV unit offering additional storage, a designer shoe cupboard, and stylish display units.', 'Embrace elegance with a custom TV unit featuring integrated lighting, opulent display units, and a shoe cupboard with a comfortable seating area.', 1),
(3, 'Entrance Lobby & Living Room', 'Ceiling & Lighting', 'Illuminate your space with a basic false ceiling and standard light effects.', 'Enhance your living experience with a designer false ceiling, exquisite cove lighting, and elegant pendant lights.', 'Transform your ceiling with a custom design featuring advanced cove lighting, smart recessed lights, and a luxurious chandelier.', 1),
(4, 'Entrance Lobby & Living Room', 'Furniture', 'Furnish with a standard center table and corner table.', 'Elevate your d??cor with a designer center table, corner table, and sophisticated wall paneling.', 'Redefine luxury with a custom center table, bespoke corner table, luxurious wall cladding, and an exclusive indoor plant arrangement.', 1),
(5, 'Entrance Lobby & Living Room', 'Electrical Work', 'Ensure basic functionality with standard plug points, switches, and hidden wiring.', 'Upgrade to hidden wiring with dimmer switches and additional USB charging points.', 'Integrate smart switches, advanced hidden wiring, designer dimmer systems, and comprehensive smart home solutions.', 1),
(6, 'Entrance Lobby & Living Room', 'Painting', 'Opt for classic wall and ceiling painting.', 'Enhance with premium wall paint finishes and a refined varnish or polish for woodwork.', 'Achieve a sophisticated look with custom paint effects and high-quality finishes for both walls and ceilings.', 1),
(7, 'Entrance Lobby & Living Room', 'Civil Changes', 'Secure your entrance with a basic safety door and main door design.', 'Upgrade to a designer main door with an elegant finish, custom partition walls, and a premium entrance design.', 'Enjoy ultimate security and style with custom doors featuring advanced security features, an elaborate partition design, and a luxurious entrance wall design.', 1),
(8, 'Entrance Lobby & Living Room', 'Air Conditioning', 'Install basic air conditioning for your space.', 'Opt for split AC with ductwork, complemented by customized false ceilings or paneling for AC vents.', 'Experience centralized AC zoning with ductless units featuring designer grills and smart temperature control settings.', 1),
(9, 'Entrance Lobby & Living Room', 'Automation', 'Begin with basic lights automation.', 'Enhance your living with advanced lights and curtain automation.', 'Enjoy comprehensive home automation systems with voice-controlled lights, curtains, and integrated smart devices.', 1),
(10, 'Entrance Lobby & Living Room', 'Miscellaneous', 'Incorporate a basic puja/mandir unit for your spiritual needs.', 'Elevate with a designer puja/mandir unit and decorative mirrors.', 'Complete your space with a custom puja/mandir unit featuring elegant lighting, luxury decorative mirrors, and high-end console tables.', 1),
(11, 'Kitchen', 'Storage', 'Maximize efficiency with under-counter storage and basic overhead cupboards.', 'Upgrade to auto-close trollies, sleek shutter cupboards, and premium overhead cupboards.', 'Revel in custom cabinetry, uplifting down pull cupboards, and designer storage solutions.', 1),
(12, 'Kitchen', 'Appliances & Fixtures Connections', 'Connect standard kitchen appliances like hob and oven with ease.', 'Enhance with built-in smart appliances including a smart oven, integrated refrigerator, hob, and chimney.', 'Enjoy high-end smart kitchen systems with advanced built-in appliances and comprehensive connections for grinder-mixer, mixi, and water purifiers.', 1),
(13, 'Kitchen', 'Lighting', 'Illuminate with basic light effects and standard task lighting.', 'Brighten up with under-cabinet lighting and designer pendant lights.', 'Transform your kitchen with customized lighting solutions, smart task lighting, and luxurious pendant or chandelier lighting.', 1),
(14, 'Kitchen', 'Wall Treatments', 'Opt for dado tiles, basic wall paneling, and texture paint for a simple finish.', 'Enhance with premium wallpaper and a designer backsplash.', 'Achieve sophistication with custom wall paneling, high-end designer backsplash, and luxury wall treatments.', 1),
(15, 'Kitchen', 'Electrical Work', 'Ensure functionality with basic plug points and standard switches.', 'Upgrade to hidden wiring, additional appliance sockets, and under-cabinet lighting points.', 'Embrace advanced electrical work with smart wiring and integrated appliance outlets.', 1),
(16, 'Kitchen', 'False Ceiling', 'Start with a basic ceiling design for a straightforward look.', 'Elevate with a gypsum ceiling featuring cove lighting.', 'Opt for a designer ceiling with custom solutions and enhanced cove lighting.', 1),
(17, 'Kitchen', 'Painting', 'Enjoy basic wall and ceiling painting for a clean finish.', 'Choose premium wall painting and varnish or polish for woodwork.', 'Indulge in high-end paint finishes and custom varnish for a polished look.', 1),
(18, 'Kitchen', 'Civil Changes', 'Perform basic counter renovation and minor dado tiles updates.', 'Upgrade with moderate doors renovation and plumbing work.', 'Achieve an extensive counter renovation, full dado tiles overhaul, and major plumbing upgrades.', 1),
(19, 'Kitchen', 'Miscellaneous', 'Utilize a standard breakfast counter and a simple crockery unit.', 'Opt for a premium breakfast counter and a designer crockery unit.', 'Enjoy custom storage solutions, a high-end breakfast counter, and an exclusive designer crockery unit.', 1),
(20, 'Dining Room', 'Seating', 'Basic dining table with 2 to 4 chairs and one simple bench.', 'Upgrade to a designer dining table, premium chairs, and a high-quality bench.', 'Indulge in a custom dining table with luxury chairs and a designer bench crafted from high-end materials.', 1),
(21, 'Dining Room', 'Storage', 'Basic chest or crockery unit with extra storage.', 'Opt for a designer chest, premium display units for added elegance.', 'Experience custom storage solutions, luxury display units, and a high-end crockery unit.', 1),
(22, 'Dining Room', 'Ceiling & Lighting', 'Standard false ceiling and basic light effects.', 'Enhance with cove lighting, designer chandeliers, and advanced light effects.', 'Enjoy a custom false ceiling with high-end cove lighting, a luxury chandelier, and integrated lighting systems.', 1),
(23, 'Dining Room', 'Furniture & Decor', 'Standard wall paneling or texture paint on one wall.', 'Elevate with designer wall paneling or premium texture paint on one wall.', 'Achieve sophistication with custom wall paneling or high-end wallpaper on one or two walls.', 1),
(24, 'Dining Room', 'Electrical Work', 'Basic plug points with standard switches and hidden wiring.', 'Upgrade to hidden wiring, dimmer switches, and additional USB charging points.', 'Embrace smart electrical solutions with advanced dimmer systems and integrated USB charging points.', 1),
(25, 'Dining Room', 'Painting', 'Standard wall and ceiling painting for a clean look.', 'Choose premium wall painting and varnish or polish for woodwork.', 'Opt for high-end paint finishes and custom varnish for a polished, luxurious appearance.', 1),
(26, 'Dining Room', 'Miscellaneous', 'Simple sideboard and basic bar unit for functionality.', 'Upgrade to a premium buffet table and custom bar unit for added elegance.', 'Enjoy a luxury buffet table and an exclusive bar unit for a truly refined dining experience.', 1),
(27, 'Passage/Lobby/Corridor', 'Ceiling & Lighting', 'Basic false ceiling with standard light effects.', 'Designer gypsum ceiling with cove lighting, recessed lights, and wall sconces.', 'Custom false ceiling featuring designer cove lighting, high-end recessed lights, and luxury wall sconces.', 1),
(28, 'Passage/Lobby/Corridor', 'Furniture & Decor', 'Basic artifacts (showpieces), standard wall paneling, texture paint, and basic curtains.', 'Designer wall paneling, premium texture paint, high-quality curtains, custom console tables, and mirrors.', 'Luxury artifacts, custom wall paneling, exclusive wallpaper, automated curtains, designer mirrors, and console tables.', 1),
(29, 'Passage/Lobby/Corridor', 'Electrical Work', 'Basic plug points with standard switches.', 'Hidden wiring, dimmer switches, and additional plug points.', 'Advanced electrical solutions, smart wiring, and designer dimmer systems.', 1),
(30, 'Passage/Lobby/Corridor', 'Painting', 'Standard wall painting and basic ceiling painting.', 'Premium wall painting with attention to detail.', 'High-end paint finishes for both walls and ceilings, providing a luxurious touch.', 1),
(31, 'Passage/Lobby/Corridor', 'Miscellaneous', 'Standard storage solutions, basic wall-mounted shelves, shoe racks, and simple decorative elements.', 'Designer storage solutions, premium wall-mounted shelves, custom shoe racks, and high-quality decorative elements.', 'Custom storage solutions, luxury wall-mounted shelves, exclusive decorative elements, and designer shoe racks.', 1),
(32, 'Master Bedroom', 'Bed & Storage', 'Relax in a Master/Queen Bed with Basic Storage Below, a Side Table, Standard Double Wardrobes, and a Simple Headboard.', 'Upgrade to a Designer Master/Queen Bed with Premium Storage Solutions, Custom Side Tables, High-Quality Double Wardrobes, and an Enhanced Headboard.', 'Experience Luxury with a Master/Queen Bed, Custom Storage Solutions, Designer Side Tables, High-End Wardrobes, and a Bespoke Headboard.', 1),
(33, 'Master Bedroom', 'Study Area', 'Set up a Basic Study Table with Standard Storage Above, Simple Bookshelves, and a Basic Chair.', 'Enhance your workspace with a Designer Study Table, Premium Storage Above, Custom Bookshelves, and a Comfortable Chair.', 'Transform with a High-End Study Table, Custom Storage Solutions, Designer Bookshelves, and an Ergonomic Chair for ultimate productivity.', 1),
(34, 'Master Bedroom', 'Ceiling & Lighting', 'Choose a Basic False Ceiling with Standard Light Effects, Simple Cove Lighting, and Basic Pendant Lights.', 'Upgrade to a Premium False Ceiling with Enhanced Light Effects, Designer Cove Lighting, and Recessed Lights for a sophisticated ambiance.', 'Indulge in a Custom False Ceiling with Advanced Cove Lighting, Luxury Pendant Lights, and High-End Recessed Lighting for an exquisite touch.', 1),
(35, 'Master Bedroom', 'Furniture & Decor', 'Decorate with a Standard TV Unit, Basic Showpiece Unit, and Wall Paneling or Texture Paint.', 'Refine your space with a Designer TV Unit, Premium Showpiece Unit, and High-Quality Wall Paneling or Premium Texture Paint.', 'Luxuriate in a Luxury TV Unit, Custom Showpiece Unit, and High-End Wall Paneling or Exclusive Wallpaper for an opulent look.', 1),
(36, 'Master Bedroom', 'Electrical Work', 'Utilize Basic Plug Points, Standard Switches, Hidden Wiring, and Dimmer Switches.', 'Opt for Premium Plug Points, Advanced Hidden Wiring, Enhanced Dimmer Switches, and Additional USB Charging Points for modern convenience.', 'Benefit from High-End Electrical Solutions, Smart Wiring, Advanced Dimmer Systems, and Integrated USB Charging Points for a seamless experience.', 1),
(37, 'Master Bedroom', 'Painting', 'Enjoy Standard Wall Painting, Basic Ceiling Painting.', 'Upgrade with Premium Wall Painting, and Varnish or Polish for Woodwork for a refined finish.', 'Revel in High-End Paint Finishes for Walls and Ceilings, and Custom Varnish or Polish for Woodwork for a luxurious touch.', 1),
(38, 'Master Bedroom', 'Automation', 'Implement Basic Lights Automation and Simple Curtain Automation.', 'Enhance with Advanced Lights Automation and Premium Curtain Automation for added comfort.', 'Experience Advanced Lights Automation and High-End Curtain Automation for a fully integrated home.', 1),
(39, 'Master Bedroom', 'Miscellaneous', 'Organize with a Basic Dressing Unit, Standard Vanity Units, and a Simple Full-Length Mirror.', 'Elevate with a Designer Dressing Unit, Premium Vanity Units, and a High-Quality Full-Length Mirror with Dressing Storage.', 'Luxuriate with a Luxury Dressing Unit, Custom Vanity Units, and an Exclusive Full-Length Mirror for a touch of elegance.', 1),
(40, 'Kids\'/Children\'s Bedroom', 'Bed & Storage', 'Enjoy a Standard Bed or Basic Bunk/Trundle Bed with Essential Storage, a Side Table, and a Simple Headboard.', 'Upgrade to a Designer Bunk/Trundle Bed with Enhanced Storage Solutions, a Custom Side Table, and an Elegant Headboard.', 'Experience Opulence with a Master Bed or Designer Bunk/Trundle Beds, Bespoke Storage Solutions, and Luxurious Side Tables and Headboards.', 1),
(41, 'Kids\'/Children\'s Bedroom', 'Wardrobe & Cabinets', 'Opt for Standard Double Wardrobes, Basic Loft Storage, Simple Cabinetry, and Open Shelves.', 'Elevate your space with Premium Double Wardrobes, Upgraded Loft Storage, Custom Cabinetry, and Designer Open Shelves.', 'Indulge in High-End Double Wardrobes, Premium Custom Cabinetry, and Exquisite Designer Open Shelves.', 1),
(42, 'Kids\'/Children\'s Bedroom', 'Study Area', 'Set up a Basic Study Table with Standard Storage Above, Simple Bookshelves, a Basic Chair, and a Pinboard.', 'Enhance your study with a Premium Study Table, Designer Storage Above, Custom Bookshelves, a Comfortable Chair, and a Stylish Pinboard.', 'Transform your study with a High-End Study Table, Luxury Storage Solutions, Designer Bookshelves, an Ergonomic Chair, and an Exclusive Pinboard.', 1),
(43, 'Kids\'/Children\'s Bedroom', 'Ceiling & Lighting', 'Choose a Basic False Ceiling, Standard Light Effects, Simple Cove Lighting, a Basic Pendant Light, and a Night Lamp.', 'Upgrade to a Premium False Ceiling with Enhanced Light Effects, Designer Cove Lighting, and a High-Quality Pendant Light.', 'Revel in a Custom False Ceiling with Designer Cove Lighting, High-End Pendant Lights, and Luxurious Night Lamps.', 1),
(44, 'Kids\'/Children\'s Bedroom', 'Furniture & Decor', 'Decorate with a Basic TV Unit, Simple Showpiece, and Standard Wall Paneling or Texture Paint.', 'Refine your space with a Designer TV Unit, Premium Showpiece, and High-Quality Wall Paneling or Premium Texture Paint.', 'Luxuriate in an Opulent TV Unit, Custom Showpiece, and Exclusive Wall Paneling or Designer Wallpaper.', 1),
(45, 'Kids\'/Children\'s Bedroom', 'Electrical Work', 'Utilize Basic Plug Points, Standard Switches, Hidden Wiring, Dimmer Switches, USB Charging Points, and Child-Safe Outlets.', 'Opt for Premium Plug Points, Advanced Hidden Wiring, Enhanced Dimmer Switches, Additional USB Charging Points, and Child-Safe Outlets.', 'Benefit from High-End Electrical Solutions, Smart Wiring, Advanced Dimmer Systems, and Premium Child-Safe Outlets.', 1),
(46, 'Kids\'/Children\'s Bedroom', 'Painting', 'Choose Standard Wall Painting, Basic Ceiling Painting, and a Chalkboard Wall.', 'Upgrade to Premium Wall Painting, Enhanced Ceiling Painting, and a Custom Chalkboard Wall.', 'Enjoy High-End Paint Finishes for Walls and Ceilings, and a Luxury Chalkboard Wall.', 1),
(47, 'Kids\'/Children\'s Bedroom', 'Automation', 'Implement Basic Lights Automation and Simple Curtain Automation.', 'Enhance with Advanced Lights Automation and Premium Curtain Automation.', 'Experience Advanced Lights Automation and High-End Curtain Automation for a fully integrated home.', 1),
(48, 'Kids\'/Children\'s Bedroom', 'Miscellaneous', 'Organize with Basic Toys Storage, a Simple Activity Area, a Basic Reading Corner, Custom Themes, and Growth Chart Stickers.', 'Elevate with Designer Toys Storage, a Premium Activity Area, a Custom Reading Corner, Enhanced Custom Themes, and Quality Growth Chart Stickers.', 'Luxuriate with Luxury Toys Storage, an Exclusive Activity Area, a Designer Reading Corner, Premium Custom Themes, and Designer Growth Chart Wall Stickers.', 1),
(49, 'Parents\' Bedroom', 'Bed & Storage', 'Unwind in a Master/Queen Bed with Standard Storage Below, a Side Table, and a Basic Headboard.', 'Upgrade to a Designer Master/Queen Bed with Enhanced Storage, a Custom Side Table, and a Premium Headboard.', 'Indulge in a High-End Master/Queen Bed with Luxury Storage Solutions Below, Designer Side Tables, and a High-End Headboard.', 1),
(50, 'Parents\' Bedroom', 'Wardrobe & Cabinets', 'Choose Standard Double Wardrobes with Basic Loft Storage, Simple Custom Cabinetry, and Open Shelves.', 'Opt for Premium Double Wardrobes with Enhanced Loft Storage, High-Quality Custom Cabinetry, and Designer Open Shelves.', 'Enjoy Luxury Double Wardrobes with High-End Custom Cabinetry and Premium Designer Open Shelves.', 1),
(51, 'Parents\' Bedroom', 'Study Area', 'Set up a Basic Study Table with Standard Storage Above, and Simple Reading Lamps.', 'Elevate with a Premium Study Table, Enhanced Storage Above, and Designer Reading Lamps.', 'Transform with a High-End Study Table, Luxury Storage Solutions, and Premium Reading Lamps for a sophisticated workspace.', 1),
(52, 'Parents\' Bedroom', 'Ceiling & Lighting', 'Select a Basic False Ceiling with Standard Light Effects, Simple Cove Lighting, and Basic Pendant Lights.', 'Enhance with Premium Light Effects, Enhanced Cove Lighting, and Designer Pendant Lights.', 'Experience Custom False Ceiling with Designer Cove Lighting and High-End Pendant Lights for a luxurious touch.', 1),
(53, 'Parents\' Bedroom', 'Furniture & Decor', 'Decorate with a Standard TV Unit, Basic Showpiece Unit, and Wall Paneling or Texture Paint.', 'Refine with a Designer TV Unit, Premium Showpiece Unit, and High-Quality Wall Paneling or Premium Texture Paint.', 'Luxuriate in a Luxury TV Unit, Custom Showpiece Unit, and Exclusive Wall Paneling or Designer Wallpaper.', 1),
(54, 'Parents\' Bedroom', 'Electrical Work', 'Use Basic Plug Points, Standard Switches, Hidden Wiring, Dimmer Switches, and USB Charging Points.', 'Upgrade to Premium Plug Points, Enhanced Hidden Wiring, Advanced Dimmer Switches, and Additional USB Charging Points.', 'Benefit from High-End Electrical Solutions, Smart Wiring, Advanced Dimmer Systems, and Premium USB Charging Points.', 1),
(55, 'Parents\' Bedroom', 'Painting', 'Enjoy Standard Wall Painting and Basic Ceiling Painting.', 'Opt for Premium Wall Painting with Enhanced Ceiling Painting for a refined finish.', 'Revel in High-End Paint Finishes for Walls and Ceilings for a luxurious look.', 1),
(56, 'Parents\' Bedroom', 'Automation', 'Implement Basic Lights Automation and Simple Curtain Automation.', 'Enhance with Advanced Lights Automation and Premium Curtain Automation for added convenience.', 'Experience Advanced Lights Automation and High-End Curtain Automation for a fully integrated home environment.', 1),
(57, 'Parents\' Bedroom', 'Miscellaneous', 'Organize with a Basic Dressing Unit, Standard Vanity Units, and a Simple Full-Length Mirror.', 'Elevate with a Designer Dressing Unit, Premium Vanity Units, and a High-Quality Full-Length Mirror with Dressing Storage.', 'Luxuriate with a Luxury Dressing Unit, Custom Vanity Units, and an Exclusive Full-Length Mirror for an elegant touch.', 1),
(58, 'Guest Bedroom', 'Bed & Storage', 'Relax with a Master/Queen Bed or a Sofa Cum Bed, featuring Standard Storage Below, a Side Table, and a Basic Headboard.', 'Upgrade to a Designer Master/Queen Bed or an Enhanced Sofa Cum Bed, with Premium Storage Solutions Below, a Custom Side Table, and a Designer Headboard.', 'Indulge in a High-End Master/Queen Bed or Luxury Sofa Cum Bed, complete with Premium Storage Solutions, High-End Side Tables, and a Luxurious Headboard.', 1),
(59, 'Guest Bedroom', 'Wardrobe & Cabinets', 'Utilize a Single Wardrobe with Basic Loft Above and Open Shelves.', 'Opt for an Enhanced Single Wardrobe with Premium Loft Above and High-Quality Open Shelves.', 'Enjoy a Luxury Single Wardrobe with High-End Loft Above and Premium Designer Open Shelves.', 1),
(60, 'Guest Bedroom', 'Ceiling & Lighting', 'Settle under a Basic False Ceiling with Standard Light Effects, Simple Cove Lighting, Pendant Lights, and Bedside Lamps.', 'Elevate the ambiance with Premium Light Effects, Enhanced Cove Lighting, Designer Pendant Lights, and High-Quality Bedside Lamps.', 'Transform your space with a Custom False Ceiling, Advanced Cove Lighting, High-End Pendant Lights, and Premium Bedside Lamps.', 1),
(61, 'Guest Bedroom', 'Furniture & Decor', 'Furnish with a Standard TV Unit, Basic Showpiece Unit, Wall Paneling, Texture Paint, Wallpaper, Curtains, and Rugs.', 'Enhance with a Designer TV Unit, Premium Showpiece Unit, High-Quality Wall Paneling or Enhanced Texture Paint.', 'Luxuriate with a Luxury TV Unit, Custom Showpiece Unit, Exclusive Wall Paneling, or Designer Wallpaper for a refined touch.', 1),
(62, 'Guest Bedroom', 'Electrical Work', 'Use Basic Plug Points, Standard Switches, Hidden Wiring, Dimmer Switches, and USB Charging Points.', 'Upgrade to Premium Plug Points, Enhanced Hidden Wiring, Advanced Dimmer Switches, and Additional USB Charging Points.', 'Benefit from High-End Electrical Solutions, Smart Wiring, Advanced Dimmer Systems, and Premium USB Charging Points.', 1),
(63, 'Guest Bedroom', 'Painting', 'Enjoy Standard Wall Painting and Basic Ceiling Painting.', 'Opt for Premium Wall Painting with Enhanced Ceiling Painting for a refined look.', 'Revel in High-End Paint Finishes for Walls and Ceilings for a sophisticated ambiance.', 1),
(64, 'Guest Bedroom', 'Automation', 'Implement Basic Lights Automation for convenience.', 'Enhance with Advanced Lights Automation for a touch of luxury.', 'Experience Advanced Lights Automation for a seamless, high-end home experience.', 1),
(65, 'Guest Bedroom', 'Miscellaneous', 'Equip with a Standard Luggage Rack, Basic Writing Desk, Mirror, and Comfortable Seating.', 'Upgrade to a Premium Luggage Rack, Designer Writing Desk, High-Quality Mirror, and Enhanced Comfortable Seating.', 'Luxuriate with a Luxury Luggage Rack, Custom Writing Desk, Premium Mirror, and High-End Comfortable Seating for an elegant touch.', 1),
(66, 'Study Room/Home Office', 'Furniture', 'Set up with a Basic Study Table/Desk, Standard Ergonomic Chair, Simple Storage Cabinet/s, Standard Bookshelves, and Basic Filing Cabinet/s.', 'Upgrade to a Premium Study Table/Desk, Designer Ergonomic Chair, Enhanced Storage Cabinet/s, Custom Bookshelves, and High-Quality Filing Cabinet/s.', 'Opt for a Luxury Study Desk with Adjustable Height, High-End Ergonomic Chair, Luxury Storage Cabinets, Designer Bookshelves, and Premium Filing Cabinet/s.', 1),
(67, 'Study Room/Home Office', 'Storage Solutions', 'Utilize Basic Overhead Storage, Standard Shelving Units, and Simple Modular Cabinet/s.', 'Enhance with Premium Overhead Storage, High-Quality Shelving Unit/s, and Custom Modular Cabinet/s.', 'Experience Luxury Overhead Storage, Designer Shelving Unit/s, and Premium Modular Cabinet/s.', 1),
(68, 'Study Room/Home Office', 'Ceiling & Lighting', 'Enjoy a Simple False Ceiling with Standard Task Lighting, Basic Light Effects, Recessed Lights, and Desk Lamps.', 'Upgrade to Enhanced False Ceiling, Premium Task Lighting, Designer Light Effects, High-Quality Recessed Lights, and Custom Desk Lamps.', 'Transform with a Custom False Ceiling with Integrated Lighting, Advanced Task Lighting, Luxury Light Effects, Designer Recessed Lights, and High-End Desk Lamps.', 1),
(69, 'Study Room/Home Office', 'Electrical Work', 'Basic Plug Points, Standard Switches, Hidden Wiring, Data Points, and USB Charging Points.', 'Opt for Enhanced Plug Points, Premium Switches, Advanced Hidden Wiring, Additional Data Points, and Extra USB Charging Points.', 'Benefit from High-End Electrical Work with Smart Systems, Advanced Data Points, and Luxury USB Charging Solutions.', 1),
(70, 'Study Room/Home Office', 'Painting', 'Choose Standard Wall Painting or Wallpaper.', 'Upgrade to Premium Wall Painting or Enhanced Wallpaper, with a Custom Whiteboard Wall.', 'Indulge in Luxury Paint Finishes or Designer Wallpaper, with High-End Whiteboard Walls.', 1),
(71, 'Study Room/Home Office', 'Automation', 'Basic Lights Automation and Simple Blinds Automation.', 'Enhance with Advanced Lights Automation and Premium Blinds Automation.', 'Experience Advanced Lights and Blinds Automation with Smart Controls for a seamless experience.', 1),
(72, 'Study Room/Home Office', 'Miscellaneous', 'Incorporate a Standard Printer Stand, Basic Lockable Drawers, and Simple Cable Management Systems.', 'Upgrade to a Premium Printer Stand, Enhanced Lockable Drawers, and High-Quality Cable Management Systems.', 'Luxuriate with a Multifunctional Printer Stand, Custom Lockable Drawers, and Premium Cable Management Systems.', 1),
(73, 'Walk-in-Wardrobe', 'Wardrobe Units', 'Enjoy Basic Custom Wardrobe Units with Standard Shelves, Hanging Rods, Basic Drawers, and Standard Shoe Racks.', 'Upgrade to Premium Wardrobe Units featuring Superior Materials, Enhanced Shelves, Soft-Close Drawers, and Advanced Shoe Racks.', 'Indulge in Luxury Wardrobe Units crafted from High-End Materials, Customized Shelves, Premium Hanging Rods, Soft-Close Drawers, and Luxury Shoe Organizers.', 1),
(74, 'Walk-in-Wardrobe', 'Storage Solutions', 'Utilize Standard Overhead Storage, Simple Lofts, Basic Pull-Out Drawers, and Basic Corner Units.', 'Enhance with Premium Overhead Storage, High-Quality Lofts, Smooth Pull-Out Drawers, Premium Corner Units, and Trouser Racks.', 'Experience Luxury Overhead Storage, Designer Lofts, High-End Pull-Out Drawers, Advanced Corner Units, and Custom Trouser Racks.', 1),
(75, 'Walk-in-Wardrobe', 'Lighting', 'Basic LED Strip Lighting, Standard Spotlights, and Basic Under-Shelf Lights illuminate your space.', 'Upgrade to Premium LED Strip Lighting, Designer Spotlights, Sensor Lights, and Enhanced Under-Shelf Lights.', 'Transform with Luxury LED Strip Lighting, Smart Spotlights, Advanced Sensor-Based Lighting, High-End Under-Shelf Lights, and Designer Ceiling Lights.', 1),
(76, 'Walk-in-Wardrobe', 'Flooring', 'Standard Wooden Flooring, Basic Vinyl Flooring, Standard Carpet, and Basic Tiling complete the look.', 'Opt for Premium Wooden Flooring, High-Quality Vinyl Flooring, Enhanced Carpet, and Premium Tiling.', 'Luxuriate with Hardwood Flooring, Designer Vinyl Flooring, Premium Carpets, and High-End Designer Tiling.', 1),
(77, 'Walk-in-Wardrobe', 'Wall Treatments', 'Basic Wall Paneling, Standard Texture Paint, and Simple Wallpaper.', 'Upgrade to Enhanced Wall Paneling, Premium Texture Paint, Designer Wallpaper, and Decorative Mirrors.', 'Indulge in Luxury Wall Paneling with Advanced Materials, Custom Texture Paint, High-End Wallpaper, and Full Wall Mirrors.', 1),
(78, 'Walk-in-Wardrobe', 'Doors and Shutters', 'Basic Sliding Doors and Hinged Doors.', 'Opt for Premium Sliding Doors, Enhanced Hinged Doors, and High-Quality Glass Shutters.', 'Luxuriate with Luxury Sliding Doors featuring a Soft-Close Mechanism, Designer Hinged Doors, and High-End Glass and Mirror Shutters.', 1),
(79, 'Walk-in-Wardrobe', 'Accessories', 'Basic Mirrors, Hooks, Valet Rods, and Ottoman/s for practical use.', 'Upgrade to Premium Mirrors, Designer Hooks, Enhanced Valet Rods, Premium Ottoman/s, and Basic Jewelry Organizers.', 'Experience Luxury Full-Length Mirrors, Custom Hooks, High-End Valet Rods, Designer Ottoman/s, and Luxury Jewelry Organizers.', 1),
(80, 'Walk-in-Wardrobe', 'Electrical Work', 'Basic Plug Points, Standard Switches, and Hidden Wiring.', 'Enhance with Premium Plug Points, Advanced Switches, Enhanced Hidden Wiring, and Extra USB Charging Points.', 'Benefit from Luxury Electrical Work with Smart Switches, High-End Hidden Wiring, and Multiple USB Charging Stations.', 1),
(81, 'Walk-in-Wardrobe', 'False Ceiling', 'Simple Ceiling Design, Standard Gypsum Ceiling, and Basic POP Design.', 'Upgrade to Enhanced Ceiling Design, Premium Gypsum Ceiling, Advanced POP Design, and Designer Cove Lighting.', 'Transform with Luxury Ceiling Design featuring Integrated Lighting, Designer Gypsum Ceiling, Custom POP Design, and Advanced Cove Lighting.', 1),
(82, 'Walk-in-Wardrobe', 'Painting', 'Standard Wall Painting, Basic Ceiling Painting, and Standard Varnish or Polish for Woodwork.', 'Opt for Premium Wall Painting, High-Quality Ceiling Painting, and Enhanced Varnish or Polish for Woodwork.', 'Indulge in Luxury Wall and Ceiling Painting with High-End Finishes and Custom Varnish or Polish for Premium Woodwork.', 1),
(83, 'Walk-in-Wardrobe', 'Automation', 'Basic Automated Lights.', 'Upgrade to Enhanced Automated Lights and Motorized Shutters.', 'Experience Luxury Smart Lighting Systems, Motorized Shutters with Remote Control, and Advanced Sensor-Based Systems.', 1),
(84, 'Bathroom/Toilet', 'Sanitary Fixtures', 'Standard toilet, washbasin, basic shower area, and standard flush system.', 'Designer toilet, washbasin with vanity unit, luxurious rain shower, wall-mounted flush system, and hand-held showers.', 'High-end toilet with concealed tank, elegant washbasin with designer vanity, indulgent bathtub, bidet, and multi-jet shower system.', 1),
(85, 'Bathroom/Toilet', 'Storage Solutions', 'Basic wall-mounted shelves and towel rack for essential storage.', 'Custom vanity with built-in storage, sleek medicine cabinet with mirror, and stylish glass shelves.', 'Bespoke cabinetry with integrated LED lighting, expansive linen closet, and luxury towel warmers.', 1),
(86, 'Bathroom/Toilet', 'Ceiling & Lighting', 'Basic false ceiling with standard waterproof recessed lighting.', 'Designer false ceiling with task lighting, mirror lights, and dimmable LED fixtures.', 'Customized ceiling design with sophisticated cove lighting, smart mirror lighting, and motion-activated illumination.', 1),
(87, 'Bathroom/Toilet', 'Plumbing Fixtures', 'Standard water outlets, faucets, and showerhead.', 'Premium faucets and mixers, hot and cold mixer units, and high-quality showerhead.', 'Luxury fixtures with smart faucets, digital thermostatic mixers, and a deluxe handheld and rain shower combo.', 1),
(88, 'Bathroom/Toilet', 'Electrical Work', 'Standard plug points, switches, and basic geyser installation.', 'Modular switches, premium plug points, exhaust fan with timer, and waterproof switches.', 'Advanced smart switches, intelligent geyser, USB charging points, and a silent exhaust fan with smart controls.', 1),
(89, 'Bathroom/Toilet', 'Flooring', 'Anti-skid tiles for safe and practical flooring.', 'Premium anti-skid tiles, marble, or luxury vinyl flooring.', 'High-end marble flooring, custom mosaic designs, and indulgent heated floors.', 1),
(90, 'Bathroom/Toilet', 'Wall Treatments', 'Basic wall tiles and moisture-resistant paint.', 'Designer wall tiles, eye-catching accent backsplash, and elegant texture paint.', 'Luxury wall tiles with custom patterns, natural stone cladding, and sophisticated backlit panels.', 1),
(91, 'Bathroom/Toilet', 'Painting', 'Waterproof wall painting and standard ceiling painting.', 'Moisture-resistant textured wall painting and designer ceiling finishes.', 'High-end waterproof paint with textured effects and custom mural painting.', 1),
(92, 'Bathroom/Toilet', 'Renovation', 'Basic waterproofing, minor civil changes, and standard space optimization.', 'Advanced waterproofing, space optimization with custom cabinetry, and air conditioning installation.', 'Complete remodeling with custom space planning, luxury waterproofing solutions, and integrated HVAC systems.', 1),
(93, 'Bathroom/Toilet', 'Accessories', 'Standard mirrors, soap dispensers, basic towel holders, and shower curtains.', 'Designer mirrors with storage, branded soap dispensers, towel rails, and stylish bath mats.', 'Smart mirrors with built-in lighting, heated towel rails, luxury bath accessories, and elegant vanity mirrors.', 1),
(94, 'Bathroom/Toilet', 'Automation', 'Basic motion sensor lights for convenience.', 'Automated faucets, smart mirrors with defogging capabilities, and advanced smart exhaust fans.', 'Fully automated smart bathroom system with intelligent faucets, mirrors, lights, heated towel rails, and smart showers.', 1),
(95, 'Bathroom/Toilet', 'Miscellaneous', 'Basic single glass partition between dry and wet areas.', 'Premium glass partition with one openable glass door and high-quality hardware between wet and dry areas.', 'Branded toughened glass partition with a sleek sliding glass door and superior quality hardware for separation.', 1),
(96, 'Balcony/Terrace', 'Ceiling & Lighting', 'Simple Sherawood with basic paint false ceiling, basic outdoor lighting, and string lights.', 'PVC false ceiling with enhanced outdoor lighting, premium lanterns, and stylish spotlights.', 'Luxury HPL false ceiling with weather-proof materials, high-end outdoor lighting, designer lanterns, and smart lighting.', 1),
(97, 'Balcony/Terrace', 'Wall Treatments', 'Basic wall paneling, standard texture paint, and outdoor wallpaper.', 'Premium wall paneling, high-quality texture paint, decorative cladding, and vertical garden walls.', 'Luxury wall treatments with custom cladding, designer outdoor wallpaper, high-end vertical garden walls, and integrated watering systems.', 1),
(98, 'Balcony/Terrace', 'Furniture', 'Basic outdoor seating, simple swing chairs, and folding chairs.', 'Premium outdoor seating with upgraded cushions, designer swing chairs, and high-quality folding chairs.', 'Luxury outdoor seating with custom cushions, bespoke swing chairs, hammocks with stands, and weather-resistant materials.', 1),
(99, 'Balcony/Terrace', 'Planters & Greens', 'Standard potted plants and basic hanging planters.', 'High-end potted plants, designer hanging planters, green wall, and decorative trellises.', 'Luxury green wall systems with integrated irrigation, custom flower beds, designer trellises, and advanced landscaping features.', 1),
(100, 'Balcony/Terrace', 'Electrical Work', 'Basic plug points, standard switches, and hidden wiring for basic outdoor lighting.', 'Enhanced plug points, premium switches, advanced hidden wiring for outdoor lighting, and USB charging points.', 'Luxury electrical setup with smart control systems, high-end hidden wiring, and multiple USB charging points.', 1),
(101, 'Balcony/Terrace', 'Painting', 'Standard exterior paint.', 'Premium weather-resistant paint with high-end exterior finishes.', 'Luxury exterior paint with advanced weather protection and designer finishes.', 1),
(102, 'Balcony/Terrace', 'Automation', 'Basic smart lights for automated convenience.', 'Automated irrigation system, premium smart lights, and retractable awnings.', 'Luxury automated irrigation with smart sensors, high-end smart lighting systems, and motorized retractable awnings.', 1),
(103, 'Utility Room', 'Laundry Area', 'Basic washing machine space, utility sink, standard detergent and cleaning storage.', 'Enhanced washing machine & dryer space, folding counter, high-end utility sink.', 'Custom washing & dryer stations, premium folding counters, luxury detergent dispensers, built-in laundry sorting solutions.', 1),
(104, 'Utility Room', 'Storage Solutions', 'Overhead cabinets, basic under-counter storage, standard shelving units.', 'Premium overhead cabinets, enhanced under-counter storage, custom shelving, integrated laundry baskets.', 'Luxury cabinets with soft-close mechanisms, pull-out laundry baskets, high-end shelving systems.', 1),
(105, 'Utility Room', 'Electrical Work', 'Standard plug points, switches, basic hidden wiring.', 'Enhanced plug points, premium switches, high-quality hidden wiring, water heater installation.', 'Luxury electrical systems with smart control panels, high-end hidden wiring, advanced water heater with smart features.', 1),
(106, 'Utility Room', 'Ceiling & Lighting', 'Basic false ceiling, standard light effects, simple recessed lighting.', 'Premium false ceiling, designer light effects, advanced recessed lighting, task lighting.', 'Luxury false ceiling with high-end finishes, advanced recessed lighting with dimming, designer task lighting.', 1),
(107, 'Utility Room', 'Wall Treatments', 'Basic wall paneling, moisture-resistant paint, standard tiles.', 'Premium wall paneling, high-quality moisture-resistant paint, designer tiles, backsplash.', 'Luxury wall paneling with custom finishes, high-end moisture-resistant paint, designer backsplash with integrated storage.', 1),
(108, 'Utility Room', 'Plumbing Fixtures', 'Standard utility sink, basic water outlets, simple drainage solutions.', 'Premium utility sink, high-quality water outlets, enhanced drainage solutions.', 'Luxury utility sink with custom features, advanced water outlets, high-end drainage systems.', 1),
(109, 'Utility Room', 'Painting', 'Standard wall painting, basic waterproofing paint.', 'Premium wall painting, advanced waterproofing paint.', 'Luxury wall painting with special finishes, high-performance waterproofing solutions.', 1),
(110, 'Utility Room', 'Accessories', 'Basic ironing board, standard foldable drying racks, hooks.', 'Premium ironing board with integrated storage, designer drying racks, pegboards.', 'Luxury ironing stations with built-in storage, high-end foldable drying racks, custom hooks and pegboards with storage solutions.', 1),
(111, 'Utility Room', 'Automation', 'Basic smart appliances, standard motion sensor lights.', 'Premium smart appliances, advanced motion sensor lights, automated exhaust fans.', 'Luxury smart appliances with custom programming, high-end motion sensor systems, smart exhaust fans with air quality monitoring.', 1),
(112, 'Puja Room', 'Prayer Unit', 'Basic Mandir Unit with Open Shelves and Standard Closed Cabinets', 'Premium Mandir with Elegant Closed Cabinets and Pooja Bells', 'Transform your spiritual space with an Exquisite Mandir Unit, featuring Intricate Carvings and Custom Pooja Bells for a truly divine ambiance.', 1),
(113, 'Puja Room', 'Storage Solutions', 'Basic Cabinets for Religious Books, Standard Drawers for Pooja Items', 'Premium Cabinets with Soft-Close Mechanisms and Custom Shelving Units for Pooja Items', 'Elevate your sacred storage with Opulent Solutions featuring Hidden Compartments and High-End Drawer Systems, tailored for your treasured items.', 1),
(114, 'Puja Room', 'Ceiling & Lighting', 'Basic False Ceiling with Standard Light Effects and Simple Focus Lights on Deity', 'Designer False Ceiling with Premium Light Effects and Advanced Cove Lighting', 'Illuminate your devotion with a Luxurious False Ceiling and Intelligent Lighting Systems that enhance every prayer and ritual.', 1),
(115, 'Puja Room', 'Wall Treatments', 'Basic Wall Paneling with Standard Texture Paint and Simple Wallpaper', 'Premium Wall Paneling with High-Quality Texture Paint, Designer Wallpaper, and Marble Cladding', 'Revitalize your walls with Lavish Marble Cladding and Custom Treatments that reflect the grandeur of your spiritual practice.', 1),
(116, 'Puja Room', 'Electrical Work', 'Standard Plug Points, Basic Switches, and Simple Dimmer Switches with Basic Hidden Wiring for Lamps', 'Premium Plug Points with High-Quality Switches, Advanced Dimmer Switches, and High-End Hidden Wiring Systems', 'Power your prayers with Elite Electrical Solutions featuring Smart Control Panels and Advanced Wiring, ensuring convenience and efficiency.', 1),
(117, 'Puja Room', 'Painting', 'Standard Wall Painting and Basic Ceiling Painting', 'Premium Wall Painting with Texture Finishes and High-Quality Ceiling Painting', 'Adorn your sanctuary with Luxurious Paint Finishes and Custom Designs, adding a touch of artistry to your spiritual haven.', 1),
(118, 'Puja Room', 'Automation', 'Basic Lights Automation and Standard Automated Curtains', 'Premium Lights Automation with Custom Settings and Sensor-Based Incense Burner', 'Experience modern spirituality with Sophisticated Lights Automation and Smart Incense Burners, creating a seamless and elevated prayer environment.', 1),
(119, 'Entertainment Room', 'Seating', 'Basic Sofa Set, Sofa Cum Bed, Standard Recliners, Basic Lounge Chairs, Bean Bags', 'Premium Sofa Set with Comfort Features, Recliners, Designer Lounge Chairs, Upholstered Bean Bags', 'Indulge in ultimate relaxation with a Luxurious Sofa Set, Motorized Recliners with Massage Features, and High-End Lounge Chairs, all tailored to your comfort.', 1),
(120, 'Entertainment Room', 'Storage', 'Standard TV Unit, Simple Showpiece Unit, Basic Entertainment Wall Units', 'Customized TV Unit with Storage, Designer Showpiece Units, Built-In Entertainment Wall Units', 'Elevate your entertainment with Opulent Wall Units featuring Integrated Lighting and Hidden Storage for a seamless and sophisticated setup.', 1),
(121, 'Entertainment Room', 'Ceiling & Lighting', 'Basic False Ceiling, Standard Light Effects, Basic Lights Automation', 'Designer False Ceiling, Premium Light Effects, Advanced Lights Automation, Cove Lighting', 'Transform your space with a High-End Ceiling and Advanced Mood Lighting Systems, offering Voice-Controlled Automation for a tailored ambiance.', 1),
(122, 'Entertainment Room', 'Furniture & Decor', 'Standard Artifacts, Basic Wall Paneling or Texture Paint or Wallpaper, Simple Acoustic Panels', 'Premium Artifacts, Designer Wall Paneling, High-Quality Texture Paint or Customized Wallpaper, Advanced Acoustic Panels', 'Create a statement with Luxurious Artifacts, High-End Wall Paneling, and Custom Acoustic Solutions, complemented by Designer Curtains with Automation.', 1),
(123, 'Entertainment Room', 'Electrical Work', 'Basic Plug Points, Standard Switches, Basic Hidden Wiring, Simple AV Points, Basic HDMI Outlets, USB Charging Points', 'Premium Plug Points with Smart Features, Designer Switches, High-Quality Hidden Wiring, Advanced AV Points, HDMI Outlets', 'Upgrade your power setup with Luxury Electrical Systems featuring Smart Home Integration, High-End Switches, and Advanced AV and HDMI Configurations.', 1),
(124, 'Entertainment Room', 'Painting', 'Standard Wall Painting, Basic Ceiling Painting', 'Premium Wall Painting with Textured Finishes, Designer Ceiling Painting', 'Enhance your walls with Luxurious Paint Finishes and Custom Artwork, creating a visually stunning backdrop for your entertainment.', 1),
(125, 'Entertainment Room', 'Automation', 'Basic Home Theater System Automation, Basic Lights Automation', 'Premium Home Theater System with Multi-Room Integration, Advanced Lights Automation', 'Immerse in a seamless experience with a Luxurious Home Theater System featuring Full Home Integration and Voice-Controlled Automation for Lights, Climate, and Entertainment.', 1),
(126, 'Multipurpose Room', 'Seating', 'Basic Sofa Set or Sofa Cum Bed &/or Standard Recliners, Simple Modular Seating, Basic Floor Cushions', 'Premium Sofa Set with Custom Upholstery &/or Designer Recliners, Advanced Modular Seating with Storage, Premium Floor Cushions', 'Experience unrivaled comfort with a Luxury Sofa Set featuring Smart Features, Motorized Recliners, and High-End Modular Seating Systems, complemented by Designer Floor Cushions.', 1),
(127, 'Multipurpose Room', 'Storage Solutions', 'Basic Built-In Shelves, Standard Cabinets, Simple Multipurpose Storage, Basic Open Racks', 'Customized Built-In Shelves, Designer Cabinets, Premium Multipurpose Storage with Pull-Out Systems, Modern Open Racks', 'Reimagine your storage with Luxury Solutions including High-End Finishes, Hidden Storage with Motorized Access, and Custom Shelves with LED Lighting.', 1),
(128, 'Multipurpose Room', 'Ceiling & Lighting', 'Basic False Ceiling, Standard Light Effects, Simple Recessed Lighting, Basic Task Lighting, Standard Mood Lighting', 'Designer False Ceiling, Advanced Light Effects, Premium Recessed Lighting, Designer Task Lighting, Enhanced Mood Lighting', 'Illuminate your space with a Luxury False Ceiling featuring Artistic Design, High-End Mood Lighting Systems with Automation, and Advanced Task Lighting with Smart Controls.', 1),
(129, 'Multipurpose Room', 'Furniture & Decor', 'Basic Foldable Table, Simple Convertible Furniture, Standard Wall Paneling or Texture Paint', 'Designer Foldable Table, High-Quality Convertible Furniture, Premium Wall Paneling or Custom Texture Paint', 'Elevate your decor with a Luxury Foldable Table with Smart Mechanisms, High-End Convertible Furniture, and Luxury Wall Paneling with Custom Textures.', 1),
(130, 'Multipurpose Room', 'Electrical Work', 'Basic Plug Points, Standard Switches, Basic USB Charging Points, Simple Hidden Wiring for AV Equipment', 'Designer Plug Points and Switches with Smart Features, High-Quality USB Charging Points, Advanced Hidden Wiring for AV Equipment', 'Upgrade your electrical setup with a Luxury Electrical System featuring Complete Smart Home Integration, High-End USB Charging Points with Fast-Charging Options, and Specialized Wiring for Home Automation.', 1),
(131, 'Multipurpose Room', 'Painting', 'Standard Wall Painting, Simple Chalkboard Walls, Basic Accent Walls', 'Premium Wall Painting with Textured Finishes, Designer Chalkboard Walls, High-End Accent Walls', 'Transform your walls with Luxury Painting featuring Custom Artwork, Personalized Chalkboard Walls, and Artistic Accent Walls.', 1),
(132, 'Multipurpose Room', 'Automation', 'Basic Lights Automation, Basic Blinds Automation, Standard Motorized Furniture', 'Advanced Lights Automation with Smart Controls, Premium Blinds Automation, High-End Motorized Furniture', 'Control your environment with a Luxury Home Automation System featuring Voice Control, Custom Motorized Furniture with Memory Settings, and Smart Blinds with Voice Activation.', 1),
(133, 'Reception Area', 'Seating', 'Reception Desk, Visitor Chairs, Lounge Seating', 'Designer Reception Desk, Cushioned Visitor Chairs, Sofa', 'Custom-Made Desk, Ergonomic Chairs, Premium Sofa Set', 2),
(134, 'Reception Area', 'Storage', 'File Cabinets, Display Shelves, Brochure Holders', 'Laminated Cabinets, Wall-Mounted Shelves, Acrylic Holders', 'Veneer-Finished Cabinets, Glass Shelves, Branded Holders', 2),
(135, 'Reception Area', 'Ceiling & Lighting', 'Pendant Lights, Recessed Lighting, Accent Lights', 'Designer Pendant Lights, Cove Lighting, LED Spotlights', 'Smart Lighting, Chandelier, Dimmable Cove & Hidden RGB Lighting', 2),
(136, 'Reception Area', 'Furniture', 'Coffee Table, Side Tables, Waiting Benches', 'Center Table with Storage, Designer Side Tables', 'Italian Marble Table, Contemporary Designer Furniture', 2),
(137, 'Reception Area', 'Electrical Work', 'Power Outlets, Charging Stations, USB Ports', 'Modular Switches, Concealed Wiring, Surge-Protected Outlets', 'Smart Switches, Wireless Charging Zones, Touch Panels', 2),
(138, 'Reception Area', 'Painting', 'Wall Paint, Artwork, Accent Walls', 'Texture Painting, Framed Wall Art, Feature Wall', 'Italian Paint Finish, 3D Wall Paneling, Customized Art Installation', 2),
(139, 'Reception Area', 'Civil Changes', 'Flooring, Partition Walls, Signage', 'Laminated Flooring, Glass Partition with Frost Film', 'Italian Tiles/Marble Flooring, Acoustic Glass Partition, LED Signage', 2),
(140, 'Reception Area', 'Air Conditioning', 'Climate Control, Air Vents, Thermostats', 'Split AC with Remote Thermostat', 'Centralized HVAC with Smart Controls and Diffusers', 2),
(141, 'Reception Area', 'Miscellaneous', 'Plants, Decorative Items, Magazines', 'Indoor Planters, Decorative Vases, Branded Magazine Holders', 'Premium Indoor Landscaping, Sculptures, Digital Magazine Display', 2),
(143, 'Waiting Area', 'Seating', 'Sofas, Coffee Tables, Lounge Chairs', 'Fabric Sofas, Wooden Coffee Table, Designer Lounge Chairs', 'Leather Sofas, Marble-Top Tables, Ergonomic Recliner Lounge Chairs', 2),
(144, 'Waiting Area', 'Storage', 'Magazine Racks, Shelves, Coat Hooks', 'Wall-Mounted Racks, Designer Open Shelves, Metal Coat Hooks', 'Built-in Magazine Wall, Floating Designer Shelves, Sensor-Based Hangers', 2),
(145, 'Waiting Area', 'Ceiling & Lighting', 'Overhead Lighting, Accent Lighting', 'Pendant Light Fixtures, LED Accent Lights', 'Chandelier, Smart Dimmable Lighting, Cove Lights with Mood Settings', 2),
(146, 'Waiting Area', 'Miscellaneous', 'Art Pieces, Indoor Plants, Refreshment Station', 'Framed Artwork, Potted Plants, Compact Beverage Table', 'Curated Art Gallery Wall, Green Wall/Planter Units, Smart Refreshment Counter', 2),
(148, 'Open Workspace', 'Seating', 'Desks, Ergonomic Chairs, Collaborative Tables', 'Modular Desks, Mesh Ergonomic Chairs, Writable Collaborative Tables', 'Height-Adjustable Desks, Executive Ergonomic Chairs, Designer Collaboration Pods', 2),
(149, 'Open Workspace', 'Storage', 'Shared Cabinets, Personal Lockers, Bookcases', 'Sliding Cabinets, Digital Lockers, Modern Bookcases', 'Concealed Storage, RFID Lockers, Custom Bookshelf Walls', 2),
(150, 'Open Workspace', 'Ceiling & Lighting', 'Task Lighting, Natural Light Solutions', 'Linear LED Lighting, Skylight Panels', 'Smart Lighting System, Acoustic Ceiling Panels, Daylight Simulation Lights', 2),
(151, 'Open Workspace', 'Electrical Work', 'Power Outlets, USB Charging Stations, Data Ports', 'Under-Desk Power Strips, Wireless Chargers', 'Integrated Power Docks, Smart Charging Stations, Cable-Free Layout', 2),
(152, 'Open Workspace', 'Air Conditioning', 'Ventilation Systems, Climate Control', 'Split Units, Air Purifiers', 'VRV Systems, Zone-Wise Climate Management, Motion-Based Vents', 2),
(153, 'Open Workspace', 'Miscellaneous', 'Whiteboards, Indoor Plants, Collaboration Tools', 'Digital Whiteboards, Potted Greens, Brainstorming Wall Tools', 'Touch-Screen Collaboration Boards, Vertical Gardens, AI Meeting Schedulers', 2),
(155, 'Cubicle', 'Seating', 'Desk Chair, Ergonomic Accessories, Stools', 'Mesh Chair, Adjustable Armrests, Footrests', 'Memory Foam Chairs, Posture Correction Tools, Designer Stool Chairs', 2);
INSERT INTO `room_features` (`id`, `room_type`, `room_item`, `standard_cat`, `premium_cat`, `luxury_cat`, `interior_type`) VALUES
(156, 'Cubicle', 'Storage', 'File Drawers, Desk Organizers, Personal Lockers', 'Soft-Close Drawers, Wall Organizers, RFID Lockers', 'Concealed Storage Panels, Smart Lockers, Designer Wooden Organizers', 2),
(157, 'Cubicle', 'Ceiling & Lighting', 'Desk Lamps, Partition Lighting, Overhead Lights', 'LED Desk Lamps, Integrated Panel Lights', 'Touch-Free Lighting, Voice-Controlled Lights, Natural Light Panels', 2),
(158, 'Cubicle', 'Electrical Work', 'Power Outlets, Charging Ports, Cable Management', 'Pop-Up Outlets, Built-in USB Chargers', 'Wireless Power Solutions, Smart Cable Routing Systems', 2),
(159, 'Cubicle', 'Miscellaneous', 'Personal Decor, Plants, Productivity Tools', 'Framed Prints, Table Plants, Habit Trackers', 'Mini Zen Garden, Designer Indoor Pots, Smart Productivity Dashboards', 2),
(161, 'Private Office', 'Seating', 'Executive Chair, Visitor Chairs, Lounge Chair', 'Premium Leather Chair, Fabric Visitor Chairs, Recliner Chair', 'Ergonomic Reclining Chair, Luxury Visitor Sofas, Designer Lounge Seating', 2),
(162, 'Private Office', 'Storage', 'File Cabinets, Shelves, Bookcases', 'Custom Cabinets, Floating Shelves, Wall Bookcases', 'Hidden Storage, Premium Wood Cabinets, Library-Style Book Wall', 2),
(163, 'Private Office', 'Ceiling & Lighting', 'Recessed Lighting, Task Lighting, Accent Lighting', 'Cove Lighting, Pendant Task Lights, Backlit Panels', 'Smart RGB Lighting, Custom Light Zones, Acoustic Ceiling Features', 2),
(164, 'Private Office', 'Furniture', 'Executive Desk, Coffee Table, Meeting Table', 'Solid Wood Desk, Designer Tables', 'Motorized Standing Desk, Sculptural Coffee Table, Luxury Meeting Setup', 2),
(165, 'Private Office', 'Electrical Work', 'Power Outlets, Charging Stations, Smart Plugs', 'Concealed Wiring, Voice-Controlled Plugs', 'Wireless Charging Surfaces, AI-Controlled Switches', 2),
(166, 'Private Office', 'Painting', 'Wall Paint, Decorative Panels, Accent Wall', 'Texture Paints, Wall Graphics', 'Designer Wallpaper, Acoustic Wall Panels, Themed Artistic Wall', 2),
(167, 'Private Office', 'Civil Changes', 'Flooring, Partition Walls, Soundproofing', 'Laminated Flooring, Acoustic Partition Walls', 'Marble/Hardwood Flooring, Glass Dividers, Full Acoustic Enclosure', 2),
(168, 'Private Office', 'Air Conditioning', 'Climate Control, Air Vents, Ductless Units', 'Split AC with Timer Control', 'Centralized System, App-Based Zone Control', 2),
(169, 'Private Office', 'Automation', 'Lighting Controls, Climate Control', 'Motion Sensors, Timer-Based Automation', 'Voice & App-Controlled Smart Systems, AI Monitoring', 2),
(170, 'Private Office', 'Miscellaneous', 'Art Pieces, Indoor Plants, Bookshelves', 'Curated Art, Indoor Palm Plants, Themed Bookshelves', 'Sculpture Displays, Bonsai Plants, Smart Booksh', 2),
(172, 'Conference Room', 'Seating', 'Chairs, Ergonomic Chairs', 'High-back Chairs, Mesh Ergonomic Chairs', 'Leather Executive Chairs, Recliners', 2),
(173, 'Conference Room', 'Storage', 'Shelving, Cabinets', 'Built-in Cabinets, Soft-Close Shelves', 'Hidden Storage with Panel Finish, Designer Shelves', 2),
(174, 'Conference Room', 'Ceiling & Lighting', 'Recessed Lighting, Pendant Lights', 'Cove Lighting, LED Pendants', 'Smart Lighting, Acoustic Ceilings, Chandelier Fixtures', 2),
(175, 'Conference Room', 'Furniture', 'Conference Table, Side Tables', 'Modular Conference Table, Designer Side Tables', 'Premium Table with In-built Power Ports, Statement Side Units', 2),
(176, 'Conference Room', 'Electrical Work', 'Power Outlets, AV Connections', 'Cable Management Channels, HDMI & USB Ports', 'Touch-Screen AV Setup, Wireless Charging Panels', 2),
(177, 'Conference Room', 'Painting', 'Wall Paint, Accent Wall Finishes', 'Texture Paints, Wall Designs', 'Premium Wall Panels, Acoustic Wall Decor', 2),
(178, 'Conference Room', 'Civil Changes', 'Flooring, Wall Partitions', 'Sound-absorbing Partitions, Vinyl Flooring', 'Hardwood/Granite Flooring, Glass Partitions', 2),
(179, 'Conference Room', 'Air Conditioning', 'Ventilation System, Thermostat', 'Split AC with Zone Control', 'Centralized HVAC with App Integration', 2),
(180, 'Conference Room', 'Automation', 'AV System Controls, Lighting Automation', 'Motion Sensor Lights, Wireless AV System', 'AI-Enabled Voice & App Control, Mood-Based Scene Settings', 2),
(181, 'Conference Room', 'Miscellaneous', 'Acoustic Panels, Room Divider', 'Designer Dividers, Fabric Panels', 'Sliding Acoustic Walls, Artistic Divider Installations', 2),
(183, 'Meeting Room', 'Seating', 'Chairs, Soft Seating', 'Upholstered Chairs, Ergonomic Lounge Chairs', 'Designer Chairs, Adjustable Soft Seating', 2),
(184, 'Meeting Room', 'Storage', 'Cabinets, File Storage', 'Built-in Storage, Push-to-Open Cabinets', 'Hidden Storage with Accent Finishes', 2),
(185, 'Meeting Room', 'Ceiling & Lighting', 'Pendant Lights, Downlights', 'Cove Downlights, Suspended Fixtures', 'Smart Lighting, Custom Accent Ceiling', 2),
(186, 'Meeting Room', 'Furniture', 'Meeting Table, Side Chairs', 'Sleek Round Table, Designer Side Chairs', 'Modular Tables with Tech Integration, Artistic Table Base', 2),
(187, 'Meeting Room', 'Electrical Work', 'Power Sockets, AV System Setup', 'Integrated Power Modules, HDMI Ports', 'Wireless AV Setup, Touchscreen Controls', 2),
(188, 'Meeting Room', 'Painting', 'Wall Paint, Decorative Accents', 'Textured Wall Paint, Minimalist Art', 'Custom Artwork Walls, Fabric Panel Accents', 2),
(189, 'Meeting Room', 'Civil Changes', 'Flooring, Partitioning', 'Soundproof Panels, Designer Flooring', 'Acoustic Glass Partitions, Engineered Wood Flooring', 2),
(190, 'Meeting Room', 'Air Conditioning', 'Air Vents, Climate Control', 'Programmable AC, Smart Vents', 'App-Enabled Climate Zones', 2),
(191, 'Meeting Room', 'Automation', 'AV System Control, Lighting Automation', 'Wireless Presentation System', 'Full AI-Based Automation Suite', 2),
(192, 'Meeting Room', 'Miscellaneous', 'Whiteboard, Pinboards', 'Glass Whiteboard, Magnetic Pinboards', 'Digital Smartboard, Interactive Displays', 2),
(194, 'Boardroom', 'Seating', 'Executive Chairs, Ergonomic Chairs', 'High-Back Padded Chairs, Mesh Ergonomic Seating', 'Premium Leather Chairs with Headrests', 2),
(195, 'Boardroom', 'Storage', 'Cabinets, Shelves', 'Concealed Storage, Wall-Mounted Cabinets', 'Custom-Built Wall Storage with Backlit Panels', 2),
(196, 'Boardroom', 'Ceiling & Lighting', 'Recessed Lighting, Chandeliers', 'Decorative Pendant Lighting, LED Fixtures', 'Custom Chandeliers, Mood-Based Smart Lighting', 2),
(197, 'Boardroom', 'Furniture', 'Large Conference Table, Side Tables', 'Designer Tables with AV Integration', 'Executive Boardroom Table with Power Hubs & Touch Screens', 2),
(198, 'Boardroom', 'Electrical Work', 'Power Sockets, AV Connections', 'Hidden Wiring, HDMI/USB Connectivity', 'Wireless AV + Touch-Based Power Control', 2),
(199, 'Boardroom', 'Painting', 'Wall Paint, Decorative Panels', 'Wallpaper Accents, Sound-Reflective Paints', 'Custom Art Installations, Acoustic Fabric Walls', 2),
(200, 'Boardroom', 'Civil Changes', 'Flooring, Partition Walls', 'Engineered Wood Flooring, Fabric Panels', 'Marble Flooring, Acoustic Timber Walls', 2),
(201, 'Boardroom', 'Air Conditioning', 'Ventilation, Climate Control', 'Split AC, Programmable Thermostat', 'VRV/VRF System with Mobile App Control', 2),
(202, 'Boardroom', 'Automation', 'AV System Automation, Lighting Control', 'Integrated Room Scheduler + Touch Panel Control', 'Voice + App Controlled Full Automation with Facial Recognition', 2),
(203, 'Boardroom', 'Miscellaneous', 'Acoustic Panels, Projector Setup', 'Motorized Screens, Designer Sound Panels', 'Laser Projector Setup, Surround Sound System', 2),
(205, 'Breakout Area', 'Seating', 'Sofas, Lounge Chairs', 'Soft Modular Sofas, Swivel Lounge Chairs', 'Bean Pods, Recliner Sofas, Hammock Seating', 2),
(206, 'Breakout Area', 'Storage', 'Open Shelves, Cabinets', 'Designer Shelving, Low Cabinets', 'Hidden Storage Benches, Modular Wall Units', 2),
(207, 'Breakout Area', 'Ceiling & Lighting', 'Pendant Lighting, Floor Lamps', 'Ambient Ceiling Fixtures, LED Strip Lighting', 'Smart Ceiling Lights, Statement Hanging Lamps', 2),
(208, 'Breakout Area', 'Furniture', 'Coffee Table, Side Tables', 'Designer Tables, Bean Tables', 'Sculptural Coffee Tables, Artistic Multi-Level Tables', 2),
(209, 'Breakout Area', 'Electrical Work', 'Power Outlets, Charging Stations', 'Wireless Chargers, Pop-up Ports', 'Touch-Free Charging Pods, Smart Surface Charging', 2),
(210, 'Breakout Area', 'Painting', 'Wall Paint, Accent Wall', 'Graphic Wall Prints, Texture Paint', 'Artistic Wall Murals, Wood Cladding', 2),
(211, 'Breakout Area', 'Civil Changes', 'Flooring, Partition Walls', 'Vinyl/Engineered Wood Flooring', 'Wooden Slats, Curved Glass Dividers', 2),
(212, 'Breakout Area', 'Air Conditioning', 'Air Vents, Climate Control', 'Smart AC Units', 'Zone-Based App Controlled Airflow', 2),
(213, 'Breakout Area', 'Miscellaneous', 'Indoor Plants, Decorative Elements', 'Hanging Plants, Wall Planters', 'Vertical Garden Wall, Interactive Mood Features', 2),
(215, 'Pantry/Cafeteria', 'Seating', 'Chairs, Dining Benches', 'Cushioned Seating, Bar Stools', 'High-End Caf??-Style Sofas, Designer Dining Pods', 2),
(216, 'Pantry/Cafeteria', 'Storage', 'Cabinets, Shelving Units', 'Pull-Out Cabinets, Built-in Storage', 'Touch-Latch Cabinets, Modular Pantry Systems', 2),
(217, 'Pantry/Cafeteria', 'Ceiling & Lighting', 'Task Lighting, Pendant Lighting', 'Decorative Pendant Lights, Under-Cabinet Lights', 'Smart Lighting Scenes, Designer Ceiling Lights', 2),
(218, 'Pantry/Cafeteria', 'Furniture', 'Dining Tables, Countertops', 'Quartz Countertops, Custom Dining Sets', 'Marble/Granite Counters, Designer Communal Tables', 2),
(219, 'Pantry/Cafeteria', 'Electrical Work', 'Power Outlets, Appliances', 'Concealed Wiring, Smart Sockets', 'Built-in Appliance Modules, App-Controlled Appliances', 2),
(220, 'Pantry/Cafeteria', 'Painting', 'Wall Paint, Decorative Panels', 'Tiled Backsplash, Color-Blocked Paints', 'Designer Wall Tiles, Artistic Wall Coverings', 2),
(221, 'Pantry/Cafeteria', 'Civil Changes', 'Flooring, Partition Walls', 'Anti-skid Vinyl Tiles, Modular Partitions', 'Premium Ceramic Tiles, Openable Glass Partitions', 2),
(222, 'Pantry/Cafeteria', 'Air Conditioning', 'Ventilation, Air Vents', 'Timer-Based Cooling', 'Smart Air Circulation, Fragrance Diffusers', 2),
(223, 'Pantry/Cafeteria', 'Miscellaneous', 'Water Cooler, Refrigerator', 'Built-in Water Station, Mini-Fridge', 'Beverage Dispenser, Automated Coffee Station', 2),
(225, 'Restrooms', 'Seating', 'N/A', 'N/A', 'N/A', 2),
(226, 'Restrooms', 'Storage', 'Basic Cabinets, Open Shelving', 'Modular Cabinets, Closed Shelving', 'Soft-close Cabinets, Sensor-based Storage Units', 2),
(227, 'Restrooms', 'Ceiling & Lighting', 'Recessed Lights, Basic Fixtures', 'Recessed + Vanity Lights with Motion Sensors', 'Designer Vanity Lighting, Cove Lighting with Dimmer Control', 2),
(228, 'Restrooms', 'Furniture', 'Standard Sink Counters, Basic Mirrors', 'Quartz Sink Counters, Framed Mirrors', 'Marble Countertops, Smart Mirrors with Lights/Defoggers', 2),
(229, 'Restrooms', 'Electrical Work', 'Standard Power Outlets, Exhaust Fan', 'Exhaust Fan with Humidity Sensor, GFCI Outlets', 'Smart Exhaust System, Heated Toilet Seat Power Supply', 2),
(230, 'Restrooms', 'Painting', 'Emulsion Wall Paint, Ceramic Tiling', 'Anti-fungal Paint, Designer Tiles', 'Italian Wall Finishes, High-End Wall Cladding', 2),
(231, 'Restrooms', 'Civil Changes', 'Ceramic Tile Flooring, Brick Partitions', 'Anti-slip Tiles, Modular Glass Partitions', 'Premium Stone/Marble, Frameless Glass Partitions', 2),
(232, 'Restrooms', 'Air Conditioning', 'Ventilation Fan', 'Ducted Ventilation with Sensors', 'HVAC Integration with Odor Sensors', 2),
(233, 'Restrooms', 'Miscellaneous', 'Manual Soap Dispensers, Basic Hand Dryers', 'Sensor-Based Soap Dispensers, Jet Hand Dryers', 'Touchless Fixtures, Fragrance Dispensers, Heated Flooring', 2),
(235, 'Storage/Archive Room', 'Storage', 'Metal Racks, Open Shelving', 'Modular Shelving with Labels', 'Lockable Modular Units with Digital Access', 2),
(236, 'Storage/Archive Room', 'Electrical Work', 'Basic Lighting & Plug Points', 'Organized Plug Points, Cable Management', 'Concealed Wiring, Smart Sensors for Power Usage', 2),
(237, 'Storage/Archive Room', 'Lighting', 'Tube Lights or Ceiling Bulbs', 'LED Panel Lights', 'Motion-Sensor Smart Lighting', 2),
(238, 'Storage/Archive Room', 'Ventilation', 'Basic Exhaust/Vent', 'Wall-mounted Ventilation Fans', 'Smart Climate-Controlled Air Circulation', 2),
(239, 'Storage/Archive Room', 'Painting', 'Emulsion Paint', 'Anti-dust, Anti-fungal Paint', 'Epoxy Finish, Scratch-Resistant Paint', 2),
(240, 'Storage/Archive Room', 'Flooring', 'Vinyl or Simple Tiles', 'Anti-slip Vinyl, Durable Tiles', 'Heavy-Duty Industrial Flooring', 2),
(241, 'Storage/Archive Room', 'Security', 'Basic Lock & Key Door', 'Digital Lock with Entry Record', 'Biometric Entry System with Surveillance', 2),
(243, 'Server/IT Room', 'Server Racks', 'Open-Frame Basic Server Racks', 'Closed Cabinet Racks with Ventilation', 'Climate-Controlled Enclosures, Lockable Server Units', 2),
(244, 'Server/IT Room', 'Electrical Work', 'Standard Plug Points, Basic UPS Connection', 'Organized Cabling with Power Management', 'Redundant Power Supply Systems, Server-Specific Distribution', 2),
(245, 'Server/IT Room', 'Cooling System', 'Split AC or Basic Ventilation', 'Precision Cooling Units', 'Intelligent Rack-based Cooling System', 2),
(246, 'Server/IT Room', 'Lighting', 'Tube or LED Ceiling Light', 'Focus Task Lighting', 'Smart Lighting with Motion Sensors', 2),
(247, 'Server/IT Room', 'Flooring', 'Anti-static Vinyl', 'Raised Anti-static Flooring', 'Advanced Raised Flooring with Cable Management', 2),
(248, 'Server/IT Room', 'Security', 'Lock & Key Door, Restricted Entry Sign', 'Digital Lock System', 'RFID Access, CCTV Surveillance, Fire Detection Sensors', 2),
(250, 'Lounge Area', 'Seating', 'Sofas, Basic Lounge Chairs', 'Upholstered Sofas, Ergonomic Lounge Chairs', 'Recliners, Premium Modular Seating with Charging Ports', 2),
(251, 'Lounge Area', 'Storage', 'Open Shelves, Basic Side Tables', 'Closed Cabinets, Designer Side Tables', 'Custom-Built Furniture with Smart Storage', 2),
(252, 'Lounge Area', 'Ceiling & Lighting', 'Pendant Lights, Floor Lamps', 'Designer Hanging Lights, Smart Lamps', 'Chandeliers, Mood Lighting, Voice-Controlled Lights', 2),
(253, 'Lounge Area', 'Furniture', 'Coffee Table, Basic Tables', 'Designer Coffee Tables', 'Statement Furniture with Integrated Technology', 2),
(254, 'Lounge Area', 'Electrical Work', 'Basic Charging Stations, Outlets', 'Fast-Charging USB Ports, Concealed Wiring', 'Wireless Charging Stations, Ambient Lighting Control', 2),
(255, 'Lounge Area', 'Painting', 'Emulsion Paint, Wall Art', 'Designer Paint Finishes, Framed Art', 'Wallpaper or Custom Wall Panels with Art Integration', 2),
(256, 'Lounge Area', 'Civil Changes', 'Wooden Laminate Flooring, Partition Panels', 'Vinyl or Engineered Wood Flooring', 'Hardwood Flooring, Designer Glass Partitions', 2),
(257, 'Lounge Area', 'Air Conditioning', 'Standard Vents, Split AC', 'Centralized Air Vents', 'Climate Zoning with Air Quality Monitoring', 2),
(258, 'Lounge Area', 'Miscellaneous', 'Indoor Plants, Simple Decor', 'Decorative Panels, Mood Boards', 'Live Green Walls, Scent Diffusers, Entertainment Units', 2),
(260, 'Training Room', 'Seating', 'Plastic/Metal Chairs, Training Desks', 'Cushioned Chairs, Foldable Desks', 'Ergonomic Chairs, Modular Desks with Tech Integration', 2),
(261, 'Training Room', 'AV Setup', 'Projector & Screen', 'Smart Projector with HDMI Switch', 'Interactive Smartboard with Touch Control', 2),
(262, 'Training Room', 'Electrical Work', 'Plug Points for Laptops, Basic Wiring', 'Hidden Wiring, Cable Channels', 'Floor-mounted Plug Boxes, Smart Switching', 2),
(263, 'Training Room', 'Lighting', 'Ceiling Lights with Task Focus', 'Adjustable LED Panels, Dimming Options', 'Sensor-Based Mood Lighting', 2),
(264, 'Training Room', 'Painting', 'Emulsion Paint', 'Matte Finish, Writing Surface Paint on Walls', 'Acoustic Paints, Custom Graphics', 2),
(265, 'Training Room', 'Flooring', 'Vinyl or Carpet Tiles', 'Anti-skid Carpet Flooring', 'Premium Wooden or Sound-absorbing Flooring', 2),
(266, 'Training Room', 'Miscellaneous', 'Whiteboard, Noticeboard', 'Digital Notice Screens, Pin-up Boards', 'Acoustic Panels, Soundproofing, Integrated Speakers', 2),
(268, ' Executive Office', 'Seating', 'Executive Chair, Basic Visitor Chairs', 'High-back Executive Chair, Padded Visitor Chairs', 'Ergonomic Leather Chair, Designer Visitor Seating', 2),
(269, ' Executive Office', 'Storage', 'File Cabinets, Open Shelves', 'Modular Cabinets with Locks', 'Premium Veneer Cabinets with Smart Locking', 2),
(270, ' Executive Office', 'Ceiling & Lighting', 'Recessed Lights, Task Lamp', 'LED Panel with Dimmer, Accent Lighting', 'Designer Cove Lighting with Smart Controls', 2),
(271, ' Executive Office', 'Furniture', 'Executive Desk, Coffee Table', 'Laminated Executive Desk, Side Storage Unit', 'Premium Wood Desk with Integrated Tech, Designer Coffee Table', 2),
(272, ' Executive Office', 'Electrical Work', 'Power Outlets, Charging Points', 'Concealed Wiring, USB Charging Ports', 'Wireless Charging, Smart Power Management', 2),
(273, ' Executive Office', 'Painting', 'Emulsion Paint, Decorative Panels', 'Texture Paint, Designer Wall Panels', 'Veneer/Leather Cladding, Acoustic Panels', 2),
(274, ' Executive Office', 'Civil Changes', 'Vitrified Tile Flooring, Basic Partition', 'Wooden Laminate, Acoustic Partition Walls', 'Engineered Wood Flooring, Glass + Acoustic Partition', 2),
(275, ' Executive Office', 'Air Conditioning', 'Split AC or Ceiling Vents', 'Ducted AC with Thermostat', 'Centralized Climate Control with Air Purifiers', 2),
(276, ' Executive Office', 'Automation', 'Manual Controls', 'Basic Smart Controls', 'Full Automation: Lights, Climate, Curtains', 2),
(277, ' Executive Office', 'Miscellaneous', 'Art Prints, Small Indoor Plants', 'Curated Art, Planters', 'Original Art Pieces, Live Plants, Decor Accessories', 2),
(279, 'Managerial Office', 'Seating', 'Manager Chair, Visitor Chairs', 'Adjustable Chairs, Cushioned Visitor Chairs', 'Executive Leather Chair, Designer Visitor Chairs', 2),
(280, 'Managerial Office', 'Storage', 'Basic Cabinets, Wall Shelves', 'Modular Cabinets with Handles', 'Soft-close Cabinets with Glass Fronts', 2),
(281, 'Managerial Office', 'Ceiling & Lighting', 'LED Downlights, Task Lighting', 'Layered Lighting with Spotlights', 'Mood Lighting, Designer Pendant Lights', 2),
(282, 'Managerial Office', 'Furniture', 'Standard Desk, Side Table', 'Wood-laminated Desk, Premium Side Unit', 'Custom Desk with Tech Features, Designer Side Table', 2),
(283, 'Managerial Office', 'Electrical Work', 'Basic Power Outlets, Open Cable Tray', 'Concealed Wiring, Organized Sockets', 'Pop-up Sockets, Smart Charging Solutions', 2),
(284, 'Managerial Office', 'Painting', 'Standard Emulsion Paint', 'Textured Wall Finish, Framed Prints', 'Designer Wallpaper or Panels, Integrated Display Wall', 2),
(285, 'Managerial Office', 'Civil Changes', 'Ceramic Tile Flooring, Dry Partition', 'Engineered Wood, Modular Partition', 'Acoustic Glass Partitions, Premium Flooring', 2),
(286, 'Managerial Office', 'Air Conditioning', 'Split AC, Ceiling Vents', 'Thermostat-based Control', 'Central AC with Individual Zoning', 2),
(287, 'Managerial Office', 'Miscellaneous', 'Indoor Plants, Framed Art', 'Planter Boxes, Wall Graphics', 'Designer Decor, Acoustic Artwork Panels', 2),
(289, 'Collaboration Zones', 'Seating', 'Modular Sofas, Basic Lounge Chairs', 'Modular Loungers, Padded Ottomans', 'Designer Lounge Seating, Recliner Sections', 2),
(290, 'Collaboration Zones', 'Storage', 'Open Shelving, Basic Mobile Storage', 'Modular Mobile Units with Locks', 'Custom Mobile Furniture with Integrated Storage', 2),
(291, 'Collaboration Zones', 'Ceiling & Lighting', 'Pendant Lights, Task Lighting', 'Accent Lights, Recessed Lighting', 'Statement Lighting, Scene-based Smart Lighting', 2),
(292, 'Collaboration Zones', 'Furniture', 'Coffee Tables, Tall Tables', 'Designer Caf?? Tables, Folding Units', 'Signature Tables, High-End Multipurpose Furniture', 2),
(293, 'Collaboration Zones', 'Electrical Work', 'Power Outlets, USB Points', 'Integrated Charging Docks', 'Smart Tables with Wireless Charging', 2),
(294, 'Collaboration Zones', 'Painting', 'Emulsion Paint, Graphic Wall Stickers', 'Painted Murals, Theme Panels', 'Artist Murals, Living Walls, Decorative Installations', 2),
(295, 'Collaboration Zones', 'Civil Changes', 'Wooden Flooring, Movable Wall Dividers', 'Sliding Glass Dividers, Mixed Flooring', 'Acoustic Partitions, Designer Tiles or Wood Mix', 2),
(296, 'Collaboration Zones', 'Miscellaneous', 'Potted Plants, Branded Decor', 'Hanging Plants, Mood Boards', 'Art Installations, Mood-Driven Decor', 2),
(298, 'Workstation', 'Seating', 'Ergonomic Basic Chairs', 'Adjustable Ergonomic Chairs', 'Executive Mesh Chairs with Lumbar Support', 2),
(299, 'Workstation', 'Storage', 'Under-desk Drawers, Basic Lockers', 'Mobile Pedestal Units', 'Smart Lockers with Personal Access', 2),
(300, 'Workstation', 'Ceiling & Lighting', 'Task Lighting, Overhead LED Fixtures', 'Layered Lighting, Individual Lights', 'Human-centric Smart Lighting', 2),
(301, 'Workstation', 'Furniture', 'Basic Work Desks, Standard Dividers', 'Modular Desks with Cable Channels', 'Height Adjustable Desks, Acoustic Panels in Dividers', 2),
(302, 'Workstation', 'Electrical Work', 'Plug Points, Open Cable Tray', 'Concealed Cables, USB Points', 'Smart Desks with Power Ports, Pop-up Sockets', 2),
(303, 'Workstation', 'Painting', 'Emulsion or Oil-bound Paint', 'Texture/Pattern Paint, Branding Elements', 'Interactive Wall Panels or Writable Paint', 2),
(304, 'Workstation', 'Civil Changes', 'Vinyl or Tile Flooring', 'Laminate Wood Look Flooring', 'Anti-fatigue Mats or Premium Wooden Finish', 2),
(305, 'Workstation', 'Miscellaneous', 'Basic Desk Organizers, Small Planters', 'Branded Stationery, Personal Board', 'Noise-Canceling Pods, Desk Wellness Accessories', 2),
(307, 'Phone Booth', 'Seating', 'Basic Chair or Stool', 'Cushioned Ergonomic Chair', 'Designer Acoustic Chair', 2),
(308, 'Phone Booth', 'Storage', 'Open Shelf', 'Mini Drawer Unit', 'Built-in Organizer with Charging Cradle', 2),
(309, 'Phone Booth', 'Ceiling & Lighting', 'Recessed LED Lighting', 'Soft Glare-Free Lighting', 'Adjustable Mood Lighting with Dimming', 2),
(310, 'Phone Booth', 'Electrical Work', 'Power Outlet, Minimal Soundproofing', 'USB + Power Outlet, Moderate Soundproofing', 'Full Acoustic Isolation, Ventilation Fan, Smart Switches', 2),
(311, 'Phone Booth', 'Painting', 'Emulsion Paint, Acoustic Foam', 'Designer Acoustic Panels', 'Fabric or Wood Acoustic Panels with Branding', 2),
(312, 'Phone Booth', 'Civil Changes', 'Vinyl or Laminate Flooring, Dry Partitions', 'Modular Soundproof Panels', 'Acoustic Pods, Glass Doors with Branding', 2),
(313, 'Phone Booth', 'Miscellaneous', 'Phone Stand, Privacy Curtain', 'Acoustic Curtain, Whiteboard', 'Screen with AV Calling Support, Sound Masking Systems', 2),
(315, 'Printing/Copy Room', 'Storage', 'Open Shelves, Basic Cabinets', 'Laminated Cabinets with Locks', 'Custom Modular Storage with Cable Management', 2),
(316, 'Printing/Copy Room', 'Ceiling & Lighting', 'LED Task Light', 'Recessed Lighting with Diffuser', 'Motion-Sensor Smart Lighting', 2),
(317, 'Printing/Copy Room', 'Furniture', 'Laminate Countertops, Basic Printer Stands', 'Premium Countertops, Sturdy Stands', 'Built-in Printer Station with Cable Trays', 2),
(318, 'Printing/Copy Room', 'Electrical Work', 'Plug Points, Printer Sockets', 'Organized Cable Trays, USB Ports', 'Smart Power Management, Hidden Wiring', 2),
(319, 'Printing/Copy Room', 'Painting', 'Basic Emulsion Paint', 'Wipeable Semi-Gloss Paint', 'Designer Wall Finish or Branding Elements', 2),
(320, 'Printing/Copy Room', 'Civil Changes', 'Vinyl or Ceramic Tile Flooring', 'Laminate or Anti-Static Flooring', 'Scratch-Resistant Premium Flooring', 2),
(321, 'Printing/Copy Room', 'Miscellaneous', 'Basic Supplies Area, Dustbin', 'Organized Stationery, Paper Sorting Bin', 'Integrated Recycling Unit with Smart Sorting', 2),
(323, 'Locker Area', 'Storage', 'Personal Lockers, Basic Cabinets', 'Modular Lockers with Number Tags', 'Digital Lockers with Biometric/Code Access', 2),
(324, 'Locker Area', 'Ceiling & Lighting', 'Basic LED Fixtures', 'Recessed Lighting with Motion Sensor', 'Cove Lighting with Presence Detection', 2),
(325, 'Locker Area', 'Electrical Work', 'Wall-mounted Plug Points', 'Concealed Outlets for Charging', 'Smart Charging Lockers', 2),
(326, 'Locker Area', 'Painting', 'Wall Emulsion', 'Satin Finish or Texture Paint', 'Designer Wall Graphics or Wallpapers', 2),
(327, 'Locker Area', 'Civil Changes', 'Tile or Vinyl Flooring', 'Anti-skid Textured Flooring', 'Premium Wooden or Stone-look Flooring', 2),
(328, 'Locker Area', 'Miscellaneous', 'Wayfinding Signs', 'Digital Signage', 'Interactive Lock Allocation Kiosk', 2),
(330, 'Utility Room', 'Storage', 'Steel Shelving, Open Cabinets', 'Lockable Utility Cabinets', 'Modular Storage System with Inventory Tags', 2),
(331, 'Utility Room', 'Electrical Work', 'Circuit Breakers, Plug Points', 'Backup Power Panel, Organized Wiring', 'UPS Integration, Fireproof Panels, Smart Load Controls', 2),
(332, 'Utility Room', 'Miscellaneous', 'Cleaning Supplies, Tool Rack', 'Labeled Compartments for Tools & Cleaning', 'RFID Tagged Tools, Smart Inventory System', 2),
(334, 'Fitness/Wellness Room', 'Equipment', 'Treadmill, Dumbbells, Yoga Mats', 'Multi-gym Station, Smart Mats', 'Branded Fitness Gear, VR Integration, Interactive Equipment', 2),
(335, 'Fitness/Wellness Room', 'Flooring', 'Rubber Mats, Non-slip Vinyl', 'Professional Rubberized Flooring', 'Shock-absorbing, Noise-Controlled Floor System', 2),
(336, 'Fitness/Wellness Room', 'Air Conditioning', 'Ceiling Fans, Wall AC', 'Split AC with Timer Control', 'Central Climate System with Air Purifier', 2),
(337, 'Fitness/Wellness Room', 'Miscellaneous', 'Water Dispenser, Mirrors, Towels', 'Smart Mirror, Storage Rack for Gear', 'Digital Wall Mirrors with Workout Assistant, Aroma Diffusers', 2),
(339, 'Corridor and Hallway', 'Flooring', 'Carpet Tiles or Vinyl', 'Designer Vinyl or Laminate', 'Natural Stone or Premium Engineered Flooring', 2),
(340, 'Corridor and Hallway', 'Lighting', 'Ceiling Lights, Emergency Lights', 'Recessed Spotlights, Ambient Wall Lighting', 'Designer Wall Sconces, Smart Light Control System', 2),
(341, 'Corridor and Hallway', 'Miscellaneous', 'Basic Signage, Framed Artwork', 'Custom Signboards, Murals', 'Digital Wayfinding Displays, Art Installations', 2),
(342, 'Corridor and Hallway', 'Wall Treatments', 'Basic Wall Panels, Painted Walls', 'Laminate Paneling, Acoustic Treatment', 'Designer Wall Cladding, Mirror Walls, Custom Murals', 2),
(343, 'Corridor and Hallway', 'Seating', 'Benches, Basic Built-ins', 'Cushioned Seating with Storage Below', 'Upholstered Niche Seating, Designer Waiting Pods', 2),
(344, 'Corridor and Hallway', 'Storage', 'Shoe Racks, Open Cabinets', 'Hidden Cabinetry in Wall Panels', 'Smart Storage Walls with RFID-controlled Access', 2),
(345, 'Corridor and Hallway', 'Electrical Work', 'Switches, Plug Points', 'Concealed Wiring, USB Points', 'Wireless Charging Points, Smart Panel Controls', 2),
(346, 'Corridor and Hallway', 'Security', 'Basic CCTV, Lockable Doors', 'Keycard Access, Motion Sensor Cameras', 'Integrated Biometric Access, Smart Surveillance with Face Recognition', 2),
(347, 'Corridor and Hallway', 'Ceiling Treatments', 'False Ceiling with Basic Lights', 'Cove Lighting, Acoustic Panels', 'Designer Ceiling with Motion Sensing Lights', 2),
(348, 'Corridor and Hallway', 'Ventilation', 'Ceiling or Wall Fans', 'Split AC, Air Circulation Units', 'Smart Climate Zoning, Filtered Fresh Air Supply', 2),
(350, 'Air Conditioning Room', 'Equipment', 'Basic AC Units, Standard Filters, Control Switches', 'Split/VRF Units, HEPA Filters, Digital Control Panels', 'Central HVAC System, Smart Air Quality Monitors, Advanced Control Panels', 2),
(351, 'Air Conditioning Room', 'Electrical Work', 'Power Supply, Circuit Panels', 'Organized Panel Boards, Auto-Switching System', 'Smart Energy Monitoring, Integrated Fire Safety Cut-Offs', 2),
(352, 'Air Conditioning Room', 'Miscellaneous', 'Basic Tool Set, Spare Filters', 'Maintenance Rack, Tool Storage, Spare Compressor Parts', 'Sensor-Based Inventory, Remote Maintenance Access', 2),
(354, 'Power Backup Room', 'Equipment', 'Basic UPS, Small Generator, Lead-Acid Batteries', 'Online UPS, Diesel Generator, Lithium Batteries', 'Integrated UPS-Genset System, Smart Battery Monitoring', 2),
(355, 'Power Backup Room', 'Electrical Work', 'Basic Circuit Breakers, Power Panel', 'Structured Panels with Surge Protectors', 'Fully Automated Backup System with Load Sharing', 2),
(356, 'Power Backup Room', 'Miscellaneous', 'Safety Kit, Maintenance Tools', 'Insulated Safety Equipment, SOP Boards', 'Smart Safety Equipment, Touchscreen Control with Alerts', 2),
(358, 'Security/Control Room', 'Equipment', 'CCTV Monitors, Alarm Systems, Basic Control Unit', 'IP Camera Control, Multi-Screen Display, Biometric Alarm Panels', 'AI Surveillance, Facial Recognition, Command Center Setup', 2),
(359, 'Security/Control Room', 'Electrical Work', 'Power Supply, Phone Lines, Internet Cables', 'Structured Cabling, Dedicated Server Cabinet', 'Fiber Network, Smart Grid UPS, Signal Booster Systems', 2),
(360, 'Security/Control Room', 'Miscellaneous', 'Security SOPs, Emergency Numbers', 'Alarm Protocol File, Emergency Drill Kits', 'Live Monitoring Dashboard, Automated Incident Log System', 2),
(362, 'Housekeeping Room', 'Storage', 'Basic Cleaning Supplies, Mop Rack, Bucket Area', 'Modular Shelving, Labelled Racks, Cleaning Trolley', 'Vertical Storage System, Digital Stock Counter', 2),
(363, 'Housekeeping Room', 'Electrical Work', 'Basic Power Sockets, Manual Sink', 'Dedicated Charging Station, Hand Wash Units', 'Smart Tap Systems, Heated Water Outlet, Odor Extraction Fan', 2),
(364, 'Housekeeping Room', 'Miscellaneous', 'Manual Schedules, Dustbins', 'Digital Inventory Printouts, Color-Coded Tools', 'Inventory App Access, Maintenance Logs, Safety Sensor Integration', 2),
(366, 'Waste Disposal Room', 'Storage', 'Basic Dustbins, Separate Recycle Bins', 'Sealed Containers, Color-Coded Waste Bins', 'Smart Waste Segregation Units, Odor-Control Bins', 2),
(367, 'Waste Disposal Room', 'Miscellaneous', 'Manual Cleaning Supplies, Gloves', 'Labeled Hazard Kits, Cleaning Gear Cabinet', 'Auto-Sanitizing Stations, Fireproof Disposal Units', 2),
(369, 'Locker Room/Employee Storage', 'Storage', 'Metal Lockers, Wall Shelves', 'Laminated Lockers, Personal Storage Compartments', 'Digital Lockers with Charging Ports, RFID Access Units', 2),
(370, 'Locker Room/Employee Storage', 'Miscellaneous', 'Benches, Open Space for Bags', 'Changing Zone with Hooks, Personal Organizers', 'Separate Male/Female Zones, Seating Pods, Smart Locker Control System', 2),
(372, 'Fire Control Room', 'Equipment', 'Fire Alarm Panel, Extinguishers, Blankets', 'Smoke Detectors, Water Mist Systems, Emergency Buttons', 'AI Fire Response System, Thermal Cameras, Foam Suppression Panel', 2),
(373, 'Fire Control Room', 'Electrical Work', 'Manual Control Panel, Power Backup', 'Auto Shutdown with Power Override, Emergency Lights', 'Full BMS Integration, Smart Notification System', 2),
(374, 'Fire Control Room', 'Miscellaneous', 'Printed Protocols, Training Board', 'Fire Drill Plans, Log Books, Wall Signage', 'Interactive Fire Training Simulator, E-Learning Access Station', 2),
(376, 'Basic Construction Setup', 'Marking / Excavation', 'Manual Marking, Basic Site Survey', 'Theodolite Survey, Mechanical Excavation', 'Laser Marking, 3D Terrain Mapping, GPS-based Excavation', 3),
(377, 'Basic Construction Setup', 'Soil', 'Basic Soil Testing, Manual Grading', 'Lab Soil Testing Reports, Machine Grading', 'Geo-Technical Report, Soil Stabilization with Additives', 3),
(378, 'Basic Construction Setup', 'Water', 'Borewell Setup, Basic Pipeline', 'Deep Borewell, Pressure Regulated Line', 'Filtration System, Digital Water Level Monitoring', 3),
(379, 'Basic Construction Setup', 'Gas Line', 'Basic Pipeline Installation', 'Regulated Line with Safety Valves', 'Underground Concealed System with Leak Detectors', 3),
(380, 'Basic Construction Setup', 'Corporation Pipeline', 'Manual Municipal Line Connection', 'Proper Enclosure, Pre-tested Water Connection', 'Smart Water Meter, Concealed Entry System', 3),
(381, 'Basic Construction Setup', 'Plumbing', 'Temporary Overground Lines, Basic Drain Setup', 'Underground Temporary Lines, Anti-Clog Design', 'Sealed Lines, Pre-installed Smart Sensors', 3),
(382, 'Basic Construction Setup', 'Boring Installation', 'Standard Borewell Drilling, GI Pipes', 'PVC Piping, Depth Regulation System', 'Steel Casing, Digital Borewell Monitoring', 3),
(383, 'Basic Construction Setup', 'Temporary Shed for Material Stora', 'Basic Tin Shed with Poles', 'Metal Framed Shed, Side Wall Enclosure', 'Prefab Shed, Weatherproofing, Anti-theft Locks', 3),
(384, 'Basic Construction Setup', 'Temporary Shed for Guard Room', 'Wooden or Tin Room with Fan', 'Ventilated Room with Electricity', 'Air-Conditioned Cabin, CCTV Monitor, Biometric Access', 3),
(385, 'Basic Construction Setup', 'Electrical Work', 'Manual Power Lines, Open Wiring', 'Concealed Cabling, Distribution Board', 'Smart Energy Panel, App-Based Control', 3),
(386, 'Basic Construction Setup', 'Temporary CCTV Connection', 'Basic Camera Installation, Wired Monitoring', 'Wi-Fi Enabled Cameras, DVR System', 'Cloud Storage, Motion Sensors, AI Monitoring Panel', 3),
(387, 'Basic Construction Setup', 'Tools & Equipment', 'Manual Tools, Basic Excavators', 'Advanced Tools, Hydraulic Equipment', 'Fully Automated Equipment, Remote-Controlled Machines', 3),
(388, 'Basic Construction Setup', 'Safety Equipment', 'Helmets, Safety Vests, Gloves', 'Safety Jackets, Goggles, First Aid Box', 'Smart Helmets, Gas Detectors, Emergency Response Kit', 3),
(390, 'Compound Wall', 'Construction ??? Concrete Contrac', 'Manual Labor, Basic Equipment', 'Skilled Labor, Mechanical Equipment', 'Automated Machinery, High Precision Casting', 3),
(391, 'Compound Wall', 'Steel / Reinforcement', 'Basic Rebar Placement, Standard Mesh', 'Higher Grade Rebars, Rust-Resistant Mesh', 'Earthquake-Resistant Steel, Custom Mesh Designs', 3),
(392, 'Compound Wall', 'Electrical Work', 'Open Wiring for Basic Needs', 'Concealed Conduits, Weatherproof Outlets', 'Smart Wiring System, Automation-Ready Panels', 3),
(393, 'Compound Wall', 'Drainage', 'One-point outlet', 'Sloped floor', 'Underground water harvesting drain', 3),
(394, 'Compound Wall', 'Plumbing (if any)', 'Basic drainage pipework', 'Internal drain points', 'Concealed & noise-insulated plumbing (if dry/wet bar planned)', 3),
(396, 'Compound Wall', 'Post-Construction ??? Painting', 'Exterior Grade Paint, Basic Finish', 'Weatherproof Paint, Dual Coating', 'Texture Coating, Anti-Dust, UV-Resistant Designer Finishes', 3),
(397, 'Compound Wall', 'Lighting & Fixtures', 'Basic Wall Fixtures, CFL/LED Lights', 'Designer LED Fixtures, Motion Sensor Lights', '', 3),
(398, 'Compound Wall', 'Accessories', 'Standard Name Plate, Doorbell', 'Designer House Number Plate, Intercom System', 'Customized Steel/Brass Plates, Video Doorbell, Integrated Access System', 3),
(400, 'Garden', 'Land Preparation', 'Manual leveling', 'Mechanical grading & soil mix', 'Soil testing, grading, drainage setup', 3),
(401, 'Garden', 'Soil Work', 'Topsoil layer', 'Enriched compost mix', 'Custom layers for plants, root barriers', 3),
(402, 'Garden', 'Pathway Setup', 'Gravel or plain stone', 'Interlocking tiles', 'Natural stone/engraved paths', 3),
(403, 'Garden', 'Fencing/Borders', 'Brick or wire fencing', 'Decorative wooden/metal', 'Designer panels, vertical gardens', 3),
(404, 'Garden', 'Drainage', 'One-point outlet', 'Sloped floor', 'Underground water harvesting drain', 3),
(405, 'Garden', 'Plumbing (if any)', 'Basic drainage pipework', 'Internal drain points', 'Concealed & noise-insulated plumbing (if dry/wet bar planned)', 3),
(406, 'Garden', 'Water Features (Base)', 'NA', 'Pre-cast fountain', 'Custom-designed pond/fountain', 3),
(407, 'Garden', 'Irrigation System', 'Manual watering', 'Drip irrigation', 'Fully automated with moisture sensors', 3),
(408, 'Garden', 'Electrical Work', 'Open Wiring for Basic Needs', 'Concealed Conduits, Weatherproof Outlets', 'Smart Wiring System, Automation-Ready Panels', 3),
(410, 'Garden', 'Planting', 'Grass, few shrubs', 'Ornamental plants', 'Landscape-zoned plantation', 3),
(411, 'Garden', 'Lighting & Fixtures', 'Pole light', 'LED spike lights', 'App-controlled smart lighting', 3),
(412, 'Garden', 'Furniture', 'Stone bench', 'Pergola seating', 'Lounge, swings, garden dining set', 3),
(413, 'Garden', 'Decor Add-ons', 'NA', 'Planters, garden sculptures', 'Wall art, themed garden accessories', 3),
(415, 'Car Parking Area', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(416, 'Car Parking Area', 'Flooring/Base', 'Cement finish', 'Weatherproof tiles', 'Designer stamped concrete or granite', 3),
(417, 'Car Parking Area', 'Roof Structure', 'None or metal shed', 'Covered parking with tile/roofing sheet', 'Pergola with retractable or solar roofing', 3),
(418, 'Car Parking Area', 'Drainage', 'One-point outlet', 'Sloped floor', 'Underground water harvesting drain', 3),
(419, 'Car Parking Area', 'Plumbing (if any)', 'Basic drainage pipework', 'Internal drain points', 'Concealed & noise-insulated plumbing (if dry/wet bar planned)', 3),
(420, 'Car Parking Area', 'Wiring Setup', 'Basic wiring', 'EV plug point', 'Dedicated EV station with surge protection', 3),
(422, 'Car Parking Area', 'Lighting & Fixtures', 'Wall light', 'Ceiling LEDs', 'Motion sensor lights', 3),
(423, 'Car Parking Area', 'Paint/Markings', 'NA', 'Basic car bay markings', 'Customized painted bays', 3),
(424, 'Car Parking Area', 'Security Features', 'NA', 'Basic lock gate', 'CCTV camera, smart sensors', 3),
(425, 'Car Parking Area', 'Wall Painting', 'Exterior Grade Paint, Basic Finish', 'Weatherproof Paint, Dual Coating', 'Texture Coating, Anti-Dust, UV-Resistant Designer Finishes', 3),
(427, 'Two-Wheeler Parking Area', 'Base/Flooring', 'Concrete or stone', 'Anti-skid tiles', 'Designer tile with rain runoff slopes', 3),
(428, 'Two-Wheeler Parking Area', 'Roof Setup', 'Tin or polycarbonate', 'Metal frame', 'Designer canopy with UV protection', 3),
(429, 'Two-Wheeler Parking Area', 'Drainage', 'Basic floor slope', 'Pipe drain', 'Rainwater trench system', 3),
(430, 'Two-Wheeler Parking Area', 'Plumbing (if any)', 'Basic drainage pipework', 'Internal drain points', 'Concealed & noise-insulated plumbing (if dry/wet bar planned)', 3),
(431, 'Two-Wheeler Parking Area', 'Electrical Work', 'Manual Power Lines, Open Wiring', 'Concealed Cabling, Distribution Board', 'Smart Energy Panel, App-Based Control', 3),
(433, 'Two-Wheeler Parking Area', 'Lighting & Fixtures', 'One bulb', 'LED spotlights', 'Smart auto-sensor lights', 3),
(434, 'Two-Wheeler Parking Area', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(435, 'Two-Wheeler Parking Area', 'Security', 'NA', 'Wall hooks', 'CCTV & smart lock holders', 3),
(436, 'Two-Wheeler Parking Area', 'Wall Painting', 'Exterior Grade Paint, Basic Finish', 'Weatherproof Paint, Dual Coating', 'Texture Coating, Anti-Dust, UV-Resistant Designer Finishes', 3),
(437, 'Two-Wheeler Parking Area', 'Paint/Markings', 'NA', 'Basic car bay markings', 'Customized painted bays', 3),
(439, 'Terrace', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(440, 'Terrace', 'Slope Formation', 'Manual slope (1:100) via mortar', 'Screed concrete slope to multiple drain points', 'Laser-level slope with integrated grill outlets', 3),
(441, 'Terrace', 'Waterproofing', 'Cement-based coating (1???2 layers)', 'Bituminous/polymer coating with protective screed', 'PU multi-layer + screed + topcoat with warranty options', 3),
(442, 'Terrace', 'Floor Finishing', 'IPS or budget anti-skid tiles', 'Concrete pavers, vitrified tiles', 'Premium stone, wooden deck, UV & weather-treated designer tiles', 3),
(443, 'Terrace', 'Parapet Wall', 'Cement plastered brick wall (3 ft)', 'Brick wall with tile cladding and coping', 'RCC/brick wall with designer railing, cladding, or planter top', 3),
(444, 'Terrace', 'Railing Installation', 'MS powder-coated basic railing', 'Decorative metal/glass railing', 'Frameless glass, stainless steel, or custom railings', 3),
(445, 'Terrace', 'Plumbing', '1 water outlet, exposed pipes', 'Multiple taps, concealed lines, drain points', 'Concealed plumbing + drip-ready outlets + terrace sink point', 3),
(446, 'Terrace', 'Electrical', 'One light point, surface conduit', 'Multiple points for lights/fans, outdoor switchboard', 'Concealed wiring, smart-ready panels, outdoor socket enclosures', 3),
(447, 'Terrace', 'Roofing (Optional)', 'Not included or fiber sheet cover', 'Metal/tiled fixed roofing or retractable awning', 'Pergola with polycarbonate, retractable motorized roof, heat insulation', 3),
(448, 'Terrace', 'Drainage System', 'Single point drain, basic pipe to main line', 'Dual or multi-point with SS drain covers, debris catch', 'Custom channel drain, multi-point with anti-clog grills + inspection chambers', 3),
(449, 'Terrace', 'Green Zone Setup', 'Soil beds and movable pots', 'Fixed planters with waterproof base and gravel layering', 'Professional waterproofed garden zone with geotextile, soil mix, and irrigation pipe layout', 3),
(451, 'Terrace', 'Leak & Drain Test', '24???48 hour manual soak test', 'Drain test with outlet inspection and edge scanning', 'Professional hydro test + thermal scan + report', 3),
(452, 'Terrace', 'Lighting & Fixtures', 'One wall light or bulb fixture', 'Ambient lights, ceiling fans, water-resistant fittings', 'Smart lights, concealed lighting, RGB ambient lighting systems', 3),
(453, 'Terrace', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(454, 'Terrace', 'Painting & Wall Finish', 'Cement-based exterior paint', 'Weather-resistant paint with primer', 'Designer texture or stone cladding finishes', 3),
(455, 'Terrace', 'Smart Features (Optional)', 'Not available', 'CCTV & router point provisions', 'Full smart-ready wiring, sensors, smart switches, solar monitoring', 3),
(457, 'Main Gate', 'Gate Structure', 'Manual MS gate', 'Decorative metal/wood gate', 'Motorized designer gate', 3),
(458, 'Main Gate', 'Automation Base', 'NA', 'Basic motor install', 'Smart system wiring, keypad/remote setup', 3),
(459, 'Main Gate', 'Electrical Work', 'Wall bulb', 'Dual fixtures', 'Pillar lights with sensors', 3),
(460, 'Main Gate', 'Security Setup', 'Manual lock', 'Camera at gate', 'Facial recognition/intercom wiring', 3),
(461, 'Main Gate', 'Plumbing (if any)', 'Basic drainage pipework', 'Internal drain points', 'Concealed & noise-insulated plumbing (if dry/wet bar planned)', 3),
(463, 'Main Gate', 'Paint/Coating', 'Enamel paint', 'Powder coated', 'Weatherproof designer coating', 3),
(464, 'Main Gate', 'Name Plate', 'Steel/wood plate', 'Backlit plate', 'LED-lit designer plate', 3),
(465, 'Main Gate', 'Bell System', 'Manual bell', 'Speaker with bell', 'Smart video bell', 3),
(467, 'Entrance Lobby', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(468, 'Entrance Lobby', 'Flooring', 'Vitrified tiles', 'Marble finish tiles or wooden finish tiles', 'Imported marble or onyx with inlay work', 3),
(469, 'Entrance Lobby', 'Wall Base', 'Plaster & paint', 'Stone/wood wall cladding', 'Designer textured panels or CNC-cut backlit cladding', 3),
(470, 'Entrance Lobby', 'Ceiling Setup', 'Simple false ceiling', 'Cove lighting with layered ceiling design', 'Designer false ceiling with ambient & hidden lighting', 3),
(471, 'Entrance Lobby', 'Wiring/Electrical', 'Basic switches & wiring setup', 'Concealed wiring with modular switches', 'Smart wiring with touch panels & automation-ready', 3),
(473, 'Entrance Lobby', 'Lighting & Fixtures', 'Tube light or wall sconce', 'Spotlights, pendant lights, or chandeliers', 'Designer chandelier, ambient floor & wall lighting', 3),
(474, 'Entrance Lobby', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(475, 'Entrance Lobby', 'Main Entrance Door', 'Ready-made flush door with basic polish', 'Teak wood or custom-designed panel door', 'Double-door designer entrance with smart lock & carving', 3),
(476, 'Entrance Lobby', 'Painting', 'Standard emulsion paint', 'Texture paint, wall accents, or wallpaper', 'Luxury wall finishes ??? Italian paint or suede texture', 3),
(477, 'Entrance Lobby', 'Decor/Miscellaneous', 'Simple nameplate, shoe rack', 'Designer nameplate, bench seating, planters', 'Feature wall, artwork niche, customized d??cor panel', 3),
(479, 'Staircase', 'Structure', 'RCC with basic finish', 'RCC with smoother finish, neat edges', 'RCC or steel frame with architectural design', 3),
(480, 'Staircase', 'Flooring/Treads', 'Concrete with basic finish', 'Granite or wooden finish', 'Imported marble, glass steps, or designer wood', 3),
(481, 'Staircase', 'Wall Base', 'Plaster & paint', 'Wall cladding or decorative texture', 'Feature wall with paneling, lighting or art decor', 3),
(482, 'Staircase', 'Wiring', 'Basic wiring for lighting', 'Concealed wiring with switchboards', 'Smart lighting wiring with sensors and control panels', 3),
(484, 'Staircase', 'Wall Base', 'Plaster with paint', 'Textured paint / Wallpaper', 'Designer panels / High-end wall finishes', 3),
(485, 'Staircase', 'Railing', 'MS railing with paint finish', 'SS or glass railing with wooden handrail', 'Designer railing in SS + glass or wrought iron with laser cut patterns', 3),
(486, 'Staircase', 'Lighting & Fixtures', 'Tube lights or basic wall sconces', 'Step lights or pendant lights', 'Motion sensor step lights, chandelier in stairwell', 3),
(487, 'Staircase', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(488, 'Staircase', 'Painting', 'Basic emulsion', 'Wall textures or designer stencil work', 'Italian paint or metallic finishes', 3),
(489, 'Staircase', 'D??cor/Misc.', 'Simple wall art or wall clock', 'Framed art or mirrors', 'Sculptural d??cor, indoor plants in niches', 3),
(491, 'Mudroom', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(492, 'Mudroom', 'Flooring Base', 'Ceramic tiles or vitrified tiles', 'Anti-skid tiles or wooden finish tiles', 'Imported anti-slip stone, designer patterned tiles', 3),
(493, 'Mudroom', 'Wall Base', 'Cement plaster + paint', 'Wall cladding or laminated wall panels', 'Waterproof designer panels or wood accent panels', 3),
(494, 'Mudroom', 'Ceiling', 'Simple plaster ceiling', 'False ceiling with spotlights', 'Designer ceiling with cove lights and wooden accents', 3),
(495, 'Mudroom', 'Wiring', 'Basic power points for lighting', 'Modular switches + concealed wiring', 'Smart switch panel for boot dryers, heated racks, etc', 3),
(496, 'Mudroom', 'Plumbing (if any)', 'Basic drainage pipework', 'Internal drain points', 'Concealed & noise-insulated plumbing (if dry/wet bar planned)', 3),
(498, 'Mudroom', 'D??cor/Painting', 'Simple emulsion finish', 'Accent walls or chalkboard wall for notes', 'Designer wallpaper or textured laminate finishes', 3),
(499, 'Mudroom', 'Lighting & Fixtures', 'Ceiling-mounted LED light or CFL fixture', 'Recessed downlights, under-cabinet lighting for shelves', 'Sensor-based lighting, decorative pendant over seating, accent strip lighting in cabinets', 3),
(500, 'Mudroom', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(501, 'Mudroom', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(503, 'Living Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(504, 'Living Room', 'Wall Construction', 'Brick/block walls, basic alignment', 'AAC blocks, better finish', 'High precision walls, soundproofing options', 3),
(505, 'Living Room', 'Lintel Beam', 'RCC lintel with formwork', 'RCC with better grade steel', 'RCC + concealed utility conduits', 3),
(506, 'Living Room', 'Door/Window Openings', 'Simple cut-outs with wooden/aluminum frames', 'Cut-outs with premium UPVC frames', 'Larger openings, sliding-foldable glass doors', 3),
(507, 'Living Room', 'Flooring Base', 'Cement mortar bed', 'Levelled flooring with waterproofing', 'RCC slab with chemical waterproofing & thermal insulation', 3),
(508, 'Living Room', 'Ceiling RCC Work', 'Flat slab RCC', 'RCC with conduits', 'RCC slab with embedded HVAC or automation duct provision', 3),
(509, 'Living Room', 'Plastering', 'Basic internal plaster', 'Smooth internal plaster', 'Gypsum plaster for smooth premium finish', 3);
INSERT INTO `room_features` (`id`, `room_type`, `room_item`, `standard_cat`, `premium_cat`, `luxury_cat`, `interior_type`) VALUES
(510, 'Living Room', 'Electrical Conduits', 'Surface or semi-concealed PVC conduits', 'Concealed conduits', 'Concealed FRLS conduits + smart-ready cabling', 3),
(512, 'Living Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(513, 'Living Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(514, 'Living Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(515, 'Living Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(516, 'Living Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(517, 'Living Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(518, 'Living Room', 'Curtains/Blinds', 'Standard rod with fabric curtains', 'Roller blinds or dual fabric curtains', 'Motorized blinds, custom drapery with valance', 3),
(520, 'Dining Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(521, 'Dining Room', 'Wall Construction', 'Brick/block walls', 'AAC blockwork', 'Precision masonry with insulation options', 3),
(522, 'Dining Room', 'Lintel Beam', 'Standard RCC lintel', 'RCC with treated steel', 'RCC + smart conduit inclusion', 3),
(523, 'Dining Room', 'Door/Window Openings', 'Cut-outs for doors/windows', 'UPVC or powder-coated aluminum', 'Full-height glazed openings', 3),
(524, 'Dining Room', 'Flooring Base', 'Cement mortar bed', 'Levelled floor with waterproof base', 'Engineered sub-floor for heavy finishes', 3),
(525, 'Dining Room', 'Ceiling RCC Work', 'RCC slab with junction boxes', 'RCC with electrical/lighting provision', 'RCC with ambient and mood lighting ducts', 3),
(526, 'Dining Room', 'Plastering', 'Sand cement plaster', 'Gypsum or POP smooth finish', 'High-finish plaster with embedded design elements', 3),
(527, 'Dining Room', 'Electrical Conduits', 'Exposed/Semi-concealed', 'Concealed wiring setup', 'Full smart system ready conduits with control panels', 3),
(528, 'Dining Room', 'Plumbing (if any)', 'Basic drainage pipework', 'Internal drain points', 'Concealed & noise-insulated plumbing (if dry/wet bar planned)', 3),
(530, 'Dining Room', 'Painting', 'Emulsion paint', 'Satin or semi-gloss finish', 'Imported designer paint or wallpapers', 3),
(531, 'Dining Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(532, 'Dining Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(533, 'Dining Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(534, 'Dining Room', 'Lighting & Fixtures', 'Ceiling light or tube light', 'Pendant lights, ambient lighting', 'Designer chandelier, smart dimmable lighting', 3),
(535, 'Dining Room', 'Door & Windows', 'Wooden panel door, aluminum windows', 'Engineered door, UPVC sliding windows', 'Glass folding panels, designer main door', 3),
(536, 'Dining Room', 'Plumbing Finishes and Fixtures', 'Basic tap, single sink, PVC waste trap', 'Stainless steel sink, branded tap, chrome finish', 'Designer sink, sensor tap, concealed drain, premium metal finishes', 3),
(538, 'Kitchen', 'Structural Framing', 'Designer sink, sensor tap, concealed drain, premium metal finishes', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(539, 'Kitchen', 'Wall Construction', 'Brickwork for counters & partitions', 'AAC block walls', 'Precision walls with insulation & backing for cabinets', 3),
(540, 'Kitchen', 'Lintel Beam', 'RCC lintel', 'Reinforced lintel with better steel', 'RCC with mechanical chases', 3),
(541, 'Kitchen', 'Door/Window Openings', 'Standard cut-outs with aluminum frames', 'Premium UPVC frames', 'Full-size ventilated windows with exhaust provisions', 3),
(542, 'Kitchen', 'Flooring Base', 'Cement floor, basic leveling', 'Waterproofed and screeded floor', 'RCC with double waterproofing + anti-skid base prep', 3),
(543, 'Kitchen', 'Ceiling RCC Work', 'RCC slab', 'RCC slab with embedded piping', 'RCC slab with HVAC ducting options', 3),
(544, 'Kitchen', 'Plastering', 'Cement plaster', 'Smooth POP plaster', 'Moisture-resistant gypsum/putty', 3),
(545, 'Kitchen', 'Electrical Conduits', 'Semi-concealed conduit for lights', 'Concealed wiring + chimney points', 'Smart layout with appliance automation options', 3),
(546, 'Kitchen', 'Plumbing Work', 'Basic water line, sink provision', 'Provision for RO, dishwasher', 'Concealed plumbing with multiple outlet points', 3),
(548, 'Kitchen', 'Painting', 'Emulsion paint', 'Satin or semi-gloss finish', 'Imported designer paint or wallpapers', 3),
(549, 'Kitchen', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(550, 'Kitchen', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(551, 'Kitchen', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(552, 'Kitchen', 'Lighting & Fixtures', 'Ceiling light or tube light', 'Pendant lights, ambient lighting', 'Designer chandelier, smart dimmable lighting', 3),
(553, 'Kitchen', 'Door & Windows', 'Wooden panel door, aluminum windows', 'Engineered door, UPVC sliding windows', 'Glass folding panels, designer main door', 3),
(554, 'Kitchen', 'Plumbing Finishes and Fixtures', 'Basic tap, single sink, PVC waste trap', 'Stainless steel sink, branded tap, chrome finish', 'Designer sink, sensor tap, concealed drain, premium metal finishes', 3),
(556, 'Pantry', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(557, 'Pantry', 'Wall Construction', 'Brickwork for shelves, small partition walls', 'AAC blocks, smooth finish', 'Designer partition walls with moisture protection', 3),
(558, 'Pantry', 'Lintel Beam', 'RCC lintel for door/window', 'RCC with conduit space', 'RCC with integrated lighting or utility chases', 3),
(559, 'Pantry', 'Door/Window Openings', 'Small opening with grill/aluminum frame', 'Ventilated UPVC frame', 'Ventilated designer opening with premium material', 3),
(560, 'Pantry', 'Flooring Base', 'Cement floor base', 'Waterproof screed base', 'Double waterproofing with slope management', 3),
(561, 'Pantry', 'Ceiling RCC Work', 'Flat RCC slab', 'RCC with ceiling conduit for lighting', 'RCC slab with embedded automation panels', 3),
(562, 'Pantry', 'Plastering', 'Basic cement plaster', 'Smooth POP/plaster', 'Moisture-resistant finish', 3),
(563, 'Pantry', 'Electrical Conduits', 'Basic conduit for light', 'Plug points for small appliances', 'Appliance-friendly smart circuits', 3),
(564, 'Pantry', 'Plumbing Work', 'Water point (if required)', 'Small sink plumbing', 'Concealed plumbing with filtration options', 3),
(566, 'Pantry', 'Painting', 'Emulsion paint', 'Satin or semi-gloss finish', 'Imported designer paint or wallpapers', 3),
(567, 'Pantry', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(568, 'Pantry', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(569, 'Pantry', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(570, 'Pantry', 'Lighting & Fixtures', 'Ceiling light or tube light', 'Pendant lights, ambient lighting', 'Designer chandelier, smart dimmable lighting', 3),
(571, 'Pantry', 'Plumbing Finishes and Fixtures', 'Basic tap, single sink, PVC waste trap', 'Stainless steel sink, branded tap, chrome finish', 'Designer sink, sensor tap, concealed drain, premium metal finishes', 3),
(573, 'Utility Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(574, 'Utility Room', 'Wall Construction', 'Brickwork for shelves, small partition walls', 'AAC blocks, smooth finish', 'Designer partition walls with moisture protection', 3),
(575, 'Utility Room', 'Lintel Beam', 'RCC lintel for door/window', 'RCC with conduit space', 'RCC with integrated lighting or utility chases', 3),
(576, 'Utility Room', 'Door/Window Openings', 'Small opening with grill/aluminum frame', 'Ventilated UPVC frame', 'Ventilated designer opening with premium material', 3),
(577, 'Utility Room', 'Flooring Base', 'Cement floor base', 'Waterproof screed base', 'Double waterproofing with slope management', 3),
(578, 'Utility Room', 'Ceiling RCC Work', 'Flat RCC slab', 'RCC with ceiling conduit for lighting', 'RCC slab with embedded automation panels', 3),
(579, 'Utility Room', 'Waterproofing', 'Cement coating', 'Bituminous or acrylic waterproofing', 'Advanced membrane waterproofing system', 3),
(580, 'Utility Room', 'Ventilation', 'Basic ventilator/window', 'Louvered or exhaust fan', 'Automatic dehumidifier, smart exhaust', 3),
(581, 'Utility Room', 'Plastering', 'Basic cement plaster', 'Smooth POP/plaster', 'Moisture-resistant finish', 3),
(582, 'Utility Room', 'Electrical Conduits', 'Basic conduit for light', 'Plug points for small appliances', 'Appliance-friendly smart circuits', 3),
(583, 'Utility Room', 'Plumbing Work', 'Water point (if required)', 'Small sink plumbing', 'Concealed plumbing with filtration options', 3),
(585, 'Utility Room', 'Painting', 'Emulsion paint', 'Satin or semi-gloss finish', 'Imported designer paint or wallpapers', 3),
(586, 'Utility Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(587, 'Utility Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(588, 'Utility Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(589, 'Utility Room', 'Lighting & Fixtures', 'Ceiling light or tube light', 'Pendant lights, ambient lighting', 'Designer chandelier, smart dimmable lighting', 3),
(591, 'Laundry Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(592, 'Laundry Room', 'Wall Construction', 'Brickwork for shelves, small partition walls', 'AAC blocks, smooth finish', 'Designer partition walls with moisture protection', 3),
(593, 'Laundry Room', 'Lintel Beam', 'RCC lintel for door/window', 'RCC with conduit space', 'RCC with integrated lighting or utility chases', 3),
(594, 'Laundry Room', 'Door/Window Openings', 'Small opening with grill/aluminum frame', 'Ventilated UPVC frame', 'Ventilated designer opening with premium material', 3),
(595, 'Laundry Room', 'Flooring Base', 'Cement floor base', 'Waterproof screed base', 'Double waterproofing with slope management', 3),
(596, 'Laundry Room', 'Ceiling RCC Work', 'Flat RCC slab', 'RCC with ceiling conduit for lighting', 'RCC slab with embedded automation panels', 3),
(597, 'Laundry Room', 'Waterproofing', 'Cement coating', 'Bituminous or acrylic waterproofing', 'Advanced membrane waterproofing system', 3),
(598, 'Laundry Room', 'Ventilation', 'Basic ventilator/window', 'Louvered or exhaust fan', 'Automatic dehumidifier, smart exhaust', 3),
(599, 'Laundry Room', 'Plastering', 'Basic cement plaster', 'Smooth POP/plaster', 'Moisture-resistant finish', 3),
(600, 'Laundry Room', 'Electrical Conduits', 'Basic conduit for light', 'Plug points for small appliances', 'Appliance-friendly smart circuits', 3),
(601, 'Laundry Room', 'Plumbing Work', 'Water point (if required)', 'Small sink plumbing', 'Concealed plumbing with filtration options', 3),
(603, 'Laundry Room', 'Painting', 'Emulsion paint', 'Satin or semi-gloss finish', 'Imported designer paint or wallpapers', 3),
(604, 'Laundry Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(605, 'Laundry Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(606, 'Laundry Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(607, 'Laundry Room', 'Lighting & Fixtures', 'Ceiling light or tube light', 'Pendant lights, ambient lighting', 'Designer chandelier, smart dimmable lighting', 3),
(608, 'Laundry Room', 'Plumbing Finishes and Fixtures', 'Basic tap, single sink, PVC waste trap', 'Stainless steel sink, branded tap, chrome finish', 'Designer sink, sensor tap, concealed drain, premium metal finishes', 3),
(610, 'Bedrooms', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(611, 'Bedrooms', 'Wall Construction', 'Brick/block walls, basic alignment', 'AAC blocks, better finish', 'High precision walls, soundproofing options', 3),
(612, 'Bedrooms', 'Lintel Beam', 'RCC lintel with formwork', 'RCC with better grade steel', 'RCC + concealed utility conduits', 3),
(613, 'Bedrooms', 'Door/Window Openings', 'Simple cut-outs with wooden/aluminum frames', 'Cut-outs with premium UPVC frames', 'Larger openings, sliding-foldable glass doors', 3),
(614, 'Bedrooms', 'Flooring Base', 'Cement mortar bed', 'Levelled flooring with waterproofing', 'RCC slab with chemical waterproofing & thermal insulation', 3),
(615, 'Bedrooms', 'Ceiling RCC Work', 'Flat slab RCC', 'RCC with conduits', 'RCC slab with embedded HVAC or automation duct provision', 3),
(616, 'Bedrooms', 'Plastering', 'Basic internal plaster', 'Smooth internal plaster', 'Gypsum plaster for smooth premium finish', 3),
(617, 'Bedrooms', 'Electrical Conduits', 'Surface or semi-concealed PVC conduits', 'Concealed conduits', 'Concealed FRLS conduits + smart-ready cabling', 3),
(619, 'Bedrooms', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(620, 'Bedrooms', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(621, 'Bedrooms', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(622, 'Bedrooms', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(623, 'Bedrooms', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(624, 'Bedrooms', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(625, 'Bedrooms', 'Curtains/Blinds', 'Standard rod with fabric curtains', 'Roller blinds or dual fabric curtains', 'Motorized blinds, custom drapery with valance', 3),
(627, 'Walk-in Wardrobe/ Closet', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(628, 'Walk-in Wardrobe/ Closet', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(629, 'Walk-in Wardrobe/ Closet', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(630, 'Walk-in Wardrobe/ Closet', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(631, 'Walk-in Wardrobe/ Closet', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(632, 'Walk-in Wardrobe/ Closet', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(634, 'Walk-in Wardrobe/ Closet', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(635, 'Walk-in Wardrobe/ Closet', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(636, 'Walk-in Wardrobe/ Closet', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(637, 'Walk-in Wardrobe/ Closet', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(638, 'Walk-in Wardrobe/ Closet', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(639, 'Walk-in Wardrobe/ Closet', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(640, 'Walk-in Wardrobe/ Closet', 'Curtains/Blinds', 'Standard rod with fabric curtains', 'Roller blinds or dual fabric curtains', 'Motorized blinds, custom drapery with valance', 3),
(642, 'Play Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(643, 'Play Room', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(644, 'Play Room', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(645, 'Play Room', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(646, 'Play Room', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(647, 'Play Room', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(649, 'Play Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(650, 'Play Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(651, 'Play Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(652, 'Play Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(653, 'Play Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(654, 'Play Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(657, 'Game Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(658, 'Game Room', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(659, 'Game Room', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(660, 'Game Room', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(661, 'Game Room', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(662, 'Game Room', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(664, 'Game Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(665, 'Game Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(666, 'Game Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(667, 'Game Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(668, 'Game Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(669, 'Game Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(671, 'Bathrooms', 'Structural Framing', 'Designer sink, sensor tap, concealed drain, premium metal finishes', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(672, 'Bathrooms', 'Wall Construction', 'Brick wall with plaster', 'Moisture-resistant board walls', 'Waterproof drywall with insulation', 3),
(673, 'Bathrooms', 'Door & Lintel Beam', 'Flush door with RCC lintel', 'Waterproof laminated door, concealed lintel', 'Solid teak door, designer concealed lintel beam', 3),
(674, 'Bathrooms', 'Flooring', 'Ceramic anti-skid tiles', 'Vitrified anti-skid tiles', 'Marble / designer tiles / stone flooring', 3),
(675, 'Bathrooms', 'Wall Tiling', '5-7 ft ceramic tile dado', 'Full-height vitrified or textured tiles', 'Full-height imported tiles, stone, or marble finish', 3),
(676, 'Bathrooms', 'Ceiling Setup', 'Cement sheet ceiling', 'Gypsum board false ceiling', 'PVC or designer waterproof ceiling', 3),
(677, 'Bathrooms', 'Plumbing & Drainage', 'UPVC pipes, basic slope drainage', 'CPVC pipes, concealed drainage', 'Multi-layered piping, smart drainage system', 3),
(678, 'Bathrooms', 'Waterproofing', 'Cement-based waterproof coating', 'Two-layer waterproofing with branded chemicals', 'Full-body membrane, high-grade waterproofing with warranty', 3),
(679, 'Bathrooms', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring with safety switch', 'Smart wiring with automation, IP-rated bathroom switches', 3),
(680, 'Bathrooms', 'Ventilation/Exhaust', 'Basic exhaust fan provision', 'Wall-mounted exhaust with timer', 'Silent exhaust with humidity sensor', 3),
(681, 'Bathrooms', 'Windows', 'Aluminum frame, frosted glass', 'uPVC sliding with mesh', 'Wooden finish, privacy glass, motorized option', 3),
(683, 'Bathrooms', 'Wall Base Finish', 'Emulsion paint above tile', 'Moisture-resistant paint / texture', 'Designer finish / marble / wall panels', 3),
(684, 'Bathrooms', 'Painting', 'Oil-bound distemper', 'Waterproof emulsion', 'Anti-fungal, luxury bathroom paint', 3),
(685, 'Bathrooms', 'Lighting & Fixtures', 'Single wall light / ceiling light', 'Mirror light, spotlights', 'Cove lighting, mirror-integrated light, ambient lighting', 3),
(686, 'Bathrooms', 'Switchboards/Plates', 'Standard plastic covers', 'Modular branded covers', 'Glass finish or touch sensor plates', 3),
(687, 'Bathrooms', 'Toilet Fixtures', 'Basic WC, seat cover, flush tank', 'Wall-hung WC, concealed cistern', 'Rimless WC, smart toilet, touchless flush', 3),
(688, 'Bathrooms', 'Wash Basin Setup', 'Wall-hung ceramic basin', 'Countertop basin with cabinet', 'Designer basin with vanity, sensor faucet', 3),
(689, 'Bathrooms', 'Shower Area', 'Basic hand shower with angle cock', 'Overhead shower, glass partition', 'Rain shower with thermostat panel, full cubicle/glass enclosure', 3),
(690, 'Bathrooms', 'Faucets & CP Fittings', 'Basic chrome plated', 'Quarter turn, premium brands', 'Sensor-based, matte/gold finish designer brands', 3),
(691, 'Bathrooms', 'Towel Rods/Holders', 'SS single rod, basic holders', 'Double towel rod, robe hooks', 'Designer accessories set with finish match', 3),
(692, 'Bathrooms', 'Mirror', 'Simple wall-mounted mirror', 'Backlit or framed mirror', 'Anti-fog, sensor-activated smart mirror', 3),
(693, 'Bathrooms', 'Storage Cabinets', 'Open shelf or small plastic cabinet', 'Wall-mounted waterproof cabinet', 'Designer vanity with hidden storage', 3),
(694, 'Bathrooms', 'Bathtub (if any)', 'Not included', 'Acrylic tub', 'Jacuzzi, designer stone bathtub', 3),
(695, 'Bathrooms', 'Geyser/Water Heater', '10L storage geyser', 'Instant heater with auto cut-off', 'Concealed, high-efficiency heater with digital control', 3),
(696, 'Bathrooms', 'Accessories', 'Soap tray, mug holder', 'Coordinated set with towel ring, brush holder', 'Premium accessory set, anti-rust & designer range', 3),
(697, 'Bathrooms', 'Ventilation Grill/Cover', 'PVC ventilation grill', 'SS grill with net', 'Designer louvered grill with filter', 3),
(699, 'Puja Room/Prayer Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(700, 'Puja Room/Prayer Room', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(701, 'Puja Room/Prayer Room', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(702, 'Puja Room/Prayer Room', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(703, 'Puja Room/Prayer Room', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(704, 'Puja Room/Prayer Room', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(706, 'Puja Room/Prayer Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(707, 'Puja Room/Prayer Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(708, 'Puja Room/Prayer Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(709, 'Puja Room/Prayer Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(710, 'Puja Room/Prayer Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(711, 'Puja Room/Prayer Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(713, 'Entertainment/Media Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(714, 'Entertainment/Media Room', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(715, 'Entertainment/Media Room', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(716, 'Entertainment/Media Room', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(717, 'Entertainment/Media Room', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(718, 'Entertainment/Media Room', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(720, 'Entertainment/Media Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(721, 'Entertainment/Media Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(722, 'Entertainment/Media Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(723, 'Entertainment/Media Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(724, 'Entertainment/Media Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(725, 'Entertainment/Media Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(727, 'Home Theatre Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(728, 'Home Theatre Room', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(729, 'Home Theatre Room', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(730, 'Home Theatre Room', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(731, 'Home Theatre Room', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(732, 'Home Theatre Room', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(734, 'Home Theatre Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(735, 'Home Theatre Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(736, 'Home Theatre Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(737, 'Home Theatre Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(738, 'Home Theatre Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(739, 'Home Theatre Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(741, 'Library/Reading Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(742, 'Library/Reading Room', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(743, 'Library/Reading Room', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(744, 'Library/Reading Room', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(745, 'Library/Reading Room', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(746, 'Library/Reading Room', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(748, 'Library/Reading Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(749, 'Library/Reading Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(750, 'Library/Reading Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(751, 'Library/Reading Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(752, 'Library/Reading Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(753, 'Library/Reading Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(755, 'Multipurpose Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(756, 'Multipurpose Room', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(757, 'Multipurpose Room', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(758, 'Multipurpose Room', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(759, 'Multipurpose Room', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(760, 'Multipurpose Room', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(762, 'Multipurpose Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(763, 'Multipurpose Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(764, 'Multipurpose Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(765, 'Multipurpose Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(766, 'Multipurpose Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(767, 'Multipurpose Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(769, 'Spa/Jacuzzi', 'Wall Construction', 'Brick with plaster finish', 'Moisture-resistant boards', 'Waterproof insulated walls', 3),
(770, 'Spa/Jacuzzi', 'Door & Lintel Beam', 'Flush door, RCC lintel', 'Laminated moisture-proof door', 'Teak or engineered wood with water-resistant core', 3),
(771, 'Spa/Jacuzzi', 'Flooring', 'Anti-skid ceramic tiles', 'Vitrified/stone-finish tiles', 'Marble/wood-look porcelain or natural stone flooring', 3),
(772, 'Spa/Jacuzzi', 'Wall Tiling', 'Half-height ceramic tiles', 'Full-height vitrified or textured tiles', 'Full-height imported marble/onyx/porcelain wall cladding', 3),
(773, 'Spa/Jacuzzi', 'Ceiling Setup', 'Cement board ceiling', 'Gypsum false ceiling with moisture resistance', 'Designer waterproof ceiling with integrated lighting', 3),
(774, 'Spa/Jacuzzi', 'Plumbing & Drainage', 'Standard UPVC piping', 'Concealed CPVC piping', 'Smart water control system with advanced drainage slope', 3),
(775, 'Spa/Jacuzzi', 'Waterproofing', 'Single layer cement-based', 'Double layer branded chemical waterproofing', 'High-end sheet membrane with waterproofing guarantee', 3),
(776, 'Spa/Jacuzzi', 'Electrical Wiring', 'Basic wiring', 'Modular concealed wiring', 'Smart automation-ready wiring with isolation controls', 3),
(777, 'Spa/Jacuzzi', 'Ventilation/Exhaust', 'Wall exhaust fan', 'Silent exhaust with timer', 'Humidity-sensor exhaust or aroma ventilation system', 3),
(778, 'Spa/Jacuzzi', 'Windows', 'Basic aluminum with frosted glass', 'uPVC/wood finish with privacy glass', 'Smart glass windows with remote or touch control', 3),
(779, 'Spa/Jacuzzi', 'Jacuzzi Setup Base', 'Concrete base for plug-in tub', 'Elevated wooden/stone base for built-in tub', 'Integrated jacuzzi sunken or platform tub with plumbing & electrical', 3),
(781, 'Spa/Jacuzzi', 'Wall Base Finish', 'Paint above tile line', 'Water-repellent texture paint', 'Designer wall panels or marble continuation', 3),
(782, 'Spa/Jacuzzi', 'Painting', 'Oil-bound waterproof paint', 'Anti-mildew emulsion paint', 'High-end spa-grade antibacterial, anti-fungal finish', 3),
(783, 'Spa/Jacuzzi', 'Lighting & Fixtures', 'One ceiling light and wall lamp', 'Recessed lights, mirror lighting', 'Dimmable cove lighting, mood lighting, chromotherapy lights', 3),
(784, 'Spa/Jacuzzi', 'Switchboards/Plates', 'Basic plastic plates', 'Branded modular switchboards', 'Touch sensor/glass switch panels', 3),
(785, 'Spa/Jacuzzi', 'Jacuzzi/Bathtub', 'Plug & play acrylic jacuzzi', 'Built-in acrylic with hydro-massage jets', 'Imported smart jacuzzi with remote, LED lights, Bluetooth, aroma diffuser', 3),
(786, 'Spa/Jacuzzi', 'Faucets & CP Fittings', 'Basic diverter and chrome faucet', 'Quarter-turn diverter, hand-shower, tub filler', 'Designer waterfall fixtures, touch-control thermostatic mixers', 3),
(787, 'Spa/Jacuzzi', 'Wash Basin Setup', 'Wall-mounted basin', 'Countertop basin with under-sink storage', 'Designer double basin or integrated stone basin with mirror cabinet', 3),
(788, 'Spa/Jacuzzi', 'Shower Area (if any)', 'Open hand-shower zone', 'Partitioned shower with glass divider', 'Steam shower cabin with body jets', 3),
(789, 'Spa/Jacuzzi', 'Storage Cabinets', 'Basic plastic or wall-mounted shelves', 'Waterproof modular vanity', 'Custom-made stone/wood cabinetry with ambient lighting', 3),
(790, 'Spa/Jacuzzi', 'Towel Rods/Holders', 'Basic towel rod', 'Designer SS towel bar and hooks', 'Heated towel rail, coordinated premium accessories', 3),
(791, 'Spa/Jacuzzi', 'Mirror', 'Regular wall-mounted', 'Framed or LED backlit mirror', 'Sensor-controlled smart mirror with anti-fog and Bluetooth', 3),
(792, 'Spa/Jacuzzi', 'Geyser/Water Heater', 'Wall-mounted 10-15L geyser', 'Instant geyser with thermostat', 'Concealed luxury spa water heater, digital control', 3),
(793, 'Spa/Jacuzzi', 'Aromatherapy Setup', 'Not included', 'Scent diffuser provision', 'Integrated aromatherapy diffuser system', 3),
(794, 'Spa/Jacuzzi', 'Ventilation Grill', 'PVC grill', 'SS netted ventilation grill', 'Motorized aroma ventilation + filter', 3),
(795, 'Spa/Jacuzzi', 'Music/Entertainment', 'Not included', 'Bluetooth speaker option', 'Built-in waterproof audio-video system', 3),
(796, 'Spa/Jacuzzi', 'Floor Heating (optional)', 'Not included', 'Provision for heating mats', 'Digital thermostat-controlled heated flooring', 3),
(798, 'Balcony', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(799, 'Balcony', 'Flooring', 'Anti-skid ceramic tiles', 'Wooden-finish vitrified tiles', 'Outdoor wooden decking / natural stone / designer outdoor tiles', 3),
(800, 'Balcony', 'Wall Construction', 'Brick wall with plaster finish', 'AAC block with weatherproofing', 'Cladded wall with textured or natural stone finish', 3),
(801, 'Balcony', 'Railing Installation', 'MS painted railing', 'SS railing with glass panels', 'Frameless toughened glass railing / designer wrought iron / wooden railing', 3),
(802, 'Balcony', 'Ceiling Setup', 'Cement plaster ceiling', 'False ceiling with outdoor paint', 'Wooden ceiling paneling / designer outdoor false ceiling', 3),
(803, 'Balcony', 'Electrical Wiring', 'Basic wiring for light point', 'Modular outdoor wiring with covered boxes', 'Concealed wiring with smart light provisions', 3),
(804, 'Balcony', 'Drainage System', 'Basic floor slope for water outlet', 'Branded drain pipe and mesh cover', 'Concealed stainless steel linear drain', 3),
(805, 'Balcony', 'Waterproofing', 'Basic cement-based coating', 'Double layer chemical waterproofing', 'High-performance membrane waterproofing', 3),
(807, 'Balcony', 'Wall Base Finish', 'Cement paint or exterior paint', 'Texture paint or tile cladding', 'Designer wall panels, wooden or stone cladding', 3),
(808, 'Balcony', 'Painting', 'Waterproof exterior emulsion', 'Anti-fungal weatherproof paint', 'High-grade textured or designer outdoor finish', 3),
(809, 'Balcony', 'Lighting & Fixtures', 'One wall light', 'Wall sconce & ambient LED lights', 'Smart mood lighting, hanging outdoor lanterns, cove lighting', 3),
(810, 'Balcony', 'Switchboards/Plates', 'Basic outdoor plates', 'Branded weatherproof plates', 'Touch or smart-controlled weatherproof switches', 3),
(811, 'Balcony', 'Furniture Setup', 'Plastic chairs & table', 'Wicker or weatherproof wooden furniture', 'Custom luxury outdoor seating with cushions & coffee table', 3),
(812, 'Balcony', 'Planter Provision', 'Basic railing-mounted planters', 'Floor pots & vertical planter rack', 'Automated self-watering planter system, green wall', 3),
(813, 'Balcony', 'Ceiling Fan (Optional)', 'Not included', 'Standard outdoor ceiling fan', 'Designer fan with lighting or remote control', 3),
(814, 'Balcony', 'Privacy Screens', 'Basic curtain rod for fabric curtain', 'Bamboo or wooden screen', 'Automated louvered screens or retractable glass panels', 3),
(816, 'Basement', 'Excavation', 'Manual or basic machine digging', 'Machine excavation with leveling', 'Precision excavation with reinforced retaining walls', 3),
(817, 'Basement', 'Foundation & RCC Slab', 'Basic reinforced slab', 'High-grade concrete & steel reinforcement', 'Earthquake-resistant reinforced structure', 3),
(818, 'Basement', 'Wall Construction', 'Brick or block wall', 'AAC blocks with waterproof plaster', 'RCC retaining walls with thermal insulation', 3),
(819, 'Basement', 'Waterproofing', 'Basic chemical coating', 'Double-layer chemical + bitumen waterproofing', 'Membrane waterproofing with external drainage systems', 3),
(820, 'Basement', 'Flooring Base', 'Cement screed', 'Cement screed with waterproof layer', 'Screed with vapor barrier & thermal insulation', 3),
(821, 'Basement', 'Ceiling Setup', 'Exposed RCC ceiling', 'False ceiling with lighting provision', 'Acoustic false ceiling with smart lighting setup', 3),
(822, 'Basement', 'Ventilation Provision', 'Wall-mounted exhausts', 'Ducted mechanical ventilation', 'HVAC integrated system with fresh air inlets', 3),
(823, 'Basement', 'Electrical Wiring', 'Basic concealed wiring', 'Modular concealed wiring', 'Smart wiring with automation options', 3),
(824, 'Basement', 'Plumbing (if required)', 'Drainage pipe provisions', 'Concealed plumbing lines', 'Advanced drainage + sump & pump system', 3),
(825, 'Basement', 'Staircase Connectivity', 'RCC staircase', 'Wooden or tiled finish stairs', 'Designer stairs with lighting and railing integration', 3),
(827, 'Basement', 'Wall Base Finish', 'Cement paint or plaster', 'Wall putty + emulsion', 'Wall cladding / textured designer walls', 3),
(828, 'Basement', 'Painting', 'Basic waterproof paint', 'Satin finish waterproof emulsion', 'Designer textures, acoustic wall panels, or wallpapers', 3),
(829, 'Basement', 'Flooring', 'Ceramic tiles / vitrified tiles', 'Wooden-finish vitrified tiles', 'Vinyl wooden flooring / carpet tiles / designer tiles', 3),
(830, 'Basement', 'Lighting & Fixtures', 'Tube lights or wall sconces', 'LED recessed lights + cove lights', 'Smart lighting system with dimmers, ambient & decorative lights', 3),
(831, 'Basement', 'Switchboards/Plates', 'Basic plastic modular plates', 'Branded modular switchboards', 'Touch-controlled or smart switch systems', 3),
(832, 'Basement', 'Furniture Setup', 'Basic plastic or wooden furniture', 'Modular built-in storage units', 'Custom furniture with smart integration and media setup', 3),
(833, 'Basement', 'Soundproofing (Optional)', 'Not included', 'Acoustic panels on walls or ceiling', 'Complete soundproofing with flooring & ceiling treatment', 3),
(834, 'Basement', 'Utility Area (if included)', 'Small storage space', 'Storage + laundry setup', 'Utility zone with cabinetry, equipment and ventilation', 3),
(835, 'Basement', 'Fire Safety Setup', 'Fire extinguisher only', 'Fire sensors & extinguisher', 'Fire alarm system with emergency lighting and exit plan', 3),
(836, 'Basement', 'Entertainment Setup', 'Not included', 'Basic home theatre wiring', 'Full home theatre or gaming zone with acoustic control', 3),
(838, 'Servant???s Quarters/Staff R', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(839, 'Servant???s Quarters/Staff R', 'Wall Construction', 'Brick walls with basic plaster', 'AAC blocks or fly ash bricks with smooth plaster', 'Thermal-insulated RCC walls with external weather coating', 3),
(840, 'Servant???s Quarters/Staff R', 'Flooring Base', 'Cement flooring', 'Vitrified tiles', 'Anti-skid designer tiles or vinyl flooring', 3),
(841, 'Servant???s Quarters/Staff R', 'Ceiling Setup', 'Exposed slab or basic plaster finish', 'False ceiling or pop design', 'False ceiling with lighting provision', 3),
(842, 'Servant???s Quarters/Staff R', 'Roofing/Waterproofing', 'Basic weather coating', 'Bitumen + chemical waterproofing', 'Advanced membrane waterproofing', 3),
(843, 'Servant???s Quarters/Staff R', 'Plumbing Lines', 'Basic water inlet/outlet', 'Concealed plumbing lines', 'Premium quality plumbing with individual isolation', 3),
(844, 'Servant???s Quarters/Staff R', 'Electrical Wiring', 'Concealed wiring, basic switches', 'Modular concealed wiring', 'Smart wiring with energy-efficient provisions', 3),
(845, 'Servant???s Quarters/Staff R', 'Windows & Ventilation', 'Aluminum or MS frames, glass panes', 'UPVC sliding windows', 'Soundproof designer windows with mosquito mesh', 3),
(846, 'Servant???s Quarters/Staff R', 'Toilet Construction', 'Indian-style WC, floor-mounted tap fittings', 'Western WC, geyser provision', 'Wall-hung WC, premium fittings, hot water provision', 3),
(847, 'Servant???s Quarters/Staff R', 'Kitchenette Provision', 'Cement slab and sink', 'Granite top with SS sink', 'Modular base unit with tiles backsplash', 3),
(848, 'Servant???s Quarters/Staff R', 'Separate Entry', 'Via external stair/path', 'Gated access and dedicated entrance', 'Private secured entry with intercom/camera provision', 3),
(850, 'Servant???s Quarters/Staff R', 'Wall Base Finish', 'Cement-based paint', 'Wall putty + emulsion', 'Anti-fungal premium paint or wallpaper', 3),
(851, 'Servant???s Quarters/Staff R', 'Painting', 'Whitewash or basic emulsion', 'Oil-bound or washable paint', 'Stain-resistant, breathable designer paint', 3),
(852, 'Servant???s Quarters/Staff R', 'Lighting & Fixtures', 'Tube lights or bulb fittings', 'LED lights with switches', 'Recessed lighting, ambient light fixtures', 3);
INSERT INTO `room_features` (`id`, `room_type`, `room_item`, `standard_cat`, `premium_cat`, `luxury_cat`, `interior_type`) VALUES
(853, 'Servant???s Quarters/Staff R', 'Switchboards/Plates', 'Basic plastic switchboards', 'Modular branded plates', 'Designer or smart switch plates', 3),
(854, 'Servant???s Quarters/Staff R', 'Door & Window Fittings', 'Wooden or metal doors, simple handles', 'Flush doors with laminate finish', 'Laminated or PVC doors with high-end hardware', 3),
(855, 'Servant???s Quarters/Staff R', 'Bathroom Fixtures', 'Basic tap, shower, Indian WC', 'Premium taps, geyser setup, Western WC', 'Designer fittings, concealed cistern, glass partition', 3),
(856, 'Servant???s Quarters/Staff R', 'Kitchenette Finish', 'Cement counter, basic sink', 'Granite platform, SS sink with wall tiles', 'Designer modular base, soft-close drawers, wall-mounted chimney option', 3),
(857, 'Servant???s Quarters/Staff R', 'Storage/Furniture', 'Steel or wooden cot, metal cupboard', 'Built-in wooden shelves or wardrobes', 'Modular storage with loft space', 3),
(858, 'Servant???s Quarters/Staff R', 'Curtain Rods/Blinds', 'Basic metal rod fittings', 'Adjustable curtain rods or roller blinds', 'Motorized blinds or premium curtain accessories', 3),
(859, 'Servant???s Quarters/Staff R', 'Utility Connection', 'Shared water/electric source', 'Separate meter provision', 'Independent utility system', 3),
(861, 'Storage Room', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(862, 'Storage Room', 'Wall Construction', 'Brick wall with plaster', 'Gypsum board partitions with smooth finish', 'Acoustic-treated partitions or wood paneling', 3),
(863, 'Storage Room', 'Door & Window Lintel Beam', 'RCC lintel beam', 'Concealed lintel beam', 'Designer concealed beam with wooden trims', 3),
(864, 'Storage Room', 'Flooring', 'Ceramic or vitrified tiles', 'Wooden finish tiles or laminated flooring', 'Hardwood flooring or marble', 3),
(865, 'Storage Room', 'Ceiling Setup', 'Basic plaster ceiling', 'Gypsum false ceiling', 'Designer false ceiling with lighting integration', 3),
(866, 'Storage Room', 'Electrical Wiring', 'Basic concealed wiring', 'Modular wiring setup', 'Smart wiring with automation provisions', 3),
(868, 'Storage Room', 'Painting', 'Standard emulsion paint', 'Semi-luxury finish (satin/pearl finish)', 'Luxury finish (Italian, velvet touch, or designer paint)', 3),
(869, 'Storage Room', 'Lighting & Fixtures', 'Tube lights, wall sconces', 'Spotlights, designer pendant lights', 'Smart lighting, chandeliers, dimmable ambient lighting', 3),
(870, 'Storage Room', 'Switchboards and plates', 'Basic plastic switchboards, standard switches, minimal design', 'Modular switch plates, matte/glossy finishes, sleeker design', 'Designer or glass-finish plates, smart touch switches, concealed systems', 3),
(871, 'Storage Room', 'Door & Windows', 'Standard wooden or aluminum frame', 'UPVC or veneered wooden frames', 'Teak wood or smart motorized windows & custom doors', 3),
(872, 'Storage Room', 'Flooring Finish', 'Basic polish or tile grout sealing', 'Polished marble or vitrified tile finish', 'Epoxy coat, wooden polish, or imported stone finishing', 3),
(873, 'Storage Room', 'False Ceiling', 'Simple gypsum ceiling', 'Cove ceiling with LED strip lights', 'Designer layered or themed false ceiling with automation', 3),
(875, 'Waste Disposal', 'Structural Framing', 'RCC slab (basic thickness)', 'High-grade RCC with better curing', 'Customized RCC with extra reinforcement, slab insulation', 3),
(876, 'Waste Disposal', 'Wall Construction', 'Brick walls with plaster', 'Fly ash or AAC blocks with smooth finish', 'RCC walls with anti-bacterial paint base', 3),
(877, 'Waste Disposal', 'Flooring Base', 'Cement flooring', 'Anti-skid ceramic tiles', 'Industrial-grade anti-slip tiles with chemical resistance', 3),
(878, 'Waste Disposal', 'Ventilation Setup', 'Ventilation hole or basic window', 'Exhaust fan or louvered windows', 'Mechanized exhaust system with air filters', 3),
(879, 'Waste Disposal', 'Drainage Line Setup', 'Basic floor drain with pipe', 'Grated floor drain with trap', 'High-capacity sloped flooring with concealed drainage system', 3),
(880, 'Waste Disposal', 'Waterproofing', 'Basic coating', 'Bitumen or chemical layer', 'Advanced waterproofing membrane with anti-stain technology', 3),
(881, 'Waste Disposal', 'Door Installation', 'Metal or PVC door', 'Rust-proof aluminum door', 'Fire-rated metal door with access control if needed', 3),
(882, 'Waste Disposal', 'Electrical Provision', 'One power point', 'Concealed wiring with LED point', 'Motion sensor-based lighting provisions', 3),
(883, 'Waste Disposal', 'Waste Access Chute/Zone', 'Manual entry area', 'Waste slot/chute with cover', 'Pneumatic or automatic waste chute provision', 3),
(885, 'Waste Disposal', 'Wall Base Finish', 'Basic whitewash or cement paint', 'Washable emulsion or oil-bound paint', 'Anti-microbial, odor-resistant wall paint', 3),
(886, 'Waste Disposal', 'Painting', 'Cement grey or white', 'Neutral-toned washable emulsion', 'Stain-resistant, high-durability paint', 3),
(887, 'Waste Disposal', 'Lighting & Fixtures', 'Single tube light', 'LED light with switch', 'Motion-sensor LED light, sealed fittings', 3),
(888, 'Waste Disposal', 'Switchboards/Plates', 'Basic plastic board', 'Modular, washable boards', 'Waterproof and sealed switchboards', 3),
(889, 'Waste Disposal', 'Door & Handle Fittings', 'Basic handle, manual latch', 'Lever handle with soft-close mechanism', 'Anti-bacterial handle with locking mechanism if required', 3),
(890, 'Waste Disposal', 'Signage/Marking', 'Painted or laminated sticker', 'Acrylic signage with clear labeling', 'Backlit or stainless steel engraved signage', 3),
(891, 'Waste Disposal', 'Odor Control System', 'Open ventilation', 'Exhaust fan with odor filters', 'Deodorizing system or automated fresh air purifiers', 3),
(892, 'Waste Disposal', 'Cleaning Tools Setup', 'Wall hook or shelf', 'Wall-mounted cabinet', 'Concealed cabinet with built-in sanitizer dispensers', 3),
(894, 'UGT (Underground Tank)', 'Excavation Work', 'Manual or basic excavation', 'Machine excavation with proper depth control', 'Detailed geotechnical excavation with safety barriers', 3),
(895, 'UGT (Underground Tank)', 'Tank Construction', 'Brick or RCC with plaster finish', 'RCC with waterproofing layers', 'RCC with food-grade waterproofing and structural reinforcement', 3),
(896, 'UGT (Underground Tank)', 'Base Slab', 'Plain concrete base', 'Reinforced concrete base', 'RCC with epoxy coating for extra protection', 3),
(897, 'UGT (Underground Tank)', 'Wall Construction', 'Cement plastered brick walls', 'RCC with anti-leak treatment', 'RCC with chemical-resistant, fiber-reinforced walls', 3),
(898, 'UGT (Underground Tank)', 'Waterproofing', 'Basic bitumen coating', 'Chemical waterproofing treatment', 'High-grade membrane and PU-based waterproofing', 3),
(899, 'UGT (Underground Tank)', 'Piping & Inlet/Outlet', 'PVC piping', 'CPVC or HDPE piping', 'SS or HDPE with anti-corrosion fittings', 3),
(900, 'UGT (Underground Tank)', 'Partition for Storage', 'Not included', 'Included if dual-use (drinking & non-potable)', 'Segmented with sensors and automated valves', 3),
(901, 'UGT (Underground Tank)', 'Top Slab & Access', 'Concrete cover with metal lid', 'RCC cover with lockable access panel', 'RCC top with stainless steel locking hatch and ventilation shaft', 3),
(903, 'UGT (Underground Tank)', 'Wall Base Finish', 'Cement plaster', 'Smooth finish with anti-algae coating', 'Food-grade epoxy or antimicrobial interior finish', 3),
(904, 'UGT (Underground Tank)', 'Painting/Coating', 'Bitumen-based internal coat', 'Water-resistant chemical paint', 'NSF-certified internal coatings for potable water', 3),
(905, 'UGT (Underground Tank)', 'Access Cover & Lock', 'Iron lid with basic locking', 'Powder-coated metal with secure lock', 'SS304/316 lockable access with gas spring assist', 3),
(906, 'UGT (Underground Tank)', 'Drainage System', 'Manual overflow pipe', 'Overflow pipe with trap and mesh', 'Sensor-based drainage with overflow alerts', 3),
(907, 'UGT (Underground Tank)', 'Pest & Insect Prevention', 'Netting over vent', 'Vent filter mesh with sealed lid', 'Air-locked chamber with carbon filter vents', 3),
(908, 'UGT (Underground Tank)', 'Electrical (if needed)', 'Basic wiring for pump', 'Protected wiring with lighting provision', 'Pump room automation wiring with smart control', 3),
(909, 'UGT (Underground Tank)', 'Water Level Indicator', 'Manual gauge', 'Float-type indicator', 'Digital sensor with remote monitoring system', 3),
(911, 'OHT (Overhead Tank)', 'Structural Base', 'RCC slab with basic reinforcement', 'RCC with additional structural support', 'RCC with seismic resistance & vibration dampers', 3),
(912, 'OHT (Overhead Tank)', 'Tank Material', 'Brick or cement tank', 'Precast RCC or high-quality plastic', 'Fiber-reinforced plastic (FRP) or stainless steel', 3),
(913, 'OHT (Overhead Tank)', 'Tank Shape & Design', 'Basic circular or rectangular', 'Optimized shape for pressure flow', 'Custom design for load balancing and aesthetics', 3),
(914, 'OHT (Overhead Tank)', 'Waterproofing', 'Bitumen coating', 'Cementitious waterproofing', 'Food-grade epoxy or PU-based waterproofing', 3),
(915, 'OHT (Overhead Tank)', 'Inlet/Outlet Pipes', 'PVC', 'CPVC or HDPE', 'SS or premium-grade HDPE', 3),
(916, 'OHT (Overhead Tank)', 'Manhole & Cover', 'Cement or iron lid', 'Lockable metal lid with gasket seal', 'SS hatch with weatherproof locking system', 3),
(917, 'OHT (Overhead Tank)', 'Railing (if external access)', 'Not included', 'GI pipe railing', 'SS railing with safety grip', 3),
(918, 'OHT (Overhead Tank)', 'Access Ladder', 'Basic iron ladder', 'GI ladder with cage', 'SS ladder with safety cage and anti-slip coating', 3),
(919, 'OHT (Overhead Tank)', 'Ventilation', 'Open pipe vents', 'Covered mesh vents', 'Filtered vents to block dust/insects', 3),
(921, 'OHT (Overhead Tank)', 'Wall Base Finish', 'Rough cement finish', 'Smooth internal finish', 'Food-grade coated internal lining', 3),
(922, 'OHT (Overhead Tank)', 'Painting/External Coating', 'Cement paint', 'Weather-resistant acrylic paint', 'Heat-reflective, anti-algae, anti-crack paint', 3),
(923, 'OHT (Overhead Tank)', 'Water Level Indicator', 'Manual level marking', 'Float-type indicator', 'Digital sensor with mobile/app monitoring', 3),
(924, 'OHT (Overhead Tank)', 'Access Cover & Lock', 'Iron lid with latch', 'Powder-coated lockable metal lid', 'Stainless steel with gas-lift and lock system', 3),
(925, 'OHT (Overhead Tank)', 'Drainage Outlet', 'Manual outlet', 'Drain with valve', 'Drain with filtration system', 3),
(926, 'OHT (Overhead Tank)', 'Electrical (if any pump/lighting)', 'Basic wiring', 'Concealed weather-resistant wiring', 'Automated control system with remote panel', 3),
(927, 'OHT (Overhead Tank)', 'Overflow Control', 'Standard overflow pipe', 'Pipe with trap and mesh', 'Alarmed overflow sensor with shutoff valve', 3),
(929, 'Generator/Inverter/Back-Up R', 'Room Construction', 'Brick walls with RCC slab', 'RCC walls with insulation', 'Soundproof and thermally insulated RCC with ventilation system', 3),
(930, 'Generator/Inverter/Back-Up R', 'Flooring', 'Basic cement flooring', 'Anti-vibration concrete flooring', 'Vibration-resistant treated flooring with anti-slip finish', 3),
(931, 'Generator/Inverter/Back-Up R', 'Door & Lintel', 'Iron or wooden frame door', 'Fire-rated metal door', 'Acoustic fire-rated SS door with secure locking', 3),
(932, 'Generator/Inverter/Back-Up R', 'Ventilation/Openings', 'Basic ventilation opening', 'Louvered vent openings', 'Automated exhaust system with filtered inlets', 3),
(933, 'Generator/Inverter/Back-Up R', 'Exhaust Outlet Setup', 'Single exhaust pipe setup', 'Double exhaust pipe with cover', 'Insulated and silenced dual exhaust with spark arrestor', 3),
(934, 'Generator/Inverter/Back-Up R', 'Platform for Generator', 'Concrete platform', 'Anti-vibration mount base', 'Elevated anti-vibration base with shock absorbers', 3),
(935, 'Generator/Inverter/Back-Up R', 'Wiring Conduits', 'Basic PVC conduits', 'Concealed conduits with cable tray', 'Copper-lined conduits with EMI shielding', 3),
(937, 'Generator/Inverter/Back-Up R', 'Wall Finish', 'Cement plaster with paint', 'Weather-resistant paint or tiles', 'Sound-absorbing wall panels or acoustic coating', 3),
(938, 'Generator/Inverter/Back-Up R', 'Painting', 'Enamel or oil-bound distemper', 'Heat and oil-resistant industrial paint', 'Fire-retardant and dust-resistant coating', 3),
(939, 'Generator/Inverter/Back-Up R', 'Lighting', 'Tube light or bulb fixture', 'LED battens with protective casing', 'Sensor-based LED lighting with auto ON/OFF and battery backup', 3),
(940, 'Generator/Inverter/Back-Up R', 'Fixtures & Controls', 'Manual switch box', 'Modular switchgear and indicators', 'Smart control panel with display, auto transfer switch (ATS)', 3),
(941, 'Generator/Inverter/Back-Up R', 'Switchboards/Plates', 'Basic plastic boards', 'Modular metal-finish boards', 'Digital touchscreen or SS modular control plates', 3),
(942, 'Generator/Inverter/Back-Up R', 'Safety Features', 'Fire extinguisher holder', 'Fire extinguisher, safety signage', 'Fire detection system, ventilation alarm, remote monitoring system', 3),
(943, 'Generator/Inverter/Back-Up R', 'Storage Provision', 'Small shelf for tools', 'Cabinet for batteries and accessories', 'Fire-rated storage with organized sections and cable management tray', 3);

-- --------------------------------------------------------

--
-- Table structure for table `room_features_bkuup`
--

CREATE TABLE `room_features_bkuup` (
  `id` int(3) NOT NULL,
  `room_type` varchar(28) DEFAULT NULL,
  `room_item` varchar(33) DEFAULT NULL,
  `standard_cat` varchar(139) DEFAULT NULL,
  `premium_cat` varchar(152) DEFAULT NULL,
  `luxury_cat` varchar(205) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `room_features_bkuup`
--

INSERT INTO `room_features_bkuup` (`id`, `room_type`, `room_item`, `standard_cat`, `premium_cat`, `luxury_cat`) VALUES
(1, 'Entrance Lobby & Living Room', 'Seating', 'Unwind in comfort with our classic sofa set and basic armchairs.', 'Experience elevated relaxation with a sofa cum bed adorned with premium fabrics, complemented by designer armchairs and basic recliners.', 'Indulge in ultimate comfort with a designer sofa set, exquisitely upholstered recliners, and bespoke lounge chairs.'),
(2, 'Entrance Lobby & Living Room', 'Storage', 'Organize with simplicity using a basic TV unit and a straightforward shoe cupboard.', 'Upgrade with a TV unit offering additional storage, a designer shoe cupboard, and stylish display units.', 'Embrace elegance with a custom TV unit featuring integrated lighting, opulent display units, and a shoe cupboard with a comfortable seating area.'),
(3, 'Entrance Lobby & Living Room', 'Ceiling & Lighting', 'Illuminate your space with a basic false ceiling and standard light effects.', 'Enhance your living experience with a designer false ceiling, exquisite cove lighting, and elegant pendant lights.', 'Transform your ceiling with a custom design featuring advanced cove lighting, smart recessed lights, and a luxurious chandelier.'),
(4, 'Entrance Lobby & Living Room', 'Furniture', 'Furnish with a standard center table and corner table.', 'Elevate your d??cor with a designer center table, corner table, and sophisticated wall paneling.', 'Redefine luxury with a custom center table, bespoke corner table, luxurious wall cladding, and an exclusive indoor plant arrangement.'),
(5, 'Entrance Lobby & Living Room', 'Electrical Work', 'Ensure basic functionality with standard plug points, switches, and hidden wiring.', 'Upgrade to hidden wiring with dimmer switches and additional USB charging points.', 'Integrate smart switches, advanced hidden wiring, designer dimmer systems, and comprehensive smart home solutions.'),
(6, 'Entrance Lobby & Living Room', 'Painting', 'Opt for classic wall and ceiling painting.', 'Enhance with premium wall paint finishes and a refined varnish or polish for woodwork.', 'Achieve a sophisticated look with custom paint effects and high-quality finishes for both walls and ceilings.'),
(7, 'Entrance Lobby & Living Room', 'Civil Changes', 'Secure your entrance with a basic safety door and main door design.', 'Upgrade to a designer main door with an elegant finish, custom partition walls, and a premium entrance design.', 'Enjoy ultimate security and style with custom doors featuring advanced security features, an elaborate partition design, and a luxurious entrance wall design.'),
(8, 'Entrance Lobby & Living Room', 'Air Conditioning', 'Install basic air conditioning for your space.', 'Opt for split AC with ductwork, complemented by customized false ceilings or paneling for AC vents.', 'Experience centralized AC zoning with ductless units featuring designer grills and smart temperature control settings.'),
(9, 'Entrance Lobby & Living Room', 'Automation', 'Begin with basic lights automation.', 'Enhance your living with advanced lights and curtain automation.', 'Enjoy comprehensive home automation systems with voice-controlled lights, curtains, and integrated smart devices.'),
(10, 'Entrance Lobby & Living Room', 'Miscellaneous', 'Incorporate a basic puja/mandir unit for your spiritual needs.', 'Elevate with a designer puja/mandir unit and decorative mirrors.', 'Complete your space with a custom puja/mandir unit featuring elegant lighting, luxury decorative mirrors, and high-end console tables.'),
(11, 'Kitchen', 'Storage', 'Maximize efficiency with under-counter storage and basic overhead cupboards.', 'Upgrade to auto-close trollies, sleek shutter cupboards, and premium overhead cupboards.', 'Revel in custom cabinetry, uplifting down pull cupboards, and designer storage solutions.'),
(12, 'Kitchen', 'Appliances & Fixtures Connections', 'Connect standard kitchen appliances like hob and oven with ease.', 'Enhance with built-in smart appliances including a smart oven, integrated refrigerator, hob, and chimney.', 'Enjoy high-end smart kitchen systems with advanced built-in appliances and comprehensive connections for grinder-mixer, mixi, and water purifiers.'),
(13, 'Kitchen', 'Lighting', 'Illuminate with basic light effects and standard task lighting.', 'Brighten up with under-cabinet lighting and designer pendant lights.', 'Transform your kitchen with customized lighting solutions, smart task lighting, and luxurious pendant or chandelier lighting.'),
(14, 'Kitchen', 'Wall Treatments', 'Opt for dado tiles, basic wall paneling, and texture paint for a simple finish.', 'Enhance with premium wallpaper and a designer backsplash.', 'Achieve sophistication with custom wall paneling, high-end designer backsplash, and luxury wall treatments.'),
(15, 'Kitchen', 'Electrical Work', 'Ensure functionality with basic plug points and standard switches.', 'Upgrade to hidden wiring, additional appliance sockets, and under-cabinet lighting points.', 'Embrace advanced electrical work with smart wiring and integrated appliance outlets.'),
(16, 'Kitchen', 'False Ceiling', 'Start with a basic ceiling design for a straightforward look.', 'Elevate with a gypsum ceiling featuring cove lighting.', 'Opt for a designer ceiling with custom solutions and enhanced cove lighting.'),
(17, 'Kitchen', 'Painting', 'Enjoy basic wall and ceiling painting for a clean finish.', 'Choose premium wall painting and varnish or polish for woodwork.', 'Indulge in high-end paint finishes and custom varnish for a polished look.'),
(18, 'Kitchen', 'Civil Changes', 'Perform basic counter renovation and minor dado tiles updates.', 'Upgrade with moderate doors renovation and plumbing work.', 'Achieve an extensive counter renovation, full dado tiles overhaul, and major plumbing upgrades.'),
(19, 'Kitchen', 'Miscellaneous', 'Utilize a standard breakfast counter and a simple crockery unit.', 'Opt for a premium breakfast counter and a designer crockery unit.', 'Enjoy custom storage solutions, a high-end breakfast counter, and an exclusive designer crockery unit.'),
(20, 'Dining Room', 'Seating', 'Basic dining table with 2 to 4 chairs and one simple bench.', 'Upgrade to a designer dining table, premium chairs, and a high-quality bench.', 'Indulge in a custom dining table with luxury chairs and a designer bench crafted from high-end materials.'),
(21, 'Dining Room', 'Storage', 'Basic chest or crockery unit with extra storage.', 'Opt for a designer chest, premium display units for added elegance.', 'Experience custom storage solutions, luxury display units, and a high-end crockery unit.'),
(22, 'Dining Room', 'Ceiling & Lighting', 'Standard false ceiling and basic light effects.', 'Enhance with cove lighting, designer chandeliers, and advanced light effects.', 'Enjoy a custom false ceiling with high-end cove lighting, a luxury chandelier, and integrated lighting systems.'),
(23, 'Dining Room', 'Furniture & Decor', 'Standard wall paneling or texture paint on one wall.', 'Elevate with designer wall paneling or premium texture paint on one wall.', 'Achieve sophistication with custom wall paneling or high-end wallpaper on one or two walls.'),
(24, 'Dining Room', 'Electrical Work', 'Basic plug points with standard switches and hidden wiring.', 'Upgrade to hidden wiring, dimmer switches, and additional USB charging points.', 'Embrace smart electrical solutions with advanced dimmer systems and integrated USB charging points.'),
(25, 'Dining Room', 'Painting', 'Standard wall and ceiling painting for a clean look.', 'Choose premium wall painting and varnish or polish for woodwork.', 'Opt for high-end paint finishes and custom varnish for a polished, luxurious appearance.'),
(26, 'Dining Room', 'Miscellaneous', 'Simple sideboard and basic bar unit for functionality.', 'Upgrade to a premium buffet table and custom bar unit for added elegance.', 'Enjoy a luxury buffet table and an exclusive bar unit for a truly refined dining experience.'),
(27, 'Passage/Lobby/Corridor', 'Ceiling & Lighting', 'Basic false ceiling with standard light effects.', 'Designer gypsum ceiling with cove lighting, recessed lights, and wall sconces.', 'Custom false ceiling featuring designer cove lighting, high-end recessed lights, and luxury wall sconces.'),
(28, 'Passage/Lobby/Corridor', 'Furniture & Decor', 'Basic artifacts (showpieces), standard wall paneling, texture paint, and basic curtains.', 'Designer wall paneling, premium texture paint, high-quality curtains, custom console tables, and mirrors.', 'Luxury artifacts, custom wall paneling, exclusive wallpaper, automated curtains, designer mirrors, and console tables.'),
(29, 'Passage/Lobby/Corridor', 'Electrical Work', 'Basic plug points with standard switches.', 'Hidden wiring, dimmer switches, and additional plug points.', 'Advanced electrical solutions, smart wiring, and designer dimmer systems.'),
(30, 'Passage/Lobby/Corridor', 'Painting', 'Standard wall painting and basic ceiling painting.', 'Premium wall painting with attention to detail.', 'High-end paint finishes for both walls and ceilings, providing a luxurious touch.'),
(31, 'Passage/Lobby/Corridor', 'Miscellaneous', 'Standard storage solutions, basic wall-mounted shelves, shoe racks, and simple decorative elements.', 'Designer storage solutions, premium wall-mounted shelves, custom shoe racks, and high-quality decorative elements.', 'Custom storage solutions, luxury wall-mounted shelves, exclusive decorative elements, and designer shoe racks.'),
(32, 'Master Bedroom', 'Bed & Storage', 'Relax in a Master/Queen Bed with Basic Storage Below, a Side Table, Standard Double Wardrobes, and a Simple Headboard.', 'Upgrade to a Designer Master/Queen Bed with Premium Storage Solutions, Custom Side Tables, High-Quality Double Wardrobes, and an Enhanced Headboard.', 'Experience Luxury with a Master/Queen Bed, Custom Storage Solutions, Designer Side Tables, High-End Wardrobes, and a Bespoke Headboard.'),
(33, 'Master Bedroom', 'Study Area', 'Set up a Basic Study Table with Standard Storage Above, Simple Bookshelves, and a Basic Chair.', 'Enhance your workspace with a Designer Study Table, Premium Storage Above, Custom Bookshelves, and a Comfortable Chair.', 'Transform with a High-End Study Table, Custom Storage Solutions, Designer Bookshelves, and an Ergonomic Chair for ultimate productivity.'),
(34, 'Master Bedroom', 'Ceiling & Lighting', 'Choose a Basic False Ceiling with Standard Light Effects, Simple Cove Lighting, and Basic Pendant Lights.', 'Upgrade to a Premium False Ceiling with Enhanced Light Effects, Designer Cove Lighting, and Recessed Lights for a sophisticated ambiance.', 'Indulge in a Custom False Ceiling with Advanced Cove Lighting, Luxury Pendant Lights, and High-End Recessed Lighting for an exquisite touch.'),
(35, 'Master Bedroom', 'Furniture & Decor', 'Decorate with a Standard TV Unit, Basic Showpiece Unit, and Wall Paneling or Texture Paint.', 'Refine your space with a Designer TV Unit, Premium Showpiece Unit, and High-Quality Wall Paneling or Premium Texture Paint.', 'Luxuriate in a Luxury TV Unit, Custom Showpiece Unit, and High-End Wall Paneling or Exclusive Wallpaper for an opulent look.'),
(36, 'Master Bedroom', 'Electrical Work', 'Utilize Basic Plug Points, Standard Switches, Hidden Wiring, and Dimmer Switches.', 'Opt for Premium Plug Points, Advanced Hidden Wiring, Enhanced Dimmer Switches, and Additional USB Charging Points for modern convenience.', 'Benefit from High-End Electrical Solutions, Smart Wiring, Advanced Dimmer Systems, and Integrated USB Charging Points for a seamless experience.'),
(37, 'Master Bedroom', 'Painting', 'Enjoy Standard Wall Painting, Basic Ceiling Painting.', 'Upgrade with Premium Wall Painting, and Varnish or Polish for Woodwork for a refined finish.', 'Revel in High-End Paint Finishes for Walls and Ceilings, and Custom Varnish or Polish for Woodwork for a luxurious touch.'),
(38, 'Master Bedroom', 'Automation', 'Implement Basic Lights Automation and Simple Curtain Automation.', 'Enhance with Advanced Lights Automation and Premium Curtain Automation for added comfort.', 'Experience Advanced Lights Automation and High-End Curtain Automation for a fully integrated home.'),
(39, 'Master Bedroom', 'Miscellaneous', 'Organize with a Basic Dressing Unit, Standard Vanity Units, and a Simple Full-Length Mirror.', 'Elevate with a Designer Dressing Unit, Premium Vanity Units, and a High-Quality Full-Length Mirror with Dressing Storage.', 'Luxuriate with a Luxury Dressing Unit, Custom Vanity Units, and an Exclusive Full-Length Mirror for a touch of elegance.'),
(40, 'Kids\'/Children\'s Bedroom', 'Bed & Storage', 'Enjoy a Standard Bed or Basic Bunk/Trundle Bed with Essential Storage, a Side Table, and a Simple Headboard.', 'Upgrade to a Designer Bunk/Trundle Bed with Enhanced Storage Solutions, a Custom Side Table, and an Elegant Headboard.', 'Experience Opulence with a Master Bed or Designer Bunk/Trundle Beds, Bespoke Storage Solutions, and Luxurious Side Tables and Headboards.'),
(41, 'Kids\'/Children\'s Bedroom', 'Wardrobe & Cabinets', 'Opt for Standard Double Wardrobes, Basic Loft Storage, Simple Cabinetry, and Open Shelves.', 'Elevate your space with Premium Double Wardrobes, Upgraded Loft Storage, Custom Cabinetry, and Designer Open Shelves.', 'Indulge in High-End Double Wardrobes, Premium Custom Cabinetry, and Exquisite Designer Open Shelves.'),
(42, 'Kids\'/Children\'s Bedroom', 'Study Area', 'Set up a Basic Study Table with Standard Storage Above, Simple Bookshelves, a Basic Chair, and a Pinboard.', 'Enhance your study with a Premium Study Table, Designer Storage Above, Custom Bookshelves, a Comfortable Chair, and a Stylish Pinboard.', 'Transform your study with a High-End Study Table, Luxury Storage Solutions, Designer Bookshelves, an Ergonomic Chair, and an Exclusive Pinboard.'),
(43, 'Kids\'/Children\'s Bedroom', 'Ceiling & Lighting', 'Choose a Basic False Ceiling, Standard Light Effects, Simple Cove Lighting, a Basic Pendant Light, and a Night Lamp.', 'Upgrade to a Premium False Ceiling with Enhanced Light Effects, Designer Cove Lighting, and a High-Quality Pendant Light.', 'Revel in a Custom False Ceiling with Designer Cove Lighting, High-End Pendant Lights, and Luxurious Night Lamps.'),
(44, 'Kids\'/Children\'s Bedroom', 'Furniture & Decor', 'Decorate with a Basic TV Unit, Simple Showpiece, and Standard Wall Paneling or Texture Paint.', 'Refine your space with a Designer TV Unit, Premium Showpiece, and High-Quality Wall Paneling or Premium Texture Paint.', 'Luxuriate in an Opulent TV Unit, Custom Showpiece, and Exclusive Wall Paneling or Designer Wallpaper.'),
(45, 'Kids\'/Children\'s Bedroom', 'Electrical Work', 'Utilize Basic Plug Points, Standard Switches, Hidden Wiring, Dimmer Switches, USB Charging Points, and Child-Safe Outlets.', 'Opt for Premium Plug Points, Advanced Hidden Wiring, Enhanced Dimmer Switches, Additional USB Charging Points, and Child-Safe Outlets.', 'Benefit from High-End Electrical Solutions, Smart Wiring, Advanced Dimmer Systems, and Premium Child-Safe Outlets.'),
(46, 'Kids\'/Children\'s Bedroom', 'Painting', 'Choose Standard Wall Painting, Basic Ceiling Painting, and a Chalkboard Wall.', 'Upgrade to Premium Wall Painting, Enhanced Ceiling Painting, and a Custom Chalkboard Wall.', 'Enjoy High-End Paint Finishes for Walls and Ceilings, and a Luxury Chalkboard Wall.'),
(47, 'Kids\'/Children\'s Bedroom', 'Automation', 'Implement Basic Lights Automation and Simple Curtain Automation.', 'Enhance with Advanced Lights Automation and Premium Curtain Automation.', 'Experience Advanced Lights Automation and High-End Curtain Automation for a fully integrated home.'),
(48, 'Kids\'/Children\'s Bedroom', 'Miscellaneous', 'Organize with Basic Toys Storage, a Simple Activity Area, a Basic Reading Corner, Custom Themes, and Growth Chart Stickers.', 'Elevate with Designer Toys Storage, a Premium Activity Area, a Custom Reading Corner, Enhanced Custom Themes, and Quality Growth Chart Stickers.', 'Luxuriate with Luxury Toys Storage, an Exclusive Activity Area, a Designer Reading Corner, Premium Custom Themes, and Designer Growth Chart Wall Stickers.'),
(49, 'Parents\' Bedroom', 'Bed & Storage', 'Unwind in a Master/Queen Bed with Standard Storage Below, a Side Table, and a Basic Headboard.', 'Upgrade to a Designer Master/Queen Bed with Enhanced Storage, a Custom Side Table, and a Premium Headboard.', 'Indulge in a High-End Master/Queen Bed with Luxury Storage Solutions Below, Designer Side Tables, and a High-End Headboard.'),
(50, 'Parents\' Bedroom', 'Wardrobe & Cabinets', 'Choose Standard Double Wardrobes with Basic Loft Storage, Simple Custom Cabinetry, and Open Shelves.', 'Opt for Premium Double Wardrobes with Enhanced Loft Storage, High-Quality Custom Cabinetry, and Designer Open Shelves.', 'Enjoy Luxury Double Wardrobes with High-End Custom Cabinetry and Premium Designer Open Shelves.'),
(51, 'Parents\' Bedroom', 'Study Area', 'Set up a Basic Study Table with Standard Storage Above, and Simple Reading Lamps.', 'Elevate with a Premium Study Table, Enhanced Storage Above, and Designer Reading Lamps.', 'Transform with a High-End Study Table, Luxury Storage Solutions, and Premium Reading Lamps for a sophisticated workspace.'),
(52, 'Parents\' Bedroom', 'Ceiling & Lighting', 'Select a Basic False Ceiling with Standard Light Effects, Simple Cove Lighting, and Basic Pendant Lights.', 'Enhance with Premium Light Effects, Enhanced Cove Lighting, and Designer Pendant Lights.', 'Experience Custom False Ceiling with Designer Cove Lighting and High-End Pendant Lights for a luxurious touch.'),
(53, 'Parents\' Bedroom', 'Furniture & Decor', 'Decorate with a Standard TV Unit, Basic Showpiece Unit, and Wall Paneling or Texture Paint.', 'Refine with a Designer TV Unit, Premium Showpiece Unit, and High-Quality Wall Paneling or Premium Texture Paint.', 'Luxuriate in a Luxury TV Unit, Custom Showpiece Unit, and Exclusive Wall Paneling or Designer Wallpaper.'),
(54, 'Parents\' Bedroom', 'Electrical Work', 'Use Basic Plug Points, Standard Switches, Hidden Wiring, Dimmer Switches, and USB Charging Points.', 'Upgrade to Premium Plug Points, Enhanced Hidden Wiring, Advanced Dimmer Switches, and Additional USB Charging Points.', 'Benefit from High-End Electrical Solutions, Smart Wiring, Advanced Dimmer Systems, and Premium USB Charging Points.'),
(55, 'Parents\' Bedroom', 'Painting', 'Enjoy Standard Wall Painting and Basic Ceiling Painting.', 'Opt for Premium Wall Painting with Enhanced Ceiling Painting for a refined finish.', 'Revel in High-End Paint Finishes for Walls and Ceilings for a luxurious look.'),
(56, 'Parents\' Bedroom', 'Automation', 'Implement Basic Lights Automation and Simple Curtain Automation.', 'Enhance with Advanced Lights Automation and Premium Curtain Automation for added convenience.', 'Experience Advanced Lights Automation and High-End Curtain Automation for a fully integrated home environment.'),
(57, 'Parents\' Bedroom', 'Miscellaneous', 'Organize with a Basic Dressing Unit, Standard Vanity Units, and a Simple Full-Length Mirror.', 'Elevate with a Designer Dressing Unit, Premium Vanity Units, and a High-Quality Full-Length Mirror with Dressing Storage.', 'Luxuriate with a Luxury Dressing Unit, Custom Vanity Units, and an Exclusive Full-Length Mirror for an elegant touch.'),
(58, 'Guest Bedroom', 'Bed & Storage', 'Relax with a Master/Queen Bed or a Sofa Cum Bed, featuring Standard Storage Below, a Side Table, and a Basic Headboard.', 'Upgrade to a Designer Master/Queen Bed or an Enhanced Sofa Cum Bed, with Premium Storage Solutions Below, a Custom Side Table, and a Designer Headboard.', 'Indulge in a High-End Master/Queen Bed or Luxury Sofa Cum Bed, complete with Premium Storage Solutions, High-End Side Tables, and a Luxurious Headboard.'),
(59, 'Guest Bedroom', 'Wardrobe & Cabinets', 'Utilize a Single Wardrobe with Basic Loft Above and Open Shelves.', 'Opt for an Enhanced Single Wardrobe with Premium Loft Above and High-Quality Open Shelves.', 'Enjoy a Luxury Single Wardrobe with High-End Loft Above and Premium Designer Open Shelves.'),
(60, 'Guest Bedroom', 'Ceiling & Lighting', 'Settle under a Basic False Ceiling with Standard Light Effects, Simple Cove Lighting, Pendant Lights, and Bedside Lamps.', 'Elevate the ambiance with Premium Light Effects, Enhanced Cove Lighting, Designer Pendant Lights, and High-Quality Bedside Lamps.', 'Transform your space with a Custom False Ceiling, Advanced Cove Lighting, High-End Pendant Lights, and Premium Bedside Lamps.'),
(61, 'Guest Bedroom', 'Furniture & Decor', 'Furnish with a Standard TV Unit, Basic Showpiece Unit, Wall Paneling, Texture Paint, Wallpaper, Curtains, and Rugs.', 'Enhance with a Designer TV Unit, Premium Showpiece Unit, High-Quality Wall Paneling or Enhanced Texture Paint.', 'Luxuriate with a Luxury TV Unit, Custom Showpiece Unit, Exclusive Wall Paneling, or Designer Wallpaper for a refined touch.'),
(62, 'Guest Bedroom', 'Electrical Work', 'Use Basic Plug Points, Standard Switches, Hidden Wiring, Dimmer Switches, and USB Charging Points.', 'Upgrade to Premium Plug Points, Enhanced Hidden Wiring, Advanced Dimmer Switches, and Additional USB Charging Points.', 'Benefit from High-End Electrical Solutions, Smart Wiring, Advanced Dimmer Systems, and Premium USB Charging Points.'),
(63, 'Guest Bedroom', 'Painting', 'Enjoy Standard Wall Painting and Basic Ceiling Painting.', 'Opt for Premium Wall Painting with Enhanced Ceiling Painting for a refined look.', 'Revel in High-End Paint Finishes for Walls and Ceilings for a sophisticated ambiance.'),
(64, 'Guest Bedroom', 'Automation', 'Implement Basic Lights Automation for convenience.', 'Enhance with Advanced Lights Automation for a touch of luxury.', 'Experience Advanced Lights Automation for a seamless, high-end home experience.'),
(65, 'Guest Bedroom', 'Miscellaneous', 'Equip with a Standard Luggage Rack, Basic Writing Desk, Mirror, and Comfortable Seating.', 'Upgrade to a Premium Luggage Rack, Designer Writing Desk, High-Quality Mirror, and Enhanced Comfortable Seating.', 'Luxuriate with a Luxury Luggage Rack, Custom Writing Desk, Premium Mirror, and High-End Comfortable Seating for an elegant touch.'),
(66, 'Study Room/Home Office', 'Furniture', 'Set up with a Basic Study Table/Desk, Standard Ergonomic Chair, Simple Storage Cabinet/s, Standard Bookshelves, and Basic Filing Cabinet/s.', 'Upgrade to a Premium Study Table/Desk, Designer Ergonomic Chair, Enhanced Storage Cabinet/s, Custom Bookshelves, and High-Quality Filing Cabinet/s.', 'Opt for a Luxury Study Desk with Adjustable Height, High-End Ergonomic Chair, Luxury Storage Cabinets, Designer Bookshelves, and Premium Filing Cabinet/s.'),
(67, 'Study Room/Home Office', 'Storage Solutions', 'Utilize Basic Overhead Storage, Standard Shelving Units, and Simple Modular Cabinet/s.', 'Enhance with Premium Overhead Storage, High-Quality Shelving Unit/s, and Custom Modular Cabinet/s.', 'Experience Luxury Overhead Storage, Designer Shelving Unit/s, and Premium Modular Cabinet/s.'),
(68, 'Study Room/Home Office', 'Ceiling & Lighting', 'Enjoy a Simple False Ceiling with Standard Task Lighting, Basic Light Effects, Recessed Lights, and Desk Lamps.', 'Upgrade to Enhanced False Ceiling, Premium Task Lighting, Designer Light Effects, High-Quality Recessed Lights, and Custom Desk Lamps.', 'Transform with a Custom False Ceiling with Integrated Lighting, Advanced Task Lighting, Luxury Light Effects, Designer Recessed Lights, and High-End Desk Lamps.'),
(69, 'Study Room/Home Office', 'Electrical Work', 'Basic Plug Points, Standard Switches, Hidden Wiring, Data Points, and USB Charging Points.', 'Opt for Enhanced Plug Points, Premium Switches, Advanced Hidden Wiring, Additional Data Points, and Extra USB Charging Points.', 'Benefit from High-End Electrical Work with Smart Systems, Advanced Data Points, and Luxury USB Charging Solutions.'),
(70, 'Study Room/Home Office', 'Painting', 'Choose Standard Wall Painting or Wallpaper.', 'Upgrade to Premium Wall Painting or Enhanced Wallpaper, with a Custom Whiteboard Wall.', 'Indulge in Luxury Paint Finishes or Designer Wallpaper, with High-End Whiteboard Walls.'),
(71, 'Study Room/Home Office', 'Automation', 'Basic Lights Automation and Simple Blinds Automation.', 'Enhance with Advanced Lights Automation and Premium Blinds Automation.', 'Experience Advanced Lights and Blinds Automation with Smart Controls for a seamless experience.'),
(72, 'Study Room/Home Office', 'Miscellaneous', 'Incorporate a Standard Printer Stand, Basic Lockable Drawers, and Simple Cable Management Systems.', 'Upgrade to a Premium Printer Stand, Enhanced Lockable Drawers, and High-Quality Cable Management Systems.', 'Luxuriate with a Multifunctional Printer Stand, Custom Lockable Drawers, and Premium Cable Management Systems.'),
(73, 'Walk-in-Wardrobe', 'Wardrobe Units', 'Enjoy Basic Custom Wardrobe Units with Standard Shelves, Hanging Rods, Basic Drawers, and Standard Shoe Racks.', 'Upgrade to Premium Wardrobe Units featuring Superior Materials, Enhanced Shelves, Soft-Close Drawers, and Advanced Shoe Racks.', 'Indulge in Luxury Wardrobe Units crafted from High-End Materials, Customized Shelves, Premium Hanging Rods, Soft-Close Drawers, and Luxury Shoe Organizers.'),
(74, 'Walk-in-Wardrobe', 'Storage Solutions', 'Utilize Standard Overhead Storage, Simple Lofts, Basic Pull-Out Drawers, and Basic Corner Units.', 'Enhance with Premium Overhead Storage, High-Quality Lofts, Smooth Pull-Out Drawers, Premium Corner Units, and Trouser Racks.', 'Experience Luxury Overhead Storage, Designer Lofts, High-End Pull-Out Drawers, Advanced Corner Units, and Custom Trouser Racks.'),
(75, 'Walk-in-Wardrobe', 'Lighting', 'Basic LED Strip Lighting, Standard Spotlights, and Basic Under-Shelf Lights illuminate your space.', 'Upgrade to Premium LED Strip Lighting, Designer Spotlights, Sensor Lights, and Enhanced Under-Shelf Lights.', 'Transform with Luxury LED Strip Lighting, Smart Spotlights, Advanced Sensor-Based Lighting, High-End Under-Shelf Lights, and Designer Ceiling Lights.'),
(76, 'Walk-in-Wardrobe', 'Flooring', 'Standard Wooden Flooring, Basic Vinyl Flooring, Standard Carpet, and Basic Tiling complete the look.', 'Opt for Premium Wooden Flooring, High-Quality Vinyl Flooring, Enhanced Carpet, and Premium Tiling.', 'Luxuriate with Hardwood Flooring, Designer Vinyl Flooring, Premium Carpets, and High-End Designer Tiling.'),
(77, 'Walk-in-Wardrobe', 'Wall Treatments', 'Basic Wall Paneling, Standard Texture Paint, and Simple Wallpaper.', 'Upgrade to Enhanced Wall Paneling, Premium Texture Paint, Designer Wallpaper, and Decorative Mirrors.', 'Indulge in Luxury Wall Paneling with Advanced Materials, Custom Texture Paint, High-End Wallpaper, and Full Wall Mirrors.'),
(78, 'Walk-in-Wardrobe', 'Doors and Shutters', 'Basic Sliding Doors and Hinged Doors.', 'Opt for Premium Sliding Doors, Enhanced Hinged Doors, and High-Quality Glass Shutters.', 'Luxuriate with Luxury Sliding Doors featuring a Soft-Close Mechanism, Designer Hinged Doors, and High-End Glass and Mirror Shutters.'),
(79, 'Walk-in-Wardrobe', 'Accessories', 'Basic Mirrors, Hooks, Valet Rods, and Ottoman/s for practical use.', 'Upgrade to Premium Mirrors, Designer Hooks, Enhanced Valet Rods, Premium Ottoman/s, and Basic Jewelry Organizers.', 'Experience Luxury Full-Length Mirrors, Custom Hooks, High-End Valet Rods, Designer Ottoman/s, and Luxury Jewelry Organizers.'),
(80, 'Walk-in-Wardrobe', 'Electrical Work', 'Basic Plug Points, Standard Switches, and Hidden Wiring.', 'Enhance with Premium Plug Points, Advanced Switches, Enhanced Hidden Wiring, and Extra USB Charging Points.', 'Benefit from Luxury Electrical Work with Smart Switches, High-End Hidden Wiring, and Multiple USB Charging Stations.'),
(81, 'Walk-in-Wardrobe', 'False Ceiling', 'Simple Ceiling Design, Standard Gypsum Ceiling, and Basic POP Design.', 'Upgrade to Enhanced Ceiling Design, Premium Gypsum Ceiling, Advanced POP Design, and Designer Cove Lighting.', 'Transform with Luxury Ceiling Design featuring Integrated Lighting, Designer Gypsum Ceiling, Custom POP Design, and Advanced Cove Lighting.'),
(82, 'Walk-in-Wardrobe', 'Painting', 'Standard Wall Painting, Basic Ceiling Painting, and Standard Varnish or Polish for Woodwork.', 'Opt for Premium Wall Painting, High-Quality Ceiling Painting, and Enhanced Varnish or Polish for Woodwork.', 'Indulge in Luxury Wall and Ceiling Painting with High-End Finishes and Custom Varnish or Polish for Premium Woodwork.'),
(83, 'Walk-in-Wardrobe', 'Automation', 'Basic Automated Lights.', 'Upgrade to Enhanced Automated Lights and Motorized Shutters.', 'Experience Luxury Smart Lighting Systems, Motorized Shutters with Remote Control, and Advanced Sensor-Based Systems.'),
(84, 'Bathroom/Toilet', 'Sanitary Fixtures', 'Standard toilet, washbasin, basic shower area, and standard flush system.', 'Designer toilet, washbasin with vanity unit, luxurious rain shower, wall-mounted flush system, and hand-held showers.', 'High-end toilet with concealed tank, elegant washbasin with designer vanity, indulgent bathtub, bidet, and multi-jet shower system.'),
(85, 'Bathroom/Toilet', 'Storage Solutions', 'Basic wall-mounted shelves and towel rack for essential storage.', 'Custom vanity with built-in storage, sleek medicine cabinet with mirror, and stylish glass shelves.', 'Bespoke cabinetry with integrated LED lighting, expansive linen closet, and luxury towel warmers.'),
(86, 'Bathroom/Toilet', 'Ceiling & Lighting', 'Basic false ceiling with standard waterproof recessed lighting.', 'Designer false ceiling with task lighting, mirror lights, and dimmable LED fixtures.', 'Customized ceiling design with sophisticated cove lighting, smart mirror lighting, and motion-activated illumination.'),
(87, 'Bathroom/Toilet', 'Plumbing Fixtures', 'Standard water outlets, faucets, and showerhead.', 'Premium faucets and mixers, hot and cold mixer units, and high-quality showerhead.', 'Luxury fixtures with smart faucets, digital thermostatic mixers, and a deluxe handheld and rain shower combo.'),
(88, 'Bathroom/Toilet', 'Electrical Work', 'Standard plug points, switches, and basic geyser installation.', 'Modular switches, premium plug points, exhaust fan with timer, and waterproof switches.', 'Advanced smart switches, intelligent geyser, USB charging points, and a silent exhaust fan with smart controls.'),
(89, 'Bathroom/Toilet', 'Flooring', 'Anti-skid tiles for safe and practical flooring.', 'Premium anti-skid tiles, marble, or luxury vinyl flooring.', 'High-end marble flooring, custom mosaic designs, and indulgent heated floors.'),
(90, 'Bathroom/Toilet', 'Wall Treatments', 'Basic wall tiles and moisture-resistant paint.', 'Designer wall tiles, eye-catching accent backsplash, and elegant texture paint.', 'Luxury wall tiles with custom patterns, natural stone cladding, and sophisticated backlit panels.'),
(91, 'Bathroom/Toilet', 'Painting', 'Waterproof wall painting and standard ceiling painting.', 'Moisture-resistant textured wall painting and designer ceiling finishes.', 'High-end waterproof paint with textured effects and custom mural painting.'),
(92, 'Bathroom/Toilet', 'Renovation', 'Basic waterproofing, minor civil changes, and standard space optimization.', 'Advanced waterproofing, space optimization with custom cabinetry, and air conditioning installation.', 'Complete remodeling with custom space planning, luxury waterproofing solutions, and integrated HVAC systems.'),
(93, 'Bathroom/Toilet', 'Accessories', 'Standard mirrors, soap dispensers, basic towel holders, and shower curtains.', 'Designer mirrors with storage, branded soap dispensers, towel rails, and stylish bath mats.', 'Smart mirrors with built-in lighting, heated towel rails, luxury bath accessories, and elegant vanity mirrors.'),
(94, 'Bathroom/Toilet', 'Automation', 'Basic motion sensor lights for convenience.', 'Automated faucets, smart mirrors with defogging capabilities, and advanced smart exhaust fans.', 'Fully automated smart bathroom system with intelligent faucets, mirrors, lights, heated towel rails, and smart showers.'),
(95, 'Bathroom/Toilet', 'Miscellaneous', 'Basic single glass partition between dry and wet areas.', 'Premium glass partition with one openable glass door and high-quality hardware between wet and dry areas.', 'Branded toughened glass partition with a sleek sliding glass door and superior quality hardware for separation.'),
(96, 'Balcony/Terrace', 'Ceiling & Lighting', 'Simple Sherawood with basic paint false ceiling, basic outdoor lighting, and string lights.', 'PVC false ceiling with enhanced outdoor lighting, premium lanterns, and stylish spotlights.', 'Luxury HPL false ceiling with weather-proof materials, high-end outdoor lighting, designer lanterns, and smart lighting.'),
(97, 'Balcony/Terrace', 'Wall Treatments', 'Basic wall paneling, standard texture paint, and outdoor wallpaper.', 'Premium wall paneling, high-quality texture paint, decorative cladding, and vertical garden walls.', 'Luxury wall treatments with custom cladding, designer outdoor wallpaper, high-end vertical garden walls, and integrated watering systems.'),
(98, 'Balcony/Terrace', 'Furniture', 'Basic outdoor seating, simple swing chairs, and folding chairs.', 'Premium outdoor seating with upgraded cushions, designer swing chairs, and high-quality folding chairs.', 'Luxury outdoor seating with custom cushions, bespoke swing chairs, hammocks with stands, and weather-resistant materials.'),
(99, 'Balcony/Terrace', 'Planters & Greens', 'Standard potted plants and basic hanging planters.', 'High-end potted plants, designer hanging planters, green wall, and decorative trellises.', 'Luxury green wall systems with integrated irrigation, custom flower beds, designer trellises, and advanced landscaping features.'),
(100, 'Balcony/Terrace', 'Electrical Work', 'Basic plug points, standard switches, and hidden wiring for basic outdoor lighting.', 'Enhanced plug points, premium switches, advanced hidden wiring for outdoor lighting, and USB charging points.', 'Luxury electrical setup with smart control systems, high-end hidden wiring, and multiple USB charging points.'),
(101, 'Balcony/Terrace', 'Painting', 'Standard exterior paint.', 'Premium weather-resistant paint with high-end exterior finishes.', 'Luxury exterior paint with advanced weather protection and designer finishes.'),
(102, 'Balcony/Terrace', 'Automation', 'Basic smart lights for automated convenience.', 'Automated irrigation system, premium smart lights, and retractable awnings.', 'Luxury automated irrigation with smart sensors, high-end smart lighting systems, and motorized retractable awnings.'),
(103, 'Utility Room', 'Laundry Area', 'Basic washing machine space, utility sink, standard detergent and cleaning storage.', 'Enhanced washing machine & dryer space, folding counter, high-end utility sink.', 'Custom washing & dryer stations, premium folding counters, luxury detergent dispensers, built-in laundry sorting solutions.'),
(104, 'Utility Room', 'Storage Solutions', 'Overhead cabinets, basic under-counter storage, standard shelving units.', 'Premium overhead cabinets, enhanced under-counter storage, custom shelving, integrated laundry baskets.', 'Luxury cabinets with soft-close mechanisms, pull-out laundry baskets, high-end shelving systems.'),
(105, 'Utility Room', 'Electrical Work', 'Standard plug points, switches, basic hidden wiring.', 'Enhanced plug points, premium switches, high-quality hidden wiring, water heater installation.', 'Luxury electrical systems with smart control panels, high-end hidden wiring, advanced water heater with smart features.'),
(106, 'Utility Room', 'Ceiling & Lighting', 'Basic false ceiling, standard light effects, simple recessed lighting.', 'Premium false ceiling, designer light effects, advanced recessed lighting, task lighting.', 'Luxury false ceiling with high-end finishes, advanced recessed lighting with dimming, designer task lighting.'),
(107, 'Utility Room', 'Wall Treatments', 'Basic wall paneling, moisture-resistant paint, standard tiles.', 'Premium wall paneling, high-quality moisture-resistant paint, designer tiles, backsplash.', 'Luxury wall paneling with custom finishes, high-end moisture-resistant paint, designer backsplash with integrated storage.'),
(108, 'Utility Room', 'Plumbing Fixtures', 'Standard utility sink, basic water outlets, simple drainage solutions.', 'Premium utility sink, high-quality water outlets, enhanced drainage solutions.', 'Luxury utility sink with custom features, advanced water outlets, high-end drainage systems.'),
(109, 'Utility Room', 'Painting', 'Standard wall painting, basic waterproofing paint.', 'Premium wall painting, advanced waterproofing paint.', 'Luxury wall painting with special finishes, high-performance waterproofing solutions.'),
(110, 'Utility Room', 'Accessories', 'Basic ironing board, standard foldable drying racks, hooks.', 'Premium ironing board with integrated storage, designer drying racks, pegboards.', 'Luxury ironing stations with built-in storage, high-end foldable drying racks, custom hooks and pegboards with storage solutions.'),
(111, 'Utility Room', 'Automation', 'Basic smart appliances, standard motion sensor lights.', 'Premium smart appliances, advanced motion sensor lights, automated exhaust fans.', 'Luxury smart appliances with custom programming, high-end motion sensor systems, smart exhaust fans with air quality monitoring.'),
(112, 'Puja Room', 'Prayer Unit', 'Basic Mandir Unit with Open Shelves and Standard Closed Cabinets', 'Premium Mandir with Elegant Closed Cabinets and Pooja Bells', 'Transform your spiritual space with an Exquisite Mandir Unit, featuring Intricate Carvings and Custom Pooja Bells for a truly divine ambiance.'),
(113, 'Puja Room', 'Storage Solutions', 'Basic Cabinets for Religious Books, Standard Drawers for Pooja Items', 'Premium Cabinets with Soft-Close Mechanisms and Custom Shelving Units for Pooja Items', 'Elevate your sacred storage with Opulent Solutions featuring Hidden Compartments and High-End Drawer Systems, tailored for your treasured items.'),
(114, 'Puja Room', 'Ceiling & Lighting', 'Basic False Ceiling with Standard Light Effects and Simple Focus Lights on Deity', 'Designer False Ceiling with Premium Light Effects and Advanced Cove Lighting', 'Illuminate your devotion with a Luxurious False Ceiling and Intelligent Lighting Systems that enhance every prayer and ritual.'),
(115, 'Puja Room', 'Wall Treatments', 'Basic Wall Paneling with Standard Texture Paint and Simple Wallpaper', 'Premium Wall Paneling with High-Quality Texture Paint, Designer Wallpaper, and Marble Cladding', 'Revitalize your walls with Lavish Marble Cladding and Custom Treatments that reflect the grandeur of your spiritual practice.'),
(116, 'Puja Room', 'Electrical Work', 'Standard Plug Points, Basic Switches, and Simple Dimmer Switches with Basic Hidden Wiring for Lamps', 'Premium Plug Points with High-Quality Switches, Advanced Dimmer Switches, and High-End Hidden Wiring Systems', 'Power your prayers with Elite Electrical Solutions featuring Smart Control Panels and Advanced Wiring, ensuring convenience and efficiency.'),
(117, 'Puja Room', 'Painting', 'Standard Wall Painting and Basic Ceiling Painting', 'Premium Wall Painting with Texture Finishes and High-Quality Ceiling Painting', 'Adorn your sanctuary with Luxurious Paint Finishes and Custom Designs, adding a touch of artistry to your spiritual haven.'),
(118, 'Puja Room', 'Automation', 'Basic Lights Automation and Standard Automated Curtains', 'Premium Lights Automation with Custom Settings and Sensor-Based Incense Burner', 'Experience modern spirituality with Sophisticated Lights Automation and Smart Incense Burners, creating a seamless and elevated prayer environment.'),
(119, 'Entertainment Room', 'Seating', 'Basic Sofa Set, Sofa Cum Bed, Standard Recliners, Basic Lounge Chairs, Bean Bags', 'Premium Sofa Set with Comfort Features, Recliners, Designer Lounge Chairs, Upholstered Bean Bags', 'Indulge in ultimate relaxation with a Luxurious Sofa Set, Motorized Recliners with Massage Features, and High-End Lounge Chairs, all tailored to your comfort.'),
(120, 'Entertainment Room', 'Storage', 'Standard TV Unit, Simple Showpiece Unit, Basic Entertainment Wall Units', 'Customized TV Unit with Storage, Designer Showpiece Units, Built-In Entertainment Wall Units', 'Elevate your entertainment with Opulent Wall Units featuring Integrated Lighting and Hidden Storage for a seamless and sophisticated setup.'),
(121, 'Entertainment Room', 'Ceiling & Lighting', 'Basic False Ceiling, Standard Light Effects, Basic Lights Automation', 'Designer False Ceiling, Premium Light Effects, Advanced Lights Automation, Cove Lighting', 'Transform your space with a High-End Ceiling and Advanced Mood Lighting Systems, offering Voice-Controlled Automation for a tailored ambiance.'),
(122, 'Entertainment Room', 'Furniture & Decor', 'Standard Artifacts, Basic Wall Paneling or Texture Paint or Wallpaper, Simple Acoustic Panels', 'Premium Artifacts, Designer Wall Paneling, High-Quality Texture Paint or Customized Wallpaper, Advanced Acoustic Panels', 'Create a statement with Luxurious Artifacts, High-End Wall Paneling, and Custom Acoustic Solutions, complemented by Designer Curtains with Automation.'),
(123, 'Entertainment Room', 'Electrical Work', 'Basic Plug Points, Standard Switches, Basic Hidden Wiring, Simple AV Points, Basic HDMI Outlets, USB Charging Points', 'Premium Plug Points with Smart Features, Designer Switches, High-Quality Hidden Wiring, Advanced AV Points, HDMI Outlets', 'Upgrade your power setup with Luxury Electrical Systems featuring Smart Home Integration, High-End Switches, and Advanced AV and HDMI Configurations.'),
(124, 'Entertainment Room', 'Painting', 'Standard Wall Painting, Basic Ceiling Painting', 'Premium Wall Painting with Textured Finishes, Designer Ceiling Painting', 'Enhance your walls with Luxurious Paint Finishes and Custom Artwork, creating a visually stunning backdrop for your entertainment.'),
(125, 'Entertainment Room', 'Automation', 'Basic Home Theater System Automation, Basic Lights Automation', 'Premium Home Theater System with Multi-Room Integration, Advanced Lights Automation', 'Immerse in a seamless experience with a Luxurious Home Theater System featuring Full Home Integration and Voice-Controlled Automation for Lights, Climate, and Entertainment.'),
(126, 'Multipurpose Room', 'Seating', 'Basic Sofa Set or Sofa Cum Bed &/or Standard Recliners, Simple Modular Seating, Basic Floor Cushions', 'Premium Sofa Set with Custom Upholstery &/or Designer Recliners, Advanced Modular Seating with Storage, Premium Floor Cushions', 'Experience unrivaled comfort with a Luxury Sofa Set featuring Smart Features, Motorized Recliners, and High-End Modular Seating Systems, complemented by Designer Floor Cushions.'),
(127, 'Multipurpose Room', 'Storage Solutions', 'Basic Built-In Shelves, Standard Cabinets, Simple Multipurpose Storage, Basic Open Racks', 'Customized Built-In Shelves, Designer Cabinets, Premium Multipurpose Storage with Pull-Out Systems, Modern Open Racks', 'Reimagine your storage with Luxury Solutions including High-End Finishes, Hidden Storage with Motorized Access, and Custom Shelves with LED Lighting.'),
(128, 'Multipurpose Room', 'Ceiling & Lighting', 'Basic False Ceiling, Standard Light Effects, Simple Recessed Lighting, Basic Task Lighting, Standard Mood Lighting', 'Designer False Ceiling, Advanced Light Effects, Premium Recessed Lighting, Designer Task Lighting, Enhanced Mood Lighting', 'Illuminate your space with a Luxury False Ceiling featuring Artistic Design, High-End Mood Lighting Systems with Automation, and Advanced Task Lighting with Smart Controls.'),
(129, 'Multipurpose Room', 'Furniture & Decor', 'Basic Foldable Table, Simple Convertible Furniture, Standard Wall Paneling or Texture Paint', 'Designer Foldable Table, High-Quality Convertible Furniture, Premium Wall Paneling or Custom Texture Paint', 'Elevate your decor with a Luxury Foldable Table with Smart Mechanisms, High-End Convertible Furniture, and Luxury Wall Paneling with Custom Textures.'),
(130, 'Multipurpose Room', 'Electrical Work', 'Basic Plug Points, Standard Switches, Basic USB Charging Points, Simple Hidden Wiring for AV Equipment', 'Designer Plug Points and Switches with Smart Features, High-Quality USB Charging Points, Advanced Hidden Wiring for AV Equipment', 'Upgrade your electrical setup with a Luxury Electrical System featuring Complete Smart Home Integration, High-End USB Charging Points with Fast-Charging Options, and Specialized Wiring for Home Automation.'),
(131, 'Multipurpose Room', 'Painting', 'Standard Wall Painting, Simple Chalkboard Walls, Basic Accent Walls', 'Premium Wall Painting with Textured Finishes, Designer Chalkboard Walls, High-End Accent Walls', 'Transform your walls with Luxury Painting featuring Custom Artwork, Personalized Chalkboard Walls, and Artistic Accent Walls.'),
(132, 'Multipurpose Room', 'Automation', 'Basic Lights Automation, Basic Blinds Automation, Standard Motorized Furniture', 'Advanced Lights Automation with Smart Controls, Premium Blinds Automation, High-End Motorized Furniture', 'Control your environment with a Luxury Home Automation System featuring Voice Control, Custom Motorized Furniture with Memory Settings, and Smart Blinds with Voice Activation.');

-- --------------------------------------------------------

--
-- Table structure for table `room_master`
--

CREATE TABLE `room_master` (
  `room_id` int(2) NOT NULL,
  `room_type` varchar(28) DEFAULT NULL,
  `standard_area` int(3) DEFAULT NULL,
  `mumbai` int(6) DEFAULT NULL,
  `bangalore` int(6) DEFAULT NULL,
  `hyderabad` int(6) DEFAULT NULL,
  `noida` int(6) DEFAULT NULL,
  `pune` int(6) DEFAULT NULL,
  `ahmedabad` int(6) DEFAULT NULL,
  `indore` int(6) DEFAULT NULL,
  `jaipur` int(6) DEFAULT NULL,
  `nagpur` int(6) DEFAULT NULL,
  `surat` int(6) DEFAULT NULL,
  `nasik` int(6) DEFAULT NULL,
  `interior_type_id` int(11) NOT NULL,
  `noida2` double DEFAULT 0,
  `delhi` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `room_master`
--

INSERT INTO `room_master` (`room_id`, `room_type`, `standard_area`, `mumbai`, `bangalore`, `hyderabad`, `noida`, `pune`, `ahmedabad`, `indore`, `jaipur`, `nagpur`, `surat`, `nasik`, `interior_type_id`, `noida2`, `delhi`) VALUES
(1, 'Entrance Lobby & Living Room', 375, 750000, 675000, 637500, 645000, 600000, 450000, 412500, 412500, 375000, 412500, 337500, 1, 0, 0),
(2, 'Kitchen', 125, 250000, 225000, 212500, 215000, 200000, 150000, 137500, 137500, 125000, 137500, 112500, 1, 0, 0),
(3, 'Dining Room', 160, 320000, 288000, 272000, 275200, 256000, 192000, 176000, 176000, 160000, 176000, 144000, 1, 0, 0),
(4, 'Passage/Lobby/Corridor', 60, 120000, 108000, 102000, 103200, 96000, 72000, 66000, 66000, 60000, 66000, 54000, 1, 0, 0),
(5, 'Master Bedroom', 200, 400000, 360000, 340000, 344000, 320000, 240000, 220000, 220000, 200000, 220000, 180000, 1, 0, 0),
(6, 'Kids\'/Children\'s Bedroom', 125, 250000, 225000, 212500, 215000, 200000, 150000, 137500, 137500, 125000, 137500, 112500, 1, 0, 0),
(7, 'Parents\' Bedroom', 160, 320000, 288000, 272000, 275200, 256000, 192000, 176000, 176000, 160000, 176000, 144000, 1, 0, 0),
(8, 'Guest Bedroom', 150, 300000, 270000, 255000, 258000, 240000, 180000, 165000, 165000, 150000, 165000, 135000, 1, 0, 0),
(9, 'Study Room/Home Office', 120, 240000, 216000, 204000, 206400, 192000, 144000, 132000, 132000, 120000, 132000, 108000, 1, 0, 0),
(10, 'Walk-in-Wardrobe', 75, 150000, 135000, 127500, 129000, 120000, 90000, 82500, 82500, 75000, 82500, 67500, 1, 0, 0),
(11, 'Bathroom/Toilet', 60, 120000, 108000, 102000, 103200, 96000, 72000, 66000, 66000, 60000, 66000, 54000, 1, 0, 0),
(12, 'Balcony/Terrace', 100, 200000, 180000, 170000, 172000, 160000, 120000, 110000, 110000, 100000, 110000, 90000, 1, 0, 0),
(13, 'Utility Room', 75, 150000, 135000, 127500, 129000, 120000, 90000, 82500, 82500, 75000, 82500, 67500, 1, 0, 0),
(14, 'Puja Room', 40, 80000, 72000, 68000, 68800, 64000, 48000, 44000, 44000, 40000, 44000, 36000, 1, 0, 0),
(15, 'Entertainment Room', 250, 500000, 450000, 425000, 430000, 400000, 300000, 275000, 275000, 250000, 275000, 225000, 1, 0, 0),
(16, 'Multipurpose Room', 200, 400000, 360000, 340000, 344000, 320000, 240000, 220000, 220000, 200000, 220000, 180000, 1, 0, 0),
(17, 'Reception Area', 200, 440000, 400000, 380000, 384000, 360000, 280000, 260000, 260000, 240000, 260000, 220000, 2, 0, 0),
(18, 'Waiting Area', 150, 330000, 300000, 285000, 288000, 270000, 210000, 195000, 195000, 180000, 195000, 165000, 2, 0, 0),
(19, 'Open Workspace', 500, 1100000, 1000000, 950000, 960000, 900000, 700000, 650000, 650000, 600000, 650000, 550000, 2, 0, 0),
(20, 'Cubicle', 100, 220000, 200000, 190000, 192000, 180000, 140000, 130000, 130000, 120000, 130000, 110000, 2, 0, 0),
(21, 'Private Office', 250, 550000, 500000, 475000, 480000, 450000, 350000, 325000, 325000, 300000, 325000, 275000, 2, 0, 0),
(22, 'Conference Room', 400, 880000, 800000, 760000, 768000, 720000, 560000, 520000, 520000, 480000, 520000, 440000, 2, 0, 0),
(23, 'Meeting Room', 200, 440000, 400000, 380000, 384000, 360000, 280000, 260000, 260000, 240000, 260000, 220000, 2, 0, 0),
(24, 'Boardroom', 350, 770000, 700000, 665000, 672000, 630000, 490000, 455000, 455000, 420000, 455000, 385000, 2, 0, 0),
(25, 'Breakout Area', 250, 550000, 500000, 475000, 480000, 450000, 350000, 325000, 325000, 300000, 325000, 275000, 2, 0, 0),
(26, 'Pantry/Cafeteria', 300, 660000, 600000, 570000, 576000, 540000, 420000, 390000, 390000, 360000, 390000, 330000, 2, 0, 0),
(27, 'Restrooms', 200, 440000, 400000, 380000, 384000, 360000, 280000, 260000, 260000, 240000, 260000, 220000, 2, 0, 0),
(28, 'Storage/Archive Room', 100, 220000, 200000, 190000, 192000, 180000, 140000, 130000, 130000, 120000, 130000, 110000, 2, 0, 0),
(29, 'Server/IT Room', 150, 330000, 300000, 285000, 288000, 270000, 210000, 195000, 195000, 180000, 195000, 165000, 2, 0, 0),
(30, 'Lounge Area', 250, 550000, 500000, 475000, 480000, 450000, 350000, 325000, 325000, 300000, 325000, 275000, 2, 0, 0),
(31, 'Training Room', 200, 440000, 400000, 380000, 384000, 360000, 280000, 260000, 260000, 240000, 260000, 220000, 2, 0, 0),
(32, 'Executive Office', 250, 550000, 500000, 475000, 480000, 450000, 350000, 325000, 325000, 300000, 325000, 275000, 2, 0, 0),
(33, 'Managerial Office', 200, 440000, 400000, 380000, 384000, 360000, 280000, 260000, 260000, 240000, 260000, 220000, 2, 0, 0),
(34, 'Collaboration Zones', 500, 1100000, 1000000, 950000, 960000, 900000, 700000, 650000, 650000, 600000, 650000, 550000, 2, 0, 0),
(35, 'Workstation', 50, 110000, 100000, 95000, 96000, 90000, 70000, 65000, 65000, 60000, 65000, 55000, 2, 0, 0),
(36, 'Phone Booth', 20, 44000, 40000, 38000, 38400, 36000, 28000, 26000, 26000, 24000, 26000, 22000, 2, 0, 0),
(37, 'Printing/Copy Room', 100, 220000, 200000, 190000, 192000, 180000, 140000, 130000, 130000, 120000, 130000, 110000, 2, 0, 0),
(38, 'Locker Area', 150, 330000, 300000, 285000, 288000, 270000, 210000, 195000, 195000, 180000, 195000, 165000, 2, 0, 0),
(39, 'Utility Room', 100, 220000, 200000, 190000, 192000, 180000, 140000, 130000, 130000, 120000, 130000, 110000, 2, 0, 0),
(40, 'Fitness/Wellness Room', 300, 660000, 600000, 570000, 576000, 540000, 420000, 390000, 390000, 360000, 390000, 330000, 2, 0, 0),
(41, 'Corridor and Hallway', 200, 440000, 400000, 380000, 384000, 360000, 280000, 260000, 260000, 240000, 260000, 220000, 2, 0, 0),
(42, 'Air Conditioning Room', 150, 330000, 300000, 285000, 288000, 270000, 210000, 195000, 195000, 180000, 195000, 165000, 2, 0, 0),
(43, 'Power Backup Room', 100, 220000, 200000, 190000, 192000, 180000, 140000, 130000, 130000, 120000, 130000, 110000, 2, 0, 0),
(44, 'Security/Control Room', 150, 330000, 300000, 285000, 288000, 270000, 210000, 195000, 195000, 180000, 195000, 165000, 2, 0, 0),
(45, 'Housekeeping Room', 100, 220000, 200000, 190000, 192000, 180000, 140000, 130000, 130000, 120000, 130000, 110000, 2, 0, 0),
(46, 'Waste Disposal Room', 100, 220000, 200000, 190000, 192000, 180000, 140000, 130000, 130000, 120000, 130000, 110000, 2, 0, 0),
(47, 'Locker Room/Employee Storage', 200, 440000, 400000, 380000, 384000, 360000, 280000, 260000, 260000, 240000, 260000, 220000, 2, 0, 0),
(48, 'Fire Control Room', 100, 220000, 200000, 190000, 192000, 180000, 140000, 130000, 130000, 120000, 130000, 110000, 2, 0, 0),
(49, 'Basic Construction Setup (BU', 1000, 1700000, 1700000, 1700000, 1520000, 1600000, 1530000, 1450000, 1500000, 1000000, 1400000, 1500000, 3, 0, 0),
(50, 'Compound Wall', 200, 340000, 340000, 340000, 304000, 320000, 306000, 290000, 300000, 200000, 280000, 300000, 3, 0, 0),
(51, 'Garden', 150, 255000, 255000, 255000, 228000, 240000, 229500, 217500, 225000, 150000, 210000, 225000, 3, 0, 0),
(52, 'Car Parking Area', 150, 255000, 255000, 255000, 228000, 240000, 229500, 217500, 225000, 150000, 210000, 225000, 3, 0, 0),
(53, 'Two-Wheeler Parking Area', 40, 68000, 68000, 68000, 60800, 64000, 61200, 58000, 60000, 40000, 56000, 60000, 3, 0, 0),
(54, 'Terrace', 300, 510000, 510000, 510000, 456000, 480000, 459000, 435000, 450000, 300000, 420000, 450000, 3, 0, 0),
(55, 'Main Gate', 25, 42500, 42500, 42500, 38000, 40000, 38250, 36250, 37500, 25000, 35000, 37500, 3, 0, 0),
(56, 'Entrance Lobby', 60, 102000, 102000, 102000, 91200, 96000, 91800, 87000, 90000, 60000, 84000, 90000, 3, 0, 0),
(57, 'Staircase', 100, 170000, 170000, 170000, 152000, 160000, 153000, 145000, 150000, 100000, 140000, 150000, 3, 0, 0),
(58, 'Mudroom', 40, 68000, 68000, 68000, 60800, 64000, 61200, 58000, 60000, 40000, 56000, 60000, 3, 0, 0),
(59, 'Living Room', 220, 374000, 374000, 374000, 334400, 352000, 336600, 319000, 330000, 220000, 308000, 330000, 3, 0, 0),
(60, 'Dining Room', 140, 238000, 238000, 238000, 212800, 224000, 214200, 203000, 210000, 140000, 196000, 210000, 3, 0, 0),
(61, 'Kitchen', 120, 204000, 204000, 204000, 182400, 192000, 183600, 174000, 180000, 120000, 168000, 180000, 3, 0, 0),
(62, 'Pantry', 30, 51000, 51000, 51000, 45600, 48000, 45900, 43500, 45000, 30000, 42000, 45000, 3, 0, 0),
(63, 'Utility Room', 50, 85000, 85000, 85000, 76000, 80000, 76500, 72500, 75000, 50000, 70000, 75000, 3, 0, 0),
(64, 'Laundry Room', 50, 85000, 85000, 85000, 76000, 80000, 76500, 72500, 75000, 50000, 70000, 75000, 3, 0, 0),
(65, 'Bedrooms', 150, 255000, 255000, 255000, 228000, 240000, 229500, 217500, 225000, 150000, 210000, 225000, 3, 0, 0),
(66, 'Walk-in Wardrobe / Closet', 40, 68000, 68000, 68000, 60800, 64000, 61200, 58000, 60000, 40000, 56000, 60000, 3, 0, 0),
(67, 'Play Room', 100, 170000, 170000, 170000, 152000, 160000, 153000, 145000, 150000, 100000, 140000, 150000, 3, 0, 0),
(68, 'Game Room', 130, 221000, 221000, 221000, 197600, 208000, 198900, 188500, 195000, 130000, 182000, 195000, 3, 0, 0),
(69, 'Bathrooms', 60, 102000, 102000, 102000, 91200, 96000, 91800, 87000, 90000, 60000, 84000, 90000, 3, 0, 0),
(70, 'Puja Room / Prayer Room', 30, 51000, 51000, 51000, 45600, 48000, 45900, 43500, 45000, 30000, 42000, 45000, 3, 0, 0),
(71, 'Entertainment / Media Room', 150, 255000, 255000, 255000, 228000, 240000, 229500, 217500, 225000, 150000, 210000, 225000, 3, 0, 0),
(72, 'Home Theatre Room', 200, 340000, 340000, 340000, 304000, 320000, 306000, 290000, 300000, 200000, 280000, 300000, 3, 0, 0),
(73, 'Library / Reading Room', 100, 170000, 170000, 170000, 152000, 160000, 153000, 145000, 150000, 100000, 140000, 150000, 3, 0, 0),
(74, 'Multipurpose Room', 120, 204000, 204000, 204000, 182400, 192000, 183600, 174000, 180000, 120000, 168000, 180000, 3, 0, 0),
(75, 'Spa / Jacuzzi', 80, 136000, 136000, 136000, 121600, 128000, 122400, 116000, 120000, 80000, 112000, 120000, 3, 0, 0),
(76, 'Balcony', 60, 102000, 102000, 102000, 91200, 96000, 91800, 87000, 90000, 60000, 84000, 90000, 3, 0, 0),
(77, 'Basement', 500, 850000, 850000, 850000, 760000, 800000, 765000, 725000, 750000, 500000, 700000, 750000, 3, 0, 0),
(78, 'Servant???s Quarters / Staff', 120, 204000, 204000, 204000, 182400, 192000, 183600, 174000, 180000, 120000, 168000, 180000, 3, 0, 0),
(79, 'Storage Room', 60, 102000, 102000, 102000, 91200, 96000, 91800, 87000, 90000, 60000, 84000, 90000, 3, 0, 0),
(80, 'Waste Disposal Room', 25, 42500, 42500, 42500, 38000, 40000, 38250, 36250, 37500, 25000, 35000, 37500, 3, 0, 0),
(81, 'UGT (Underground Tank)', 100, 170000, 170000, 170000, 152000, 160000, 153000, 145000, 150000, 100000, 140000, 150000, 3, 0, 0),
(82, 'OHT (Overhead Tank)', 80, 136000, 136000, 136000, 121600, 128000, 122400, 116000, 120000, 80000, 112000, 120000, 3, 0, 0),
(83, 'Generator / Inverter / Back-', 60, 102000, 102000, 102000, 91200, 96000, 91800, 87000, 90000, 60000, 84000, 90000, 3, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `room_master_bkup`
--

CREATE TABLE `room_master_bkup` (
  `room_id` int(2) NOT NULL,
  `room_type` varchar(28) DEFAULT NULL,
  `standard_area` int(3) DEFAULT NULL,
  `mumbai` int(6) DEFAULT NULL,
  `bangalore` int(6) DEFAULT NULL,
  `hyderabad` int(6) DEFAULT NULL,
  `noida` int(6) DEFAULT NULL,
  `pune` int(6) DEFAULT NULL,
  `ahmedabad` int(6) DEFAULT NULL,
  `indore` int(6) DEFAULT NULL,
  `jaipur` int(6) DEFAULT NULL,
  `nagpur` int(6) DEFAULT NULL,
  `surat` int(6) DEFAULT NULL,
  `nasik` int(6) DEFAULT NULL,
  `interior_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `room_master_bkup`
--

INSERT INTO `room_master_bkup` (`room_id`, `room_type`, `standard_area`, `mumbai`, `bangalore`, `hyderabad`, `noida`, `pune`, `ahmedabad`, `indore`, `jaipur`, `nagpur`, `surat`, `nasik`, `interior_type_id`) VALUES
(1, 'Entrance Lobby & Living Room', 375, 750000, 675000, 637500, 645000, 600000, 450000, 412500, 412500, 375000, 412500, 337500, 1),
(2, 'Kitchen', 125, 250000, 225000, 212500, 215000, 200000, 150000, 137500, 137500, 125000, 137500, 112500, 1),
(3, 'Dining Room', 160, 320000, 288000, 272000, 275200, 256000, 192000, 176000, 176000, 160000, 176000, 144000, 1),
(4, 'Passage/Lobby/Corridor', 60, 120000, 108000, 102000, 103200, 96000, 72000, 66000, 66000, 60000, 66000, 54000, 1),
(5, 'Master Bedroom', 200, 400000, 360000, 340000, 344000, 320000, 240000, 220000, 220000, 200000, 220000, 180000, 1),
(6, 'Kids\'/Children\'s Bedroom', 125, 250000, 225000, 212500, 215000, 200000, 150000, 137500, 137500, 125000, 137500, 112500, 1),
(7, 'Parents\' Bedroom', 160, 320000, 288000, 272000, 275200, 256000, 192000, 176000, 176000, 160000, 176000, 144000, 1),
(8, 'Guest Bedroom', 150, 300000, 270000, 255000, 258000, 240000, 180000, 165000, 165000, 150000, 165000, 135000, 1),
(9, 'Study Room/Home Office', 120, 240000, 216000, 204000, 206400, 192000, 144000, 132000, 132000, 120000, 132000, 108000, 1),
(10, 'Walk-in-Wardrobe', 75, 150000, 135000, 127500, 129000, 120000, 90000, 82500, 82500, 75000, 82500, 67500, 1),
(11, 'Bathroom/Toilet', 60, 120000, 108000, 102000, 103200, 96000, 72000, 66000, 66000, 60000, 66000, 54000, 1),
(12, 'Balcony/Terrace', 100, 200000, 180000, 170000, 172000, 160000, 120000, 110000, 110000, 100000, 110000, 90000, 1),
(13, 'Utility Room', 75, 150000, 135000, 127500, 129000, 120000, 90000, 82500, 82500, 75000, 82500, 67500, 1),
(14, 'Puja Room', 40, 80000, 72000, 68000, 68800, 64000, 48000, 44000, 44000, 40000, 44000, 36000, 1),
(15, 'Entertainment Room', 250, 500000, 450000, 425000, 430000, 400000, 300000, 275000, 275000, 250000, 275000, 225000, 1),
(16, 'Multipurpose Room', 200, 400000, 360000, 340000, 344000, 320000, 240000, 220000, 220000, 200000, 220000, 180000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `selected_design_categories`
--

CREATE TABLE `selected_design_categories` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `selected_design_style`
--

CREATE TABLE `selected_design_style` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `style_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `selected_rooms`
--

CREATE TABLE `selected_rooms` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `room_id` int(11) NOT NULL,
  `room_count` int(11) NOT NULL DEFAULT 1,
  `room_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_master`
--

CREATE TABLE `service_master` (
  `service_id` int(11) NOT NULL,
  `project_type` varchar(50) NOT NULL DEFAULT 'Home Interior',
  `services` varchar(60) DEFAULT NULL,
  `mumbai` varchar(5) DEFAULT NULL,
  `bangalore` varchar(5) DEFAULT NULL,
  `hyderabbad` varchar(5) DEFAULT NULL,
  `noida` varchar(5) DEFAULT NULL,
  `pune` varchar(5) DEFAULT NULL,
  `ahmedabad` varchar(5) DEFAULT NULL,
  `indore` varchar(5) DEFAULT NULL,
  `jaipur` varchar(5) DEFAULT NULL,
  `nagpur` varchar(5) DEFAULT NULL,
  `surat` varchar(5) DEFAULT NULL,
  `nasik` varchar(5) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `noida2` double DEFAULT 0,
  `delhi` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `service_master`
--

INSERT INTO `service_master` (`service_id`, `project_type`, `services`, `mumbai`, `bangalore`, `hyderabbad`, `noida`, `pune`, `ahmedabad`, `indore`, `jaipur`, `nagpur`, `surat`, `nasik`, `description`, `noida2`, `delhi`) VALUES
(481, 'Cafe Interior', 'First Site Visit', '2500', '2000', '2000', '2000', '1500', '2000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(482, 'Cafe Interior', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(483, 'Cafe Interior', '2D Design with Detailed Estimate (per sq.ft.)', '75', '60', '60', '60', '60', '50', '50', '50', '50', '50', '45', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(484, 'Cafe Interior', 'Basic 3D Design with Mood Board (per sq.ft.)', '120', '100', '100', '100', '100', '75', '75', '75', '75', '75', '60', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(485, 'Cafe Interior', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(486, 'Cafe Interior', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(487, 'Cafe Interior', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(488, 'Cafe Interior', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(489, 'Cafe Interior', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(490, 'Cafe Interior', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(491, 'Cafe Interior', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(492, 'Cafe Interior', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(493, 'Cafe Interior', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(494, 'Cafe Interior', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(495, 'Cafe Interior', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(496, 'Cafe Interior', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(497, 'Cafe Interior', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0),
(498, 'Clinic Interior', 'First Site Visit', '2500', '2000', '2000', '2000', '1500', '2000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(499, 'Clinic Interior', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(500, 'Clinic Interior', '2D Design with Detailed Estimate (per sq.ft.)', '75', '60', '60', '60', '60', '50', '50', '50', '50', '50', '45', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(501, 'Clinic Interior', 'Basic 3D Design with Mood Board (per sq.ft.)', '120', '100', '100', '100', '100', '75', '75', '75', '75', '75', '60', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(502, 'Clinic Interior', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(503, 'Clinic Interior', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(504, 'Clinic Interior', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(505, 'Clinic Interior', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(506, 'Clinic Interior', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(507, 'Clinic Interior', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(508, 'Clinic Interior', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(509, 'Clinic Interior', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(510, 'Clinic Interior', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(511, 'Clinic Interior', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(512, 'Clinic Interior', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(513, 'Clinic Interior', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(514, 'Clinic Interior', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0),
(515, 'Gym Interior', 'First Site Visit', '2500', '2000', '2000', '2000', '1500', '2000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(516, 'Gym Interior', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(517, 'Gym Interior', '2D Design with Detailed Estimate (per sq.ft.)', '75', '60', '60', '60', '60', '50', '50', '50', '50', '50', '45', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(518, 'Gym Interior', 'Basic 3D Design with Mood Board (per sq.ft.)', '120', '100', '100', '100', '100', '75', '75', '75', '75', '75', '60', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(519, 'Gym Interior', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(520, 'Gym Interior', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(521, 'Gym Interior', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(522, 'Gym Interior', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(523, 'Gym Interior', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(524, 'Gym Interior', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(525, 'Gym Interior', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(526, 'Gym Interior', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(527, 'Gym Interior', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(528, 'Gym Interior', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(529, 'Gym Interior', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(530, 'Gym Interior', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(531, 'Gym Interior', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0),
(532, 'Home Interior', 'First Site Visit', '2000', '2000', '2000', '2000', '1500', '1000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(533, 'Home Interior', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(534, 'Home Interior', '2D Design with Detailed Estimate (per sq.ft.)', '10', '15', '15', '10', '15', '10', '10', '15', '11', '11', '15', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(535, 'Home Interior', 'Basic 3D Design with Mood Board (per sq.ft.)', '15', '20', '20', '15', '20', '15', '15', '20', '17', '17', '15', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(536, 'Home Interior', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(537, 'Home Interior', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(538, 'Home Interior', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(539, 'Home Interior', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(540, 'Home Interior', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(541, 'Home Interior', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(542, 'Home Interior', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(543, 'Home Interior', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(544, 'Home Interior', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(545, 'Home Interior', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(546, 'Home Interior', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(547, 'Home Interior', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(548, 'Home Interior', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0),
(549, 'Hospital Interior', 'First Site Visit', '2500', '2000', '2000', '2000', '1500', '2000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(550, 'Hospital Interior', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(551, 'Hospital Interior', '2D Design with Detailed Estimate (per sq.ft.)', '75', '60', '60', '60', '60', '50', '50', '50', '50', '50', '45', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(552, 'Hospital Interior', 'Basic 3D Design with Mood Board (per sq.ft.)', '120', '100', '100', '100', '100', '75', '75', '75', '75', '75', '60', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(553, 'Hospital Interior', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(554, 'Hospital Interior', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(555, 'Hospital Interior', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(556, 'Hospital Interior', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(557, 'Hospital Interior', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(558, 'Hospital Interior', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(559, 'Hospital Interior', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(560, 'Hospital Interior', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(561, 'Hospital Interior', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(562, 'Hospital Interior', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(563, 'Hospital Interior', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(564, 'Hospital Interior', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(565, 'Hospital Interior', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0),
(566, 'Hotel Interior', 'First Site Visit', '2500', '2000', '2000', '2000', '1500', '2000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(567, 'Hotel Interior', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(568, 'Hotel Interior', '2D Design with Detailed Estimate (per sq.ft.)', '75', '60', '60', '60', '60', '50', '50', '50', '50', '50', '45', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(569, 'Hotel Interior', 'Basic 3D Design with Mood Board (per sq.ft.)', '120', '100', '100', '100', '100', '75', '75', '75', '75', '75', '60', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(570, 'Hotel Interior', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(571, 'Hotel Interior', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(572, 'Hotel Interior', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(573, 'Hotel Interior', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(574, 'Hotel Interior', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(575, 'Hotel Interior', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(576, 'Hotel Interior', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(577, 'Hotel Interior', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(578, 'Hotel Interior', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(579, 'Hotel Interior', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(580, 'Hotel Interior', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(581, 'Hotel Interior', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(582, 'Hotel Interior', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0),
(583, 'House Architecture', 'First Site Visit', '2000', '2000', '2000', '2000', '1500', '1000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(584, 'House Architecture', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(585, 'House Architecture', '2D Design with Detailed Estimate (per sq.ft.)', '10', '15', '15', '10', '15', '10', '10', '15', '11', '11', '15', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(586, 'House Architecture', 'Basic 3D Design with Mood Board (per sq.ft.)', '15', '20', '20', '15', '20', '15', '15', '20', '17', '17', '15', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(587, 'House Architecture', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(588, 'House Architecture', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(589, 'House Architecture', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(590, 'House Architecture', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(591, 'House Architecture', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(592, 'House Architecture', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(593, 'House Architecture', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(594, 'House Architecture', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(595, 'House Architecture', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(596, 'House Architecture', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(597, 'House Architecture', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(598, 'House Architecture', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(599, 'House Architecture', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0),
(600, 'Office Interior', 'First Site Visit', '2500', '2000', '2000', '2000', '1500', '2000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(601, 'Office Interior', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(602, 'Office Interior', '2D Design with Detailed Estimate (per sq.ft.)', '75', '60', '60', '60', '60', '50', '50', '50', '50', '50', '45', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(603, 'Office Interior', 'Basic 3D Design with Mood Board (per sq.ft.)', '120', '100', '100', '100', '100', '75', '75', '75', '75', '75', '60', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(604, 'Office Interior', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(605, 'Office Interior', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(606, 'Office Interior', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(607, 'Office Interior', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(608, 'Office Interior', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(609, 'Office Interior', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(610, 'Office Interior', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(611, 'Office Interior', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(612, 'Office Interior', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(613, 'Office Interior', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(614, 'Office Interior', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(615, 'Office Interior', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(616, 'Office Interior', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0),
(617, 'Restaurant Interior', 'First Site Visit', '2500', '2000', '2000', '2000', '1500', '2000', '1000', '1000', '1000', '1000', '1000', 'Initial visit to understand your space, requirements, and project scope.', 0, 0),
(618, 'Restaurant Interior', 'Site Measurements (after Work Order)', '3500', '3000', '3000', '3000', '3000', '2500', '2500', '2500', '2500', '2500', '2000', 'Accurate laser measurements of every room to prepare detailed drawings.', 0, 0),
(619, 'Restaurant Interior', '2D Design with Detailed Estimate (per sq.ft.)', '75', '60', '60', '60', '60', '50', '50', '50', '50', '50', '45', 'Layout plans showing furniture placement + a room-wise cost estimate.', 0, 0),
(620, 'Restaurant Interior', 'Basic 3D Design with Mood Board (per sq.ft.)', '120', '100', '100', '100', '100', '75', '75', '75', '75', '75', '60', 'Realistic 3D views + theme, color, and material references for your space.', 0, 0),
(621, 'Restaurant Interior', 'Basic Project Coordination (lump sum)', '10000', '10000', '9000', '10000', '9000', '7500', '7500', '7500', '7000', '7000', '6500', 'WhatsApp/phone updates, reminders, and progress tracking.', 0, 0),
(622, 'Restaurant Interior', 'Vendor Alignment (lump sum)', '8000', '8000', '7500', '8000', '7500', '6000', '6000', '6000', '5500', '5500', '5000', 'Connecting you with trusted vendors + sharing drawings & requirements.', 0, 0),
(623, 'Restaurant Interior', 'Advanced Quality Drawings (per sq.ft.)', '40', '45', '40', '40', '40', '30', '30', '30', '30', '30', '22', 'Detailed joinery, electrical, plumbing, and modular drawings.', 0, 0),
(624, 'Restaurant Interior', 'Advanced Vendor Procurement Assistance (lump sum)', '18000', '20000', '18000', '18000', '18000', '15000', '15000', '15000', '14000', '14000', '12000', 'Shortlisting vendors, getting quotes, negotiating, and finalizing selection.', 0, 0),
(625, 'Restaurant Interior', 'Material Quality Audits (per sq.ft.)', '12', '15', '15', '12', '12', '10', '10', '10', '9', '9', '8', 'Checking material quality and finish at key stages of execution.', 0, 0),
(626, 'Restaurant Interior', 'Curtain Furnishings (per sq.ft.)', '150', '180', '170', '180', '160', '130', '150', '150', '130', '130', '110', 'Fabric selection, stitching, style options, and installation for curtains.', 0, 0),
(627, 'Restaurant Interior', 'Décor Selection (lump sum)', '60000', '55000', '60000', '60000', '55000', '45000', '40000', '45000', '40000', '45000', '35000', 'Curation of décor items—lamps, wall art, plants, accessories.', 0, 0),
(628, 'Restaurant Interior', 'Intermittent Supervision (per visit)', '5000', '4500', '4500', '4500', '4500', '3500', '3500', '3500', '3000', '3000', '2500', 'Scheduled site visits to ensure work quality and design alignment.', 0, 0),
(629, 'Restaurant Interior', 'Full-Time Supervision (per month)', '35000', '30000', '30000', '35000', '30000', '25000', '20000', '25000', '20000', '20000', '17000', 'A dedicated supervisor at site daily to manage work and contractors.', 0, 0),
(630, 'Restaurant Interior', 'Project Management (lump sum)', '60000', '50000', '50000', '60000', '50000', '40000', '35000', '40000', '35000', '40000', '40000', 'Complete planning, execution tracking, timeline control, and quality checks.', 0, 0),
(631, 'Restaurant Interior', 'Cost Report (lump sum)', '15000', '12000', '12000', '15000', '15000', '10000', '10000', '12000', '10000', '10000', '8000', 'Final budget report comparing estimated, actual, and saved costs.', 0, 0),
(632, 'Restaurant Interior', 'Modular Drawings (per sq. ft.)', '25', '30', '25', '25', '25', '20', '20', '20', '18', '18', '15', 'Kitchen and wardrobe layouts with sections and elevations.', 0, 0),
(633, 'Restaurant Interior', 'Basic VR', '12000', '12000', '9000', '9000', '9000', '7500', '7500', '7500', '7500', '7500', '7500', 'Virtual walkthrough to experience your designed space before execution.', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `service_selections`
--

CREATE TABLE `service_selections` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `selected_services` text NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `flag` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `style_city_rates`
--

CREATE TABLE `style_city_rates` (
  `id` int(11) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `style_id` int(11) DEFAULT NULL,
  `project_type` varchar(50) NOT NULL DEFAULT 'Home Interior',
  `multiplier` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `style_master`
--

CREATE TABLE `style_master` (
  `style_id` int(1) NOT NULL,
  `style_name` varchar(200) DEFAULT NULL,
  `style_multiplier` decimal(2,1) DEFAULT NULL,
  `interior_type` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `style_master`
--

INSERT INTO `style_master` (`style_id`, `style_name`, `style_multiplier`, `interior_type`) VALUES
(1, 'Modern Minimalist', 1.0, 1),
(2, 'Mid-Century Modern', 1.3, 1),
(3, 'Urban Design', 1.4, 1),
(4, 'Hollywood Glam', 1.8, 1),
(5, 'Shabby Chic Design', 1.5, 1),
(6, 'Classic Contemporary', 1.6, 1),
(7, 'Fusion Style', 1.7, 1),
(8, 'Modern Minimalist', 1.0, 2),
(9, 'Mid-Century Modern', 1.3, 2),
(10, 'Urban Design', 1.4, 2),
(11, 'Industrial Design', 1.8, 2),
(12, 'Shabby Chic Design', 1.5, 2),
(13, 'Contemporary Design', 1.6, 2),
(14, 'Fusion Style (modern + contemporary)', 1.7, 2),
(15, 'Traditional', 1.0, 3),
(16, 'Classic', 1.4, 3),
(17, 'Transitional', 1.3, 3),
(18, 'Modern', 1.2, 3),
(19, 'Contemporary', 1.1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `survey_options`
--

CREATE TABLE `survey_options` (
  `option_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `survey_options`
--

INSERT INTO `survey_options` (`option_id`, `question_id`, `option_text`) VALUES
(1, 1, 'Maximizing space'),
(2, 1, 'Aesthetic appeal'),
(3, 1, 'Functionality'),
(4, 1, 'Staying within budget'),
(5, 2, 'Immediately'),
(6, 2, 'Within 1-3 months'),
(7, 2, '3-6 Months'),
(8, 2, 'Just exploring ideas'),
(9, 3, 'Hands-on and involved in every step'),
(10, 3, 'Collaborative, but experts decide'),
(11, 3, 'Full-service with minimal involvement'),
(12, 4, 'Custom built-in furniture'),
(13, 4, 'Green/sustainable design'),
(14, 4, 'Smart home technology'),
(15, 4, 'Unique lighting solutions'),
(16, 5, 'Under ₹10L'),
(17, 5, '₹10L to ₹20L'),
(18, 5, '₹20L to ₹30L'),
(19, 5, '₹30L to ₹40L'),
(20, 5, '₹40L to ₹50L'),
(21, 5, '₹50L to ₹60L'),
(22, 5, '₹60L to ₹70L'),
(23, 5, '₹70L to ₹1cr'),
(24, 5, 'Above ₹1cr');

-- --------------------------------------------------------

--
-- Table structure for table `survey_questions`
--

CREATE TABLE `survey_questions` (
  `question_id` int(11) NOT NULL,
  `question_text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `survey_questions`
--

INSERT INTO `survey_questions` (`question_id`, `question_text`) VALUES
(1, 'Which design aspect is the top priority for your project?'),
(2, 'How soon are you looking to start your project?'),
(3, 'How involved do you want to be in the design process?'),
(4, 'Are there any specific features or elements you want to include?'),
(5, 'What is your budget range?');

-- --------------------------------------------------------

--
-- Table structure for table `survey_responses`
--

CREATE TABLE `survey_responses` (
  `id` int(11) NOT NULL,
  `session_id` varchar(50) DEFAULT NULL,
  `question_number` int(11) NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_estimates`
--

CREATE TABLE `user_estimates` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `pincode` varchar(10) NOT NULL,
  `interior_selection` varchar(255) NOT NULL,
  `rooms_selected` text NOT NULL,
  `design_style` varchar(255) NOT NULL,
  `design_category` varchar(255) NOT NULL,
  `estimated_total_cost` decimal(10,2) NOT NULL,
  `selected_services` text DEFAULT NULL,
  `final_total_cost` decimal(10,2) DEFAULT NULL,
  `flag` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `selectedFloor` text DEFAULT NULL,
  `preconstruction_list` text DEFAULT NULL,
  `preconstruction_total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_information`
--

CREATE TABLE `user_information` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `country_code` int(11) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `pincode` varchar(6) NOT NULL,
  `whatsapp_updates` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `country` varchar(100) DEFAULT 'India',
  `company_type` enum('Individual','Business') DEFAULT 'Individual',
  `company_name` varchar(255) DEFAULT NULL,
  `gst_number` varchar(15) DEFAULT NULL,
  `full_address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE `user_master` (
  `id` int(11) NOT NULL,
  `name` varchar(1000) NOT NULL,
  `email` varchar(1000) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `create_at` date NOT NULL,
  `user_type` varchar(1000) NOT NULL,
  `user_img` varchar(255) DEFAULT NULL,
  `user_status` varchar(50) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_master`
--

INSERT INTO `user_master` (`id`, `name`, `email`, `password`, `create_at`, `user_type`, `user_img`, `user_status`) VALUES
(0, 'vinay', 'vinay@gmail.com', 'Vinay123', '0000-00-00', '', NULL, 'active'),
(1, 'Trupti ladda', 'admin@alacritys.in', 'b8f7d3302cb3c6740819c3664d640cf1', '2025-08-05', 'admin', NULL, 'active'),
(2, 'Nouman', 'nouman@gmail.com', '140b543013d988f4767277b6f45ba542', '2025-08-05', 'contractor', NULL, 'active'),
(3, 'vinay', 'vinay@gmail.com', 'Vinay123', '0000-00-00', '', NULL, 'active'),
(100, 'Temp Admin', 'admin@temp.com', '0192023a7bbd73250516f069df18b500', '0000-00-00', 'admin', NULL, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `session_id` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admin_comparison_history`
--
ALTER TABLE `admin_comparison_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `city_master`
--
ALTER TABLE `city_master`
  ADD PRIMARY KEY (`city_id`);

--
-- Indexes for table `cms_posts`
--
ALTER TABLE `cms_posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cost_estimates`
--
ALTER TABLE `cost_estimates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_city` (`city`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_total_estimate_cost` (`total_estimate_cost`);

--
-- Indexes for table `design_categories`
--
ALTER TABLE `design_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `interior_selections`
--
ALTER TABLE `interior_selections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `interior_types`
--
ALTER TABLE `interior_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `offersdiscounttbl`
--
ALTER TABLE `offersdiscounttbl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offer_city_rates`
--
ALTER TABLE `offer_city_rates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_offer_city` (`offer_id`,`city`);

--
-- Indexes for table `payment_details`
--
ALTER TABLE `payment_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `razorpay_order_id` (`razorpay_order_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `payment_status` (`payment_status`),
  ADD KEY `created_at` (`created_at`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_payment_status` (`payment_status`);

--
-- Indexes for table `room_features`
--
ALTER TABLE `room_features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_features_bkuup`
--
ALTER TABLE `room_features_bkuup`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_master`
--
ALTER TABLE `room_master`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `room_master_bkup`
--
ALTER TABLE `room_master_bkup`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `selected_design_categories`
--
ALTER TABLE `selected_design_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_session` (`session_id`);

--
-- Indexes for table `selected_design_style`
--
ALTER TABLE `selected_design_style`
  ADD PRIMARY KEY (`id`),
  ADD KEY `style_id` (`style_id`);

--
-- Indexes for table `selected_rooms`
--
ALTER TABLE `selected_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `service_master`
--
ALTER TABLE `service_master`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `idx_project_type` (`project_type`);

--
-- Indexes for table `style_city_rates`
--
ALTER TABLE `style_city_rates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `city_style` (`city`,`style_id`);

--
-- Indexes for table `style_master`
--
ALTER TABLE `style_master`
  ADD PRIMARY KEY (`style_id`);

--
-- Indexes for table `survey_options`
--
ALTER TABLE `survey_options`
  ADD PRIMARY KEY (`option_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `survey_questions`
--
ALTER TABLE `survey_questions`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `survey_responses`
--
ALTER TABLE `survey_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `user_information`
--
ALTER TABLE `user_information`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_session_email` (`session_id`,`email`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `user_master`
--
ALTER TABLE `user_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admin_comparison_history`
--
ALTER TABLE `admin_comparison_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `city_master`
--
ALTER TABLE `city_master`
  MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=219;

--
-- AUTO_INCREMENT for table `cms_posts`
--
ALTER TABLE `cms_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cost_estimates`
--
ALTER TABLE `cost_estimates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `design_categories`
--
ALTER TABLE `design_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `interior_selections`
--
ALTER TABLE `interior_selections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `interior_types`
--
ALTER TABLE `interior_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `offersdiscounttbl`
--
ALTER TABLE `offersdiscounttbl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `offer_city_rates`
--
ALTER TABLE `offer_city_rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payment_details`
--
ALTER TABLE `payment_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `selected_design_categories`
--
ALTER TABLE `selected_design_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `selected_design_style`
--
ALTER TABLE `selected_design_style`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `selected_rooms`
--
ALTER TABLE `selected_rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_master`
--
ALTER TABLE `service_master`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=634;

--
-- AUTO_INCREMENT for table `style_city_rates`
--
ALTER TABLE `style_city_rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `survey_options`
--
ALTER TABLE `survey_options`
  MODIFY `option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `survey_questions`
--
ALTER TABLE `survey_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `survey_responses`
--
ALTER TABLE `survey_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_information`
--
ALTER TABLE `user_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `interior_selections`
--
ALTER TABLE `interior_selections`
  ADD CONSTRAINT `interior_selections_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `user_sessions` (`session_id`) ON DELETE CASCADE;

--
-- Constraints for table `selected_design_categories`
--
ALTER TABLE `selected_design_categories`
  ADD CONSTRAINT `selected_design_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `design_categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `selected_design_style`
--
ALTER TABLE `selected_design_style`
  ADD CONSTRAINT `selected_design_style_ibfk_1` FOREIGN KEY (`style_id`) REFERENCES `style_master` (`style_id`) ON DELETE CASCADE;

--
-- Constraints for table `selected_rooms`
--
ALTER TABLE `selected_rooms`
  ADD CONSTRAINT `selected_rooms_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room_master` (`room_id`) ON DELETE CASCADE;

--
-- Constraints for table `survey_options`
--
ALTER TABLE `survey_options`
  ADD CONSTRAINT `survey_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `survey_questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `survey_responses`
--
ALTER TABLE `survey_responses`
  ADD CONSTRAINT `survey_responses_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `user_sessions` (`session_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
