<?php

class Database {
    private $host = "sql102.infinityfree.com";
    private $db_name = "if0_41918440_routine_maker_db";
    private $username = "if0_41918440";
    private $password = "9DHs3qWmbQLVl";
    public $conn;


    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, 
                                  $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
