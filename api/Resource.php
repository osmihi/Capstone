<?php #Resource.php - abstract superclass for database objects

require_once('DbConnection.php');
require_once('RequestType.php');

abstract class Resource {
	const USER = 0;
	const RESTAURANT = 1;
	const TABLE = 2;
	const WAITLIST = 3;
	const MENUITEM = 4;
	const ORDERITEM = 5;
	const ORDER = 6;
	const BILL = 7;
	const TIP = 9;
	const DISCOUNT = 10;
	const DISCOUNTED = 11;
	
	private $db;

	private $keyName;
	private $validFields; 

	function __construct(DbConnection $database) {
		$this->db = $database;
		$this->validFields = array();
	}

	public function process($requestType, $params) {
		
	}
	
	abstract protected function create($params);

	abstract protected function read($params);

	abstract protected function update($params);

	abstract protected function delete($params);

	abstract protected function jsonSerialize();
}
