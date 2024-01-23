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

function get_prizes_from_xlsx()
{
    $inputFileType = 'Xlsx';
    $inputFileName = __DIR__ . '/data/prizes.xlsx';
    $reader = IOFactory::createReader($inputFileType);
    $reader->setReadDataOnly(true);
    $spreadsheet = $reader->load($inputFileName);
    $activeSheet = $spreadsheet->getActiveSheet();
    $highestRowAndColumn = $activeSheet->getHighestRowAndColumn();
    $h = $highestRowAndColumn['row'];
    $values = $activeSheet->rangeToArray("A2:C$h");
    $prizes = array();
    foreach ($values as $i => $v) {
        if (trim($v[0])) {
            $prize = [
                "id" => $i,
                "name" => trim($v[0]),
                "total" => intval(trim($v[1])) ?: 0,
                "level" => trim($v[2]),
                "winners" => [],
            ];
            array_push($prizes, $prize);
        }
    }
    return $prizes;
}

function get_persons_from_xlsx()
{
    $inputFileType = 'Xlsx';
    $inputFileName = __DIR__ . '/data/users.xlsx';
    $reader = IOFactory::createReader($inputFileType);
    $reader->setReadDataOnly(true);
    $spreadsheet = $reader->load($inputFileName);
    $activeSheet = $spreadsheet->getActiveSheet();
    $highestRowAndColumn = $activeSheet->getHighestRowAndColumn();
    $h = $highestRowAndColumn['row'];
    $values = $activeSheet->rangeToArray("A2:E$h");
    $persons = array();
    foreach ($values as $i => $v) {
        if (trim($v[0])) {
            $p = [
                "id" => $i,
                "name" => trim($v[1]),
                "employeeId" => trim($v[0]),
                "department" => trim($v[2]),
                "level" => trim($v[3]),
                "can" => strtolower(trim($v[4])) == 'yes',
            ];
            array_push($persons, $p);
        }
    }
    return $persons;
}

const temp_dir = __DIR__ . "/temp";
const prizes_file = temp_dir . '/prizes.json';
const persons_file = temp_dir . '/persons.json';
function initial()
{
    if (!file_exists(temp_dir)) {
        mkdir(temp_dir);
    }
    if (!file_exists(prizes_file)) {
        $file = fopen(prizes_file, 'w+');
        $prizes = get_prizes_from_xlsx();
        fwrite($file, json_encode($prizes));
        fclose($file);
    }
    if (!file_exists(persons_file)) {
        $file = fopen(persons_file, 'w+');
        $prizes = get_persons_from_xlsx();
        fwrite($file, json_encode($prizes));
        fclose($file);
    }
}

function clear_data()
{
    if (file_exists(prizes_file)) {
        unlink(prizes_file);
    }
    if (file_exists(persons_file)) {
        unlink(persons_file);
    }
    if (file_exists(temp_dir)) {
        rmdir(temp_dir);
    }
}

function get_prizes_json_str()
{
    return file_get_contents(prizes_file);
}

function get_persons_json_str()
{
    return file_get_contents(persons_file);
}

function hit_the_jackpot($prizes_json_str)
{
    file_put_contents(prizes_file, $prizes_json_str);
}