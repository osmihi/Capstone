<?php # MenuItem.php - resource subclass for menu items

class MenuItem extends Resource {
	
	protected $menuItemID;
	protected $restaurantID;
	protected $name;
	protected $category;
	protected $prepTime;
	protected $price;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'menuItemID';
		
		$this->fieldMap = array(
			"menuitemid" => "menuItemID",
			"restaurantid" => "restaurantID",
			"name" => "name",
			"category" => "category",
			"preptime" => "prepTime",
			"price" => "price"
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
