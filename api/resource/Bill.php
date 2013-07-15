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
		
		parent::loadFields($params);
	}
}
