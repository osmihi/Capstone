<?php # Tip.php - resource subclass for tips

class Tip extends Resource {

	protected $tipID;
	protected $userID;
	protected $billID;
	protected $amount;
	protected $paid;

	function __construct(DbConnection $dbc, array $params) {
		parent::__construct($dbc);
		
		$this->keyName = 'tipID';
		
		$this->fieldMap = array(
			"tipid" => "tipID",
			"userid" => "userID",
			"billid" => "billID",
			"amount" => "amount",
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
