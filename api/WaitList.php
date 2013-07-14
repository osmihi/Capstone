<?php # WaitList.php - resource subclass for waitlist

class WaitList extends Resource {
	
	protected $waitListID;
	protected $restaurantID;
	protected $name;
	protected $size;
	protected $timestamp;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'waitListID';
		
		$this->fieldMap = array(
			"waitlistid" => "waitListID",
			"restaurantid" => "restaurantID",
			"name" => "name",
			"size" => "size",
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
