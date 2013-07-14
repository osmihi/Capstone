<?php # Discounted.php - resource subclass for discount associations with bills

class Discounted extends Resource {
	
	protected $discountID;
	protected $billID;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = ''; // key is discountID and billID
		
		$this->fieldMap = array(
			"discountid" => "discountID",
			"billid" => "billID"
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
