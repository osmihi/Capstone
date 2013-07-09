<?php #Resource.php - abstract superclass for database objects

abstract class Resource {
	private $db;
	private $keyName;
	
	private $actionType;
	private $params; 

	function __construct(DbConnection $database) {
		$this->db = $database;
	}

	public function process(ActionType $actionType, $params) {
		
	}
	
	abstract protected function jsonSerialize();

	abstract protected function create();

	abstract protected function read();

	abstract protected function update();

	abstract protected function delete();
}
