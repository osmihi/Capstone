<?php # Table.php - resource subclass for Table

class Table extends Resource {

	// Database fields
	protected $TableID;
	protected $RestaurantID;
	protected $UserID;
	protected $Number;
	protected $Capacity;
	protected $Status;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'TableID';
		
		$this->fieldMap = array(
			"tableid" => "TableID",
			"restaurantid" => "RestaurantID",
			"userid" => "UserID",
			"assignee" => "UserID",
			"number" => "Number",
			"capacity" => "Capacity",
			"status" => "Status"
		);
		
		parent::loadFields($params);
	}
}
