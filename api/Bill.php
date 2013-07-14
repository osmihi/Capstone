<?php # Bill.php - resource subclass for bill

class Bill extends Resource {
	
	protected $billID;
	protected $paid;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'billID';
		
		$this->fieldMap = array(
			"billid" => "billID",
			"paid" => "paid"
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
