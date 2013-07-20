<?php # Bill.php - resource subclass for bill

class Bill extends Resource {

	// Database fields
	protected $BillID;
	protected $Paid;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'BillID';
		
		$this->fieldMap = array(
			"billid" => "BillID",
			"paid" => "Paid"
		);

		// Required fields for each operation
		$this->createFields = array("Paid");
 		$this->readFields = array("BillID");
 		$this->updateFields = array("BillID");
 		$this->deleteFields = array("BillID");
 
		parent::loadFields($params);
	}
}
