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
		
		parent::loadFields($params);
	}
}
