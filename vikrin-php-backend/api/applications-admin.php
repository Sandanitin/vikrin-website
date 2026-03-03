<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

// Hardcoded tokens logic matching careers-admin.php
$SECRET_KEY = "vikrin_super_secret_key_2025";
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid token']);
    exit;
}

$token = $matches[1];

function verify_jwt($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    list($b64header, $b64payload, $signature) = $parts;
    $validSignature = hash_hmac('sha256', "$b64header.$b64payload", $secret);
    if (!hash_equals($validSignature, base64_decode($signature))) return false;
    $payload = json_decode(base64_decode($b64payload), true);
    if (isset($payload['exp']) && $payload['exp'] < time()) return false;
    return $payload;
}

$payload = verify_jwt($token, $SECRET_KEY);
if (!$payload) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid or expired token']);
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
