<?php # Restaurant.php - resource subclass for Restaurant

class Restaurant extends Resource {

	// Database fields
	protected $RestaurantID;
	protected $Name;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'RestaurantID';
		
		$this->fieldMap = array(
			"restaurantid" => "RestaurantID",
			"name" => "Name"
		);
		
		parent::loadFields($params);
	}
}
