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
		
		parent::loadFields($params);
	}
}
