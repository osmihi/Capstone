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
 		$this->readFields = array("DiscountID");
 		$this->updateFields = array("DiscountID");
 		$this->deleteFields = array("DiscountID");

		parent::loadFields($params);
	}
}
