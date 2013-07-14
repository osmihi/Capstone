<?php # Order.php - resource subclass for orders

class Order extends Resource {
	
	protected $orderID;
	protected $tableID;
	protected $billID;
	protected $timestamp;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'orderID';
		
		$this->fieldMap = array(
			"orderid" => "orderID",
			"tableid" => "tableID",
			"billid" => "billID",
			"timestamp" => "timestamp"
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
