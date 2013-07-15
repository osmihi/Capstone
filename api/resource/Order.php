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
		
		parent::loadFields($params);
	}
}
