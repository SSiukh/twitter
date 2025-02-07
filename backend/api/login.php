<?php

require '../vendor/autoload.php';

use Classes\Database;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


$db = new Database();


if ($_SERVER['REQUEST_METHOD'] === "POST") {

    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['login']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["result" => false, "message" => "Login or password is missing"]);
            exit;
        }

        $loginField = filter_var($data['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $dbData = $db->selectOne(
            'SELECT pass FROM users 
        WHERE ' . $loginField . ' = :login',
            ['login' => $data["login"]]
        );

        if ($dbData && password_verify($data['password'], $dbData['pass'])) {
            http_response_code(200);
            echo json_encode(["result" => true, "message" => "Login successful"]);
        } else {
            http_response_code(401);
            echo json_encode(["result" => false, "message" => "Login or password is incorrect"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["result" => false, "message" => "Something went wrong. Please try again later"]);
    }
}
