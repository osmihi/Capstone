<?php # Discount.php - resource subclass for discounts

class Discount extends Resource {
	
	protected $discountID;
	protected $restaurantID;
	protected $discountCode;
	protected $type;
	protected $value;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'discountID';
		
		$this->fieldMap = array(
			"discountid" => "discountID",
			"restaurantid" => "restaurantID",
			"discountcode" => "discountCode",
			"type" => "type",
			"value" => "value"
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
