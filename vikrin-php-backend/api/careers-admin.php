<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

// --- Auth check ---
$SECRET_KEY = 'VikrinAdminSecret2024!';

function verify_token($key) {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!str_starts_with($auth, 'Bearer ')) return false;
    $token = substr($auth, 7);
    // Simple HMAC token validation
    [$data, $sig] = explode('.', $token . '.') + [0 => '', 1 => ''];
    return $sig === hash_hmac('sha256', $data, $key);
}

if (!verify_token($SECRET_KEY)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET all jobs (including inactive)
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM careers ORDER BY created_at DESC");
    $jobs = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $jobs]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

// POST — create new job
if ($method === 'POST') {
    $title       = trim($input['title'] ?? '');
    $department  = trim($input['department'] ?? '');
    $location    = trim($input['location'] ?? 'Remote');
    $type        = trim($input['type'] ?? 'Full-Time');
    $description = trim($input['description'] ?? '');
    $requirements= trim($input['requirements'] ?? '');
    $is_active   = isset($input['is_active']) ? (int)$input['is_active'] : 1;

    if (!$title || !$description) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Title and description are required']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO careers (title, department, location, type, description, requirements, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$title, $department, $location, $type, $description, $requirements, $is_active]);
    $id = $pdo->lastInsertId();

    $job = $pdo->prepare("SELECT * FROM careers WHERE id = ?");
    $job->execute([$id]);
    echo json_encode(['success' => true, 'data' => $job->fetch(), 'message' => 'Job created']);
    exit;
}

// PUT — update existing job
if ($method === 'PUT') {
    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Job ID required']);
        exit;
    }

    $title       = trim($input['title'] ?? '');
    $department  = trim($input['department'] ?? '');
    $location    = trim($input['location'] ?? 'Remote');
    $type        = trim($input['type'] ?? 'Full-Time');
    $description = trim($input['description'] ?? '');
    $requirements= trim($input['requirements'] ?? '');
    $is_active   = isset($input['is_active']) ? (int)$input['is_active'] : 1;

    $stmt = $pdo->prepare("UPDATE careers SET title=?, department=?, location=?, type=?, description=?, requirements=?, is_active=? WHERE id=?");
    $stmt->execute([$title, $department, $location, $type, $description, $requirements, $is_active, $id]);

    echo json_encode(['success' => true, 'message' => 'Job updated']);
    exit;
}

// DELETE — remove job
if ($method === 'DELETE') {
    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Job ID required']);
        exit;
    }
    $stmt = $pdo->prepare("DELETE FROM careers WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true, 'message' => 'Job deleted']);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
