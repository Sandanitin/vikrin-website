<?php
// One-time setup script — run once then delete for security
require_once __DIR__ . '/db.php';

$sql = "CREATE TABLE IF NOT EXISTS `careers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) DEFAULT '',
  `location` VARCHAR(100) DEFAULT 'Remote',
  `type` VARCHAR(50) DEFAULT 'Full-Time',
  `description` TEXT NOT NULL,
  `requirements` TEXT DEFAULT '',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

try {
    $pdo->exec($sql);
    echo json_encode(['success' => true, 'message' => 'careers table created (or already exists)']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
