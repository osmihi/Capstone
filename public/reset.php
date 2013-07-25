<?php # reset.php - visit this page to reset the database to baseline

function startsWith($haystack, $needle) {
    return !strncmp($haystack, $needle, strlen($needle));
}

require_once('../private/ConnectionFactory.php');

$db = ConnectionFactory::getFactory()->getConnection();

$queryStr = file_get_contents('../private/OrDrUpDB_Data.sql');

$stmt;

$queryStr = ltrim($queryStr, "\xEF\xBB\xBF");

foreach ( explode(";", $queryStr) as $line ) {
	if (trim($line) != "") {

		$fixedLine = "";

		foreach ( explode("\n", $line) as $l ) {
			if ( strpos($l, '--') !== 0 && trim($l) !== "") {
				$fixedLine .= $l;
			}
		}

		$fixedLine .= ";";

		//echo $fixedLine . "<br />" . PHP_EOL;
		$stmt = $db->prepare($fixedLine);
		$stmt->execute();
	}
}

echo "<html><body><p>Database reset.</p</body></html>" . PHP_EOL;
