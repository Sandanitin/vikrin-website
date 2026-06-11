<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$slug = trim($_GET['slug'] ?? '');

try {
    if ($slug !== '') {
        // Fetch a single blog post
        $stmt = $pdo->prepare("SELECT * FROM `blog_posts` WHERE slug = ? AND is_published = 1 LIMIT 1");
        $stmt->execute([$slug]);
        $post = $stmt->fetch();
        if ($post) {
            echo json_encode(['success' => true, 'data' => $post]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Blog post not found']);
        }
    } else {
        // Fetch all published blog posts
        $stmt = $pdo->query("SELECT id, title, slug, summary, image_url, author, published_at, created_at FROM `blog_posts` WHERE is_published = 1 ORDER BY published_at DESC");
        $posts = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $posts]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch blog posts: ' . $e->getMessage()]);
}
