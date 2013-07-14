<?php # Restaurant.php - resource subclass for Restaurant

class Restaurant extends Resource {

	protected $restaurantID;
	protected $name;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'restaurantID';
		
		$this->fieldMap = array(
			"restaurantid" => "restaurantID",
			"name" => "name"
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
