<?php
require_once 'util.php';

if (!array_key_exists('action', $_GET)) {
    exit;
}
$action = $_GET['action'];
if ($action === 'prizes') {
    echo(get_prizes_json_str());
} else if ($action === 'persons') {
    echo(get_persons_json_str());
} else if ($action === 'hit_the_jackpot') {
    hit_the_jackpot($_POST['prizes_json_str']);
    echo(json_encode(true));
} else if ($action === 'clear_data') {
    clear_data();
    echo(json_encode(true));
}

exit;