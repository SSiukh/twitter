<?php
// Перевіряємо, чи є файл у папці dist
$requested_file = __DIR__ . '/dist' . $_SERVER['REQUEST_URI'];
if (file_exists($requested_file) && is_file($requested_file)) {
    // Якщо файл існує, обслуговуємо його
    return false;
}

// В іншому випадку — завантажуємо index.html
require __DIR__ . '/dist/index.html';
