<?php

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);
$session_token = $data['session_token'] ?? '';

$query = "DELETE FROM user_sessions WHERE session_token = :token";
$stmt = $db->prepare($query);
$stmt->bindParam(':token', $session_token);
$stmt->execute();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>