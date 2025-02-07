<?php

require '../vendor/autoload.php';

use Classes\Database;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

$db = new Database();

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!(isset($data['username']) && isset($data["email"]) && isset($data["password"]))) {
            http_response_code(400);
            echo json_encode(["result" => false, "message" => "Some field is missing"]);
            exit;
        }

        $userExists = $db->selectOne(
            "SELECT username, email FROM users 
        WHERE username = :username
        OR email = :email",
            ["username" => $data['username'], "email" => $data['email']]
        );

        if ($userExists) {
            if ($userExists["username"] === $data["username"]) {
                http_response_code(409);
                echo json_encode(["result" => false, "message" => "This username is already in use"]);
                exit;
            }
            if ($userExists["email"] === $data["email"]) {
                http_response_code(409);
                echo json_encode(["result" => false, "message" => "This email is already in use"]);
                exit;
            }
        }

        $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);

        $db->insert(
            "INSERT INTO users (username, email, pass)
        VALUES (:username, :email, :pass)",
            ["username" => $data["username"], "email" => $data["email"], "pass" => $hashedPassword]
        );

        http_response_code(201);
        echo json_encode(["result" => true, "message" => "Registration was successful"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["result" => false, "message" => "Something went wrong. Please try again later"]);
    }
}
