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
 		
 		$this->createFields = array("RestaurantId", "Name", "Size");
 		$this->readFields = array("WaitListId", "RestaurantId");
 		$this->updateFields = array("WaitListId", "RestaurantId");
 		$this->deleteFields = array("WaitListId", "RestaurantId");
		
		parent::loadFields($params);
	}
}
