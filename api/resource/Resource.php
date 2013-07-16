<?php #Resource.php - abstract superclass for database objects

abstract class Resource {
	const USER = 1;
	const RESTAURANT = 2;
	const TABLE = 3;
	const WAITLIST = 4;
	const MENUITEM = 5;
	const ORDERITEM = 6;
	const ORDER = 7;
	const BILL = 8;
	const TIP = 9;
	const DISCOUNT = 10;
	const DISCOUNTED = 11;
	
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
		$params = $params + $this->getFields();
		if (!$this->verifyRequiredFields($this->createFields, $params)) return false;
		return true;
	}

	public function read(array $params = array()) {
		$params = $params + $this->getFields();
		if (!$this->verifyRequiredFields($this->readFields, $params)) return false;

		$fieldNames = "";
		$delim = "";
		foreach ($this->fieldMap as $f) {
			$fieldNames .= $delim . "`" . $f . "`";
			$delim = ", "; 
		}
		
		$reqFields = "";
		$delim = " ";
		foreach ($this->readFields as $f) {
			$reqFields .= $delim . "`" . $f . "` = :" . $f . "Value ";
			$delim = " AND "; 
		}

		$stmt = $this->db->prepare("SELECT ". $fieldNames . " FROM `" . get_class($this) . "` WHERE " . $reqFields);
		foreach ($this->readFields as $f)
			$stmt->bindValue(':' . $f . "Value", $params[$f], Resource::getPDOParamType($params[$f]));

		$res = $this->db->execute($stmt);

		return $res; 	
	}

	public function update(array $params = array()) {
		$params = $params + $this->getFields();
		if (!$this->verifyRequiredFields($this->updateFields, $params)) return false;
		return true;		
	}

	public function delete(array $params = array()) {
		$params = $params + $this->getFields();
		if (!$this->verifyRequiredFields($this->deleteFields, $params)) return false;
		return true;
	}

	public function getJson() {
		$json  = "{" . PHP_EOL;
		$delim = "";
		foreach($this->fieldMap as $f) {
			$json .= $delim;
			$json .= "\t" . json_encode($f) . ":" . json_encode($this->{$f});
			$delim = "," . PHP_EOL;
		}
		$json .= PHP_EOL . "}" . PHP_EOL;

		return $json;
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

	public static function getPDOParamType($value) {
		if (is_int($value))
			return PDO::PARAM_INT;
		elseif (is_bool($value))
			return PDO::PARAM_BOOL;
		elseif (is_null($value))
			return PDO::PARAM_NULL;
		elseif (is_string($value))
			return PDO::PARAM_STR;
		else 
			return false;
	}
}
