<?php # DbConnection.php - Database connection

require_once('../private/ConnectionFactory.php');

class DbConnection {
	private $db;
	
	function __construct() {
		$this->db = ConnectionFactory::getFactory()->getConnection();
	}
	
	public function getDb() {
		return $this->db;
	}

	public function prepare($queryStr) {
		return $this->db->prepare($queryStr);
	}
	
	public function execute(PDOStatement $stmt) {
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
