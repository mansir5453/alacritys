<?php

include '../../config.php';

// 1. Fetch all questions and options in one go
$questions_sql = "SELECT q.question_id, q.question_text, o.option_text
                  FROM survey_questions q
                  LEFT JOIN survey_options o ON q.question_id = o.question_id
                  ORDER BY q.question_id ASC";
$questions_stmt = $pdo->query($questions_sql);
$question_rows = $questions_stmt->fetchAll();

$questions = [];
foreach ($question_rows as $row) {
    $qid = $row['question_id'];
    if (!isset($questions[$qid])) {
        $questions[$qid] = [
            'main' => $row['question_text'],
            'options' => []
        ];
    }
    if ($row['option_text']) {
        $questions[$qid]['options'][] = $row['option_text'];
    }
}
$questions = array_values($questions); // reset numeric index

// 2. Fetch all interior types and all rooms in one go
$types_sql = "SELECT t.id AS type_id, t.name AS type_name, r.room_id, r.room_type
              FROM interior_types t
              LEFT JOIN room_master r ON t.id = r.interior_type_id
              ORDER BY t.id, r.room_id ASC";
$types_stmt = $pdo->query($types_sql);
$types_rows = $types_stmt->fetchAll();

$interior_types = [];
foreach ($types_rows as $row) {
    $tid = $row['type_id'];
    if (!isset($interior_types[$tid])) {
        $interior_types[$tid] = [
            'id' => $tid,
            'name' => $row['type_name'],
            'rooms' => []
        ];
    }
    if ($row['room_id']) {
        $interior_types[$tid]['rooms'][] = [
            'room_id' => $row['room_id'],
            'room_type' => $row['room_type']
        ];
    }
}
$interior_types = array_values($interior_types);

// 3. Styles
$styles_sql = "SELECT style_id, style_name FROM style_master ORDER BY style_id ASC";
$styles_stmt = $pdo->query($styles_sql);
$styles_data = $styles_stmt->fetchAll();

$styles = [];
foreach ($styles_data as $style) {
    $styles[] = [
        'title' => $style['style_name'],
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

// 4. Design categories
$categories_sql = "SELECT category_id, category_name FROM design_categories ORDER BY category_id ASC";
$categories_stmt = $pdo->query($categories_sql);
$categories_data = $categories_stmt->fetchAll();

$categories = [];
foreach ($categories_data as $category) {
    $categories[] = [
        'id' => $category['category_id'],
        'name' => $category['category_name'],
        'description' => $category['category_name'] . " category offers enhanced features and superior comfort for a premium experience."
    ];
}

// 5. Output JSON
echo json_encode([
    'questions' => $questions,
    'interior_types' => $interior_types,
    'styles' => $styles,
    'categories' => $categories
]);
