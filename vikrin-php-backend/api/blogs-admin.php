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

// GET all blog posts (including unpublished)
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM `blog_posts` ORDER BY created_at DESC");
        $posts = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $posts]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

// POST — create new blog post
if ($method === 'POST') {
    $title        = trim($input['title'] ?? '');
    $slug         = trim($input['slug'] ?? '');
    $summary      = trim($input['summary'] ?? '');
    $content      = trim($input['content'] ?? '');
    $image_url    = trim($input['image_url'] ?? '');
    $author       = trim($input['author'] ?? 'Vikrin Team');
    $is_published = isset($input['is_published']) ? (int)$input['is_published'] : 1;

    if (!$title || !$slug || !$content) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Title, slug and content are required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO `blog_posts` (title, slug, summary, content, image_url, author, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $slug, $summary, $content, $image_url, $author, $is_published]);
        $id = $pdo->lastInsertId();

        $post = $pdo->prepare("SELECT * FROM `blog_posts` WHERE id = ?");
        $post->execute([$id]);
        echo json_encode(['success' => true, 'data' => $post->fetch(), 'message' => 'Blog post created']);
    } catch (PDOException $e) {
        http_response_code(500);
        if ($e->getCode() == 23000) {
            echo json_encode(['success' => false, 'error' => 'A blog post with this slug already exists']);
        } else {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
    exit;
}

// PUT — update existing blog post
if ($method === 'PUT') {
    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Blog post ID is required']);
        exit;
    }

    $title        = trim($input['title'] ?? '');
    $slug         = trim($input['slug'] ?? '');
    $summary      = trim($input['summary'] ?? '');
    $content      = trim($input['content'] ?? '');
    $image_url    = trim($input['image_url'] ?? '');
    $author       = trim($input['author'] ?? 'Vikrin Team');
    $is_published = isset($input['is_published']) ? (int)$input['is_published'] : 1;

    if (!$title || !$slug || !$content) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Title, slug and content are required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE `blog_posts` SET title=?, slug=?, summary=?, content=?, image_url=?, author=?, is_published=? WHERE id=?");
        $stmt->execute([$title, $slug, $summary, $content, $image_url, $author, $is_published, $id]);
        echo json_encode(['success' => true, 'message' => 'Blog post updated']);
    } catch (PDOException $e) {
        http_response_code(500);
        if ($e->getCode() == 23000) {
            echo json_encode(['success' => false, 'error' => 'A blog post with this slug already exists']);
        } else {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
    exit;
}

// DELETE — remove blog post
if ($method === 'DELETE') {
    $id = (int)($input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Blog post ID is required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `blog_posts` WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Blog post deleted']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
