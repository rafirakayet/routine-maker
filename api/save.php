<?php

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);
$session_token = $data['session_token'] ?? '';
$data_key = $data['data_key'] ?? '';
$data_value = $data['data_value'] ?? '';

// Verify session
$sessionQuery = "SELECT user_id FROM user_sessions WHERE session_token = :token AND expires_at > NOW()";
$sessionStmt = $db->prepare($sessionQuery);
$sessionStmt->bindParam(':token', $session_token);
$sessionStmt->execute();

if ($sessionStmt->rowCount() === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
    exit();
}

$user = $sessionStmt->fetch(PDO::FETCH_ASSOC);
$user_id = $user['user_id'];

// Prefix the data key with user_id to ensure isolation
$prefixed_key = "user_{$user_id}_{$data_key}";

$query = "INSERT INTO user_data (user_id, data_key, data_value) VALUES (:user_id, :data_key, :data_value)
          ON DUPLICATE KEY UPDATE data_value = :data_value";
$stmt = $db->prepare($query);
$stmt->bindParam(':user_id', $user_id);
$stmt->bindParam(':data_key', $prefixed_key);
$stmt->bindParam(':data_value', $data_value);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save data']);
}
?>