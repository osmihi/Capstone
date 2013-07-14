<?php # Table.php - resource subclass for Table

class Table extends Resource {
	
	protected $tableID;
	protected $restaurantID;
	protected $userID;
	protected $number;
	protected $capacity;
	protected $status;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'tableID';
		
		$this->fieldMap = array(
			"tableid" => "tableID",
			"restaurantid" => "restaurantID",
			"userid" => "userID",
			"assignee" => "userID",
			"number" => "number",
			"capacity" => "capacity",
			"status" => "status"
		);
		
		parent::loadFields($params);
	}

	// Inherited methods
	
	public function create($params) {
		
	}
	
	public function read($params) {
		
	}
	
	public function update($params) {
		
	}
	
	public function delete($params) {
		
	}
	
	public function jsonSerialize() {
		
	}
}
