<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, title, department, location, type, description, requirements, created_at FROM careers WHERE is_active = 1 ORDER BY created_at DESC");
    $stmt->execute();
    $jobs = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $jobs]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch jobs']);
}
