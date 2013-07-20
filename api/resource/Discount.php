<?php # Discount.php - resource subclass for discounts

class Discount extends Resource {

	// Database fields
	protected $DiscountID;
	protected $RestaurantID;
	protected $DiscountCode;
	protected $Type;
	protected $Value;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'DiscountID';
		
		$this->fieldMap = array(
			"discountid" => "DiscountID",
			"restaurantid" => "RestaurantID",
			"discountcode" => "DiscountCode",
			"type" => "Type",
			"value" => "Value"
		);

		// Required fields for each operation
		$this->createFields = array("RestaurantID", "DiscountCode", "Type");
 		$this->readFields = array("RestaurantID");
 		$this->updateFields = array("DiscountID", "RestaurantID");
 		$this->deleteFields = array("DiscountID", "RestaurantID");

		parent::loadFields($params);
	}
}
