<?php # ConnectionFactory.php - provides our database connections for the API
	# reference: http://stackoverflow.com/questions/130878/global-or-singleton-for-database-connection

class ConnectionFactory {
    private static $factory;
    private $db;
    
    private function __construct() {}
    
    public static function getFactory() {
        if (!self::$factory)
            self::$factory = new ConnectionFactory();
        return self::$factory;
    }

    public function getConnection() {
        if (!isset($this->db)) {
			try {
				$this->db = new PDO(
					'mysql:host=localhost;dbname=smihi83_ordrup;charset=utf8', 
					'smihi83_capstone', 
					't@c0surprise', 
					array(
						PDO::ATTR_EMULATE_PREPARES => false, 
						PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
					)
				);
			} catch (PDOException $e) {
				echo "Error connecting to the database.<br />" . PHP_EOL;
			}
        }
        return $this->db;
    }
}