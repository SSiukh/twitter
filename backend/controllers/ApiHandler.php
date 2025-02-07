<?php

namespace Controllers;

use \Exception;

class ApiHandler
{
    private $db;
    private $getQuery;
    private $getCountQuery;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function handleRequest()
    {
        $route = $_SERVER["REQUEST_URI"];

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            if ($route === "/backend/login") {
                $this->login();
            } elseif ($route === "/backend/register") {
                $this->register();
            } elseif ($route === "/backend/ctweet") {
                $this->createTweet();
            } else {
                $this->respond(404, ["result" => false, "message" => "endpoint not found"]);
            }
        } elseif ($_SERVER["REQUEST_METHOD"] === "GET") {

            $urlPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

            if ($urlPath === "/backend/gettweets") {
                $this->getData("tweets", $id);
            } elseif ($urlPath === "/backend/getusers") {
                $this->getData("users");
            } elseif ($urlPath === "/backend/getuser") {
                $this->getUser($id);
            } elseif ($urlPath === "/backend/get_all_users") {
                $this->getAllUsers();
            } else {
                $this->respond(404, ["result" => false, "message" => "get endpoint not found"]);
            }
        } elseif ($_SERVER["REQUEST_METHOD"] === "PUT") {
            if ($route === "/backend/edittweet") {
                $this->editTweet();
            } elseif ($route === "/backend/editusername") {
                $this->editUsername();
            }
        } else {
            $this->respond(405, ["result" => false, "message" => "method not allowed"]);
        }
    }

    private function login()
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['login']) || !isset($data['password'])) {
                $this->respond(400, ["result" => false, "message" => "Login or password is missing"]);
            }

            $loginField = filter_var($data['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

            $dbData = $this->db->selectOne(
                'SELECT id, pass FROM users 
                WHERE ' . $loginField . ' = :login',
                ['login' => $data["login"]]
            );

            if ($dbData && password_verify($data['password'], $dbData['pass'])) {
                $this->respond(200, ["result" => true, "message" => "Login successful", "id" => $dbData["id"]]);
            } else {
                $this->respond(401, ["result" => false, "message" => "Login or password is incorrect"]);
            }
        } catch (Exception $e) {
            $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
    }

    private function register()
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!(isset($data['username']) && isset($data["email"]) && isset($data["password"]))) {
                $this->respond(400, ["result" => false, "message" => "Some field is missing"]);
            }

            $userExists = $this->db->selectOne(
                "SELECT username, email FROM users 
                WHERE username = :username
                OR email = :email",
                ["username" => $data['username'], "email" => $data['email']]
            );

            if ($userExists) {
                if ($userExists["username"] === $data["username"]) {
                    $this->respond(409, ["result" => false, "message" => "This username is already in use"]);
                }
                if ($userExists["email"] === $data["email"]) {
                    $this->respond(409, ["result" => false, "message" => "This email is already in use"]);
                }
            }

            $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);

            $this->db->insert(
                "INSERT INTO users (username, email, pass)
                VALUES (:username, :email, :pass)",
                ["username" => $data["username"], "email" => $data["email"], "pass" => $hashedPassword]
            );

            $dbId = $this->db->selectOne("SELECT id FROM users WHERE username = :username", ["username" => $data["username"]]);

            $this->respond(201, ["result" => true, "message" => "Registration was successful", "id" => $dbId["id"]]);
        } catch (Exception $e) {
            $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
    }

    private function createTweet()
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!(isset($data["id"]) && isset($data["text"]))) {
                $this->respond(400, ["result" => false, "message" => "Some field is missing"]);
            }

            $this->db->insert(
                "INSERT INTO tweets (user_id, content)
                VALUES (:id, :content)",
                ["id" => $data["id"], "content" => $data["text"]]
            );

            $this->respond(200, ["result" => true, "message" => "Successfully!"]);
        } catch (Exception $e) {
            $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
    }

    private function getUser($id)
    {
        try {
            $dbData = $this->db->selectOne(
                'SELECT username, email, created_at FROM users 
                WHERE id = :id',
                ['id' => $id]
            );

            $this->respond(200, ["result" => true, "data" => $dbData]);
        } catch (Exception $e) {
            $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
    }

    private function getAllUsers()
    {
        try {
            $data = $this->db->select(
                'SELECT id, username FROM users'
            );

            $this->respond(200, ["result" => true, "data" => $data]);
        } catch (Exception $e) {
            $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
    }

    private function getData($value, $id = null)
    {
        switch ($value) {
            case "tweets":
                $this->getCountQuery = "SELECT COUNT(*) FROM tweets";
                $this->getQuery = "SELECT tweets.id, tweets.user_id, tweets.content, tweets.created_at, tweets.updated_at, users.username FROM tweets
                                    JOIN users ON tweets.user_id = users.id";
                if ($id) {
                    $this->getCountQuery .= " WHERE user_id = :id";
                    $this->getQuery .= " WHERE tweets.user_id = :id";
                }

                $this->getQuery .= " ORDER BY created_at DESC LIMIT :perpage OFFSET :offset";
                break;
            case "users":
                $this->getCountQuery = "SELECT COUNT(*) FROM users";
                $this->getQuery = "SELECT id, username, email, created_at FROM users
                                    ORDER BY created_at DESC LIMIT :perpage OFFSET :offset";
                break;
            default:
                $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
        try {
            $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $totalData = $this->db->select($this->getCountQuery, $id ? ["id" => $id] : []);
            $total = $totalData[0]["COUNT(*)"];
            $offset = ($page - 1) * $perPage;
            $totalPages = ceil($total / $perPage);
            $params = ['perpage' => $perPage, 'offset' => $offset];

            if ($id) {
                $params['id'] = $id;
            }

            $data = $this->db->select($this->getQuery, $params);

            $this->respond(200, ["result" => true, "data" => $data, "meta" => ["per_page" => $perPage, "page" => $page, "total" => $total, "total_pages" => $totalPages]]);
        } catch (Exception $e) {
            $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
    }

    private function editTweet()
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!(isset($data["id"]) && isset($data["text"]))) {
                $this->respond(400, ["result" => false, "message" => "Some field is missing"]);
            }

            $this->db->update(
                "UPDATE tweets SET content = :content
                WHERE id = :id",
                ["content" => $data["text"], "id" => $data["id"]]
            );

            $this->respond(200, ["result" => true, "message" => "Successfully!"]);
        } catch (Exception $e) {
            $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
    }

    private function editUsername()
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!(isset($data["id"]) && isset($data["value"]))) {
                $this->respond(400, ["result" => false, "message" => "Some field is missing"]);
            }

            $checkUsername = $this->db->selectOne(
                "SELECT * FROM users
                WHERE username = :username",
                ["username" => $data["value"]]
            );

            if ($checkUsername) {
                $this->respond(400, ["result" => false, "message" => "Username already exists"]);
            }

            $this->db->update(
                "UPDATE users SET username = :username
                WHERE id = :id",
                ["username" => $data["value"], "id" => $data["id"]]
            );

            $this->respond(200, ["result" => true, "message" => "Successfully!", "check" => $checkUsername]);
        } catch (Exception $e) {
            $this->respond(500, ["result" => false, "message" => "Something went wrong. Please try again later"]);
        }
    }


    private function respond($errCode, $data)
    {
        http_response_code($errCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}
