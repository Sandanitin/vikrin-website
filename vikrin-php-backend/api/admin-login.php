<?php
require_once __DIR__ . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

define('ADMIN_USERNAME', 'vikrin@gmil.com');
define('ADMIN_PASSWORD', 'vikrin@gmil.com1');
define('SECRET_KEY', 'VikrinAdminSecret2024!');

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if ($username !== ADMIN_USERNAME || $password !== ADMIN_PASSWORD) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    exit;
}

// Generate HMAC token (valid for 8 hours)
$expiry = time() + (8 * 60 * 60);
$data   = base64_encode(json_encode(['user' => $username, 'exp' => $expiry]));
$sig    = hash_hmac('sha256', $data, SECRET_KEY);
$token  = "$data.$sig";

echo json_encode([
    'success' => true,
    'token'   => $token,
    'expires' => $expiry,
    'message' => 'Login successful'
]);
