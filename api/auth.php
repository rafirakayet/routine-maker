<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

session_start();

$database = new Database();
$db = $database->getConnection();

$request_method = $_SERVER["REQUEST_METHOD"];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($request_method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($action === 'register') {
        $username = $data['username'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($username) || empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'All fields required']);
            exit();
        }
        
        $checkQuery = "SELECT id FROM users WHERE username = :username OR email = :email";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':username', $username);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
            exit();
        }
        
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $insertQuery = "INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password_hash)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':username', $username);
        $insertStmt->bindParam(':email', $email);
        $insertStmt->bindParam(':password_hash', $password_hash);
        
        if ($insertStmt->execute()) {
            $user_id = $db->lastInsertId();
            $session_token = bin2hex(random_bytes(32));
            $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
            
            $sessionQuery = "INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (:user_id, :session_token, :expires_at)";
            $sessionStmt = $db->prepare($sessionQuery);
            $sessionStmt->bindParam(':user_id', $user_id);
            $sessionStmt->bindParam(':session_token', $session_token);
            $sessionStmt->bindParam(':expires_at', $expires_at);
            $sessionStmt->execute();
            
            echo json_encode([
                'success' => true, 
                'message' => 'Registration successful',
                'session_token' => $session_token,
                'user' => ['id' => $user_id, 'username' => $username, 'email' => $email]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
        
    } elseif ($action === 'login') {
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        $query = "SELECT id, username, email, password_hash FROM users WHERE username = :username OR email = :username";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $user['password_hash'])) {
                $session_token = bin2hex(random_bytes(32));
                $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
                
                $sessionQuery = "INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (:user_id, :session_token, :expires_at)";
                $sessionStmt = $db->prepare($sessionQuery);
                $sessionStmt->bindParam(':user_id', $user['id']);
                $sessionStmt->bindParam(':session_token', $session_token);
                $sessionStmt->bindParam(':expires_at', $expires_at);
                $sessionStmt->execute();
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'session_token' => $session_token,
                    'user' => ['id' => $user['id'], 'username' => $user['username'], 'email' => $user['email']]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid password']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    }
}
?>