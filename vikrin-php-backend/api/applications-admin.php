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

// GET: Fetch all active applications
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM `job_applications` ORDER BY created_at DESC");
    $applications = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $applications]);
    exit;
}

// DELETE: Delete an application
if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID is required']);
        exit;
    }
    
    $stmt = $pdo->prepare("DELETE FROM `job_applications` WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
