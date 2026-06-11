<?php
// One-time setup script to create the blog_posts table
require_once __DIR__ . '/db.php';

$sql = "CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `summary` VARCHAR(500) DEFAULT '',
  `content` TEXT NOT NULL,
  `image_url` VARCHAR(500) DEFAULT '',
  `author` VARCHAR(100) DEFAULT 'Vikrin Team',
  `is_published` TINYINT(1) DEFAULT 1,
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

try {
    $pdo->exec($sql);
    echo json_encode(['success' => true, 'message' => 'blog_posts table created (or already exists)']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
