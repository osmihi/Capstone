<?php # DbInfo.php - holds private logon info for database access

	// THIS FILE SHOULD NEVER BE STORED IN A WEB-ACCESSIBLE FOLDER!

class DbInfo {

	// Database User
	private static $DB_USER = 'smihi83_capstone';

	// Database Password
	private static $DB_PASSWORD = 't@c0surprise';

	// Database Host
	private static $DB_HOST = 'localhost';

	// Database Name
	private static $DB_NAME = 'smihi83_ordrup';
	
	static function getConnection() {
		$dbc = @mysqli_connect (self::$DB_HOST, self::$DB_USER, self::$DB_PASSWORD, self::$DB_NAME)	OR die ('Could not connect to MySQL: ' . mysqli_connect_error() );
		return $dbc;
	}
}