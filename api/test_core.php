<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
echo json_encode([
    "status" => "success", 
    "message" => "CORS headers are working",
    "headers_sent" => headers_list()
]);
?>