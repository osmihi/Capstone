<?php # Order.php - resource subclass for orders

class Order extends Resource {

	// Database fields
	protected $OrderID;
	protected $TableID;
	protected $BillID;
	protected $Timestamp;
	
	protected $RestaurantID;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'OrderID';
		
		$this->fieldMap = array(
			"orderid" => "OrderID",
			"tableid" => "TableID",
			"billid" => "BillID",
			"timestamp" => "Timestamp"
		);
		
		// Required fields for each operation
		$this->createFields = array("TableID");
 		$this->readFields = array("RestaurantID");
 		$this->updateFields = array("OrderID");
 		$this->deleteFields = array("OrderID");

		parent::loadFields($params);
	}
	
	public function read(array $params = array(), $join = null) {
		$rId;
		foreach ($params as $pKey => $pVal) {
			if (strcasecmp($pKey, 'RestaurantID') == 0) $rId = $pVal;
		}

		$join = " INNER JOIN `Table` ON `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = " . $rId . " ";

		return parent::read($params, $join);
	}
}
