<?php # MenuItem.php - resource subclass for menu items

class MenuItem extends Resource {

	// Database fields
	protected $MenuItemID;
	protected $RestaurantID;
	protected $Name;
	protected $Category;
	protected $PrepTime;
	protected $Price;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'MenuItemID';
		
		$this->fieldMap = array(
			"menuitemid" => "MenuItemID",
			"restaurantid" => "RestaurantID",
			"name" => "Name",
			"category" => "Category",
			"preptime" => "PrepTime",
			"price" => "Price"
		);
		
		parent::loadFields($params);
	}
}
