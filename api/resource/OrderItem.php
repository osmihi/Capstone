<?php # OrderItem.php - resource subclass for order items

class OrderItem extends Resource {

	// Database fields
	protected $OrderItemID;
	protected $MenuItemID;
	protected $OrderID;
	protected $Status;
	protected $PurchasePrice;
	protected $Notes;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);

		$this->keyName = 'OrderItemID';

		$this->fieldMap = array(
			"orderitemid" => "OrderItemID",
			"menuitemid" => "MenuItemID",
			"orderid" => "OrderID",
			"status" => "Status",
			"purchaseprice" => "PurchasePrice",
			"notes" => "Notes"
		);

		// Required fields for each operation
		$this->createFields = array("OrderID", "MenuItemID", "PurchasePrice");
 		$this->readFields = array("RestaurantID");
 		$this->updateFields = array("OrderItemID");
 		$this->deleteFields = array("OrderItemID");

		parent::loadFields($params);
	}
	
	public function read(array $params = array(), $join = null) {
		$rId;
		foreach ($params as $pKey => $pVal) {
			if (strcasecmp($pKey, 'RestaurantID') == 0) $rId = $pVal;
		}

		$join = " INNER JOIN `MenuItem` ON `MenuItem`.`MenuItemID` = `OrderItem`.`MenuItemID` AND `MenuItem`.`RestaurantID` = " . $rId . " ";

		return parent::read($params, $join);
	}
}
