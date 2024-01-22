<?php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

function test1()
{
    $spreadsheet = new Spreadsheet();
    $activeWorksheet = $spreadsheet->getActiveSheet();
    $activeWorksheet->setCellValue('A1', 'Hello World !');

    $writer = new Xlsx($spreadsheet);
    $writer->save('hello world.xlsx');
}


function test2()
{
    $inputFileType = 'Xlsx';
    $inputFileName = __DIR__ . '/data/users.xlsx';
    $reader = IOFactory::createReader($inputFileType);
    $reader->setReadDataOnly(true);
    $spreadsheet = $reader->load($inputFileName);
    $activeSheet = $spreadsheet->getActiveSheet();
    $activeRange = $activeSheet->calculateWorksheetDataDimension();
    echo($activeRange);
//    $sheetData = $activeSheet->rangeToArray("A1:C108", '');
//    var_dump($sheetData);
}

function test3()
{
    $inputFileType = 'Xlsx';
    $inputFileName = __DIR__ . '/data/prizes2.xlsx';
    $reader = IOFactory::createReader($inputFileType);
    $reader->setReadDataOnly(true);
    $spreadsheet = $reader->load($inputFileName);
    $activeSheet = $spreadsheet->getActiveSheet();
    $v = trim($activeSheet->getCell("A2")->getValue());
    $a = $activeSheet->getHighestRowAndColumn();
    var_dump($a);
    $d = $activeSheet->getCell("A4")->getValue();
    var_dump(strlen(trim($d)));
}

//test2();
function get_prizes()
{
    $inputFileType = 'Xlsx';
    $inputFileName = __DIR__ . '/data/prizes.xlsx';
    $reader = IOFactory::createReader($inputFileType);
    $reader->setReadDataOnly(true);
    $spreadsheet = $reader->load($inputFileName);
    $activeSheet = $spreadsheet->getActiveSheet();
    $highestRowAndColumn = $activeSheet->getHighestRowAndColumn();
    $h = $highestRowAndColumn['row'];
    $values = $activeSheet->rangeToArray("A2:B$h");
    $prizes = array();
    foreach ($values as $i => $v) {
        if (trim($v[0])) {
            $prize = [
                "id" => $i,
                "name" => trim($v[0]),
                "total" => trim($v[1]) ?: 0,
                "winners" => [],
            ];
            array_push($prizes, $prize);
        }
    }
    return $prizes;
}


function get_persons()
{
    $inputFileType = 'Xlsx';
    $inputFileName = __DIR__ . '/data/users.xlsx';
    $reader = IOFactory::createReader($inputFileType);
    $reader->setReadDataOnly(true);
    $spreadsheet = $reader->load($inputFileName);
    $activeSheet = $spreadsheet->getActiveSheet();
    $highestRowAndColumn = $activeSheet->getHighestRowAndColumn();
    $h = $highestRowAndColumn['row'];
    $values = $activeSheet->rangeToArray("A2:C$h");
    $persons = array();
    foreach ($values as $i => $v) {
        if (trim($v[0])) {
            $p = [
                "id" => $i,
                "name" => trim($v[1]),
                "employeeId" => trim($v[0]),
                "department" => trim($v[2]),
            ];
            array_push($persons, $p);
        }
    }
    return $persons;
}

//var_dump($_SERVER);
//echo(json_encode($_SERVER['REQUEST_METHOD']));
//var_dump($_GET['']);

if (!array_key_exists('action', $_GET)) {
    echo("no");
    exit;
}
$action = $_REQUEST['action'];
if ($action === 'prizes') {
    $prizes = get_prizes();
    echo(json_encode($prizes));
} else if ($action === 'persons') {
    echo(json_encode(get_persons()));
}

exit;