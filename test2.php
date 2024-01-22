<?php
$temp_dir = __DIR__ . "/temp";
$result_file = $temp_dir . '/result.json';
if (!file_exists($temp_dir)) {
    mkdir($temp_dir);
}
if (!file_exists($result_file)) {
    $file = fopen($result_file, 'w+');
    fwrite($file, "[]");
    fclose($file);
}

