<?php

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$session_token = $_GET['session_token'] ?? '';
$data_key = $_GET['data_key'] ?? '';

// Verify session
$sessionQuery = "SELECT user_id FROM user_sessions WHERE session_token = :token AND expires_at > NOW()";
$sessionStmt = $db->prepare($sessionQuery);
$sessionStmt->bindParam(':token', $session_token);
$sessionStmt->execute();

if ($sessionStmt->rowCount() === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid or expired session', 'data' => null]);
    exit();
}

$user = $sessionStmt->fetch(PDO::FETCH_ASSOC);
$user_id = $user['user_id'];

// Prefix the data key with user_id
$prefixed_key = "user_{$user_id}_{$data_key}";

$query = "SELECT data_value FROM user_data WHERE user_id = :user_id AND data_key = :data_key";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user_id);
$stmt->bindParam(':data_key', $prefixed_key);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => json_decode($result['data_value'], true)]);
} else {
    echo json_encode(['success' => true, 'data' => null]);
}
?>