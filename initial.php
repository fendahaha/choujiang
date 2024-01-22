<?php
require_once 'util.php';

$temp_dir = __DIR__ . "/temp";
$prizes_file = $temp_dir . '/prizes.json';
$persons_file = $temp_dir . '/persons.json';
if (!file_exists($temp_dir)) {
    mkdir($temp_dir);
}
if (!file_exists($prizes_file)) {
    $file = fopen($prizes_file, 'w+');
    $prizes = get_prizes_from_xlsx();
    fwrite($file, json_encode($prizes));
    fclose($file);
}
if (!file_exists($persons_file)) {
    $file = fopen($persons_file, 'w+');
    $prizes = get_persons_from_xlsx();
    fwrite($file, json_encode($prizes));
    fclose($file);
}

