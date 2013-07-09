<?php # DbConnection.php - Database connection

require_once('../private/DbInfo.php');

class DbConnection {
	private $db;
	
	function __construct() {
		$this->db = DbInfo::getConnection();

		var_dump($this->db);
		
		$q = "SELECT 12345";
		$r = mysqli_query ($this->db, $q);
		if ($r) {
			while ($row = mysqli_fetch_array ($r, MYSQLI_ASSOC)) {
				echo '<p>' . $row[0] . '</p>' . PHP_EOL;
			}
		}
	}
}
