<?php # Tip.php - resource subclass for tips

class Tip extends Resource {

	// Database fields
	protected $TipID;
	protected $UserID;
	protected $BillID;
	protected $Amount;
	protected $Paid;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'TipID';
		
		$this->fieldMap = array(
			"tipid" => "TipID",
			"userid" => "UserID",
			"billid" => "BillID",
			"amount" => "Amount",
			"paid" => "Paid"
		);
		
		// Required fields for each operation
 		$this->createFields = array("UserID", "BillID", "Amount");
 		$this->readFields = array();
 		$this->updateFields = array("TipID");
 		$this->deleteFields = array("TipID");

		parent::loadFields($params);
	}
}
