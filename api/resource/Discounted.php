<?php # Discounted.php - resource subclass for discount associations with bills

class Discounted extends Resource {

	// Database fields
	protected $DiscountedID;
	protected $DiscountID;
	protected $BillID;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'DiscountedID'; // key is discountID and billID
		
		$this->fieldMap = array(
			"discountedid" => "DiscountedID",
			"discountid" => "DiscountID",
			"billid" => "BillID"
		);
		
		// Required fields for each operation
		$this->createFields = array("DiscountID", "BillID");
 		$this->readFields = array("BillID");
 		$this->updateFields = array("DiscountedID");
 		$this->deleteFields = array("DiscountedID");

		parent::loadFields($params);
	}
}
