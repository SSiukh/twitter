<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require "./vendor/autoload.php";

use Controllers\ApiHandler;
use Classes\Database;


$db = new Database();
$api = new ApiHandler($db);

$api->handleRequest();
