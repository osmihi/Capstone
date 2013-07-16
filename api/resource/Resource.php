<?php #Resource.php - abstract superclass for database objects

abstract class Resource {
	const USER = 0;
	const RESTAURANT = 1;
	const TABLE = 2;
	const WAITLIST = 3;
	const MENUITEM = 4;
	const ORDERITEM = 5;
	const ORDER = 6;
	const BILL = 7;
	const TIP = 8;
	const DISCOUNT = 9;
	const DISCOUNTED = 10;
	
	private static $rscMap = array(
		"user" => Resource::USER,
		"restaurant" => Resource::RESTAURANT,
		"table" => Resource::TABLE,
		"waitlist" => Resource::WAITLIST,
		"menuitem" => Resource::MENUITEM,
		"orderitem" => Resource::ORDERITEM,
		"order" => Resource::ORDER,
		"bill" => Resource::BILL,
		"tip" => Resource::TIP,
		"discount" => Resource::DISCOUNT,
		"discounted" => Resource::DISCOUNTED
	);
	
	protected $db;
	
	protected $keyName;

	// map param names to variable / database names
	protected $fieldMap;

	// required fields for each operation
	protected $createFields;
	protected $readFields;
	protected $updateFields;
	protected $deleteFields;

	function __construct(DbConnection $database) {
		$this->db = $database;
	}

	public function process($requestType, $params) {
		
	}
	
	public function loadFields(array $params) {
		foreach ($params as $paramKey => $paramVal) {
			$fieldName = $this->getFieldName($paramKey);
			if ($fieldName) {
				$this->{$fieldName} = $paramVal;
			}
		}

		if ( isset($params['key']) ) {
			$this->{$this->keyName} = $params['key'];
		}
	}
	
	protected function getFieldName($paramKey) {
		foreach($this->fieldMap as $fieldKey => $fieldName) {
			if (strcasecmp($paramKey, $fieldKey) == 0) {
				return $fieldName;
			}
		}
		return false;
	}

	public function getFields() {
		$fields = array();
		foreach ($this->fieldMap as $key => $value) {
			if (isset($this->{$value})) {
				$fields[$value] = $this->{$value}; 
			}
		}
		return $fields;
	}

	public function getField($key) {
		$field = false;
		$fieldName = $this->getFieldName($key);

		if (isset($this->{$fieldName})) {
			$field = $this->{$fieldName}; 
		}
		return $field;
	}
	
	public function getPrimaryKey() {
		return $this->{$this->keyName};
	}

	protected function verifyRequiredFields(array $requiredFields, array $params) {

		$params = $params + $this->getFields();

		$verified = !empty($params);

		foreach ($requiredFields as $fieldName) {
			$fieldOk = false;
			if ($verified) {
				foreach ($params as $paramKey => $paramValue) {
					if (strcasecmp($fieldName,$paramKey) == 0) {
						$fieldOk = true;
					}
					$verified = $fieldOk;
				}
			}
		}

		return $verified;
	}	

	public function create(array $params = array()) {
		if (!$this->verifyRequiredFields($this->createFields, $params)) return false;
		return true;
	}

	public function read(array $params = array()) {
		if (!$this->verifyRequiredFields($this->readFields, $params)) return false;
		return true; 	
	}

	public function update(array $params = array()) {
		if (!$this->verifyRequiredFields($this->updateFields, $params)) return false;
		return true;		
	}

	public function delete(array $params = array()) {
		if (!$this->verifyRequiredFields($this->deleteFields, $params)) return false;
		return true;
	}

	public function jsonSerialize() {
		
	}
	
	public static function getResourceType($rsc) {
		$rscType = false;

		if (!is_string($rsc)) {
			$rsc = get_class($rsc);
		}

		foreach(self::$rscMap as $rscKey => $rscVal) {
			if ( strcasecmp($rsc, $rscKey) == 0 ) $rscType = $rscVal;
		}

		return $rscType;
	}
	
	public static function getResource($rscType, DbConnection $dbc, array $params) {
		if ($rscType){
			switch($rscType) {
				case Resource::USER:
					return new User($dbc, $params);
					break;
				case Resource::RESTAURANT:
					return new Restaurant($dbc, $params);
					break;
				case Resource::TABLE:
					return new Table($dbc, $params);
					break;
				case Resource::WAITLIST:
					return new WaitList($dbc, $params);
					break;
				case Resource::MENUITEM:
					return new MenuItem($dbc, $params);
					break;
				case Resource::ORDERITEM:
					return new OrderItem($dbc, $params);
					break;
				case Resource::ORDER:
					return new Order($dbc, $params);
					break;
				case Resource::BILL:
					return new Bill($dbc, $params);
					break;
				case Resource::TIP:
					return new Tip($dbc, $params);
					break;
				case Resource::DISCOUNT:
					return new Discount($dbc, $params);
					break;
				case Resource::DISCOUNTED:
					return new Discounted($dbc, $params);
					break;
				default:
					return false;
					break;
			}
		}
		return false;
	}
}
