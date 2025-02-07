<?php

namespace Classes;

use Dotenv\Dotenv as Dotenv;
use PDO;
use PDOException;

class Database
{
    private $host;
    private $dbName;
    private $dbUser;
    private $dbPass;
    private $pdo;

    public function __construct()
    {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();

        $this->host = $_ENV['DB_HOST'];
        $this->dbName = $_ENV['DB_NAME'];
        $this->dbUser = $_ENV['DB_USER'];
        $this->dbPass = $_ENV['DB_PASSWORD'];

        try {
            $this->pdo = new PDO("mysql:host={$this->host};port=3306;dbname={$this->dbName};charset=utf8", $this->dbUser, $this->dbPass);
        } catch (PDOException $e) {
            echo "Error connecting: " . $e->getMessage();
        }
    }

    public function select($query, $params = [])
    {
        $stmt = $this->pdo->prepare($query);

        foreach ($params as $key => $value) {
            if (is_int($value)) {
                $stmt->bindValue($key, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue($key, $value);
            }
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function selectOne($query, $params = [])
    {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function insert($query, $params = [])
    {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $this->pdo->lastInsertId();
    }

    public function update($query, $params = [])
    {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->rowCount();
    }
}
