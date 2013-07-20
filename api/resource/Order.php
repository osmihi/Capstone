<?php # Order.php - resource subclass for orders

class Order extends Resource {

	// Database fields
	protected $OrderID;
	protected $TableID;
	protected $BillID;
	protected $Timestamp;

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
		$this->createFields = array("TableID", "BillID");
 		$this->readFields = array("TableID");
 		$this->updateFields = array("OrderID");
 		$this->deleteFields = array("OrderID");

		parent::loadFields($params);
	}
}
