<?php # WaitList.php - resource subclass for waitlist

class WaitList extends Resource {

	// Database fields
	protected $WaitListID;
	protected $RestaurantID;
	protected $Name;
	protected $Size;
	protected $Timestamp;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'WaitListID';
		
		$this->fieldMap = array(
			"waitlistid" => "WaitListID",
			"restaurantid" => "RestaurantID",
			"name" => "Name",
			"size" => "Size",
			"timestamp" => "Timestamp"
 		);

 		// Required fields for each operation
 		$this->createFields = array("RestaurantID", "Name", "Size");
 		$this->readFields = array("WaitListID", "RestaurantID");
 		$this->updateFields = array("WaitListID", "RestaurantID");
 		$this->deleteFields = array("WaitListID", "RestaurantID");

		parent::loadFields($params);
	}
}
