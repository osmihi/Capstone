<?php # OrderItem.php - resource subclass for order items

class OrderItem extends Resource {
	
	protected $orderItemID;
	protected $menuItemID;
	protected $orderID;
	protected $status;
	protected $purchasePrice;
	protected $notes;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'orderItemID';
		
		$this->fieldMap = array(
			"orderitemid" => "orderItemID",
			"menuitemid" => "menuItemID",
			"orderid" => "orderID",
			"status" => "status",
			"purchaseprice" => "purchasePrice",
			"price" => "purchasePrice",
			"notes" => "notes"
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
