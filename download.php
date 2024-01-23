<?php
require_once 'vendor/autoload.php';
require_once 'util.php';

use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Helper\Sample;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

$helper = new Sample();
if ($helper->isCli()) {
    $helper->log('This example should only be run from a Web Browser' . PHP_EOL);

    return;
}
// Create new Spreadsheet object
$spreadsheet = new Spreadsheet();

// Set document properties
$spreadsheet->getProperties()->setCreator('fenda')
    ->setLastModifiedBy('fenda')
    ->setTitle('lottery result')
    ->setSubject('lottery result document')
    ->setDescription('lottery result')
    ->setKeywords('lottery result')
    ->setCategory('lottery result');
/**####################################*/
// Add some data
$spreadsheet->setActiveSheetIndex(0);
$activeSheet = $spreadsheet->getActiveSheet();

$prizes = json_decode(get_prizes_json_str(), true);
$column = 1;
for ($i = 0; $i < count($prizes); $i++) {
    $prize = $prizes[$i];
    $winners = $prize['winners'];
    $activeSheet->setCellValue("A$column", $prize['name']);
    $column += 1;
    foreach ($winners as $k => $winner) {
        $activeSheet->setCellValue("A$column", $winner['name']);
        $activeSheet->setCellValueExplicit("B$column", $winner['employeeId'], DataType::TYPE_STRING2);
        $activeSheet->setCellValue("C$column", $winner['department']);
        $column += 1;
    }
    $activeSheet->setCellValue("A$column", '');
    $column += 1;
}

/**####################################*/
// Rename worksheet
$spreadsheet->getActiveSheet()->setTitle('lottery result');
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$spreadsheet->setActiveSheetIndex(0);
/**####################################*/
$filename = date("Y-m-d H-i-s") . " lottery result";
// Redirect output to a client’s web browser (Xlsx)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header("Content-Disposition: attachment;filename=\"$filename.xlsx\"");
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');

// If you're serving to IE over SSL, then the following may be needed
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header('Pragma: public'); // HTTP/1.0

$writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
$writer->save('php://output');
exit;
